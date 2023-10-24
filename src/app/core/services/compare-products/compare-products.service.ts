import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constants } from '@config/app.constants';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvService } from '@core/services/env/env.service';

const {  compareProducts } = constants.config;

@Injectable({providedIn: 'root'})
export class CompareProductsService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }


  getCompareProducts(ids: string, userId: string){
    return this.http.get(`${this.env.apiGatewayFront}${compareProducts}`, {
      params: {
        ids,
        userId
      }
    });
  }

}