import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '@core/services/env/env.service';
import {constants} from '@config/app.constants';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient,
              private env: EnvService) { }
  saveCartTunnelData(body: any) {
    // const headers = new HttpHeaders();
    // headers.append("Content-Type", "application/form-data");
    // const body: FormData = new FormData();
    // body.append("citiesERP", data.citiesERP);
    // body.append("searchText", data.searchText);
    return this.http.post<any>(`${this.env.apiGatewayFront}${constants.config.saveCartTunnelData}`, body);
  }
  saveOrder(body: any) {
    return this.http.post<any>(`${this.env.apiGatewayFront}${constants.config.saveOrder}`, body);
  }
  getCountriesBilling(): Observable<any> {
    const url = `${this.env.apiGatewayFront}${constants.config.countries}`;
    return this.http.get(url);
  }
  getStatesBilling(countryId: string): Observable<any> {
    const url = `${this.env.apiGatewayFront}${constants.config.states}?countryId=${countryId}`;
    return this.http.get(url);
  }
  getCitiesBilling(stateId: string): Observable<any> {
    const url = `${this.env.apiGatewayFront}${constants.config.cities}?stateId=${stateId}`;
    return this.http.get(url);
  }
}
