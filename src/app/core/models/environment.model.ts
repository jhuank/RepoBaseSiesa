export interface AppEnvironment {
  clientName?: string;
  author?: string;
  apiGatewayFront?: string;
  apiGatewayBackOffice?: string;
  enableDebug?: string;
  siteKeyCaptcha?: string;
  apiKeyGoogleMap?: string;
  tagId?: string;
  toastDelay?: number;
  saveParametersInStorage?: boolean;
  maximumItemsDisplayedInListOnHome?: number;
}
