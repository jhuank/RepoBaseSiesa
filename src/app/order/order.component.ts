import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap, takeUntil, map } from 'rxjs/operators';
import { Observable, Subject, of, timer, BehaviorSubject, interval, concat } from 'rxjs';

import { CartService } from '@core/services/cart/cart.service';
import { ToastService } from '@core/services/toast/toast.service';
import { CommonService } from '@core/services/common/common.service';
import { IShoppingCartItem, IShoppingCartPaymentMethod, ShoppingCart, CustomParam, CheckItemsPriceReponse, CheckItemsPriceItem, filterPickUp } from '@core/models/cart.model';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ModalService } from '@core/services/modal/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import { titles } from '@config/titles.constants';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { DOCUMENT } from '@angular/common';
import { LocationService } from '@core/services/location/location.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  templateUrl: '../../templates/order/order.component.html',
  styleUrls: ['../../templates/order/order.component.scss']
})
export class OrderComponent implements OnInit {
  public searching = false;
  public paymentMethods: IShoppingCartPaymentMethod[];
  // public orderDataForm: any;
  public initialCharge = false;
  public toggleOrderComment: boolean;
  public products = [];
  public locations$: Observable<any[]>;
  private locationQuery = new Subject<string>();
  private currentShoppingCartError: BehaviorSubject<ShoppingCart>;
  public updatingQuantity = false;
  public updatingQuantityIdItem: String;
  public cmsData: any;
  public page = 'PAG-31';
  public paramestroToast: any;
  public savingCoupon: boolean = false;
  public discountCoupon: String;
  public couponSaved: boolean = false;
  public couponMessage: any;
  public couponResponse: any;
  public validCoupon: boolean = false;
  public couponCode: any;
  public obsequios = [];
  public formCoupon = new FormGroup({
    couponDiscounCode: new FormControl('', [
      Validators.required,
    ]),
  });
  public formCouponFeedback = {
    couponDiscounCode: {
      required: 'El cupón de descuento es requerido',
    },
  };
  public customProperties: CustomParam = new CustomParam();
  public showItemsCheckPriceCms = false;

  constructor(
    public parametersService: ParametersService,
    public cartService: CartService,
    public locationService: LocationService,
    private adService: AdvertisementsService,
    private commonService: CommonService,
    private toastService: ToastService,
    public modalService: ModalService,
    public switchSpinnerService: SwitchSpinnerService,
    public ngxSmartModalService: NgxSmartModalService,
    private gtmService: GoogleTagManagerService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute
  ) {
    this.currentShoppingCartError = new BehaviorSubject(new ShoppingCart);
  }

