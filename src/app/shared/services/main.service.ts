import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {constants} from '../../../config/app.constants';
import { EnvService } from '@core/services/env/env.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  public search: boolean;
  public typeaheadIsOpen: boolean;
  public globalSearchTextHome: string;
  public chatScript: any;
  constructor(private env: EnvService,
              private http: HttpClient) { }
  goToSearchProduct(item) {
    this.search = false;
    this.typeaheadIsOpen = false;
    item = item || this.globalSearchTextHome;
    // if($scope.globalSearchTextHome) {
    // ToDo ajustar funcionalidad
    /*if (item) {
      let searchText = encodeURIComponent(item);
      this.$state.go('home.productSearch', {searchText: searchText});
    }*/
  }

  getCategoriesMenu(): Observable<any> {
    const url = this.env.apiGatewayFront + constants.config.categoriesMenu;
    return this.http.get<any>(url)
      .pipe(
        retry(1)
      );
  }
  getLocations(): Observable<any> {
    const url = this.env.apiGatewayFront + constants.config.getLocation;
    return this.http.get<any>(url)
      .pipe(
        retry(1)
      );
  }

  neighborhoodBySearchText(data): Observable<any> {
    const url = `${this.env.apiGatewayFront}${constants.config.neighborhoodBySearchText}?city=${data.city}&searchword=${data.searchText}`;
    return this.http.get<any>(url)
      .pipe(
        retry(1)
      );
  }
  setDeliveryLocation(data): Observable<any> {
    const cartId =  '';
    const url = `${this.env.apiGatewayFront}${constants.config.setCoverageDelivery}?cartId=${cartId}`;

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();
    body.append('coverageLocation', data);

    return this.http.post(url, body, {headers});
  }
}
