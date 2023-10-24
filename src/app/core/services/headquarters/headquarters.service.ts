import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constants } from '@config/app.constants';
import { EnvService } from '@core/services/env/env.service';

const {  getContactLocations } = constants.config;

@Injectable({providedIn: 'root'})
export class HeadquartersService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }


  getContactLocations(operatingCenterId = '') {
    return this.http.get(`${this.env.apiGatewayFront}${getContactLocations}`, {
      params: {
        operatingCenterId
      }
    });
  }

}