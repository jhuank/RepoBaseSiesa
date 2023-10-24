import {Injectable} from '@angular/core';
import {constants} from '@config/app.constants';
import {EnvService} from '../env/env.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CartService} from '../cart/cart.service';
import {NgxSmartModalService, NgxSmartModalComponent} from 'ngx-smart-modal';
import {AuthService} from '../auth/auth.service';

export enum CoverageMode {
  deliveryOrPickup = 0,
  deliveryList = 1,
  delivery = 2,
  pickup = 3
}

// interface AppLocation {
//     id?: string | null;
//     name?: string;
//     address?: string;
// }

const {
  getCityByText,
  getCityAll,
  getNeighborhoodLocations,
  setCoverageDelivery,
  getLocation,
  getAllDirections,
  saveDirection,
  fetchStorePickup
} = constants.config;

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public readonly modalReference = 'modalLocation';
  public readonly customModalReference = 'customModal';
  public modal: NgxSmartModalComponent;
  public modal2: NgxSmartModalComponent;
  public coverageOption: number = CoverageMode.delivery;
  public collectionCoverage: any[] = [];
  public locations: any[] = [];

  constructor(
    private envService: EnvService,
    private cartService: CartService,
    private authService: AuthService,
    private ngxSmartModalService: NgxSmartModalService,
    private http: HttpClient
  ) {
  }

  /**
   * ============================================================
   *  Modal
   * ============================================================
   */
  showLocationModal(option?: number) {

    if (option) {
      this.modal.setData({option}, true);
      this.coverageOption = option;
    } else {
      this.modal.removeData();
    }

    this.modal.open();
  }

  closeLocationModal() {
    this.modal.close();
  }

  /**
   * ============================================================
   *  Cobertura
   * ============================================================
   */
  fetchPointsEnabledToPickUpInStore() {
    return this.http.get(`${this.envService.apiGatewayFront}/${fetchStorePickup}`);
  }

  getLocationCoverage() {
    return this.http.get(`${this.envService.apiGatewayFront}/${getLocation}`);
  }

  /**
   * ============================================================
   *  Buscadores
   * ============================================================
   */
  getCitiesByQuery(searchText: string): Observable<any> {
    return this.http.post<any[]>(`${this.envService.apiGatewayFront}/${getCityByText}`, {searchText})
      .pipe(map(locations => locations.slice(0, 10)));
  }

  getCities(): Observable<any> {
    return this.http.post<any[]>(`${this.envService.apiGatewayFront}/${getCityAll}`, null);
  }

  getNeighborhoodByQuery(searchText: string, cityId: string = '', cob: string = 'con cobertura'): Observable<any> {
    return this.http.get<any[]>(`${this.envService.apiGatewayFront}/${getNeighborhoodLocations}`, {
      params: {
        city: cityId,
        searchword: searchText,
        cobertura: cob,
      }
    });
  }

  /**
   * ============================================================
   *  Direcciones
   * ============================================================
   */
  getAllDirections(city: string = '') {
    return this.http.get<{ error: boolean; message: string; data?: any[]; }>(
      `${this.envService.apiGatewayFront}${getAllDirections}`, {
        params: {
          city,
          usuarioId: this.authService.getUserId()
        }
      });
  }

  createAddress(body: any) {
    return this.http.post(`${this.envService.apiGatewayFront}${saveDirection}`, body);
  }

  /**
   * ============================================================
   *  Actualizar canasta
   * ============================================================
   */
  updateCartLocation(body: any) {
    return this.http.post<any>(`${this.envService.apiGatewayFront}/${setCoverageDelivery}`, body, {
      params: {
        cartId: this.cartService.getCartId()
      }
    });
  }

  openCustomModal() {
    this.modal2.open();
  }

  closeCustomModal() {
    this.modal2.close();
  }
}
