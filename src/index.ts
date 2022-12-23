/* eslint-disable @typescript-eslint/no-explicit-any */
import * as puppeteer from 'puppeteer';
import {Page} from 'puppeteer';
import {
  getElementsLength,
  mapHTMLContent,
  mapTextContent,
} from './crawler.formatting';
import {ParseListInterface} from './shop.interface';
import shopSelectors from './shop.selector';

// ========== EXECUTED FUNCTION ==========
async function scrapeProducts() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      args: ['--start-maximized'],
    });

    const [page] = await browser.pages();
    await page.goto(shopSelectors.shopUrl, {
      waitUntil: 'networkidle2',
    });

    console.log('script started');

    await cookieClick(page);
    await delay(2000);
    await keyboardInput(page, 'Magnesium');
    await delay(2000);
    await parseList(page);
  } catch (e) {
    console.log(e);
  }
}

// ========== CLICKING ON A COOKIE IF IT EXISTS ==========
async function cookieClick(page: Page): Promise<boolean | any> {
  try {
    const cookie = await page.$$eval(
      shopSelectors.cookieSelector,
      getElementsLength
    );
    console.log('cookie existence: ', cookie);
    if (cookie) {
      await page.click(shopSelectors.cookieSelector);
    }
    return cookie;
  } catch (e) {
    console.log(e);
  }
}

// ========== PARSING AND MAPPING FINAL RESULT ==========
async function parseList(page: Page): Promise<ParseListInterface[] | []> {
  try {
    const listLength = await parseLength(page);
    const content = await parseContent(page);
    const prices = await parsePrice(page);
    const titles = await parseTitle(page);
    const avbs = await parseAvailability(page);

    const finalResult: ParseListInterface[] = [];

    if (listLength > 0) {
      for (let i = 0; i < listLength; i++) {
        finalResult.push({
          pzn: content[i].pzn,
          url: content[i].url,
          position: i + 1,
          price: prices[i],
          title: titles[i],
          availability: avbs[i],
        });
      }
    }

    console.log(finalResult);

    return finalResult;
  } catch (e) {
    return [];
  }
}

// ========== EXTRACTING LENGTH ==========
async function parseLength(page: Page): Promise<number> {
  try {
    const listLength = await page.$$eval(
      shopSelectors.productListLengthSelector,
      getElementsLength
    );

    return listLength;
  } catch (e) {
    return 0;
  }
}

// ========== EXTRACTING CONTENT ==========
async function parseContent(page: Page): Promise<any[] | []> {
  try {
    let productListContent: any[] = await page.$$eval(
      shopSelectors.productListContentSelector,
      mapHTMLContent
    );

    productListContent = productListContent.map((element: any) => ({
      pzn: extractListPzn(element),
      url: shopSelectors.shopUrl + extractListUrl(element),
    }));

    return productListContent;
  } catch (e) {
    return [];
  }
}

function extractListPzn(pzn: string): string | null {
  const regex = /(PZN\/EAN:|PZN:)(\s*\w{7,8})/gm;
  const matchRegex = pzn.match(regex);
  return matchRegex && matchRegex.length
    ? matchRegex[0].includes('EAN')
      ? matchRegex[0].replace('PZN/EAN: ', '')
      : matchRegex[0].replace('PZN: ', '')
    : null;
}

function extractListUrl(url: string): string | null {
  const regex = /(?<=href=")(.+?htm)/s;
  const matchRegex = url.match(regex);
  return matchRegex && matchRegex.length ? matchRegex[0] : null;
}

// ========== EXTRACTING PRICE ==========
async function parsePrice(page: Page): Promise<number[] | []> {
  try {
    const productListPrice: number[] = await page.$$eval(
      shopSelectors.productListPriceSelector,
      mapTextContent
    );

    const extractedProductListPrice: number[] =
      extractListPrice(productListPrice);

    return extractedProductListPrice;
  } catch (e) {
    return [];
  }
}

function extractListPrice(productListPrice: any[]): number[] | [] {
  productListPrice = productListPrice.map((item: any) =>
    parseFloat(item.split('€')[1].trim().replace(',', '.'))
  );
  return productListPrice;
}

// ========== EXTRACTING TITLE ==========
async function parseTitle(page: Page): Promise<string[] | []> {
  try {
    const productListTitle: string[] = await page.$$eval(
      shopSelectors.productListTitleSelector,
      mapTextContent
    );

    return productListTitle;
  } catch (e) {
    return [];
  }
}

// ========== EXTRACTING AVAILABILITY ==========
async function parseAvailability(page: Page): Promise<string[] | []> {
  try {
    const productListAvb: string[] = await page.$$eval(
      shopSelectors.productListAvbSelector,
      mapTextContent
    );

    return productListAvb;
  } catch (e) {
    return [];
  }
}

// ========== TYPING SIMULATION (KEY STROKE) ==========
async function keyboardInput(page: Page, keyword: string): Promise<any> {
  try {
    await page.click(shopSelectors.searchSelector);
    await delay(2000);
    await page.keyboard.type(keyword, {delay: 150});
    await page.keyboard.press('Enter');
  } catch (e) {
    return e;
  }
}

// ========== TIMEOUT FUNCTION ==========
function delay(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

scrapeProducts();
