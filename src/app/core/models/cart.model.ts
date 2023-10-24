export interface IShoppingCartPaymentMethod {
  id: number;
  nombre: string;
  name?: string;
  activo?: boolean;
  orden?: number;
  imagen_formato_guia?: string;
  pasarela_pago_id?: number;
  guia_email?: string;
  notifica_pago?: number;
  medio_publico?: number;
  uso_zona_de_pago?: number;
}

export interface IShoppingCartLocation {
  phone: string;
  countryId?: number | string;
  countryName?: string;
  countryIndicative?: number;
  stateId?: number | string;
  stateName?: string;
  cityId?: number | string;
  cityName?: string;
  cityIndicative?: number;
  neighborhoodId?: string;
  neighborhoodName?: string;
  storeId?: string;
  storeName?: string;
  address?: string;
  mainPhoneNumber?: string | null;
}

export interface IShoppingCartItem {
  obsequio: any;
  id: string;
  reference: string;
  slug: string;
  name: string;
  quantity: string;
  image: string;
  attachments?: string;
  measureUnit?: string;
  price?: string;
  cantidad?: number;
  iva?: number | string;
  ivaValue?: number;
  isProcedure?: boolean;
  total?: number;
  comment?: string;
  discount?: number;
  discountWithTaxes?: number;
  peso?: {
    embalaje: any;
    item: any;
  };
  category?: {
    slug: string;
  };
  attributesDetail?: any[];
  discountsRange?: string;
  quote?: number;
  textLabel?: string;
  transportInfo?: string;
  transport?: string;
  priceItemQuoteSeller?: string;
  ivaPercentageQuoteSeller?: string;
  discountPercentage?: number;
  obsequioAxB?: number;
  obsequioMensaje?: string;
  isPromo?: boolean;
  descriptionAxB?: string;
  obsequioValor?: number;
  maxDiscount?: number;
  addingQuantityItemCart?: boolean;
  factorQuantity?: number;
  taxImpConsumoValue?: number;
}

export interface IShoppingCartOrder {
  totalPesoItems: number;
  totalItemsToQuote: number;
  totalItemsToQuoteQuantity: number;
  shippingId: number;
  workingHours: number;
  deliveryDay: string;
  payment: IShoppingCartPaymentMethod;
  location: {
    city: {
      id: number;
      name: string;
      indicative: number;
    },
    state: {
      id: number;
      name: string;
    },
    country: {
      id: number;
      name: string;
      indicative: number;
    },
    fullname: string;
  };
  // billing: any; // FIXME: Nadie usa esto. Contiene exactamente la misma información que se optiene en el campo: "location"
  pointOfSale: {
    id: number;
  }; // FIXME: Nadie usa esto.
  vehiculo_transporte: {
    nombre_conductor: any;
    documento_conductor: any;
    placa_vehiculo: any;
  };
  comment: string;
}

export class ShoppingCart {
  error?: boolean;
  message?: string;
  cartId?: string;
  cartUnified?: boolean;
  cartQuantity?: number;
  itemsCanastaUsuario?: IShoppingCartItem[];
  cartLocation?: IShoppingCartLocation;
  'items_servicio'?: boolean;
  cartSubtotal?: number;
  cartTaxes?: number;
  cartDiscounts?: number;
  cartDiscountsWithTaxes?: number;
  cartTransports?: number;
  cartTotal?: number;
  cartWeight?: number;
  cartOrderData?: IShoppingCartOrder;
  cartTunnelData?: any;
  cartTunnelDataInfo?: any;
  isInternal?: boolean;
  showTransportMessage?: number;
  transportMessage?: string;
  valueTaxBag?: number;
  useBagTax?:any;
  mensaje_impuesto_bolsa?:any;
  ownerUserId?:number;
  isCollectedInStore?: boolean;
  cartCoupons?: any;
  cartWithImpoConsumoTax?: boolean;
  // /**
  //  * Calcula el subtotal
  //  */
  // get subtotal(): number {
  //   return ((this.cartSubtotal - this.cartDiscounts) + this.cartTaxes);
  // }

  // get items(): IShoppingCartItem[] {
  //   return this.itemsCanastaUsuario || [];
  // }
}

export class CustomParam {
  de?: string | null;
  para?: string | null;
  mensaje?: string | null;
}

export class CheckItemsPriceItem {
  cartId?: number | null;
  cartItemId?: string | number | null;
  deleteFromCart?: boolean;
}

export class CheckItemsPriceReponse {
  activeParameter?: boolean;
  finalArray?: CheckItemsPriceItem[];
}

export interface filterPickUp {
  coverage?: number | null;
  dates?: string | null;
  hours?: string | null;
}

