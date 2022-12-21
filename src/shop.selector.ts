const shopSelectors = {
  cookieSelector: '[data-testid="uc-accept-all-button"]',
  productListLengthSelector: '.o-SearchResults li.o-SearchProductListItem',
  productListContentSelector:
    '.o-SearchResults li.o-SearchProductListItem .o-SearchProductListItem__content .u-padding--sides',
  shopUrl: 'https://www.shop-apotheke.com',
  exampleUrl:
    'https://www.shop-apotheke.com/search.htm?i=1&q=Magnesium&searchChannel=algolia',
  productListPriceSelector:
    '.o-SearchResults li.o-SearchProductListItem .o-SearchProductListItem__content .o-SearchProductListItem__prices__retail-price-wrapper',
  productListTitleSelector:
    '.o-SearchResults li.o-SearchProductListItem .o-SearchProductListItem__content .u-padding--sides .o-SearchProductListItem__title',
  productListAvbSelector:
    '.o-SearchResults li.o-SearchProductListItem .o-SearchProductListItem__content .u-padding--sides .o-SearchProductListItem__selectableSection a',
  searchSelector: '#h-SearchBox [data-qa-id="search-box-query"]',
};

export default shopSelectors;
