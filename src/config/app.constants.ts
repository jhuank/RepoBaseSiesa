export const constants = {
  APP_RUNTIME_CONFIG: '/assets/runtime.config.json',
  storage: {
    STORAGE_CLIENT_NAME: 'client',
    PAGE_PARAMS: 'params',
    COMPANY_PARAMS: 'companyInfo',
    STORAGE_USER: 'currentUser',
    STORAGE_COOKIES_ACCEPTED: 'cookiesAccepted',
    STORAGE_CART_ID: 'cartId',
    STORAGE_CART_DATA: 'cartData',
    STORAGE_MENU: 'CategoriesMenu'
  },
  config: {
    getPageParameters: 'param/get-app-params',
    getPageParametersRegister: 'param/get-params-register',
    getCompanyParameters: 'adminComponentes/companies',
    getCmsRestablecerContrasena: 'template/cms-restablecer-contrasena',

    mailNewsletter: 'item-info/send-newsletter-register',
    getRegisterMessage: '/login/get-messages-of-register',
    locationBySearchText: '/location/get-location-by-search-text',
    userRegister: '/login/user-register',
    userQuickRegister: '/login/user-register-quick-purchase',
    getActividadEconomica: '/login/get-actividad-economica',
    getContactLocations: '/location/get-contact-locations',
    getContactMatters: '/location/get-contact-matters',
    mailContact: '/item-info/enviar-correo-contactenos',
    getUserInfo: '/user/user-info',
    userUpdate: '/user/update-user',
    passwordUpdate: 'user/update-password',
    getLocation: '/location/get-operating-centers-coverage-by-owner',
    neighborhoodBySearchText: '/location/get-neighborhoods-by-city',
    // Anuncios
    advertisementsApi: '/template/cms-spaces?&ad=0',
    advertisementsCmsSpaces: 'template/cms-spaces',
    // Favoritos
    getVerProductos: '/item-info/ver-productos',
    setFavoriteProduct: 'item-info/set-favorite-product',
    ResumeFavoriteItems: '/item-info/get-resume-favorites?',
    // search
    getItemsByText: 'categoria-info/show-items-by-cattegory',
    sendEmailProductNotFound: 'item-info/enviar-correo-producto-no-encontrado',

    // Catalolgue
    categoriesMenu: '/param/get-category-menu',
    getProduct: 'item-info/ver-producto',
    getProducts: 'item-info/ver-productos',
    saveHistoryProducts: 'item-info/save-history-products',
    getRatings: 'items/items/get-calificaciones',
    getRatingsFiltros: 'items/items/get-calificaciones-filter',
    setRating: 'items/items/set-calificacion',
    getClonePrice: 'item-info/obtener-precio-item-clonado',
    getAutocomplete: 'item-info/autocompletado-producto',

    // Categories
    getCategory: 'categoria-info/ver-categoria',
    getTreeCategory: 'categoria-info/arbol-categoria',
    getCategoryAttributes: 'categoria-info/ver-atributos-categoria-dos',

    // Cart
    getShoppingCartSummary: 'cart/get-cart-resume-data',
    getShoppingCartDetails: 'cart/obtener-canasta',
    removeShoppingCart: 'cart/delete-cart',
    addItemToShoppingCart: 'cart/agregar-item-canasta',
    removeItemToShoppingCart: 'cart/eliminar-item-canasta',
    setLocation: 'cart/update-city-location',
    getPaymentMethods: 'order/pay-methods',
    setPaymentMethod: 'cart/update-pay-method',
    setOrderComment: 'cart/update-comment-cart',
    saveCart: 'cart/save-cart-order-data',
    setNewQuantityForItem: 'cart/update-quantity-item-cart',
    registrarBasketLoss: 'item-info/registrar-venta-perdida',
    validateCuponCode: '/discount/validar-cupon',
    deleteCartCupon: '/discount/eliminar-cupon',
    checkItemsPriceByCart: 'cart/check-items-price-by-cart',

    // Order
    getPaymentInformation: 'order/get-pay-info',
    getOrder: 'order/order',
    recalculateOrder: 'order/recalcular-valor-orden',
    experienceComment: 'order/qualify-shopping-experience',

    getResumeCart: 'cart/get-cart-resume-data',
    saveCartTunnelData: '/cart/save-cart-tunnel-data',
    saveOrder: '/order/save-order',
    getOrderDetail: '/order/order',
    changeStatus: '/order/change-status',
    duplicateOrder: '/cart/duplicate-order',
    saveComment: '/order/save-comment',
    countries: '/location/get-countries',
    states: '/location/get-states',
    cities: '/location/get-cities',

    // Locations
    getNeighborhoodLocations: 'location/get-neighborhoods-by-city',
    fetchStorePickup: 'location/store-pickup',
    setCoverageDelivery: '/location/set-coverage-delivery',

    // directions
    getAllDirections: '/centroOperaciones/centro-operaciones/get-direcciones',
    getDirection: '/centroOperaciones/centro-operaciones/get-direccion',
    saveDirection: '/centroOperaciones/centro-operaciones/create',
    editDirection: '/centroOperaciones/centro-operaciones/update',
    deleteDirection: '/centroOperaciones/centro-operaciones/delete',
    apdateUser: '/user/update-user',
    getTypeDocumentsUser: '/user/get-tipo-documentos-persona-natural',
    validateUserId: '/login/validate-number-id',
    getLocationByText: 'location/get-location-by-search-text',
    getCityByText: 'location/get-city-by-search-text',
    getCityAll: 'location/get-city-all',
    getBlogList: '/blog/blog-list',
    getPostBlog: '/blog/get-post?slug',
    getBlogPanel: '/blog/blog-list-panel',
    getContentCms: '/template/cms-info?ubicacion',
    getContentCmsInfo: '/template/cms-info',
    updatePassword: '/user/update-password',
    userLogin: '/login/user-login',
    recoverPassword: 'login/recover-password',
    emailValidator: '/login/validate-email',

    compareProducts: '/item-info/comparar-productos',

    // events
    getEvent: '/evento/get-eventos',
    getEvents: '/evento/event-list',

    getUserOrders: '/order/user-orders',
    getUserOrdersStatistics: '/order/user-orders-statistics',
    getSummaryQuotes: '/quotes/summary-quotes',
    sincronizarPedido: '/order/sincronizar-erp',
    recalcularPedido: '/order/recalcular-valor-orden',
    customTracking: '/transport/custom-tracking',
  }
};
