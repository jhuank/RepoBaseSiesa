import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constants } from '@config/app.constants';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvService } from '../env/env.service';

const { 
  sendEmailProductNotFound,
  getLocationByText,
  mailNewsletter
} = constants.config;

@Injectable()
export class CommonService {
  constructor(
    private envService: EnvService,
    private http: HttpClient
  ) { }

  submitProductFormNotFound(body: any, header?: any) {
    return this.http.post(`${this.envService.apiGatewayFront}/${sendEmailProductNotFound}`, body, header);
  }

  searchLocationByText(searchText: string): Observable<any> {
    return this.http.post(`${this.envService.apiGatewayFront}/${getLocationByText}`, {
      searchText,
      showOnlyCitiesInTransportRule: 1,
      showOnlyValidCountries: 1
    }).pipe(
      map((locations: any[]) => this.locationSearchFormatter(locations)),
      catchError(() => of([]))
    );
  }

  locationSearchFormatter = (locations: any[]) => locations.map((location) => ({
    value: location.cityId,
    text: `${location.cityName}, ${location.stateName}, ${location.countryName}`
  }))

  subscribeToPromotionsAndOffers(body: { name: string; email: string }): Observable<any> {
    return this.http.post<any>(`${this.envService.apiGatewayFront}/${mailNewsletter}`, body);
  }
}