  ngOnInit() {

    this.parametersService.getSingleParamInStorage('giftForm', 'de').subscribe((response : CustomParam) => {
      this.customProperties = response;
    });

    this.adService.setTitle(titles.order);
    this.switchSpinnerService.on();
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;

      this.adService.setTitle(data?.seo?.title || titles.home);
      this.adService.setMetaTags({
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords});

    });

    const cartId = this.route.snapshot.paramMap.get('orderId');

    this.cartService.checkItemsPriceByCart().then((data: CheckItemsPriceReponse) => {

      if(data?.activeParameter) {
        let itemsCopy = data?.finalArray.map((item: CheckItemsPriceItem) => {
          if(item.deleteFromCart) this.showItemsCheckPriceCms = true;
        });
      }

      this.cartService.getShoppingCartDetails(cartId).subscribe((response: any) => {

        this.products = [];
        this.obsequios = [];

        if (response?.itemsCanastaUsuario?.length) {
          response.itemsCanastaUsuario.forEach((valFor) => {
            this.products.push(
              {
                id: valFor.id,
                name: valFor.name,
                price: valFor.price,
                category: valFor.category.slug,
                quantity: valFor.quantity,
              }
            );
            if (valFor?.obsequio?.id) {
              this.obsequios.push(valFor.obsequio);
            }
          });
          this.getPaymentMethods();
        }

        this.switchSpinnerService.off();
        const gtmTag = {
          event: 'checkout',
          ecommerce: {
            checkout: {
              actionField: { step: 1 },
              products: this.products
            }
          }
        };
        this.gtmService.pushTag(gtmTag);
      });

    });

    this.locations$ = this.locationQuery.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(
        (text) => this.commonService.searchLocationByText(text)
          .pipe(tap(() => this.searching = false))
      )
    );
    this.toggleOrderComment = false;


    this.parametersService.getCompanyParameters().toPromise().then((company) => {
      this.paramestroToast = company.config?.toast;

    });


  }
  showHomeCarousel(): boolean {
    if (this.parametersService.page?.deliveryParams?.delivery_mode) {
      if (this.cartService.shoppingCart?.cartLocation?.address) {
        return true;
      }

      return false;
    }

    if (this.cmsData) {
      return true;
    }

    return false;
  }
  /**
   * Obtiene los métodos de pago
   */
  getPaymentMethods(): void {
    this.cartService.getPaymentMethods().subscribe((methods) => {
      if (methods.length > 1) {
        this.paymentMethods = methods;
      } else {
        this.setPaymentMethod(methods[0].id);
      }
    });
  }

  /**
   * Establece el método de pago a usar en la compra
   */
  setPaymentMethod(paymentMethodId: number): void {
    if (!paymentMethodId || this.cartService.shoppingCart?.cartOrderData?.payment?.id === paymentMethodId) { return; }

    this.cartService.setPaymentMethod(paymentMethodId).subscribe(
      (response) => {
        if (!response.error) {
          this.cartService.shoppingCart.cartOrderData.payment.id = paymentMethodId;
        }
      }
    );
  }

  /**
   * Buscar locaciones de destino
   */
  searchLocations(text: string): void {
    this.locationQuery.next(text);
  }

  /**
   * Establecer locación de destino
   */
  selectLocation(location: any): void {
    this.cartService.setLocation(location.value).subscribe(
      (response) => this.toastService.showFeedback(response)
    );
  }

  locationInformation(): string {
    const location = this.cartService.shoppingCart?.cartLocation;

    if (location && location.cityId) {
      const label = [location.countryName, location.cityName];

      if (location.neighborhoodId) {
        label.push(location.neighborhoodName);
      }

      if (
        (this.parametersService.page?.deliveryParams?.delivery_mode ||
        this.parametersService.page?.deliveryParams?.store_pickup_mode) &&
        this.parametersService.company?.config?.crearDireccionModalCobertura
      ) {
        label.push(`<div>${this.cartService.shoppingCart?.cartLocation?.address}.</div>`);
      }

      const label2: string[] = [];
      if(this.cartService.shoppingCart?.isCollectedInStore && this.cartService.shoppingCart?.cartOrderData?.deliveryDay) {
        label2.push(`<div>FECHA ENTREGA: ${this.cartService.shoppingCart?.cartOrderData?.deliveryDay}.</div>`);
      }
      if(this.cartService.shoppingCart?.isCollectedInStore && this.cartService.shoppingCart?.cartLocation?.mainPhoneNumber) {
        label2.push(`<div>TELÉFONO: ${this.cartService.shoppingCart?.cartLocation?.mainPhoneNumber}.</div>`);
      }

      if (this.parametersService.page?.deliveryParams?.store_pickup_mode && location.storeName) {

        if(this.cartService.shoppingCart?.isCollectedInStore && this.cartService.shoppingCart?.cartOrderData?.deliveryDay
          && this.cartService.shoppingCart?.cartLocation?.mainPhoneNumber) {

            return `<div>
              <p class="mb-1"><b>${location?.storeName.toUpperCase()}</b></p>
              <small>${label.join(', ')}</small>
              <small>${label2.join(' ')}</small>
            </div>`;

        }else {

            return `<div>
              <p class="mb-1"><b>${location?.storeName.toUpperCase()}</b></p>
              <small>${label.join(', ')}</small>
            </div>`;
        }

      } else {
        return label.join(', ');
      }
    }
    return 'Se necesita una ubicación de destino';
  }

  setOrderComment(comment: string): void {
    this.cartService.setOrderComment(comment).subscribe((response) => {
      if (!response.error) {
        this.cartService.shoppingCart.cartOrderData.comment = comment;
        this.toggleOrderComment = false;
      }

      this.toastService.showFeedback(response);
    });
  }

  showModalRemoveItemToShoppingCart(template: TemplateRef<any>, product: IShoppingCartItem): void {
    this.modalService.open(template, product, (accept) => {
      if (accept) {
        this.removeItemToShoppingCart(product);
      }
    });
  }
  /**
   * Remueve un producto de la canasta
   */
  removeItemToShoppingCart(product: IShoppingCartItem): void {
    this.cartService.removeItemToShoppingCart(product.id).subscribe(
      (response) => {
        const gtmTag = {
          event: 'removeFromCart',
          ecommerce: {
            remove: {
              products: [{
                name: product.name,
                id: product.id,
                quantity: product.quantity
              }]
            }
          }
        };
        this.gtmService.pushTag(gtmTag);
        this.toastService.showFeedback(response);
        this.pushObsequio();
      }
    );
  }

  setQuantityToItem(product: IShoppingCartItem, quantity: number) {
    this.updatingQuantity = true;
    this.updatingQuantityIdItem = product.id;
    if ((!quantity) || (+product.quantity === quantity)) {
      this.updatingQuantity = false;
      return;
    }

    this.cartService.setNewQuantityForItem(product.id, quantity).subscribe((response) => {
      if (response.error) {
        this.toastService.error(response.message);
      }
      this.updatingQuantity = false;
    });
  }

  discardShoppingCart() {
    this.modalService.open('¿Deseas descartar la canasta?', null, (accept) => {
      if (accept) {
        this.cartService.discardShoppingCart().subscribe((response) => {
          if (!response.error) {
            this.cartService.clearShoppingCart();
            this.document.documentElement.scroll({ top: 0 });
          }

          this.toastService.showFeedback(response);
        });
      }
    });
  }

  validateLocation(): boolean {
    return !!(
      this.cartService.shoppingCart?.cartOrderData?.location?.city?.id ||
      this.cartService.shoppingCart?.cartLocation?.cityId
    );
  }

  validatePayment(): boolean {
    return !!(this.cartService.shoppingCart?.cartOrderData?.payment?.id);
  }

  validateNeigborhood(): boolean {
    const conditionalPickup = this.cartService.shoppingCart.isCollectedInStore;

    // if (conditionalPickup && !this.parametersService.page?.neighborhoodCoverage) {
    if (conditionalPickup) {
      return true;
    } else if(!this.cartService.shoppingCart.cartLocation.neighborhoodId && this.parametersService.page?.neighborhoodCoverage){
      return false;
    } else {
      return !((!this.cartService.shoppingCart.cartLocation.neighborhoodId && this.parametersService.page?.deliveryParams?.delivery_mode
        && this.parametersService.page?.neighborhoodCoverage));
    }
  }

  saveOrder() {

    let mensaje = '';
    if (!this.validateLocation() || !this.validatePayment() || !this.validateNeigborhood() ) {

      if (!this.validateLocation()) {
        mensaje += '<li>Ciudad de destino</li>';
      }

      if (!this.validateNeigborhood()) {
        mensaje += '<li>No hay un barrio seleccionado, por favor edite el destino de su pedido</li>';
      }

      if (!this.validatePayment()) {
        mensaje += '<li>Método de pago</li>';
      }

      return this.toastService.warning(`<h5>Aun hacen falta campos por diligenciar:</h5><ul>${mensaje}</ul>`, { delay: this.paramestroToast?.tiempoVisualizacionAlertasCanasta });
    }

    //validar fecha y hora de recogida (recoger en tienda)
    let isValid = true;

    if(this.cartService.shoppingCart.isCollectedInStore) {
      this.cartService.locationPickUp$
        .pipe(
          map((filterPickUp: filterPickUp) => {

            if(!filterPickUp.coverage) {
              mensaje = 'Debe seleccionar una ubicación';
            }

            if(!filterPickUp.dates) {
              mensaje = 'Debe seleccionar una fecha de recogida';
            }

            if(!filterPickUp.hours) {
              mensaje = 'Debe seleccionar una hora de recogida';
            }

            return (filterPickUp.coverage != null && filterPickUp.dates != null && filterPickUp.hours != null)
          })
        )
        .subscribe((response) => {
          isValid = response;
        });
    }

    if(!isValid) {
      return this.toastService.warning(`<h5>Aun hacen falta campos por diligenciar:</h5><ul>${mensaje}</ul>`, { delay: this.paramestroToast?.tiempoVisualizacionAlertasCanasta });
    }

    this.cartService.saveOrder().subscribe((response: any) => {
      if (!response.error) {
        this.router.navigate(['/checkout']);
      }
      this.toastService.showFeedback(response, '', this.paramestroToast?.tiempoVisualizacionAlertasCanasta);
    });
  }
  saveDiscountCoupon(code: string) {

     console.log(this);
    if (code) {
      this.savingCoupon = true;
      this.couponSaved = false;

      this.cartService.saveDiscountCoupon(code).subscribe((response: any) => {
        console.log('response coupon ', response);
        this.couponResponse = response;
        if (!response.error) {
          this.couponMessage = response.message;
          this.savingCoupon = false;
          this.couponSaved = true;
          this.discountCoupon = '';
          this.validCoupon = !response.error;

          console.log(response);
          if (!response.error) {
            this.couponCode = code;
          } else {
            this.savingCoupon = false;
            this.couponSaved = true;
          }
          if (this.validCoupon && this.couponSaved) {
            console.log('showResponseCuponCode');
          }
        } else {
          this.couponMessage = response.message;
          this.discountCoupon = '';
          this.savingCoupon = false;
          this.couponSaved = false;
          this.validCoupon = !response.error;
          this.couponCode = '';
          console.log('updateCartInfo', 'setTooltip');
        }
        console.log('message',this.couponMessage);
        this.toastService.showFeedback(response, '', this.paramestroToast?.tiempoVisualizacionAlertasCanasta);
      });
    }
  }
  deleteCoupon(idCupon:any) {
    this.cartService.deleteCoupon(idCupon).subscribe((response: any) => {
      if (!response.error) {
        console.log(response);
        console.log(response.error);
        /* this.deletingItemCart = false; */
        if (!response.error) {
          //this.updateCart();
          this.couponCode = '';
          this.cartService.shoppingCart.cartCoupons = false;
          this.savingCoupon = false;
          this.validCoupon = false;
          this.couponMessage = '';
        }
      }
      this.toastService.showFeedback(response, '', this.paramestroToast?.tiempoVisualizacionAlertasCanasta);
    });
  }
  pushObsequio() {
    this.obsequios = [];
    console.log("vino");
    console.log(this.cartService.shoppingCart.itemsCanastaUsuario);
    this.cartService?.shoppingCart?.itemsCanastaUsuario?.forEach((valFor) => {
      if (valFor?.obsequio?.id) {
        this.obsequios.push(valFor.obsequio);
      }
    });
  }

  /* modalCuponAplicado(mensaje) {
    if (__env.adaptative) {
      this.messageMaterial('El cupón ' + mensaje + ' ha sido agregado.')
    } else {
      let options = {
        title: 'Notificación',
        isHtml: true,
        content: `<div class="alert alert-success" style="margin-bottom: 10px;">
                        El cupón <b>${mensaje}</b> ha sido agregado.
        </div>`,
        size: 'sm',
        showBottonCancel: false,
        textActionCancel: '',
        textAction: 'Aceptar'
      };
      this.messageResponse(options);
    }
  } */

}
