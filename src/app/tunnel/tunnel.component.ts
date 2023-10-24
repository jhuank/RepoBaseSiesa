import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { CartService } from '@core/services/cart/cart.service';
import { Router } from '@angular/router';
import { AddressService as ads } from '../services/address.service';
import { AddressService } from '@core/services/address/address.service';
import { FormGroup, NgForm,Validators,FormControl, AbstractControl,ValidationErrors} from '@angular/forms';
import { CheckoutService } from '../services/checkout.service';
import { ToastService } from '@core/services/toast/toast.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { ModalService } from '@core/services/modal/modal.service';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import { titles } from '@config/titles.constants';

import { Observable, of, Subject } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RegisterService } from '../services/register.service';
import { LocationService } from '@core/services/location/location.service';
import { CustomParam } from '@core/models/cart.model';
import {NgxSmartModalService} from 'ngx-smart-modal';

@Component({
  selector: 'app-tunnel',
  templateUrl: '../../templates/tunnel/tunnel.component.html',
  styleUrls: ['../../templates/tunnel/tunnel.component.scss']
})
export class TunnelComponent implements OnInit {
  public tunnelFormData: FormGroup;
  public orderSaved: any;
  public page = 'PAG-32';
  public registerInfo = true;
  public cmsData: any;
  public userData: any;
  public params: any;
  public company: any;
  public clientPriceListName: any;
  public cart: any;
  public tunnelStep2FormData : any = {
    contactAddressDelivery: '',
    contactAddressDeliveryId: '',
    contactNeighborhoodDelivery: '',
    contactBuildingDelivery: '',
    contactAparmentDelivery: '',
    contactName: '',
    contactMail: '',
    contactIdentityCard: '',
    contactPhoneIndicativeCountry: '',
    contactPhoneIndicativeCity: '',
    contactPhone: '',
    contactMovilIndicative: '57',
    contactMovil: '',
    contactProgrammedDelivery: '',
    policies: '', contactNeighborhoodBilling: undefined,
    contactBuildingBilling: undefined,
    contactAparmentBilling: undefined,
    contactAddressBilling: undefined,
    branchOffice: undefined,
    cartId: undefined,
    userId: undefined,
    contactTypeId: '',
    contactNumberId: '',
    contactCountryBilling: undefined,
    contactStateBilling: undefined,
    contactCityBilling: undefined

  };

  selectLocation : any;

