import {Component, OnInit} from '@angular/core';
import {ParametersService} from '@core/services/parameters/parameters.service';
import {Router} from '@angular/router';
import {OrdersService} from '@core/services/orders/orders.service';
import {AdvertisementsService} from '../shared/services/advertisements/advertisements.service';
import {ToastService} from '@core/services/toast/toast.service';
import {AuthService} from '@core/services/auth/auth.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap, switchMap} from 'rxjs/operators';
import {titles} from '@config/titles.constants';
import {SwitchSpinnerService} from '@core/services/switch-spinner/switch-spinner.service';
import {EnvService} from '@core/services/env/env.service';

@Component({
  selector: 'app-orders',
  templateUrl: '../../templates/orders/orders.component.html',
  styleUrls: ['../../templates/orders/orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private requestOrdersSubject = new BehaviorSubject({
    userId: '',
    sellerId: '',
    typeOrders: '',
    limit: 12,
    page: 1,
    filters: {}
  });
  public requestOrders$ = this.requestOrdersSubject.asObservable();

  public searchText = '';
  public sortType = 'orderId';
  public sortOrder: 'asc' | 'desc' | boolean = 'desc';
  public userOrders: any;
  public pagination = {
    page: 1,
    pageSize: 12,
    total: 0,
    numPages: undefined
  };
  public summary = [];
  public itemsPerPage = 40;
  public loadingUserOrders = true;
  public loadedUserOrders = false;
  public errorLoadingUserOrders = false;
  public loadingDuplicateOrders = false;
  public currentPage = 1;
  public actualPage = 0;
  public filters = {};
  public filtersCopy = {};
  public filterRange: any;

  public maxSize = 5;
  public bigTotalItems = 0;
  public bigCurrentPage = 1;
  public totalItemsPage = 12;
  public statistics: any;
  public userOrdersFiltered = [];
  public count = 0;

  public page = 'PAG-36';
  public cmsData: any;
  public slugCategoriaPrincipal: any;

  constructor(
    public parametersService: ParametersService,
    public authService: AuthService,
    private ordersService: OrdersService,
    private router: Router,
    private toastService: ToastService,
    public switchSpinnerService: SwitchSpinnerService,
    private envService: EnvService,
    private adService: AdvertisementsService
  ) {
    this.slugCategoriaPrincipal = localStorage.getItem('slugCategoriaPrincipal');
    this.slugCategoriaPrincipal = (this.slugCategoriaPrincipal != undefined ? this.slugCategoriaPrincipal : '/');
  }

  ngOnInit(): void {
    this.switchSpinnerService.on();
    this.authService.currentUser$.subscribe((user) => {
      this.switchSpinnerService.off();

      if (user) {
        this.requestOrders = {
          userId: user.userId,
          sellerId: user.sellerId
        };
        this.getUserOrders();
        this.getSummaryQuotes();
        this.getUserStatistics();
      } else {
        if (this.envService.isBrowser) {
          this.router.navigate(['/login']);
        }
      }
    });

    this.adService.setTitle(titles.orders);
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setMetaTags({
        title: data?.seo?.title,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords
      });
    });
  }

  get requestOrders() {
    return this.requestOrdersSubject.value;
  }

  set requestOrders(newRequestOrders: any) {
    const currentRequestOrders = this.requestOrders;

    this.requestOrdersSubject.next({
      ...currentRequestOrders,
      ...newRequestOrders
    });
  }

  getUserOrders() {
    this.requestOrders$.pipe(
      tap(() => {
        this.loadingUserOrders = true;
        this.loadedUserOrders = false;
        this.errorLoadingUserOrders = false;
      }),
      switchMap((request) => this.ordersService.getUserOrders(request))
    ).subscribe((response: any) => {
      this.loadingUserOrders = false;
      this.loadedUserOrders = true;
      this.errorLoadingUserOrders = false;

      // this.pagination = this.Pagination.getNew(40);
      this.userOrders = response.orders;
      this.pagination.total = this.userOrders.totalItems;
      this.userOrdersFiltered = response.orders.ordersQuotes;
      this.bigTotalItems = response.orders.totalItems;
    });
  }

  getSummaryQuotes() {
    this.loadingUserOrders = true;
    this.loadedUserOrders = false;
    this.errorLoadingUserOrders = false;

    this.ordersService.getSummaryQuotes({
      userId: this.authService.getUserId(),
      sellerId: this.authService.currentUserValue.sellerId,
      typeOrders: ''
    }).subscribe((response: any) => {
    });
  }

  getUserStatistics() {
    this.ordersService.getUserOrdersStatistics({
      userId: this.authService.getUserId(),
      sellerId: this.authService.currentUserValue.sellerId,
      typeOrders: '',
    }).subscribe((response: any) => {
      // this.pagination = this.Pagination.getNew(40);
      this.statistics = response.orders;
      // this.bigTotalItems = this.authServiceOrders.totalItems;
    });
  }

  changeRowsPerPage(pageSize: number): void {
    this.requestOrders = {limit: pageSize};
  }

  changePage(page: number): void {
    this.requestOrders = {page};
  }

  changeSort(value: number) {
    this.sortType = (value === 1 || value === 2) ? 'orderId' : 'totalPrice';
    this.sortOrder = (value % 2 === 1) ? 'asc' : 'desc';
  }

  duplicateOrder(order) {
    this.loadingDuplicateOrders = true;
    this.ordersService.duplicateOrderById(
      this.authService.getUserId(),
      this.authService.currentUserValue.sellerId,
      order.orderId
    ).subscribe((response: any) => {
      this.loadingDuplicateOrders = false;
      if (!response.error) {
        // this.SessionService.put('cartId', response.cartId);
        // this.$state.go('home.cart');

        localStorage.setItem('cartId', response.cartId);
        this.router.navigate(['order']);
      } else {
        alert('No se pudo completar la acción.');
      }
    });
  }

  payNow(orderId, order) {

    const userId = this.authService.getUserId();

    this.ordersService.recalculateOrder(orderId, userId).subscribe((response: any) => {
      if (!response.error) {

        if (order.paymentStateName === 'Procesando pago') {
          this.toastService.error(
            'Lo sentimos! El pago de tu pedido está siendo procesado. Por favor intentalo de nuevo más tarde.'
          );
        }

        // TODO: reemplazar funcionalidad window
        // this.$window.location = window.__env.envApiServiceBaseUri + '/order/pay-gate?id=' + orderId;

      } else {

        if (order && response.data) {
          order.paymentStateName = response.data;
        }
        this.toastService.success(response.title, response.message);
      }
    });
  }

  /** Set item per page on the pagination
   * @method setPagination
   * @param itemsPerPage Items per page on the pager
   * @example
   * setPagination(8)
   */
  setPagination(itemsPerPage) {
    this.totalItemsPage = itemsPerPage;
    this.bigCurrentPage = 1;
    this.getUserOrders();
  }

  changePageOrdes(num) {
    this.actualPage = num - 1;
  }

  syncOrder(orderId, orderData) {
    const options = {
      orderId
    };
    /* TODO: Manejo de Modales
    let modalInstance = this.$uibModal.open({
        animation: true,
        template: syncOrderModal,
        controller: 'SyncOrderModalController',
        controllerAs: 'mdCtrl',
        size: '',
        resolve: {
            modalOptions: () => options
        }
    });
    modalInstance.result.then(result => {
        orderData.sincronizado = result;
    }).catch(reason => {

    });
    */
  }

  getFilters() {
    if (JSON.stringify(this.filtersCopy) === JSON.stringify(this.filters)) {
      this.getUserOrders();
    }
  }

  clearFilter() {
    this.filterRange = {};
    this.getUserOrders();
  }

  rangeChange() {
    if ((this.filterRange.date1) && (this.filterRange.date2)) {
      if (this.filterRange.date1 > this.filterRange.date2) {
        alert('La fecha inicial no puede ser mayor a la fecha final');
      } else {
        this.getUserOrders();
      }
    }
  }

}
