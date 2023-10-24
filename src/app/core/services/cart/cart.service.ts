import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '@core/services/auth/auth.service';
import { EnvService } from '../env/env.service';

import { IShoppingCartPaymentMethod, ShoppingCart, CustomParam, CheckItemsPriceReponse, filterPickUp } from '@core/models/cart.model';
import { AppResponse } from '@core/models/common.model';

import { constants } from '@config/app.constants';
import { ParametersService } from '@core/services/parameters/parameters.service';

const {
  getShoppingCartSummary,
  getShoppingCartDetails,
  removeShoppingCart,
  addItemToShoppingCart,
  registrarBasketLoss,
  removeItemToShoppingCart,
  getLocationByText,
  getPaymentMethods,
  setLocation,
  setPaymentMethod,
  setOrderComment,
  setNewQuantityForItem,
  saveCart,
  validateCuponCode,
  deleteCartCupon,
  checkItemsPriceByCart
} = constants.config;

const {
  STORAGE_CART_DATA,
  STORAGE_CART_ID
} = constants.storage;


@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartId: string | number;
  private shoppingCartSubject: BehaviorSubject<ShoppingCart>;
  public shoppingCart$: Observable<ShoppingCart>;
  public obsequios = [];

  public locationPickUpSubject: BehaviorSubject<filterPickUp>;
  public locationPickUp$: Observable<filterPickUp>;
  public calculatoQua = 1;
  constructor(
    private envService: EnvService,
    private authService: AuthService,
    private http: HttpClient,
    public parametersService: ParametersService
  ) {
    let shoppingCart = {};

    if (this.envService.isBrowser) {
      const shoppingCartInStorage = localStorage.getItem(STORAGE_CART_DATA);
      shoppingCart = JSON.parse(shoppingCartInStorage);
    }

    this.shoppingCartSubject = new BehaviorSubject(shoppingCart);
    this.shoppingCart$ = this.shoppingCartSubject.asObservable();

    this.locationPickUpSubject = new BehaviorSubject<filterPickUp>({
      coverage: +this.shoppingCart?.cartLocation?.storeId || null,
      hours: null,
      dates: null
    });
    this.locationPickUp$ = this.locationPickUpSubject.asObservable();

  }

  get shoppingCart(): ShoppingCart {
    return this.shoppingCartSubject.value || new ShoppingCart;
  }

  set shoppingCart(shoppingCart: ShoppingCart) {
    this.shoppingCartSubject.next(shoppingCart);

    if (shoppingCart) {
      localStorage.setItem(STORAGE_CART_ID, shoppingCart.cartId);
      localStorage.setItem(STORAGE_CART_DATA, JSON.stringify(shoppingCart));
    } else {
      localStorage.removeItem(STORAGE_CART_DATA);
    }
  }

  getCartId(): string {
    if (this.shoppingCart?.hasOwnProperty(STORAGE_CART_ID)) {
      return this.shoppingCart.cartId;
    }

    return localStorage.getItem(STORAGE_CART_ID) || '';
  }

  updateShoppingCart(cartId: string = '') {
    this.getShoppingCartDetails(cartId).subscribe((shoppingCart) => this.shoppingCart = shoppingCart);
  }

  /**
   * Obtener el resumen de la canasta
   */
  getShoppingCartSummary(login: boolean = false, cartId?: string): Observable<ShoppingCart> {
    let params = {
      cartId: cartId || this.getCartId(),
      userId: this.authService.getUserId()
    };

    if (login) {
      params = Object.assign({ login: 'true' }, params);
    }

    return this.http.get<ShoppingCart>(`${this.envService.apiGatewayFront}/${getShoppingCartSummary}`, {
      params
    }).pipe(
      tap((shoppingCart) => this.shoppingCart = shoppingCart)
    );
  }

  /**
   * Obtener los detalles de la canasta
   */
  getShoppingCartDetails(cartId: string = ''): Observable<ShoppingCart> {
    // clientPriceListName = JSON.parse(localStorage.getItem('quoteCartSeller')).clientPriceList;
    return this.http.get<ShoppingCart>(`${this.envService.apiGatewayFront}/${getShoppingCartDetails}`, {
      params: {
        userId: this.authService.getUserId(),
        cartId: cartId || this.getCartId(),
        quotePriceListName: '' // TODO: Obtener ¿De donde?
      }
    }).pipe(
      tap((shoppingCart) => this.shoppingCart = shoppingCart),
      tap((shoppingCart) => {
        const copyShoppingCart = shoppingCart;
        this.parametersService.getPageParameters().subscribe((page) => {
          copyShoppingCart.showTransportMessage = page.validacion_liquidacion_transporte_canasta;
          copyShoppingCart.transportMessage = page.mensaje_validacion_liquidacion_transporte_cero;
        });
        this.obsequios = [];
        this.shoppingCart?.itemsCanastaUsuario?.forEach((valFor) => {
          if (valFor?.obsequio?.id) {
            this.obsequios.push(valFor.obsequio);
          }
        });
        return this.shoppingCart = copyShoppingCart;
      })
    );
  }

  /**
   * Chequea todos los items de la canasta y elimina los items que no estan asociados a una lista de precios o,
   * que tengan precio = 0
   * @param cartId
   */
  checkItemsPriceByCart(cartId: string = ''): Promise<CheckItemsPriceReponse> {

    return this.http.get<any>(`${this.envService.apiGatewayFront}/${checkItemsPriceByCart}`, {
      params: {
        userId: this.authService.getUserId(),
        cartId: cartId || this.getCartId(),
        quotePriceListName: '' // TODO: Obtener ¿De donde?
      }
    })
    .toPromise()
    .then();
  }

  /**
   * Añade un item de la actual canasta
   */
  addItemToShoppingCart(productId: string, quantity: number = 1, comment?: string): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.envService.apiGatewayFront}/${addItemToShoppingCart}`, {
      userId: this.authService.getUserId(),
      addItemAlreadyInCart: 0,
      cantidad_producto: quantity,
      comentario_producto: comment,
      id_canasta: this.getCartId(),
      id_producto: productId
    }).pipe(
      tap((response: any) => {
        if (response.error) {
          this.registrarBasketLoss(+productId, { quantity, available: response.itemStock });
        } else {
          this.updateShoppingCart(response.cartId);
        }
      })
    );
  }

  registrarBasketLoss(productId: number, data: { available: number; quantity: number; }) {
    this.http.post(`${this.envService.apiGatewayFront}/${registrarBasketLoss}`, {
      cantDisp: data.available,
      cantSoli: data.quantity,
      itemId: productId,
      cartId: this.getCartId(),
      userId: this.authService.getUserId()
    }).toPromise().then();
  }

  /**
   * Remueve un item de la actual canasta
   */
  removeItemToShoppingCart(productId: string): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.envService.apiGatewayFront}/${removeItemToShoppingCart}`, {
      id_canasta: this.getCartId(),
      id_producto: productId
    }).pipe(
      tap(() => this.updateShoppingCart())
    );
  }

  /**
   * Limpia la canasta
   */
  clearShoppingCart() {
    this.shoppingCart = null;
    localStorage.removeItem(STORAGE_CART_DATA);
    localStorage.removeItem(STORAGE_CART_ID);
  }

  discardShoppingCart(): Observable<AppResponse> {
    return this.http.post<AppResponse>(`${this.envService.apiGatewayFront}/${removeShoppingCart}`, {
      cartId: this.getCartId()
    }).pipe(
      tap(() => this.updateShoppingCart())
    );
  }

  setNewQuantityForItem(productId: number | string, productQuantity: number): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.envService.apiGatewayFront}/${setNewQuantityForItem}`, {
      productId,
      productQuantity,
      cartId: this.getCartId()
    }).pipe(
      tap((response: any) => {
        if (response.error) {
          this.registrarBasketLoss(+productId, { quantity: productQuantity, available: response.itemStock });
        }
        this.updateShoppingCart();
      })
    );
  }

  /**
   * Retorna los métodos de pago
   */
  getPaymentMethods(): Observable<IShoppingCartPaymentMethod[]> {
    return this.http.get<IShoppingCartPaymentMethod[]>(`${this.envService.apiGatewayFront}/${getPaymentMethods}`);
  }

  /**
   * Actualiza el método de pago
   */
  setPaymentMethod(payMethodId: number): Observable<AppResponse> {
    return this.http.post<AppResponse>(`${this.envService.apiGatewayFront}/${setPaymentMethod}`, {
      payMethodId,
      cartId: this.getCartId()
    }).pipe(
      tap(() => this.updateShoppingCart())
    );
  }

  /**
   * Actualiza la ubicación de entrega
   */
  setLocation(cityLocationId: number): Observable<any> {
    return this.http.post(`${this.envService.apiGatewayFront}/${setLocation}`, {
      cityLocationId,
      cartId: this.getCartId()
    }).pipe(
      tap(() => this.updateShoppingCart())
    );
  }

  setOrderComment(comment: string): Observable<AppResponse> {
    return this.http.post<AppResponse>(`${this.envService.apiGatewayFront}/${setOrderComment}`, {
      comment,
      cartId: this.getCartId()
    }).pipe(
      tap(() => this.updateShoppingCart())
    );
  }

  saveOrder() {

    return this.http.post(`${this.envService.apiGatewayFront}/${saveCart}`, {
      cartId: this.shoppingCart.cartId,
      userId: this.authService.getUserId(),
      sellerId: this.authService.currentUserValue?.sellerId || '',
      clientPriceList: '',
      comment: this.shoppingCart.cartOrderData.comment,
      country: this.shoppingCart.cartOrderData.location.country.id,
      state: this.shoppingCart.cartOrderData.location.state.id,
      city: this.shoppingCart.cartOrderData.location.city.id,
      deliveryDay: this.shoppingCart.cartOrderData.deliveryDay,
      errorLoadingLocationsByFastSearch: false,
      loadedCartIfno: false,
      loadedCartInfo: true,
      loadedLocationsByFastSearch: false,
      loadingCartInfo: false,
      loadingLocationsByFastSearh: false,
      locationSelected: false,
      payment: this.shoppingCart.cartOrderData.payment.id,
      pointOfSaleId: this.shoppingCart.cartOrderData.pointOfSale.id, // TODO: Verificar esto bien.
      searchLocationtext: this.shoppingCart.cartOrderData.location.fullname,
      shipping: this.shoppingCart.cartOrderData.shippingId,
      workingHours: this.shoppingCart.cartOrderData.workingHours
    });
  }

  searchLocationByText(body: any) {
    return this.http.post<any>(`${this.envService.apiGatewayFront}/${getLocationByText}`, body);
  }

  // Valida si un item con id = itemId ya esta asignado a la canasta
  validateItemAlreadyInShoppingCart(itemId: string): boolean {
    const items = this.shoppingCart?.itemsCanastaUsuario || [];

    if (!items) {
      return false;
    }

    return !!(items.find(({ id }) => +id === +itemId));
  }

  //actualiza cantidad de item sin recargar la canasta
  setNewQuantityForItem2(productId: number | string, productQuantity: number): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.envService.apiGatewayFront}/${setNewQuantityForItem}`, {
      productId,
      productQuantity,
      app: "ssr",
      cartId: this.getCartId()
    });
  }

  saveDiscountCoupon(couponCode: string) {
    return this.http.post<ShoppingCart>(`${this.envService.apiGatewayFront}/${validateCuponCode}`, {
      couponCode,
      app: "ssr",
      cartId: this.getCartId(),
      userId: this.authService.getUserId(),
    }).pipe(
      tap(() => this.updateShoppingCart())
    );
  }
  deleteCoupon(couponCode) {
    return this.http.post<ShoppingCart>(`${this.envService.apiGatewayFront}/${deleteCartCupon}`, {
      couponCode,
      app: "ssr",
      cartId: this.getCartId()
    }).pipe(
      tap(() => this.updateShoppingCart())
    );
  }
}