  public newDirection = {
    nombre: '',
    direccion: '',
  };
  public createAddres = false;
  public loadingCartInfo = true;
  public loadedCartInfo = false;
  public loadingTunel: boolean;
  public Products: any[];
  private userDirections: any[];
  private initLocationInfoLoaded: boolean;
  private quoteCartSeller: any;
  private orderIdInsideTunnel: any;
  private contactCountryDelivery: string;
  private contactStateDelivery: any;
  private contactCityDelivery: any;
  private payMethod: any;
  private savingTunnelData: boolean;
  private savedTunnelData: boolean;
  private tunnelStep: number;
  private errorSavingTunnelData: string;
  public loadingSavingOrder: boolean;
  private messageSavingTheOrder: string;
  private errorsDataSavingOrder: any[];
  private errorSavingOrder: boolean;
  private orderIdSaved: any;
  private cartOrderCreated: boolean;
  private countriesBilling: any;
  private statesBilling: any;
  private citiesBilling: any;
  private locationDestinationSelected = false ;
  private cityId: any;
  public registerForm = new FormGroup({
    type: new FormControl('personas'),

    // Persona
    firstName: new FormControl('',[
      Validators.required
    ]),
    lastName: new FormControl('',[
      Validators.required
    ]),

    numberId: new FormControl('',{
      updateOn: 'blur',
      validators: [
          Validators.required
      ]
    }),

    // Datos
    personIndicative: new FormControl('', [
      Validators.required,
      Validators.maxLength(4)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(50)
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    country: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl('', [

    ]),
    cityName: new FormControl('', [
    ]),

    // Cuenta
    email: new FormControl('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_.+-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$'),
        Validators.maxLength(50)
      ],
      asyncValidators: [
        this.emailAsyncValidator.bind(this)
      ]
    }),

    //Telefono alterno dos
    personIndicativeTwo: new FormControl('', [
      Validators.maxLength(4)
    ]),
    phoneTwo: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(50)
    ]),
  });
  public registerFormFeedback = {

    // Persona
    firstName: {
      required: 'Ingrese su(s) nombre(s)',
      minlength: 'Ingrese al menos 3 caracteres',
      maxlength: 'Ha superado el máximo de caracteres permitido'
    },
    lastName: {
      required: 'Ingrese su(s) apellido(s)',
      minlength: 'Ingrese al menos 3 caracteres',
      maxlength: 'Ha superado el máximo de caracteres permitido'
    },
    numberId: {
      required: 'Ingrese su número de identificación',
      document: 'Este número de identificación, ya se encuentra asociado a una cuenta, por favor inicie sesion',
      minlength: 'Ingrese al menos 7 digitos',
      maxlength: 'Ha superado el máximo de caracteres permitido'
    },
    // Datos
    indicative: {
      required: 'Ingrese el indicativo del país',
      maxlength: 'El numero de indicativo debe contener máximo 4 dígitos'
    },
    phone: {
      required: 'Ingrese su numero de celular',
      minlength: 'El numero de celular debe contener mínimo 10 dígitos',
      maxlength: 'El numero de celular debe contener máximo 10 dígitos'
    },
    address: {
      required: 'Ingrese su dirección',
      maxlength: 'La dirección de residencia debe contener máximo 50 caracteres',
      minlength: 'La dirección de residencia debe contener mínimo 6 caracteres',
    },
    city: {
      required: 'Selecciona la ciudad de residencia'
    },

    // Cuenta
    email: {
      required: 'El correo electrónico es requerido',
      pattern: 'Ingrese un correo electrónico válido',
      used: 'El correo electrónico ya se encuentra registrado'
    },
    phoneTwo: {
      required: 'Ingrese su numero de celular',
      minlength: 'El numero de celular debe contener mínimo 10 dígitos',
      maxlength: 'El numero de celular debe contener máximo 50 dígitos'
    },
  };
  public dataForm = {
    locationSelected: false,
    locationsByFastSearch: [],
    loadingLocationsByFastSearch: false,
    loadedLocationsByFastSearch: false,
    errorLoadingLocationsByFastSearch: false,
    searchLocationText: ''
  };
  public searchLocationSubject = new Subject<string>();


  constructor(
    public auth: AuthService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private addressService: ads,
    private toastService: ToastService,
    private addresService: AddressService,
    private adService: AdvertisementsService,
    private gtmService: GoogleTagManagerService,
    public parametersService: ParametersService,
    public locationService: LocationService,
    private router: Router,
    private modalService: ModalService,
    private registerService: RegisterService,
    private ngxSmartModalService: NgxSmartModalService,
  ) { }

  ngOnInit(): void {
    this.adService.setTitle(titles.checkout);

    if ((this.parametersService.page?.permitirCompraRapidaB2c && this.parametersService.page?.deliveryParams?.delivery_mode && this.parametersService.company?.config?.crearDireccionModalCobertura) || this.cartService.shoppingCart?.isCollectedInStore) {
     this.registerForm.get('address').setValue(this.cartService.shoppingCart?.cartLocation?.address);
    }

    if (this.parametersService.page  && (this.auth.isAuthenticated || this.parametersService.page?.permitirCompraRapidaB2c)) {
      this.getCart();
      this.getAllCartOrderInfo();

      this.searchLocationSubject.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe((text) => {
        this.resetSearch();
        if (text.length < 3) {
          return;
        }
        this.cartService.searchLocationByText({
          searchText: text,
          citiesERP: true
        }).subscribe((response: any) => {
          this.dataForm.loadingLocationsByFastSearch = false;
          this.dataForm.loadedLocationsByFastSearch = true;
          this.dataForm.locationsByFastSearch = response;
        });
      });
      this.setPeopleValidators();
    } else {
      this.router.navigate(['/login']);
    }
  }

  getCart() {
    this.userData = JSON.parse(localStorage.getItem('currentUser'));
    try {
      this.clientPriceListName = JSON.parse(localStorage.getItem('quoteCartSeller')).clientPriceList;
    } catch (e) {
    }
    this.cartService.getShoppingCartDetails().subscribe((response: any) => {
      if (!response.error) {

        localStorage.setItem('cartId', response.cartId.toString());
        response.items = [];
        response.order = {};
        // Se actualiza la información del item almacenado
        if (!response.itemsCanastaUsuario) { response.itemsCanastaUsuario = []; }
        response.itemsCanastaUsuario.forEach(dato => {
          response.items.push(dato);
        });
        response.cartQuantity = response.cartQuantity || 0;
        response.cartTaxes = response.cartTaxes || 0;
        response.cartSubtotal = response.cartSubtotal || 0;
        response.cartSavingDayIva = response.cartSavingDayIva || 0;
        response.cartTotal = response.cartTotal || 0;
        response.cartDiscounts = response.cartDiscounts || 0;
        response.cartTransports = response.cartTransports || 0;

        response.order = response.cartOrderData || {};
        response.order.cantidadTotalCanasta = 0;
        response.order.vehiculo_transporte = {};
        response.items.forEach(item => {
          response.order.cantidadTotalCanasta += item.quantity;
        });
        response.tunnel = response.cartTunnelData || {};
        // ===================================================================================================
        // Load the values for the seller quoting
        // ===================================================================================================
        const quoteCartSeller = localStorage.getItem('quoteCartSeller') || null;

        if (quoteCartSeller) {
          // @ts-ignore
          const itemsQuoteCartSeller = quoteCartSeller?.itemsQuoteCartSeller;
          itemsQuoteCartSeller.forEach(itemSeller => {
            response.items.forEach((item, key) => {
              if (item.id === itemSeller.id) {
                response.items[key].priceItemQuoteSeller = response.items[key].priceItemQuoteSeller || 0;
                response.items[key].ivaPercentageQuoteSeller = item.ivaPercentageQuoteSeller || 0;
                response.items[key].discountPercentageItemQuoteSeller = itemSeller.discountPercentageItemQuoteSeller || 0;
              }
            });

          });
        }
      } else {
        response.items = [];
        response.order = {};
        response.cartQuantity = response.cartQuantity || 0;
        response.cartTaxes = response.cartTaxes || 0;
        response.cartSubtotal = response.cartSubtotal || 0;
        response.savingDayIva = response.savingDayIva || 0;
        response.cartTotal = response.cartTotal || 0;
        response.cartDiscounts = response.cartDiscounts || 0;
        response.cartTransports = response.cartTransports || 0;
      }


      this.cart = response;
      this.cart.recoger_en_tienda = this.cart.isCollectedInStore;
      this.Products = [];
      if (response.itemsCanastaUsuario?.length) {
        response.itemsCanastaUsuario.forEach((valFor) => {
          this.Products.push(
            {
              id: valFor.id,
              name: valFor.name,
              price: valFor.price,
              category: valFor.category.slug,
              quantity: valFor.quantity,
            }
          );
        });
        const gtmTag = {
          event: 'checkout',
          ecommerce: {
            checkout: {
              actionField: { step: 2 },
              products: this.Products
            }
          },
        };
        this.gtmService.pushTag(gtmTag);
        this.loadingCartInfo = true;
        this.loadedCartInfo = false;
        this.loadingTunel = false;
        this.cityId = response.cartOrderData.location.city.id;
        if (this.auth.isAuthenticated){
          this.getAddress(this.cityId);
        }
      } else {
        this.router.navigate(['/']);
      }
      this.loadingCartInfo = false;
      this.loadedCartInfo = true;
    });
  }
  setDestinationLocation(location: string) {
    this.locationDestinationSelected = false;

    const destination = JSON.parse(location);
    // this.locationService.updateCartLocation(destination).subscribe((response) => {
      // if (!response.error) {
        this.cartService.updateShoppingCart();
        this.tunnelStep2FormData.contactAddressBilling = destination.address;
        this.tunnelStep2FormData.contactAddressDelivery = destination.address;
        this.tunnelStep2FormData.contactAddressDeliveryId = destination.id;
        this.locationDestinationSelected = true;
      // }
    // });
    // if (fieldName === 'neighborhood') {
    //   this.tunnelStep2FormData.contactNeighborhoodBilling = delivery;
    // } else if (fieldName === 'building') {
    //   this.tunnelStep2FormData.contactBuildingBilling = delivery;
    // } else if (fieldName === 'aparment') {
    //   this.tunnelStep2FormData.contactAparmentBilling = delivery;
    // } else if (fieldName === 'address') {
    //   this.userDirections.forEach((sucursal, key) => {
    //     if (sucursal.id === delivery) {
    //       this.tunnelStep2FormData.contactAddressBilling = sucursal.direccion;
    //       this.tunnelStep2FormData.contactAddressDelivery = sucursal.direccion;
    //       this.tunnelStep2FormData.contactAddressDeliveryId = sucursal.id;
    //     }
    //   });
    // } else if (fieldName === 'branchOffice') {
    //   if (delivery) {
    //     this.tunnelStep2FormData.branchOffice = 0;
    //     this.cart.tunnel.operatingCentersAddresses.forEach((sucursal, key) => {
    //       if (sucursal.address === this.tunnelStep2FormData.contactAddressBilling) {
    //         this.tunnelStep2FormData.branchOffice = sucursal.id;
    //       }
    //     });
    //   }
    // }
  }
  getAddress(idCity = null, idAddress= null ) {
      this.locationService.getAllDirections(idCity).subscribe((directions) => {
        const locations = directions.data;
        this.locationService.locations = locations;
         if(!(this.parametersService.page?.deliveryParams?.delivery_mode && this.parametersService.company?.config?.crearDireccionModalCobertura) && !this.tunnelStep2FormData.contactAddressDeliveryId){
          this.locationService.locations.forEach((valFor) => {
            if(valFor.principal){
              this.selectLocation = valFor;
            }
          });

          if(!this.selectLocation){
            this.selectLocation = this.locationService.locations[0];
          }

          this.setDestinationLocation( JSON.stringify(this.selectLocation.location) );
         }
      });
  }
  copyDataIntoBilling(fieldName, delivery) {

    if (fieldName === 'neighborhood') {
      this.tunnelStep2FormData.contactNeighborhoodBilling = delivery;
    } else if (fieldName === 'building') {
      this.tunnelStep2FormData.contactBuildingBilling = delivery;
    } else if (fieldName === 'aparment') {
      this.tunnelStep2FormData.contactAparmentBilling = delivery;
    } else if (fieldName === 'address') {
      this.userDirections.forEach((sucursal, key) => {
        if (sucursal.id === delivery) {
          this.tunnelStep2FormData.contactAddressBilling = sucursal.direccion;
          this.tunnelStep2FormData.contactAddressDelivery = sucursal.direccion;
          this.tunnelStep2FormData.contactAddressDeliveryId = sucursal.id;
          this.locationDestinationSelected = true;
        }
      });
    } else if (fieldName === 'branchOffice') {
      if (delivery) {
        this.tunnelStep2FormData.branchOffice = 0;
        this.cart.tunnel.operatingCentersAddresses.forEach((sucursal, key) => {
          if (sucursal.address === this.tunnelStep2FormData.contactAddressBilling) {
            this.tunnelStep2FormData.branchOffice = sucursal.id;
          }
        });
      }
    }
  }
  getAllCartOrderInfo() {
    const cart = this.cartService.shoppingCart;
    var stateName = '';
    var cityName = '';
    // Set info data based on cart info
    if (cart.isCollectedInStore) {
      this.contactCountryDelivery = cart.cartLocation?.countryName.toString();
      stateName = cart.cartLocation?.stateName.toString();
      cityName = cart.cartLocation?.cityName.toString();
    } else {
      this.contactCountryDelivery = cart.cartOrderData?.location.country.name.toString();
      stateName = cart.cartOrderData?.location.state.name.toString();
      cityName = cart.cartOrderData?.location.city.name.toString();
    }


    this.contactStateDelivery = stateName;
    this.contactCityDelivery = cityName;
    this.payMethod = cart.cartOrderData?.payment.name.toString();
    this.payMethod = cart.cartOrderData.payment.name.toString();
    // tslint:disable-next-line:one-variable-per-declaration
    const gtmTag = {
      event: 'checkoutOption',
      ecommerce: {
        checkout_option: {
          actionField: { step: 2, option: cart.cartOrderData.payment.name.toString() }
        }
      }
    };
    this.gtmService.pushTag(gtmTag);

    this.tunnelStep2FormData.contactBuildingDelivery = cart.cartTunnelData.contactBuildingDelivery;
    this.tunnelStep2FormData.contactBuildingBilling = cart.cartTunnelData.contactBuildingBilling;
    this.tunnelStep2FormData.contactAparmentDelivery = cart.cartTunnelData.contactAparmentDelivery;
    this.tunnelStep2FormData.contactAparmentBilling = cart.cartTunnelData.contactAparmentBilling;
    this.tunnelStep2FormData.contactNeighborhoodDelivery = cart.cartTunnelData.contactNeighborhoodDelivery;
    this.tunnelStep2FormData.contactNeighborhoodBilling = cart.cartTunnelData.contactNeighborhoodBilling;
    this.tunnelStep2FormData.contactAddressBilling = cart.cartTunnelData.contactAddressBilling;
    this.tunnelStep2FormData.contactProgrammedDelivery = cart.cartTunnelData.contactProgrammedDelivery;


    this.tunnelStep2FormData.contactName = cart?.cartTunnelDataInfo.contactName;
    this.tunnelStep2FormData.contactPhone = cart.cartTunnelDataInfo.contactTelefono;
    this.tunnelStep2FormData.contactMovil = cart?.cartTunnelDataInfo.contactTelefonoMovil;
    this.tunnelStep2FormData.contactMail = cart?.cartTunnelDataInfo.contactEmail;
    this.tunnelStep2FormData.contactPhoneIndicativeCity = cart.cartTunnelDataInfo.contactTelefonoIndiCiudad;
    this.tunnelStep2FormData.contactMovilIndicative = cart.cartTunnelDataInfo.contactTelefonoMovilIndi || '57';
    this.tunnelStep2FormData.contactPhoneIndicativeCountry = cart.cartTunnelDataInfo.contactTelefonoIndiPais;

    try {
      this.tunnelStep2FormData.contactMail = this.auth.currentUserValue.contactEmail;
    } catch (e) {
    }
    //
    if (!this.parametersService.page?.deliveryParams?.delivery_mode && this.parametersService.company?.config?.crearDireccionModalCobertura) {
      if (this.locationService.locations.length) {
        const principal = this.locationService.locations.find((address) => address.principal);

        if (principal) {
          this.tunnelStep2FormData.contactAddressDelivery = principal.direccion;
          this.tunnelStep2FormData.contactAddressBilling = principal.direccion;
          this.tunnelStep2FormData.contactAddressDeliveryId = principal.id;
          this.locationDestinationSelected = true;
        } else {
          const [location] = this.locationService.locations;
          const { direccion, id } = location;

          this.tunnelStep2FormData.contactAddressDelivery = direccion;
          this.tunnelStep2FormData.contactAddressBilling = direccion;
          this.tunnelStep2FormData.contactAddressDeliveryId = id;
          this.locationDestinationSelected = true;
        }

      }
    } else {
      const current = this.locationService.locations.find((item) => item.direccion === cart.cartLocation.address);
      if (current) {
        this.tunnelStep2FormData.contactAddressDelivery = current.direccion;
        this.tunnelStep2FormData.contactAddressBilling = current.direccion;
        this.tunnelStep2FormData.contactAddressDeliveryId = current.id;
        this.locationDestinationSelected = true;
      }
    }
    if (cart.isCollectedInStore) {
      this.tunnelStep2FormData.contactAddressDelivery = cart.cartLocation.address;
      this.tunnelStep2FormData.contactAddressBilling = cart.cartLocation.address;
    }
    /*if(!operatingCentersAddresses.length && $rootScope.isClientB2B()) {
        this.tunnelStep2FormData.contactAddressDelivery = '';
    }*/

    // Get the billing location info
    this.checkoutService.getCountriesBilling().subscribe((response: any) => {
      this.countriesBilling = response.data;
      const countryId = cart.cartLocation.countryId.toString();
      this.checkoutService.getStatesBilling(countryId).subscribe((responseState: any) => {
        this.statesBilling = responseState.data;
        const stateId = cart.cartLocation.stateId.toString();
        this.checkoutService.getCitiesBilling(stateId).subscribe((responseCities: any) => {
          this.citiesBilling = responseCities.data;
          this.tunnelStep2FormData.contactCountryBilling = cart.cartLocation.countryId.toString();
          this.tunnelStep2FormData.contactStateBilling = cart.cartLocation.stateId.toString();
          this.tunnelStep2FormData.contactCityBilling = cart.cartLocation.cityId.toString();
          this.initLocationInfoLoaded = true;
        });
      });
    });
  }
  registerData(value) {
    if (value.target.checked) {
      this.tunnelStep2FormData.contactName = this.cart.cartTunnelDataInfo.contactName;
      this.tunnelStep2FormData.contactPhone = this.cart.cartTunnelDataInfo.contactTelefono;
      this.tunnelStep2FormData.contactMovil = this.cart.cartTunnelDataInfo.contactTelefonoMovil;
      this.tunnelStep2FormData.contactMail = this.cart.cartTunnelDataInfo.contactEmail;
      this.tunnelStep2FormData.contactPhoneIndicativeCity = this.cart.cartTunnelDataInfo.contactTelefonoIndiCiudad;
      this.tunnelStep2FormData.contactMovilIndicative = this.cart.cartTunnelDataInfo.contactTelefonoMovilIndi || '57';
      this.tunnelStep2FormData.contactPhoneIndicativeCountry = this.cart.cartTunnelDataInfo.contactTelefonoIndiPais;
    } else {
      this.tunnelStep2FormData.contactName = null;
      this.tunnelStep2FormData.contactPhone = null;
      this.tunnelStep2FormData.contactMovil = null;
      this.tunnelStep2FormData.contactMail = null;
      this.tunnelStep2FormData.contactMovilIndicative = null;
      this.tunnelStep2FormData.contactPhoneIndicativeCity = null;
      this.tunnelStep2FormData.contactPhoneIndicativeCountry = null;
    }
  }
  saveTunnelOkay(tunnelStep2Form, alsoCreateOrder) {
    this.loadingSavingOrder = true;
    this.savingTunnelData = true;
    this.savedTunnelData = false;
    this.errorSavingTunnelData = '';

    this.tunnelStep2FormData.cartId = this.cart.cartId;
    try {
      if (!this.parametersService.page?.permitirCompraRapidaB2c || this.auth.isAuthenticated) {
        this.tunnelStep2FormData.userId = this.auth.currentUserValue.userId;
      }
    } catch (e) {
    }
    this.checkoutService.saveCartTunnelData(this.tunnelStep2FormData).subscribe((response: any) => {
      this.savingTunnelData = false;
      if (!response.error) {
        this.savedTunnelData = true;
        this.tunnelStep = 3;
        if (alsoCreateOrder) {
          this.saveOrder();
        }
      } else {
        this.savedTunnelData = false;
        this.errorSavingTunnelData = response.message;
      }
    }, () => {
      this.loadingSavingOrder = false;
    });


  }
  saveOrder() {

    this.loadingSavingOrder = true;
    this.orderSaved = false;
    this.errorSavingOrder = false;
    this.messageSavingTheOrder = '';
    this.errorsDataSavingOrder = [];

    const cartId = localStorage.getItem('cartId') || '';

    if (cartId) {
      let userId = '';
      let sellerId = '';
      if (!this.parametersService.page?.permitirCompraRapidaB2c || this.auth.isAuthenticated) {
        userId = this.auth.currentUserValue.userId;
        sellerId = this.auth.currentUserValue.sellerId;
      } else {
        userId = this.tunnelStep2FormData.userId;
        sellerId = '';
      }

      let orderOnlyToQuote: number;
      if (this.cart.order.totalItemsToQuote === this.cart.items.length) {
        orderOnlyToQuote = 1;
      }
      // Get the contact mail
      let contactMail = '';
      try {
        contactMail = this.tunnelStep2FormData.contactMail;
      } catch (e) {
      }

      // Get the type and number id
      let contactTypeId = '';
      let contactNumberId = '';
      try {
        contactTypeId = this.tunnelStep2FormData.contactTypeId;
        contactNumberId = this.tunnelStep2FormData.contactNumberId;
      } catch (e) {
      }
      // Client price list
      let quoteCartSellerPriceListName = '';
      try {
        quoteCartSellerPriceListName = this.quoteCartSeller.clientPriceList;
      } catch (e) {
      }
      const quoteCartSeller = this.quoteCartSeller;
      // Send the request

      //gift info
      let customParam = new CustomParam();
      this.parametersService.getSingleParamInStorage('giftForm', 'de').subscribe((response : CustomParam) => {
        customParam = response;
      });

      this.checkoutService.saveOrder({
        cartId,
        userId,
        sellerId,
        orderOnlyToQuote,
        contactMail,
        contactTypeId,
        contactNumberId,
        quoteCartSeller,
        quoteCartSellerPriceListName,
        giftValueFrom: customParam?.de || '',
        giftValueTo: customParam?.para || '',
        giftValueMessage: customParam?.mensaje || '',
      }).subscribe((response: any) => {
        this.loadingSavingOrder = false;
        if (!response.error) {
          this.orderSaved = true;
          this.orderIdSaved = response.data.orderId;
          // this.SessionService.remove('quoteCartSeller');
          // this.SessionService.remove('tunnelPayMethod');
          // this.SessionService.remove('tunnelCity');
          this.messageSavingTheOrder = 'El pedido ha sido realizado exitosamente.';
          if (this.cart.order.totalItemsToQuote !== this.cart.items.length) {
            // Se limpia el carrito
            localStorage.removeItem('cartId');
            localStorage.removeItem('cartData');
            this.cartService.clearShoppingCart();
            // ToDo limpiar carro
            this.cart = {};
            this.cartOrderCreated = true;
            const orderId = response.data.orderId;
            // toDo Response;

            this.parametersService.setSingleParamInStorage('giftForm', {de: '', para: '', mensaje: ''});

            this.router.navigate(['/confirmation/' + orderId + '/false']);
          }
        } else {
          if (response.errorCode === 'CANASTA-NO-EXISTE') {
            response.message = 'Se ha presentado un problema interno en la aplicación. ' +
              'La canasta ha sido eliminada. En un momento será redirigido ' +
              'la página de inicio.';
            // Se limpia el carrito
            localStorage.removeItem('cartId');
            localStorage.removeItem('cartData');
            this.router.navigate(['/']);
          }

          this.errorSavingOrder = true;
          this.messageSavingTheOrder = response.message;
          this.errorsDataSavingOrder = response.errorsMessages;
          this.toastService.error(response.message);
        }
      }, () => {
        this.loadingSavingOrder = false;
        this.toastService.error('Ocurrió un error al intentar finalizar la compra. Espere unos minutos y vuelva a intentarlo.');
      });
    } else {
      this.toastService.warning('No existe una canasta');
    }
  }

  saveTunnel(tunnelStep2Form: NgForm, alsoCreateOrder2) {
    const alsoCreateOrder = alsoCreateOrder2 || false;
    const context = {
      title: 'Faltan algunos datos por diligenciar...'
    };
    let message = '';

    if(!this.locationDestinationSelected && !this.cartService.shoppingCart?.isCollectedInStore){
      this.toastService.error("Se requiere seleccionar la ubicacion para la entrega del pedido");
      return;
    }

    if (this.orderIdInsideTunnel) {
      this.savingTunnelData = false;
      this.savedTunnelData = true;
      this.tunnelStep = 3;
    } else if (tunnelStep2Form.valid) {
      this.loadingSavingOrder = true;
      if (this.cart.isCollectedInStore) {
        this.tunnelStep2FormData.contactStateBilling = this.cart.cartLocation?.stateName.toString();
        this.tunnelStep2FormData.contactCityBilling = this.cart.cartLocation?.cityId.toString();
        this.tunnelStep2FormData.contactCountryBilling = this.cart.cartLocation?.countryId.toString();
      } else {
        this.tunnelStep2FormData.contactStateBilling = this.cart.order?.location.state.name.toString();
        this.tunnelStep2FormData.contactCityBilling = this.cart.order.billing.city.id.toString();
        this.tunnelStep2FormData.contactCountryBilling = this.cart.order.billing.country.id.toString();
      }
      this.saveTunnelOkay(tunnelStep2Form, alsoCreateOrder);
    } else {

      message = message + 'Para continuar con este proceso debes diligenciar los siguientes datos:<br>';

      if(!this.tunnelStep2FormData.contactAddressDelivery){
        message = message + '<br>Ubicación destino: Ingrese una ubicación de destino.';
      }


      if (tunnelStep2Form.controls.contactName.errors) {
        if (tunnelStep2Form.controls.contactName.errors.required) {
          message = message + '<br>Nombre de persona de contacto: Ingrese el nombre de la persona de contacto.';
        }
      }
      if (tunnelStep2Form.controls.contactMail.errors) {
        if (tunnelStep2Form.controls.contactMail.errors.required) {
          message = message + '<br>Correo electrónico: Ingrese un email.';
        }
        if (tunnelStep2Form.controls.contactMail.errors.valid) {
          message = message + '<br>Correo electrónico: Ingrese un email de contacto válido.';
        }
      }
      if (tunnelStep2Form.controls.contactPhone.errors) {
        if (tunnelStep2Form.controls.contactPhone.errors.minlength || tunnelStep2Form.controls.contactPhone.errors.maxlength) {
          message = message + '<br>Teléfono fijo: Debe ingresar 7 dígitos.';
        }
      }
      if (tunnelStep2Form.controls.contactMovil.errors) {
        if (tunnelStep2Form.controls.contactMovil.errors.required) {
          message = message + '<br>Teléfono móvil: Ingresa el número móvil.';
        }
        if (tunnelStep2Form.controls.contactMovil.errors.minlength) {
          message = message + '<br>Teléfono móvil: debes ingresar 10 dígitos.';
        }
      }
      if (tunnelStep2Form.controls.contactMovilIndicative.errors) {
        if (tunnelStep2Form.controls.contactMovilIndicative.errors.required) {
          message = message + '<br>Indicativo movil: Ingrese el Indicativo.';
        }
      }

      this.modalService.open(message, context);
    }
  }


  saveDirection(newDirection) {
    if (this.newDirection.nombre === '' || this.newDirection.direccion === '') {
      this.toastService.error('Faltan Campos por diligenciar');
    } else {
      const data = {
        usuarioId: this.userData.userId,
        principal: 0,
        ciudadId: this.cart.order?.location.city.id.toString(),
        nombre: this.newDirection.nombre,
        direccion: this.newDirection.direccion,
      };
      this.addresService.saveDirection(data).subscribe((response: any) => {
        if (response.error) {
          this.toastService.error(response.message);
        } else {

          this.newDirection.nombre    = '';
          this.newDirection.direccion = '';

          this.toastService.success(response.message);
          this.getAddress(this.cityId, response.id);
        }
      });
    }
  }

  openModal(template: TemplateRef<any>, context?: any) {
    this.modalService.open(template, context);
  }


  /**
   * Métodos de la compra rápida
   */
  saveTunnelQuickPurchase(tunnelStep2Form: NgForm, alsoCreateOrder) {
    this.registerForm.get('city').setValue(this.cart.order?.location.city.id);
    if (this.registerForm.invalid) {
      this.checkFieldsRegisterForm();
      return this.toastService.warning('Aun hacen falta campos por diligenciar');
    }


    this.loadingSavingOrder = true;
    this.registerService.registerQuickUser(this.registerForm.value, this.parametersService.page?.permitirCompraRapidaB2c).subscribe((data: any) => {
      if (!data.error) {
        this.tunnelStep2FormData.contactAddressBilling = 'direccion';
        this.tunnelStep2FormData.contactAddressDelivery = this.registerForm.get('address').value;
        this.tunnelStep2FormData.contactAddressDeliveryId = data.dataLogin.sucursalID;
        this.tunnelStep2FormData.contactCityBilling = this.cart.order.billing.city.id.toString();
        this.tunnelStep2FormData.contactCountryBilling = this.cart.order.billing.country.id.toString();
        this.tunnelStep2FormData.contactMail = this.registerForm.get('email').value;
        this.tunnelStep2FormData.contactMovil = this.registerForm.get('phone').value;
        this.tunnelStep2FormData.contactMovilIndicative = this.registerForm.get('personIndicative').value;
        this.tunnelStep2FormData.contactName = this.registerForm.get('firstName').value + ' ' + this.registerForm.get('lastName').value;
        this.tunnelStep2FormData.contactProgrammedDelivery = this.cart?.tunnel?.contactProgrammedDelivery;
        this.tunnelStep2FormData.contactStateBilling = this.cart.order?.location.state.name.toString();
        this.tunnelStep2FormData.userId = data.dataLogin.userId;
        localStorage.setItem('userTemporal', data.dataLogin.userId);
        this.saveTunnelOkay(this.tunnelStep2FormData, alsoCreateOrder);
      }else{
        this.loadingSavingOrder = false;
        let mensaje:any;
          mensaje = data.message;
          if(data.errors != '' && data.errors != null){
            mensaje=data.errors[0];
          }
        return this.toastService.warning(mensaje);
      }
    }, (error: any) => {
      if (error.status === 500 || error.status === 0) {
        this.loadingSavingOrder = false;
        this.router.navigate(['/500']);
      }
    });
  }

  /**
   * Valida que el email ingresado no este siendo usado
   */
  emailAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.registerService.validateEmail(control.value, this.parametersService.page?.permitirCompraRapidaB2c).pipe(
      map((response: any) => (response.error) ? { used: true } : null),
      catchError(() => of(null))
    );
  }
  /**
   * Valida que el documento ingresado no este siendo usado
   */
  documentAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.registerService.validateUserId(control.value, this.parametersService.page?.permitirCompraRapidaB2c).pipe(
      map((response: any) => (response.error) ? { document: true } : null),
      catchError(() => of(null))
    );
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);

    return (control.invalid && (control.dirty || control.touched));
  }

  getFeedback(field: string): string {
    const control = this.registerForm.get(field);

    if (control.errors) {
      const errors = Object.keys(control.errors);

      if (errors && this.registerFormFeedback[field]) {
        return this.registerFormFeedback[field][errors[0]];
      }
    }

    return '';
  }

  setSearchTerm(term: string) {
    this.searchLocationSubject.next(term);
  }

  setLocationCity(location: any) {
    this.registerForm.get('country').setValue(location.countryId);
    this.registerForm.get('state').setValue(location.stateId);
    this.registerForm.get('city').setValue(location.cityId);

    this.dataForm.locationSelected = true;
    this.dataForm.searchLocationText = location.cityName + ', ' + location.stateName + ' - ' + location.countryName;
  }

  resetSearch() {
    this.dataForm.locationSelected = false;
    this.dataForm.locationsByFastSearch = [];
    this.dataForm.locationSelected = false;

    this.registerForm.get('country').setValue('');
    this.registerForm.get('state').setValue('');
    this.registerForm.get('city').setValue('');

    this.dataForm.loadingLocationsByFastSearch = false;
    this.dataForm.loadedLocationsByFastSearch = false;
    this.dataForm.errorLoadingLocationsByFastSearch = false;

    this.dataForm.loadingLocationsByFastSearch = true;
  }

  setPeopleValidators()  {
    this.registerForm.controls.firstName.setValidators(Validators.required);
    this.registerForm.controls.firstName.setValidators(Validators.minLength(3));
    this.registerForm.controls.lastName.setValidators(Validators.required);
    this.registerForm.controls.lastName.setValidators(Validators.minLength(3));
    this.registerForm.controls.numberId.setValidators(Validators.required);
    this.registerForm.controls.numberId.setValidators(Validators.minLength(7));
    this.registerForm.controls.numberId.setAsyncValidators(this.documentAsyncValidator.bind(this));
  }

  checkFieldsRegisterForm(){
    const controls = this.registerForm.controls;

    for (const field in controls) {
      if (controls.hasOwnProperty(field)) {
        const control = controls[field];

        if (control.invalid && !control.dirty) {
          control.markAsDirty();
        }
      }
    }
  }

  fieldChange(): void {

    let optionalIndicative = this.registerForm.get('personIndicativeTwo').value;
    let optionalPhone = this.registerForm.get('phoneTwo').value;

    if(optionalIndicative.length === 0 && optionalPhone.length === 0) {

      this.registerForm.get('personIndicativeTwo').clearValidators();
      this.registerForm.get('phoneTwo').clearValidators();
    }
    else {
      this.registerForm.get('personIndicativeTwo').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(4)]);
      this.registerForm.get('phoneTwo').setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(50)]);
    }

    this.registerForm.get('personIndicativeTwo').updateValueAndValidity();
    this.registerForm.get('phoneTwo').updateValueAndValidity();

  }

  loadAddres(){
    this.addresService.getAllDirections(this.auth.getUserId(),'').subscribe(
      (returned:any)=>{
        this.locationService.locations = returned?.data;
      }
    )
  }
}
