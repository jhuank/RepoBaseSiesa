export interface Filter {
  id: number;
  slug: string;
  pageSize: number;
  searchText: string;
  internSearchText: string;
  userId: string;
  slugPromition: string;
  filters?: {
    attributes?: any;
    pageNumber?: number;
    productHighPrice?: number;
    productLowPrice?: number;
    sort?: number;
  };
}
