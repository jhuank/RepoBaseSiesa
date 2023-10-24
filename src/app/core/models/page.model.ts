export interface IPageComponent {
    module_id?: number;
    module_name?: string;
    id?: number;
    name?: string;
    component?: string;
    version?: number;
    url?: string;
    remarks?: string;
    parent_id?: number;
    ancestor_id?: number;
}

export interface IDeliveryParams {
    delivery_mode: boolean;
    store_pickup_mode: boolean;
}

export interface IPage {
    showCart?: boolean;
    showPriceFilter?: boolean;
    showLocationQuestion?: boolean;
    uaCode?: string;
    uaCodeES?: string;
    titleLocationQuestion?: string;
    descripcionLocationQuestion?: string;
    titleLocationQuestionSecond?: string;
    descripcionLocationQuestionSecond?: string;
    chatScript?: string;
    pageOnline?: boolean;
    checkFormPersonaJuridica?: boolean;
    offlineTime?: string;
    showPromotionsItemMenu?: boolean;
    operatingCenterSelected?: any[];
    pqrsDueDate?: number;
    solicitarInfoTransporte?: boolean;
    sincronizacionManualPedidos?: boolean;
    showTotalKilosCanasta?: boolean;
    showKilosItemCanasta?: boolean;
    permitirCompraRapidaB2c?: boolean;
    mostrarUnidadMedidaItemCanasta?: boolean;
    neighborhoodCoverage?: boolean;
    deliveryParams: IDeliveryParams;
    itemsView?: {
        mobile?: number;
        pc?: number;
        tablet?: number;
    };
    'slug-procedimientos'?: string; // TODO?: Reparar desde la API
    usuario?: {
        esSupervisor?: boolean;
    };
    cmsInfo?: {
        RESTABLECER_PASSWORD_INTRO: string;
        RESTABLECER_PASSWORD_TIP: string;
        EMAIL_COTIZACION_CONFIRMACION_HEAD?: string;
        EMAIL_COTIZACION_CONFIRMACION_FOOTER?: string;
        EMAIL_COTIZACION_CONFIRMACION_TERMINOS_CONDIONES?: string;
        EMAIL_USUARIO_MASTER_CREACION_CABECERA?: string;
        EMAIL_USUARIO_MASTER_MODIFICACION_CABECERA?: string;
        CONSIDERACIONES_PEDIDOS?: string;
        BIENVENIDA?: string;
        QUIENES_SOMOS?: string;
        MISION?: string;
        VISION?: string;
        POLITICAS_CALIDAD?: string;
        COMO_COMPRAR?: string;
        MEDIOS_PAGO?: string;
        POLITICAS_PRIVACIDAD?: string;
        CREACION_CUENTA_FRONTEND_INTRO?: string;
        CREACION_CUENTA_FRONTEND_CONFIRMACION?: string;
        EMAIL_CREACION_CUENTA_FRONTEND_TOP?: string;
        EMAIL_CREACION_CUENTA_FRONTEND_FOOTER?: string;
        EMAIL_CREACION_CUENTA_BACKEND_TOP?: string;
        EMAIL_CREACION_CUENTA_BACKEND_FOOTER?: string;
        REGISTRO?: string;
        TUNEL_TERMINOS_CONICIONES?: string;
        PUBLICIDAD_FOOTER?: string;
        CANASTA_INFO_INFERIOR?: string;
        ACERCA_DE_NOSOTROS?: string;
        PREGUNTAS_FRECUENTES?: string;
        CONFIDENCIALIDAD_MAIL?: string;
        HOME?: string;
        LISTADO_DE_PRODUCTOS?: string;
        CANASTA?: string;
        MIS_PLANTILLAS_LISTADO?: string;
        HOJA_DE_PRODUCTO?: string;
        COMPRA_RAPIDA?: string;
        TUNEL?: string;
        CONTACTENOS?: string;
        PREGUNTAS_FRECUENTES_TRASVERSAL?: string;
        POLITICAS_DE_PRIVACIDAD?: string;
        POLITICAS_DE_PROTECCION_DE_DATOS?: string;
        TERMINOS_Y_CONDICIONES?: string;
        QUIENES_SOMOS_TRASVERSAL?: string;
        PROCEDIMIENTOS?: string;
        HEADER_HORARIOS?: string;
        FOOTER_TIEMPO_ENTREGA?: string;
        DIRECCIONES?: string;
        GIFT_MODAL_MESSAGE?: string | null;
    };
    components: {
        BRANDS?: IPageComponent;
        CAROUSEL_CATEGORY?: IPageComponent;
        HOME?: IPageComponent;
        HEADER?: IPageComponent;
        CONTACT?: IPageComponent;
        ACCOUNT?: IPageComponent;
        LOGIN?: IPageComponent;
        BOX_PRODUCTS?: IPageComponent;
        REGISTER?: IPageComponent;
        'DYNAMIC-BANNER'?: IPageComponent;
        TEMPLATE?: IPageComponent;
        'TEMPLATE-DETAIL'?: IPageComponent;
        USERS?: IPageComponent;
        MODAL_CONFIRMATION?: IPageComponent;
        PRODUCT_LIST?: IPageComponent;
        KNOW?: IPageComponent;
        HEADER_MENU?:  IPageComponent;
        FOOTER?: IPageComponent;
        CART?: IPageComponent;
        BY_FAVORITES?: IPageComponent;
        BY_LAST_ITEMS?: IPageComponent;
        BY_SEARCH?: IPageComponent;
        CONFIRMATION_ORDER?: IPageComponent;
        ORDER_DETAIL?: IPageComponent;
        ORDERS?: IPageComponent;
        SALES_HOME?: IPageComponent;
        TUNNEL?: IPageComponent;
        CATEGORIES_FILTER?: IPageComponent;
        CATEGORIES_SLIDER_FILTER?: IPageComponent;
        CATEGORIES_INPUT_FILTER?: IPageComponent;
        CATEGORY?: IPageComponent;
        CATEGORY_PRODUCTS?: IPageComponent;
        COMPARE_PRODUCTS?: IPageComponent;
        FEATURED_PRODUCTS?: IPageComponent;
        MOST_SELLED_PRODUCTS?: IPageComponent;
        NEW_PRODUCTS?: IPageComponent;
        PRODUCT_DETAIL?: IPageComponent;
        PRODUCT_NOT_FOUND?: IPageComponent;
        RELATED_PRODUCTS?: IPageComponent;
        SALES?: IPageComponent;
        AUTOCOMPLETE?: IPageComponent;
        PRODUCT_PAGE_TOOLBOX?: IPageComponent;
        BOX_TEXT?: IPageComponent;
        CATEGORY_PAGER_TOOLBOX?: IPageComponent;
        DYNAMIC_FILTERS?: IPageComponent;
        FEATURED_SLIDER?: IPageComponent;
        PRICE_FILTER?: IPageComponent;
        RESPONSE?: IPageComponent;
        CMS?: IPageComponent;
        'CAROUSEL-BANNER'?: IPageComponent;
        'MENU-DROPDOWN'?: IPageComponent;
        'MODAL-DRIVER'?: IPageComponent;
        'SIDE-BANNERS'?: IPageComponent;
        filter?: IPageComponent;
    },
    validacion_liquidacion_transporte_canasta?: number,
    mensaje_validacion_liquidacion_transporte_cero?: string,
    showProductNotFound?: number | null,
    giftFormLabel?: string | null,
    showGiftForm?: number | null,
    mostrar_indicativo_contacto?: number | null,
    mostrar_empresa_contacto?: number | null,
    tituloProductosBajoCanasta?: string | null,
    ProductosBajoCanasta?: string | null,
    numeroProductosBajoCanasta?: string | null,
    showInstruccionesAdicionales?: boolean | null,
    deliveryAmountDays?: number | null,
    deliveryStartTime?: number | null,
    deliveryHourRanges?: number | null,
    deliveryOrderPreparationTime?: number | null,
}
