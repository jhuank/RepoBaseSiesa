
import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Services
import {AuthService} from '@core/services/auth/auth.service';
import {CartService} from '@core/services/cart/cart.service';

import {NgxSmartModalService} from 'ngx-smart-modal';
import {ParametersService} from '@core/services/parameters/parameters.service';
import {EnvService} from '@core/services/env/env.service';

import {ShareDataService} from '@core/services/share-data/share-data.service';
import { LocationService } from '@core/services/location/location.service';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import { MainService } from '@shared/services/main.service';

import { constants } from '@config/app.constants';
const {STORAGE_MENU} = constants.storage;

@Component({
  selector: 'app-header',
  templateUrl: '../../templates/header/header.component.html',
  styleUrls: ['../../templates/header/header.component.scss']
})
export class HeaderComponent implements OnInit {
  public toggleMenu = false;
  public activateSearch = true;
  public totalItemsInCart$: Observable<number>;
  public totalFavoritesItems: number;
  public blogEvent: any;
  public logo: string;
  public jsonUser: any;
  public nameUser: string;
  public nameSupplier: string;
  public toggleLeft: any;
  public page = 'PAG-2';
  public cmsData: any;
  public categoriesMenu: any;
  public schema: any;

  public activeInfoModalLocation = true;

  // tslint:disable-next-line:variable-name
  constructor(
    private envService: EnvService,
    public parametersService: ParametersService,
    public locationService: LocationService,
    private adService: AdvertisementsService,
    public mainService: MainService,
    public authService: AuthService,
    public cartService: CartService,
    private shareDataService: ShareDataService,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (this.envService.isBrowser) {
      // Total items en canasta
      this.cartService.shoppingCart.isCollectedInStore;
      this.totalItemsInCart$ = this.cartService.shoppingCart$.pipe(
        map((shoppingCart) => {
          if (shoppingCart && shoppingCart.itemsCanastaUsuario) {
            return shoppingCart.itemsCanastaUsuario.length;
          }

          return 0;
        }));

      // Total items favoritos
      this.totalFavoritesItems = this.authService.currentUserValue?.favoriteItems?.length;

      this.adService.getAdvertisements(this.page).subscribe((data: any) => {
        this.cmsData = data;
      });
      this.schema = {
        '@context': 'http://schema.org',
        '@type': 'Organization',
        name: this.parametersService.company?.info?.company?.name,
        url: this.parametersService.company?.info?.company?.webpage,
        sameAs: [
          this.parametersService.company?.info?.social?.facebook?.link,
          this.parametersService.company?.info?.social?.youtube?.link,
          this.parametersService.company?.info?.social?.instagram?.link
        ]
      };

      this.getMenu().subscribe(menu => {
        this.categoriesMenu = menu;
        localStorage.setItem('slugCategoriaPrincipal', menu[0]?.slug);
      });

    }
  }

  getMenu(): Observable<any> {
    if (this.envService.isBrowser) {
      const menuInStorage = localStorage.getItem(STORAGE_MENU);

      if (menuInStorage && this.envService.environment.saveParametersInStorage) {
        return of(JSON.parse(menuInStorage));
      } else if (!this.envService.environment.saveParametersInStorage) {
        localStorage.removeItem(STORAGE_MENU);
      }
    }

    return this.mainService.getCategoriesMenu().pipe(
      tap(menu => menu)
    );

  }

  logout() {
    this.authService.logout();
    this.cartService.clearShoppingCart();
    this.shareDataService.doSignOut();
    this.router.navigate(['']);
    window.location.reload();
  }

  clearSearch() {
    this.globalSearchTextHome = null;
  }

  globalSearchTextHome() {
    const elementInput = document.getElementById('globalSearchTextHome');
    const closedSearch = document.getElementById('closedSearch');

    elementInput.classList.add('expanded');
    elementInput.focus();
    closedSearch.classList.add('visible');
  }

  textLocation(): string {
    const cartLocation = this.cartService.shoppingCart?.cartLocation;
    if (
      this.parametersService.page?.deliveryParams?.delivery_mode ||
      this.parametersService.page?.deliveryParams?.store_pickup_mode
    ) {
      if (cartLocation?.storeId) {
        return cartLocation.storeName;
      }

      if (cartLocation?.address) {
        return cartLocation.cityName;
      }
      if (cartLocation?.cityName) {
        return cartLocation.cityName;
      }

      if (this.parametersService.page?.deliveryParams?.store_pickup_mode) {
        return 'Selecciona el destino';
      }

      return 'Ingresar dirección';
    }

    if (cartLocation?.cityId) {
      if (cartLocation?.neighborhoodId) {
        return `${cartLocation.cityName}, ${cartLocation.neighborhoodName}`;
      }

      return cartLocation.cityName;
    }

    return 'Ubicación';
  }
  locationInformation(): string {
    const location = this.cartService.shoppingCart?.cartLocation;

    if (location && location.cityId) {
      const label = [location.cityName];

      if (location.neighborhoodId) {
        label.push(location.neighborhoodName);
      }

      if (
        this.parametersService.page?.deliveryParams?.delivery_mode ||
        this.parametersService.page?.deliveryParams?.store_pickup_mode
      ) {
        label.push(`<div>${this.cartService.shoppingCart?.cartLocation?.address}</div>`);
      }

      if (this.parametersService.page?.deliveryParams?.store_pickup_mode && location.storeName) {
        return `<div>
          <p class="mb-1"><b>${location?.storeName.toUpperCase()}</b></p>
          <small>${label.join(', ')}</small>
        </div>`;
      } else {
        return label.join(', ');
      }
    }
    return 'Se necesita una ubicación de destino';
  }

  doFocusInSearchInput(): void {
    this.shareDataService.doFocusOnInput();
  }


  changeActiveInfoModalLocation(arg){

    if(this.activeInfoModalLocation == true && arg == 2){
      return;
    }else if(this.activeInfoModalLocation == false && arg == 2){
      this.activeInfoModalLocation = true;
    }else if(this.activeInfoModalLocation == true && arg == 1){
      this.activeInfoModalLocation = false;
    }else if(this.activeInfoModalLocation == false && arg == 1){
      this.activeInfoModalLocation = true;
    }
  }
}
