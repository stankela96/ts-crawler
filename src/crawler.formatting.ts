/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
export const formatUrl = (url: string, domain: string): string => {
  const regUrl = /^(http(s)?:\/\/)/gm;
  if (url.indexOf('/') === 0) url = url.substr(1);
  return url.match(regUrl) ? url : domain + url;
};

export const formatPrice = (price: string): string => {
  return price.replace(/[^0-9\,\.]/gi, '').replace(',', '.');
};

/**
 * Function that is extracting length of elements from result of page.$eval functions
 * **/
export const getElementsLength = (element: any) => {
  return element.length;
};

/**
 * Function that is extracting textContent from result of page.$eval functions
 * **/
export const getTextContent = (element: any) => {
  return element.textContent;
};

/**
 * Function that is extracting attribute content from result of page.$eval functions
 * **/
export const getContent = (element: any) => {
  return element.getAttribute('content');
};

/**
 * Function that is extracting attribute data-tracking-product-code from result of page.$eval functions
 * **/
export const getDataTrackingProductCode = (element: any) => {
  return element.getAttribute('data-tracking-product-code');
};

export const mapSellerTitle = (element: any) => {
  return element.map((option: any) =>
    option.getAttribute('title').toLowerCase()
  );
};

export const getHTML = (element: any) => {
  return element.outerHTML;
};

/**
 * Function that is extracting attribute data-pzn from result of page.$eval functions
 * **/
export const getDataPzn = (element: any) => {
  return element.getAttribute('data-pzn');
};

/**
 * Function that is extracting attribute href from result of page.$eval functions
 * **/
export const getHref = (element: any) => {
  return element.getAttribute('href');
};

/**
 * Function that is mapping and extracting data-product-id from result of page.$$eval functions
 * **/
export const mapDataProductId = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-product-id'));
};

/**
 * Function that is mapping and extracting style from result of page.$$eval functions
 * **/
export const mapStyle = (element: any) => {
  return element.map((option: any) => option.getAttribute('style'));
};

/**
 * Function that is mapping and extracting title from result of page.$$eval functions
 * **/
export const mapTitle = (element: any) => {
  return element.map((option: any) => option.getAttribute('title'));
};

/**
 * Function that is mapping and extracting data-product-variant-id from result of page.$$eval functions
 * **/
export const mapDataProductVariantId = (element: any) => {
  return element.map((option: any) =>
    option.getAttribute('data-product-variant-id')
  );
};

/**
 * Function that is mapping and extracting textContent from result of page.$$eval functions
 * **/
export const mapTextContent = (element: any) => {
  return element.map((option: any) => option.textContent.trim());
};
/**
 * Function that is mapping and extracting content from result of page.$$eval functions
 * **/
export const mapContent = (element: any) => {
  return element.map((option: any) => option.getAttribute('content'));
};
/**
 * Function that is mapping and extracting outerHTML from result of page.$$eval functions
 * **/
export const mapHTMLContent = (element: any) => {
  return element.map((option: any) => option.outerHTML);
};

/**
 * Function that is mapping and extracting outerHTML from result of page.$$eval functions
 * **/
export const mapHTMLSiblingsContent = (element: any) => {
  return element.map((option: any) => option.nextElementSibling.outerHTML);
};

/**
 * Function that is mapping and extracting value from result of page.$$eval functions
 * **/
export const mapValue = (element: any) => {
  return element.map((option: any) => option.getAttribute('value'));
};

/**
 * Function that is mapping and extracting OnClick from result of page.$$eval functions
 * **/
export const mapOnClick = (element: any) => {
  return element.map((option: any) => option.getAttribute('onclick'));
};

/**
 * Function that is mapping and extracting id from result of page.$$eval functions
 * **/
export const mapIds = (element: any) => {
  return element.map((option: any) => option.id);
};

/**
 * Function that is mapping and extracting hrefs from result of page.$$eval functions
 * **/
export const mapHrefs = (element: any) => {
  return element.map((option: any) => option.href);
};

/**
 * Function that is mapping and extracting attributes src from result of page.$$eval functions
 * **/
export const mapImgSrcs = (element: any) => {
  return element.map((option: any) => option.src);
};
/**
 * Function that is mapping and extracting attributes src from result of page.$$eval functions
 * **/
export const mapParentHref = (element: any) => {
  return element.map((option: any) => option.parentNode.getAttribute('href'));
};
/**
 * Function that is mapping and extracting attributes src from result of page.$$eval functions
 * **/
export const mapDataImg = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-img-large'));
};
/**
 * Function that is mapping and extracting attributes data-image from result of page.$$eval functions
 * **/
export const mapDataImage = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-image'));
};

/**
 * Function that is mapping and extracting attributes data-src from result of page.$$eval functions
 * **/
export const mapDataSrc = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-src'));
};

/**
 * Function that is mapping and extracting attr data-url from result of page.$$eval functions
 * **/
export const mapDataUrl = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-url'));
};

/**
 * Function that is mapping and extracting attr data-url from result of page.$$eval functions
 * **/
export const mapDataVideoUrl = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-videourl'));
};

/**
 * Function that is mapping and extracting attr data-url from result of page.$$eval functions
 * **/
export const mapDataScarabItem = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-scarabitem'));
};

/**
 * Function that is mapping and extracting attr data-url from result of page.$$eval functions
 * **/
export const mapDataOptionId = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-option-id'));
};

/**
 * Function that is mapping and extracting attributes srcset from result of page.$$eval functions
 * **/
export const mapImgSrcSet = (element: any) => {
  return element.map((option: any) => option.srcset);
};

/**
 * Function that is mapping and extracting attributes product from result of page.$$eval functions
 * **/
export const mapDataProductCode = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-product-code'));
};

/**
 * Function that is mapping and extracting attributes data-pzn from result of page.$$eval functions
 * **/
export const mapDataPzn = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-pzn'));
};

/**
 * Function that is mapping and extracting attributes data-ordernumber from result of page.$$eval functions
 * **/
export const mapDataOrderNumber = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-ordernumber'));
};

/**
 * Function that is mapping and extracting attributes data-tracking-product-code from result of page.$$evaleval functions
 * **/
export const mapDataTrackingProductCode = (element: any) => {
  return element.map((option: any) =>
    option.getAttribute('data-tracking-product-code')
  );
};

/**
 * Function that is mapping and extracting attributes data-tracking-product-code from result of page.$$evaleval functions
 * **/
export const mapDataTrackingPromotionId = (element: any) => {
  return element.map((option: any) =>
    option.getAttribute('data-tracking-promotion-id')
  );
};

/**
 * Function that is mapping and extracting attributes data-tracking-article-ordernumber from result of page.$$evaleval functions
 * **/
export const mapDataTrackingArticleOrderNumber = (element: any) => {
  return element.map((option: any) =>
    option.getAttribute('data-tracking-article-ordernumber')
  );
};

/**
 * Function that is mapping and extracting attributes data-itempzn from result of page.$$evaleval functions
 * **/
export const mapDataItemPZN = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-itempzn'));
};

/**
 * Function that is mapping and extracting map data gtm from result of page.$$eval functions
 * **/
export const mapDataGtmPayload = (element: any) => {
  return element.map((option: any) => option.getAttribute('data-gtm-payload'));
};
/**
 * Function that is mapping and extracting attributes data-image from result of page.$$eval functions
 * **/
export const mapAltText = (element: any) => {
  return element.map((option: any) => option.getAttribute('alt'));
};
