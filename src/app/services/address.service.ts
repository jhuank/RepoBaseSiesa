import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '@core/services/env/env.service';
import {Observable} from 'rxjs';
import {constants} from '@config/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient,
              private env: EnvService) { }

  getAllDirections(userId = '', city = ''): Observable<any> {
    const urllocations = `${this.env.apiGatewayFront}${constants.config.getAllDirections}?usuarioId=${userId}&city=${city}`;
    return this.http.get(urllocations);
  }
}
