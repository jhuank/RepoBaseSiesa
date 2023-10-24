import {Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, filter, tap, take} from 'rxjs/operators';
import {CatalogueService} from '@core/services/catalogue/catalogue.service';
import {Product} from '@core/models/product.model';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {Filter} from '@core/models/filter.model';
import {AuthService} from '@core/services/auth/auth.service';
import {GoogleTagManagerService} from 'angular-google-tag-manager';
import {EnvService} from '@core/services/env/env.service';
import {AdvertisementsService} from '@shared/services/advertisements/advertisements.service';
import {DOCUMENT} from '@angular/common';
import {SwitchSpinnerService} from '@core/services/switch-spinner/switch-spinner.service';
import {titles} from '@config/titles.constants';
import {ParametersService} from '@core/services/parameters/parameters.service';
import {response} from "express";
import {CartService} from '@core/services/cart/cart.service';

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

@Component({
  selector: 'app-product-list',
  templateUrl: '../../templates/catalogue/catalogue.component.html',
  styleUrls: ['../../templates/catalogue/catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit {
  @ViewChild('categoryInfo') categoryInfoRef: ElementRef;
  private filtersSubject: BehaviorSubject<Filter>;
  private showLocalSpinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public filters$: Observable<Filter>;
  public defaultFilters: any = null;
  public category: any;
  public categoryAttributes: { data: any[]; hasMoreAttributes: boolean };
  public products: Product[] = [];
  public filterProductLowPrice = '';
  public filterProductHighPrice = '';
  public pagination: Pagination;
  public cms: any;

  constructor(
    private envService: EnvService,
    private catalogueService: CatalogueService,
    private authService: AuthService,
    private adService: AdvertisementsService,
    public switchSpinnerService: SwitchSpinnerService,
    private gtmService: GoogleTagManagerService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    public  parametersService: ParametersService
  ) {
  }

  ngOnInit(): void {
    this.adService.setTitle(titles.catalogue);
    this.route.params
      .pipe(
        tap((params) => {
          this.switchSpinnerService.on();
          const slug = params.categorySlug || params.query;
          const attrArr = this.route.snapshot.queryParamMap.get('attributes');
          let attr;
          if (attrArr === null) {
            attr = new Array<string>();
          } else {
            attr = JSON.parse(attrArr);
          }

          const filters = {
            id: null,
            slug: '',
            pageSize: 12,
            searchText: '',
            internSearchText: '',
            cartId: this.cartService.getCartId(),
            userId: this.authService.getUserId(),
            slugPromition: null,
            filters: {
              pageNumber: +this.route.snapshot.queryParamMap.get('pageNumber') || 1,
              attributes: attr || {},
              productHighPrice: +this.route.snapshot.queryParamMap.get('productHighPrice') || 0,
              productLowPrice: +this.route.snapshot.queryParamMap.get('productLowPrice') || 0,
              sort: 1
            }, typeProducts: null,

          };

          if (filters.filters.productLowPrice && filters.filters.productLowPrice !== 0 ){
            this.filterProductLowPrice = filters.filters.productLowPrice.toString();
          }
          if (filters.filters.productHighPrice && filters.filters.productHighPrice !== 0 ){
            this.filterProductHighPrice = filters.filters.productHighPrice.toString();
          }

          if (params.categorySlug) {
            if (slug === 'promocion' ) {
              filters.slugPromition = slug;
              this.adService.setTitle(titles.promotions);
            } else if ( slug === 'destacados' || slug === 'nuevos' ) {
              filters.typeProducts = slug;
              this.adService.setTitle(slug);
            } else {
              filters.slug = slug;
            }
            this.getCategory(slug);
            this.getAttributesByCategory(slug);
          } else if (params.query) {
            filters.searchText = slug;
            this.adService.setTitle(titles.results);
          }

          this.filtersSubject = new BehaviorSubject<Filter>(filters);
          this.filters$ = this.filtersSubject.asObservable();
          this.pagination = {
            page: filters.filters.pageNumber,
            pageSize: filters.pageSize,
            total: 0,
          }
        }),
        switchMap(() => this.updateItemsByFilter(this.currentFilters)),
        tap(() => this.switchSpinnerService.off())
      )
      .subscribe((response) => {
        if (
          !response?.items?.length &&
          this.currentFilters.slugPromition === null
        ) {
          this.router.navigate([
            '/',
            'product-not-found',
            this.currentFilters.searchText,
          ]);
        } else {
          this.products = response.items;
          this.pagination.total = response.cantidadTotal;
          this.filtersSubject.next({
            ...this.currentFilters,
            userId: this.authService.getUserId(),
            filters: {
              ...this.currentFilters.filters,
              productHighPrice: response.highestPrice,
            },
          });
          if (!this.defaultFilters) {
            this.defaultFilters = {...this.currentFilters.filters};
          }
        }

        if (this.envService.isBrowser) {
          const Products = [];
          response.items.forEach((valFor, indexFor) => {
            Products.push({
              id: valFor.id,
              name: valFor.name,
              price: valFor.currentPrice,
            });
          });
          const gtmTag = {
            event: 'Pageview',
            ecommerce: {
              currencyCode: 'COP',
              impressions: Products,
            },
          };
          this.gtmService.pushTag(gtmTag);
        }
      });


    this.filters$
      .pipe(
        filter((filters) => !!filters.slug),
        filter((filters) => filters.slug == 'promocion'),
        take(1),
        switchMap(() => this.adService.getAdvertisements('PAG-43'))
      )
      .subscribe((cms) => (this.cms = cms));

    this.filters$
      .pipe(
        filter((filters) => !!filters.slug),
        filter((filters) => filters.slug != 'promocion'),
        take(1),
        switchMap(() => this.adService.getAdvertisements('PAG-20'))
      )
      .subscribe((cms) => (this.cms = cms));
  }

  get currentFilters(): Filter {
    return this.filtersSubject?.value;
  }

  /**
   * Actualiza los items
   */
  updateItemsByFilter(filters?: any): Observable<any> {
    return this.catalogueService
      .getItemsByCategory(filters || this.currentFilters)
      .pipe(
        tap((response) => {
          if (response.items && !filters) {
            this.products = response.items;
            this.pagination.total = response.cantidadTotal;
            this.pagination.pageSize = this.currentFilters.pageSize;
          }
          this.filtersToUlr();
        })
      );
  }

  /**
   * Obtener categorías
   */
  async getCategory(slug: string) {
    const category = await this.catalogueService
      .getCategory({slug})
      .toPromise();

    this.category = category;
    this.adService.setMetaTags({
      title: category?.seo?.title,
      meta_description: category?.seo?.meta_description,
      image: category?.image,
      og_title: category?.seo?.og_title,
      og_description: category?.seo?.og_description,
      keywords: category?.seo?.keywords,
    });
  }

  /**
   * Obtener los atributos por categoría
   */
  async getAttributesByCategory(slug: string) {
    const attributes = await this.catalogueService
      .getCategoryAttributes({slug})
      .toPromise();

    this.categoryAttributes = attributes;
  }

  updateListByText(text: string = '') {
    const filters = Object.assign({}, this.currentFilters);

    filters.internSearchText = text;

    this.filtersSubject.next(filters);
    this.updateItemsByFilter()
      .toPromise()
      .then((response) => ({}));
  }

  updateListByPageSize(size: number) {
    const filters = Object.assign({}, this.currentFilters);

    filters.pageSize = size;

    this.filtersSubject.next(filters);
    this.showLocalSpinnerSubject.next(true);
    this.updateItemsByFilter()
      .pipe(tap(() => this.showLocalSpinnerSubject.next(false)))
      .toPromise()
      .then((response) => ({}));
  }

  updateListBySort(sort: number) {
    const {filters}: any = this.currentFilters;
    const min = +this.filterProductLowPrice;
    const max = +this.filterProductHighPrice;

    if (max > 0) {
      this.currentFilters.filters.productHighPrice = max;
    }

    if (min != null) {
      this.currentFilters.filters.productLowPrice = min;
    }
    //filters.filters.sort = sort;
    this.currentFilters.filters.sort = sort;

    this.filtersSubject.next({...this.currentFilters, ...filters});
    this.showLocalSpinnerSubject.next(true);
    this.updateItemsByFilter()
      .pipe(tap(() => this.showLocalSpinnerSubject.next(false)))
      .toPromise()
      .then((response) => ({}));
  }

  updateListByAttributes(attribute: any) {
    const {filters}: any = this.currentFilters;
    const attributes = filters.attributes;

    if (!attributes[attribute.attributeId]) {
      attributes[attribute.attributeId] = [];
    }

    const index = attributes[attribute.attributeId].indexOf(attribute.id);

    if (index !== -1) {
      attributes[attribute.attributeId].splice(index, 1);
    } else {
      attributes[attribute.attributeId].push(attribute.id);
    }

    if (attributes[attribute.attributeId].length === 0) {
      delete attributes[attribute.attributeId];
    }

    this.filtersSubject.next({...this.currentFilters, ...filters});
    this.showLocalSpinnerSubject.next(true);
    this.updateItemsByFilter()
      .pipe(tap(() => this.showLocalSpinnerSubject.next(false)))
      .toPromise()
      .then((response) => ({}));
  }

  updateListByPrice() {
    const min = +this.filterProductLowPrice;
    const max = +this.filterProductHighPrice;

    if (max > 0) {
      this.currentFilters.filters.productHighPrice = max;
    }

    if (min != null) {
      this.currentFilters.filters.productLowPrice = min;
    }

    this.showLocalSpinnerSubject.next(true);
    this.updateItemsByFilter({
      ...this.currentFilters,
      filters: {
        ...this.currentFilters.filters,
        productLowPrice: +min,
        productHighPrice: +max,
      },
    })
      .pipe(
        tap(() => this.showLocalSpinnerSubject.next(false))
      )
      .toPromise()
      .then((response) => {
        this.products = response.items;
        this.pagination.total = response.cantidadTotal;
      });
  }

  // Pagination
  handlePageChange(page: number): void {
    const {filters} = this.currentFilters;

    filters.pageNumber = page;
    this.filtersSubject.next({...this.currentFilters, filters});
    this.showLocalSpinnerSubject.next(true);
    this.categoryInfoRef.nativeElement.scrollIntoView();
    this.updateItemsByFilter()
      .pipe(tap(() => this.showLocalSpinnerSubject.next(false)))
      .toPromise()
      .then(() => {
      });
  }

  get filtered() {
    return (
      Object.keys(this.currentFilters.filters.attributes).length ||
      this.defaultFilters.productHighPrice !==
      this.currentFilters.filters.productHighPrice ||
      this.defaultFilters.productLowPrice !==
      this.currentFilters.filters.productLowPrice
    );
  }

  clearFilter() {
    const {filters} = this.currentFilters;

    filters.attributes = {};
    filters.productHighPrice = 0;
    filters.productLowPrice = 0;
    this.filterProductHighPrice = '';
    this.filterProductLowPrice = '';

    this.filtersSubject.next({...this.currentFilters, filters});
    this.updateListByPrice();
  }

  get localSpinner(): boolean {
    return this.showLocalSpinnerSubject.value;
  }

  filtersToUlr() {
    const currentUrl = decodeURIComponent(window.location.pathname);
    this.router.navigate([currentUrl], { queryParams: {
        pageNumber: this.currentFilters.filters.pageNumber,
        productLowPrice: this.currentFilters.filters.productLowPrice,
        productHighPrice: this.currentFilters.filters.productHighPrice,
        sort: this.currentFilters.filters.sort,
        attributes: JSON.stringify(this.currentFilters.filters.attributes),
      } });
  }
 
}
