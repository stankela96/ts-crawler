/* import {EmptyResult, ProductDailyPrice, productJob, ProductReturnData} from '../../interfaces/product.interfaces';
import {Response} from '../../../smile_chrome/src/interfaces/puppeteer.interfaces';
import {getMedia} from './modules/media';
import {getCrossSelling} from './modules/cross.selling';
import {getRating} from './modules/rating';
import {getPackages} from './modules/packages';
import {
    formatDescription,
    formatPrice,
    formatUrl,
    mapHTMLContent,
    mapTextContent
} from '../../utilities/crawler.formating';
import {Page} from 'puppeteer';
import {getElementsLength, getTextContent} from '../../utilities/crawler.formating';
import {domains} from '../../config/config.domains';
import {scrollPage} from '../../utilities/crawler.handlepage';

const productPageSelector = '#content article span[data-qa-id="product-attribute-pzn"]';
const productListPageSelector = '.o-SearchResults li.o-SearchProductListItem .o-SearchProductListItem__content .u-padding--sides';

export const parseHTML = async (result: Response, jobData: productJob, page: Page, chrome): Promise<ProductReturnData | EmptyResult | ProductDailyPrice | {}> => {
    try {
        //  check if it is product page type & check if pzn matches with pzn on the page
        const productPage = await matchProduct(page, jobData.pzn);
        //  check if it is product list page type
        const productListPage = await page.$$eval(productListPageSelector, getElementsLength);

        const productData = productPage
            ? await parseProductPage(page, result, jobData)
            : productListPage
                ? await parseProductListPage(page, jobData, result)
                : {
                    nodata: true,
                    domain_id: jobData.domain_id,
                    pzn: jobData.pzn,
                    screenshot: result.screenshot,
                    date: new Date(),
                };

        //console.log(productData);
        return productData;
    } catch (e) {
        throw e;
    }
};

async function matchProduct(page: Page, pzn: string) {
    try {
        let check_pzn = (await page.$$eval(productPageSelector, getElementsLength)) > 0 ? (await page.$eval(productPageSelector, getTextContent)).replace(/[^0-9]/gi, '').trim() : '';

        if (check_pzn.length > 8) check_pzn = check_pzn.slice(0, 8);

        if (check_pzn === pzn) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function parseProductPage(page: Page, result: Response, jobData: productJob): Promise<ProductReturnData | ProductDailyPrice> {
    try {
        const title = await getTitle(page);
        const price = await getPrice(page);
        const availability = await getAvailability(page);
        const product_link = result.url;
        const screenshot = result.screenshot;
        const date = new Date();

        if (jobData.queue_name.includes('daily_avb') || jobData.queue_name.includes('ondemand')) {
            return {
                domain_id: jobData.domain_id,
                price,
                pzn: jobData.pzn,
                availability,
                title,
                product_link,
                screenshot,
                date
            }
        }

        const description = await getDescription(page);
        const media = await getMedia(page, jobData);
        const cross_selling = await getCrossSelling(page, jobData);
        const product_rating = await getRating(page, result.url);
        const packages = await getPackages(page);
        await scrollPage({page, scrollDelay: 200});
        const category = await getCategoryPage(page);

        return {
            domain_id: jobData.domain_id,
            title,
            pzn: jobData.pzn,
            price,
            product_link,
            availability,
            media,
            screenshot,
            date,
            cross_selling,
            product_rating,
            description,
            packages,
            category,
        };
    } catch (e) {
        throw e;
    }
}

async function getTitle(page: Page) {
    try {
        const title = (await page.$eval(`#content article .l-grid__item .o-ProductTemplate__heading`, getTextContent)).trim();
        return title;
    } catch (e) {
        return null;
    }
}

async function getDescription(page: Page) {
    try {
        const description: string[] = await page.$$eval('#content article .o-ProductDescriptions__section.o-ProductDescriptions__general', mapHTMLContent);
        return description.length ? formatDescription(description[0]) : null;
    } catch (e) {
        return null;
    }
}

async function getPrice(page: Page) {
    try {
        const price_old = '#h_ProductVariants .o-ProductVariantsBody--single-variant .m-ProductVariant__label--checked > [aria-labelledby="variants_title_price"] > .o-ProductVariantAvailableDetails--price ~ .a-Price';
        const price_new = 'div.o-SearchProductListItem__prices__retail-price-wrapper p.o-SearchProductListItem__prices__retail-price span.a-Price';
        let getPrice: string [];
        if(await page.$$eval(price_old, getElementsLength)> 0){
            getPrice = await page.$$eval(
                '#h_ProductVariants .o-ProductVariantsBody--single-variant .m-ProductVariant__label--checked > [aria-labelledby="variants_title_price"] > .o-ProductVariantAvailableDetails--price ~ .a-Price',
                mapTextContent,
            );
        }else {
            getPrice = await page.$$eval(
                price_new,
            mapTextContent,
            );
        }

        return getPrice.length > 0 ? formatPrice(getPrice[0]) : null;
    } catch (e) {
        return null;
    }
}

async function getCategoryPage(page: Page) {
    try {
        const getCategory = await page.$$eval('#h_lastActivity', mapTextContent);
        return getCategory.length && getCategory[0].indexOf('Kategorien') > -1 ? getCategory[0].split('Kategorien').pop().trim() : null;
    } catch (e) {
        return null;
    }
}

async function getAvailability(page: Page): Promise<number> {
    try {
        const availability = await page.$$eval('#content article .l-flex__primary p.u-font-weight--bold.u-no-margin.u-color--positive', mapTextContent);
        return availability.length ? 1 : 0;
    } catch (e) {
        return null;
    }
}

async function parseProductListPage(page: Page, jobData: productJob, result: Response) {
    try {
        // checking for right product in the list
        // if exists collect link and make new job. if not return {}
        const checkforMatch = await checkForMatchingListProduct(page, jobData.pzn);
        if (checkforMatch.length && checkforMatch[0].url) {
            return {
                newJobUrl: formatUrl(checkforMatch[0].url, domains[jobData.domain_id]['domain']),
            };
        }
        return {
            nodata: true,
            domain_id: jobData.domain_id,
            pzn: jobData.pzn,
            screenshot: result.screenshot,
            date: new Date()
        };
    } catch (e) {
        throw e;
    }
}

async function checkForMatchingListProduct(page: Page, pzn: string) {
    try {
        const pznsContent: string[] = await page.$$eval(productListPageSelector, mapHTMLContent);
        return pznsContent
            .map((element, index) => ({
                pzn: extractListPzn(element),
                position: index,
                url: extractListUrl(element),
            }))
            .filter((item, indexItem) => item.pzn === pzn);
    } catch (e) {
        return [];
    }
}

function extractListPzn(pzn: string): string | null {
    const regex = /(PZN\/EAN:|PZN:)(\s*\w{7,8})/gm;
    const matchRegex = pzn.match(regex);
    return matchRegex && matchRegex.length ? (matchRegex[0].includes('EAN') ? matchRegex[0].replace('PZN/EAN: ', '') : matchRegex[0].replace('PZN: ', '')) : null;
}

function extractListUrl(url: string): string | null {
    const regex = /(?<=href=")(.+?htm)/s;
    const matchRegex = url.match(regex);
    return matchRegex && matchRegex.length ? matchRegex[0] : null;
}
*/

