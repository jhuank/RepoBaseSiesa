import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Filter } from '@core/models/filter.model';

import { constants } from '@config/app.constants';
import { EnvService } from '../env/env.service';
const {
  getItemsByText,
  getProducts,
  getCategory,
  getTreeCategory,
  getCategoryAttributes
} = constants.config;

@Injectable({
  providedIn: 'root',
})
export class CatalogueService {
  constructor(
    private envService: EnvService,
    private http: HttpClient
  ) { }

  getItemsByCategory(request: Filter): Observable<any> {
    return this.http.post(`${this.envService.apiGatewayFront}/${getItemsByText}`, request);
  }

  getProducts(userId: string, limit: string, type: string, categoryId = '', itemId = '', categoryIdFilter = '', origin = '') {
    return this.http.get(`${this.envService.apiGatewayFront}/${getProducts}`, {
      params: {
        userId,
        limit,
        type,
        itemId,
        categoryId,
        categoryIdFilter,
        origin
      }
    });
  }

  /**
   * Obtiene la categoría por slug o id
   *
   * @params slug
   * @params id
   */
  getCategory(reference: { slug?: string, id?: string; }): Observable<any> {
    return this.http.get(`${this.envService.apiGatewayFront}/${getCategory}`, {
      params: { slug: '', id: '', ...reference }
    });
  }

  getCategoryAttributes(reference: { slug?: string, id?: string; }): Observable<any> {
    return this.http.get(`${this.envService.apiGatewayFront}/${getCategoryAttributes}`, {
      params: { slug: '', id: '', ...reference }
    });
  }

  getTreeCategory(reference: { id?: string, userId?: string; }): Observable<any> {
    return this.http.get(`${this.envService.apiGatewayFront}/${getTreeCategory}`, {
      params: { id: '', userId: '', ...reference }
    });
  }

}
