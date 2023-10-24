import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constants } from '@config/app.constants';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvService } from '@core/services/env/env.service';

const {  getVerProductos } = constants.config;

@Injectable({providedIn: 'root'})
export class FavoritesService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getFavorites( userId: string, filters?: any) : Observable<any>{
    return this.http.get(`${this.env.apiGatewayFront}${getVerProductos}`, {
      params: {
        type:'favoritos',
        userId: userId,
        activePagination: '1',
        pageNumber: filters?.filters.pageNumber,
        pageSize: filters?.pageSize
      }
    });
  }

}