// ===================================================================

/* import {
    getElementsLength,
    getTextContent,
    mapHrefs,
    mapImgSrcs,
    mapStyle,
    mapTextContent,
  } from "./utilities/crawler.formating";
  import * as puppeteer from "puppeteer";
  import { scrollPage } from "./utilities/crawler.handlepage";
  import { writeToPath } from "@fast-csv/format";
  import {
    EventInterface,
    EventUpperDetailInterface,
  } from "./utilities/event.interface";

  const linkSelector =
    '[aria-label="Search Results"]  [role="main"] [role="article"]  a';
  const seeMoreSelector =
    '.sjgh65i0:nth-child(1) .discj3wi.ihqw7lf3 > div:not([data-visualcompletion="ignore"]) [role="button"]';
  const descSelector = ".p75sslyk";
  const upperDetailsSelector =
    ".sjgh65i0:nth-child(1) .discj3wi.ihqw7lf3 .dati1w0a.hv4rvrfc > div:not(.p75sslyk):nth-child(2)";
  const locationSelector = ".lpgh02oy .b20td4e0.muag1w35";
  const eventDurationSelector =
    ".k4urcfbm.nqmvxvec .bi6gxh9e.aov4n071:nth-child(1)";
  const eventNameSelector = ".k4urcfbm.nqmvxvec .bi6gxh9e.aov4n071:nth-child(2)";
  const locationPlaceSelector =
    ".k4urcfbm.nqmvxvec .bi6gxh9e.aov4n071:nth-child(3)"; // use it for upper details key
  const coverPhotoSelector = '[data-imgperflogname="profileCoverPhoto"]';
  const latitudeLongitudeSelector =
    '[style="padding-top: calc(75%);"] .kr520xx4.j9ispegn.pmk7jnqg:nth-child(1)';
  const citiesArray = ["Beograd,Novi%20Sad"];

  export const scrapeEventLinks = async (): Promise<string[]> => {
    try {
      let globalLinks: string[] = [];
      console.log("SCRAPER ZAPOCET");

      for (let i = 0; i < citiesArray.length; i++) {
        const browser = await puppeteer.launch({
          headless: true,
          defaultViewport: {
            width: 1920,
            height: 1080,
          },
          args: ["--start-maximized"],
        });

        const page = await browser.newPage();

        console.log(
          "\nURL URL URL-> ",
          `https://www.facebook.com/events/search?q=${citiesArray[i]}`
        );
        await page.goto(
          `https://www.facebook.com/events/search?q=${citiesArray[i]}`,
          { waitUntil: "networkidle0" }
        );
        await page.waitForTimeout(5000);
        await scrollPage({ page });
        await page.waitForTimeout(1000);
        await page.click(
          '[role="navigation"]  div:nth-child(3)  .bi6gxh9e.aahdfvyu  div:nth-child(4)'
        );
        await page.waitForTimeout(2000);
        await page.click('[role="navigation"] .buofh1pr .oi9244e8:nth-child(4)');

        let arrOfScrollValues = [];

        for (let i = 0; i < 100; i++) {
          const scrollValue = await scrollPage({ page, scrollDelay: 200 });
          arrOfScrollValues.push(scrollValue);
          if (
            arrOfScrollValues[arrOfScrollValues.length - 1] ===
            arrOfScrollValues[arrOfScrollValues.length - 2]
          ) {
            console.log("JEDNAKI SU I IZLAZI NAPOLJE");
            break;
          }
        }

        await page.waitForTimeout(3000);
        let links = await page.$$eval(linkSelector, mapHrefs);
        await page.waitForTimeout(3000);
        await browser.close();
        links = links.map((item) => item.split("%22")[0].trim());
        console.log("\nlinks.length->", links.length);
        globalLinks.push(...links);
      }
      return globalLinks;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  async function getEventContent(): Promise<any> {
    try {
      console.log("getEventContent ZAPOCET");
      const linksFetched = await scrapeEventLinks();
      if (linksFetched.length === 0) {
        console.log("NIJE SKUPIO NIJEDAN LINK PRE OVOGA");
        return;
      }

      let dataForCSV = [];

      for (let i = 0; i < linksFetched.length; i++) {
        let objectCSV: EventInterface;

        const browser = await puppeteer.launch({
          headless: false,
          defaultViewport: {
            width: 1920,
            height: 1080,
          },
          args: ["--start-maximized"],
        });

        const page = await browser.newPage();
        await page.waitForTimeout(10000);
        await page.goto(linksFetched[i], { waitUntil: "networkidle0" });
        await page.waitForTimeout(3000);
        await checkSeeMore(page, seeMoreSelector);

        console.log(
          "TRENUTNI URL->",
          linksFetched[i],
          "",
          [i],
          "/",
          linksFetched.length
        );

        let coverPhoto: string = await page.$$eval(
          coverPhotoSelector,
          mapImgSrcs
        );
        coverPhoto = coverPhoto[0];

        let duration: string = await page.$eval(
          eventDurationSelector,
          getTextContent
        );

        let eventName: string = await page.$eval(
          eventNameSelector,
          getTextContent
        );

        let locationPlace: string = await page.$eval(
          locationPlaceSelector,
          getTextContent
        );

        let desc: string = await page.$eval(descSelector, getTextContent);
        if (desc !== undefined && desc.includes("See less")) {
          desc = desc.split("See less")[0];
        }

        let latitude;
        let longitude;
        let geolocation;

        let geoLocationElement = await page.$$eval(
          latitudeLongitudeSelector,
          getElementsLength
        );
        if (geoLocationElement > 0) {
          geolocation = await page.$$eval(latitudeLongitudeSelector, mapStyle);

          if (geolocation[0].includes("marker_list[0]")) {
            latitude = parseFloat(
              geolocation[0]
                .split("marker_list[0]=")
                .pop()
                .split('")')[0]
                .split("%2C")[0]
            ).toFixed(2);
            longitude = parseFloat(
              geolocation[0]
                .split("marker_list[0]=")
                .pop()
                .split('")')[0]
                .split("%2C")
                .pop()
            ).toFixed(2);
          }
        }

        let upperDetails = await page.$$eval(
          upperDetailsSelector,
          mapTextContent
        );

        let location: string = await page.$$eval(
          locationSelector,
          mapTextContent
        );
        location = location[0];

        if (location !== undefined && location.includes(locationPlace)) {
          location = location.split(locationPlace)[1].trim();
        }

        await browser.close();

        objectCSV = {
          coverPhoto,
          duration,
          eventName,
          locationPlace,
          desc,
          location,
          latitude,
          longitude,
          eventUrl: linksFetched[i],
        };

        upperDetails = await arrangeUpperDetails(upperDetails, objectCSV);
        console.log("UPPER DETAILS : ", upperDetails);
        dataForCSV.push(upperDetails);
      }

      await writeToCSV(dataForCSV);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function checkSeeMore(page, selector): Promise<any> {
    try {
      let seeMore = await page.$(selector);

      if (seeMore != null) {
        await page.click(selector);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function arrangeUpperDetails(
    upperDetails: string[],
    objectCSV: any
  ): Promise<EventUpperDetailInterface> {
    try {
      let upperDetailsObj = {};

      upperDetailsObj["event_url"] = objectCSV.eventUrl;
      upperDetailsObj["cover_photo"] = objectCSV.coverPhoto;
      upperDetailsObj["duration"] = objectCSV.duration;
      upperDetailsObj["event_name"] = objectCSV.eventName;
      upperDetailsObj["description"] = objectCSV.desc;
      upperDetailsObj["location"] = objectCSV.location;
      upperDetailsObj["latitude"] = objectCSV.latitude;
      upperDetailsObj["longitude"] = objectCSV.longitude;
      for (let i = 0; i < upperDetails.length; i++) {
        upperDetails[i].includes("people responded")
          ? (upperDetailsObj["people_responded"] = parseInt(
              upperDetails[i].split("people")[0].trim()
            ))
          : null;
        upperDetails[i].includes("Event by")
          ? (upperDetailsObj["event_by"] = upperDetails[i]
              .split("Event by")[1]
              .trim())
          : null;
        upperDetails[i].includes(objectCSV.locationPlace)
          ? (upperDetailsObj["place"] = upperDetails[i])
          : null;
        upperDetails[i].includes("Tickets")
          ? (upperDetailsObj["tickets"] = upperDetails[i]
              .split("Tickets")[1]
              .trim())
          : null;
        upperDetails[i].includes("Public")
          ? (upperDetailsObj["public_availability"] = upperDetails[i]
              .split("·")[1]
              .trim())
          : null;
      }
      return {
        event_url: upperDetailsObj["event_url"],
        cover_photo: upperDetailsObj["cover_photo"] || null,
        duration: upperDetailsObj["duration"] || null,
        event_name: upperDetailsObj["event_name"],
        description: upperDetailsObj["description"] || null,
        location: upperDetailsObj["location"] || null,
        latitude: upperDetailsObj["latitude"] || null,
        longitude: upperDetailsObj["longitude"] || null,
        people_responded: upperDetailsObj["people_responded"] || null,
        event_by: upperDetailsObj["event_by"] || null,
        place: upperDetailsObj["place"] || null,
        tickets: upperDetailsObj["tickets"] || null,
        public_availability: upperDetailsObj["public_availability"] || null,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function writeToCSV(data: any): Promise<any> {
    try {
      const path = `${__dirname}/events.csv`;
      const options = { headers: true, quoteColumns: true };

      writeToPath(path, data, options)
        .on("error", (err) => console.error(err))
        .on("finish", () => console.log("Done writing."));
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  getEventContent();
   */
