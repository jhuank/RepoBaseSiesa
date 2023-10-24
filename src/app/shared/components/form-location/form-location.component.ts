import {Component, OnInit, Input, ViewChild, TemplateRef, OnChanges, SimpleChanges, AfterViewInit} from '@angular/core';
import {LocationService, CoverageMode} from '@core/services/location/location.service';
import {CartService} from '@core/services/cart/cart.service';
import {filter, debounceTime, distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
import {Observable, BehaviorSubject} from 'rxjs';
import {ParametersService} from '@core/services/parameters/parameters.service';
import {AuthService} from '@core/services/auth/auth.service';
import {MainService} from '@shared/services/main.service';
import {Router} from '@angular/router';

import { ShoppingCart, filterPickUp } from '@core/models/cart.model';
import {ToastService} from '@core/services/toast/toast.service';
import {response} from "express";



@Component({
  selector: 'app-form-location',
  templateUrl: '../../../../templates/shared/components/form-location/form-location.component.html',
  styleUrls: ['../../../../templates/shared/components/form-location/form-location.component.scss'],
})
export class FormLocationComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('deliveryFormTemplate') deliveryFormTemplate: TemplateRef<any> = null;
  @ViewChild('addressCollectionTemplate') addressCollectionTemplate: TemplateRef<any> = null;
  @ViewChild('storePickupFormTemplate') storePickupFormTemplate: TemplateRef<any> = null;
  @ViewChild('deliveryOrPickupTemplate') deliveryOrPickupTemplate: TemplateRef<any> = null;
  @Input() public position: 'vertical' | 'horizontal' = 'vertical';
  @Input() public inModalContent = false;
  @Input() private option?: number;

  public previousTemplate: TemplateRef<any> = null;
  public principalTemplate: TemplateRef<any>;
  public city: any = null;
  public neighborhood: any = null;
  public coDefault: any;
  public location = {
    id: null,
    name: '',
    address: ''
  };
  public address = {
    streetname: 'Calle',
    street: '',
    corner: '',
    number: '',
    address: null,
    description: ''
  }


  public dates = [];
  public hours = [];
  public cargandoCiudades: boolean;
  public cargandoBarrios: boolean;
  public listCitys: Array<any>;
  public listNeighborhood: Array<any>;


  constructor(
    public locationService: LocationService,
    public cartService: CartService,
    public authService: AuthService,
    public toastService: ToastService,
    private router: Router,
    private mainService: MainService,
    public parametersService: ParametersService
  ) {
    this.cargandoCiudades = false;
    this.cargandoBarrios = false;
    this.listCitys = [];
  }

  ngOnInit() {


    this.cartService.locationPickUpSubject.next({
      coverage: +this.cartService?.shoppingCart?.cartLocation?.storeId || null,
      hours: null,
      dates: null
    });

    this.dates = this.generateDatesToPickUp();
    this.hours = this.generateHoursToPickUp();

    this.cartService.locationPickUpSubject
      .pipe(
        distinctUntilChanged((prev: filterPickUp, curr: filterPickUp) => prev.dates === curr.dates)
      )
      .subscribe((value: filterPickUp) => {

        let filt = Object.assign({}, this.currentFilterPickUp);

        let pickUpFinalDate = new Date();
        let mydate = new Date(pickUpFinalDate.getFullYear(), pickUpFinalDate.getMonth(), pickUpFinalDate.getDate());

        let currentDay = (value?.dates === mydate.toDateString());
        this.hours = this.generateHoursToPickUp(currentDay);
        let currentHourInArray = this.hours.indexOf(this.currentFilterPickUp.hours);

        //rest hours
        if(currentHourInArray < 0 && currentDay) {
          filt.hours = null;
        }


        this.cartService.locationPickUpSubject?.next(filt);
      });

    this.cartService.shoppingCart$
      .pipe(
        distinctUntilChanged((prev: ShoppingCart, curr: ShoppingCart) => prev?.cartLocation?.storeId === curr?.cartLocation?.storeId)
      )
      .subscribe((response: ShoppingCart) => {
        let filt = Object.assign({}, this.currentFilterPickUp);
        filt.coverage = +this.cartService?.shoppingCart?.cartLocation?.storeId || null;
        this.cartService.locationPickUpSubject?.next(filt);
      });

    this.getCityAll();
  }

  // dias de recogida
  generateDatesToPickUp(): string[] {

    let quantityDays = 30;

    if(this.parametersService?.page?.deliveryAmountDays) {
      quantityDays = +this.parametersService?.page?.deliveryAmountDays;
    }

    const daysAmout = quantityDays;
    let initDate = new Date();
    var listDates = [
      initDate.toDateString()
    ];

    for(let i = 0; i < daysAmout; i++ ){
      var newDate = initDate.setDate(initDate.getDate() + 1);
      listDates = [...listDates, new Date(newDate).toDateString()]
    }

    return listDates;
  }

  //Horas de recogida
  generateHoursToPickUp(hoursToPrepareOrder: boolean = false): string[] {

    let hourBegin = 0;
    let hourRange = 0;
    let realRange = 0;

    if(this.parametersService?.page?.deliveryStartTime) {
      hourBegin = +this.parametersService?.page?.deliveryStartTime;
    }

    if(this.parametersService?.page?.deliveryHourRanges) {
      hourRange = +this.parametersService?.page?.deliveryHourRanges;
      //si el rango esta dentro de las horas disponibles (24 - hourBegin) entonces pinto las horas del rango
      // si el rango esta mas alla de las horas disponibles (24 - hourBegin) entonces pinto las todas las horas desde hora de inicio (hourBegin)
      realRange = ((24 - hourBegin) > hourRange) ? hourRange : ((24 - hourBegin) >= 24 ? (23 - hourBegin) : (24 - hourBegin));
    }

    var date, array = [];
    date = new Date();
    date.setHours(hourBegin,0,0,0);

    for (var i = 0; i <= realRange; i++) {
      array.push(((date.getHours() < 10) ? `0${date.getHours()}` : date.getHours()) + ':' + ((date.getMinutes() == '0') ? '00' : date.getMinutes()));
      date.setMinutes ( date.getMinutes() + 60);
    }

    // si la fecha de recogida es hoy, filtro las horas para que me muestre solo las que estan por delante de la hora actual
    // quito las horas tambien de preparacion de pedido (this.parametersService?.page?.deliveryOrderPreparationTime)
    if(hoursToPrepareOrder) {

      let date = new Date();
      let finalHour = ( (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours()) + ':' + '00';
      let prepareOrderHour = +this.parametersService?.page?.deliveryOrderPreparationTime || 1;

      if(array.length > 0) {

        let finalHourIndex = array.indexOf(finalHour);
        let arrayCopy = [];
        if(finalHourIndex > -1) {
          arrayCopy = array.slice(finalHourIndex + prepareOrderHour, array.length);
        }
        //Si la hora actual no esta dentro de las horas disponibles, entonces no se puede recoger el pedido hoy
        else {
          arrayCopy = [];
        }
        array = Object.assign([], arrayCopy);
      }

    }

    return array;

  }

  ngAfterViewInit(): void {
    this.fetchStorePickUp();

    // Logica recoger en tienda con fecha y hora programada
    this.cartService.shoppingCart$
      .pipe(
        filter((cart: ShoppingCart) => cart?.isCollectedInStore)
      )
      .subscribe((cart: ShoppingCart) => {

        var filterPickUpInStorage = null;

        if(!cart?.cartOrderData?.deliveryDay) {
          this.parametersService.getSingleParamInStorage('filterPickUp', '')
            .subscribe((response : any) => {
              filterPickUpInStorage = response;
            });

          if(filterPickUpInStorage) {
            this.cartService.locationPickUpSubject.next(filterPickUpInStorage);
          }
        }

        if(cart?.cartOrderData?.deliveryDay) {

          var defaultPickUpHour = new Date(cart?.cartOrderData?.deliveryDay);

          this.cartService.locationPickUpSubject.next({
            coverage: +cart?.cartLocation?.storeId || null,
            hours: defaultPickUpHour ? ((defaultPickUpHour?.getHours() < 10) ? `0${defaultPickUpHour?.getHours()}:00` : `${defaultPickUpHour?.getHours()}:00`) : null,
            dates: defaultPickUpHour?.toDateString() || null
          });

        }

      });

    if (this.parametersService.page?.deliveryParams?.delivery_mode && this.parametersService.company?.config?.crearDireccionModalCobertura) {
      if (!this.authService.isAuthenticated) {
        // Establecer la ubicación
        this.cartService.shoppingCart$
          .pipe(
            // Logica entrega a domicilio
            filter((cart) => !cart?.isCollectedInStore))
          .subscribe((cart) => {
            if (cart && cart.cartLocation && cart.cartLocation.cityId) {
              const {neighborhoodId, neighborhoodName, address} = cart.cartLocation;

              this.city = cart.cartLocation;
              this.neighborhood = {id: neighborhoodId, nombre: neighborhoodName};
              this.location.address = address;
              try {
                const indice = address.indexOf(' ');
                this.address.streetname = address.substring(0, indice);
                const indice2 = address.indexOf('#');
                this.address.street = address.substring(indice + 1, indice2);
                const indice3 = address.indexOf('-');
                this.address.corner = address.substring(indice2 + 1, indice3);
                this.address.number = address.substring(indice3 + 1, address.length);
              } catch (e) {
                console.log('error en la direccion');
              }
            } else {
              this.city = null;
              this.neighborhood = null;
              this.location.address = '';
            }
          });
      } else {
        this.fetchAllDirections();
      }
    }
    setTimeout(() => {
      this.principalTemplate = this.fetchTemplate();
    }, 10);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.option) {
      this.principalTemplate = this.fetchTemplate();
    }
  }

  nextTemplate(template: TemplateRef<any>) {
    this.previousTemplate = this.principalTemplate;
    this.principalTemplate = template;
  }

  backTemplate() {
    if (this.previousTemplate == null) {
      this.previousTemplate = this.fetchTemplate();
    }
    this.principalTemplate = this.previousTemplate;
    this.previousTemplate = null;
  }

  setFormAddress() {
    // const { neighborhoodId, neighborhoodName, address } = cartLocation;
    // this.city = cartLocation;
    // this.neighborhood = { id: neighborhoodId, nombre: neighborhoodName };
    // this.address = address;
  }

  fetchAllDirections() {
    this.locationService.getAllDirections().subscribe((directions) => {
      const locations = directions.data;
      this.locationService.locations = locations;
    });
  }

  fetchStorePickUp() {
    this.locationService.fetchPointsEnabledToPickUpInStore().subscribe((shops: any[]) => {
      this.locationService.collectionCoverage = shops;
      this.coDefault = this.validateOperatingCEnterDefault(shops);
      if (this.cartService.getCartId() === 'undefined') {
        this.mainService.setDeliveryLocation(this.coDefault.id).subscribe((response: any) => {
          this.cartService.updateShoppingCart(response.data.cardId || null);
        });
      }
    });
  }

  validateOperatingCEnterDefault(data) {

    let seleted = {};

    data.forEach(value => {
      if (value.pdv_por_defecto === '1') {
        seleted = value;
      }
    });

    return seleted;
  }

  clearlocation() {
    this.neighborhood = null;
    this.location.address = '';
  }

  // fetchCoverage() {
  //     this.locationService.getLocationCoverage().subscribe();
  // }

  fetchTemplate(): TemplateRef<any> {
    if (this.option) {
      switch (this.option) {
        case CoverageMode.pickup:
          return this.storePickupFormTemplate;
        case CoverageMode.deliveryList:
          return this.addressCollectionTemplate;
        case CoverageMode.deliveryOrPickup:
          return this.deliveryOrPickupTemplate;

        default:
          return this.deliveryFormTemplate;
      }
    }

    if (this.parametersService.page?.deliveryParams?.delivery_mode && this.parametersService.page?.deliveryParams?.store_pickup_mode) {
      return this.deliveryOrPickupTemplate;
    }

    if (this.authService.isAuthenticated && this.parametersService.page?.deliveryParams?.delivery_mode && this.parametersService.company?.config?.crearDireccionModalCobertura) {
      return this.addressCollectionTemplate;
    }

    if (this.parametersService.page?.deliveryParams?.store_pickup_mode) {
      return this.storePickupFormTemplate;
    }

    return this.deliveryFormTemplate;
  }

  searchCitiesByQuery = (query$: Observable<string>) =>
    query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.locationService.getCitiesByQuery(term))
    )

  searchNeighborhoodByQuery = (query$: Observable<string>) =>
    query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.locationService.getNeighborhoodByQuery(term, this.city?.cityId))
    )

  formatter = (x: { cityName?: string; nombre?: string; }) => x.cityName || x.nombre;

  isValid(): boolean {
    if (this.parametersService.page?.deliveryParams?.delivery_mode) {
      if (!this.parametersService.company?.config?.crearDireccionModalCobertura) {
        return !(this.city?.cityId);
      }
      return !(
        this.address.address
      );
    }

    return !(this.city?.cityId);
  }

  changeAddress(location: any) {
    // TODO: Cambiar la API de direcciones
    this.locationService.updateCartLocation(location).subscribe((response: any) => {
      if (!response.error) {
        this.cartService.updateShoppingCart(response.data.cardId || null);

        this.redirect();
      } else {
        // TODO: Show feedback
      }
    });
  }

  redirect() {
    if (this.cartService.shoppingCart.cartQuantity > 0) {
      this.router.navigate(['/order']);
    } else if (this.router.url === '/') {
      window.location.reload();
    } else {
      this.router.navigate(['/']);
    }
    this.previousTemplate = null;
    this.principalTemplate = this.fetchTemplate();

    this.locationService.closeLocationModal();
  }

  get currentFilterPickUp(): filterPickUp {
    return this.cartService.locationPickUpSubject?.value;
  }

  // storePickUp modal select handler
  updatePickUpProperty(target : any): void {
    const filters = Object.assign({}, this.currentFilterPickUp);

    if(target?.id == 'coverage') {
      filters.coverage = target?.value
    }
    let dates = null;
    if(target?.id == 'dates') {
      filters.dates = target?.value
    }
    let hours = null;
    if(target?.id == 'hours') {
      filters.hours = target?.value
    }

    this.cartService.locationPickUpSubject?.next(filters);
  }

  updateCartWithStorePickUpCoverage(id: string) {

    if(!this.currentFilterPickUp.coverage) {
      this.toastService.warning('Debe seleccionar una ubicación', {delay: 3000});
      return;
    }

    if(!this.currentFilterPickUp.dates) {
      this.toastService.warning('Debe seleccionar una fecha de recogida', {delay: 3000});
      return;
    }

    if(!this.currentFilterPickUp.hours) {
      let errorThirtMessage = 'Debe seleccionar una hora de recogida';

      if(!this.hours.length) {
        errorThirtMessage = 'No hay disponibilidad para entregar este día';
      }

      this.toastService.warning(errorThirtMessage, {delay: 3000});
      return;
    }

    this.parametersService.setSingleParamInStorage('filterPickUp', this.currentFilterPickUp);

    var pickUpFinalDate = new Date(this.currentFilterPickUp.dates);
    pickUpFinalDate.setHours(+this.currentFilterPickUp.hours.split(':')[0]);

    this.locationService.updateCartLocation({
      coverageLocation: this.currentFilterPickUp.coverage.toString(),
      pickUpDate: `${pickUpFinalDate.getFullYear()}-${pickUpFinalDate.getMonth() + 1}-${pickUpFinalDate.getDate()} ${pickUpFinalDate.getHours()}:00:00`,
    }).subscribe((response) => {
      if (!response.error) {
        this.cartService.updateShoppingCart(response.data.cardId || null);
        this.redirect();
      } else {
        // TODO: Show feedback
      }
    });
  }

  setCartLocation() {
    if (this.authService.isAuthenticated) {
      if (!this.parametersService.company?.config?.crearDireccionModalCobertura) {
        this.locationService.updateCartLocation({
          ...this.city,
          neighborhoodId: this.neighborhood?.id,
          neighborhoodName: this.neighborhood?.nombre,
          address: this.location.address
        }).subscribe((response: any) => {
          if (!response.error) {
            this.cartService.updateShoppingCart(response.data.cardId || null);
            this.fetchAllDirections();
            this.redirect();
          } else {
            // TODO: Show feedback
          }
        });
      } else {
        this.locationService.createAddress({
          nombre: this.location.name || this.location.address,
          ciudadId: this.city?.cityId,
          barrioId: this.neighborhood?.id,
          direccion: this.location.address + (this.address?.description != '' ? ' - ' + this.address?.description : ''),
          usuarioId: this.authService.getUserId(),
          principal: 0
        }).subscribe((response: any) => {
          if (response.error) {
            this.toastService.error(response.message);
          } else {
            this.locationService.updateCartLocation({
              ...this.city,
              neighborhoodId: this.neighborhood?.id,
              neighborhoodName: this.neighborhood?.nombre,
              address: this.location.address + (this.address?.description != '' ? ' - ' + this.address?.description : ''),
            }).subscribe((response: any) => {
              if (!response.error) {
                this.cartService.updateShoppingCart(response.data.cardId || null);
                this.fetchAllDirections();
                this.redirect();
              } else {
                // TODO: Show feedback
              }
            });
          }
        });
      }
    } else {
      if (this.parametersService.company?.config?.crearDireccionModalCobertura) {
        if (!this.location.address) {
          return;
        }
        if (this.location.address === this.cartService.shoppingCart?.cartLocation?.address) {
          this.redirect();
        }
      }

      this.locationService.updateCartLocation({
        ...this.city,
        neighborhoodId: this.neighborhood?.id,
        neighborhoodName: this.neighborhood?.nombre,
        address: this.location.address + (this.address?.description != '' ? ' - ' + this.address?.description : ''),
      }).subscribe((response: any) => {

        if (!response.error) {
          localStorage.setItem('cartId', response.data.cardId);
          this.cartService.updateShoppingCart(response.data.cardId || null);

          this.redirect();
        } else {
          // TODO: Show feedback

        }
      });
    }
  }

  setAddres() {
    if (this.address.corner && this.address.streetname && this.address.street && this.address.number) {
      this.address.address = this.address.streetname + ' ' + this.address.street + ' # ' + this.address.corner + ' - ' + this.address.number;
      this.location.address = this.address.address;
    }
  }

  getCityAll() {
    this.cargandoCiudades = true;
    this.locationService.getCities().subscribe(
      response => {
        this.listCitys = response;
        this.cargandoCiudades = false;
      }
    )
  }

  getNeighborhoodByCity() {
    this.cargandoBarrios = true;
    if (this.city?.cityId != '') {
      this.listNeighborhood = [];
      this.locationService.getNeighborhoodByQuery('', this.city?.cityId).subscribe(
        response => {
          this.listNeighborhood = response;
          this.cargandoBarrios = false;
        }
      )
    }
  }

  resetAddres() {
    if (this.authService.getUserId() != '' && this.authService.getUserId() != null){
      this.location.address = '';
      this.location.id = '';
      this.location.name = '';
      this.neighborhood = null;
      this.city = null;
      this.address.description = '';
      this.address.address = null;
      this.address.corner = '';
      this.address.number = '';
      this.address.street = '';
      this.address.streetname = 'Calle';
    }
  }
}
