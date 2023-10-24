import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { constants } from '@config/app.constants';
import { EnvService } from '@core/services/env/env.service';

const { getAllDirections } = constants.config;

@Injectable({ providedIn: 'root' })
export class AddressService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getAllDirections(usuarioId: string, city: string) {
    return this.http.get(`${this.env.apiGatewayFront}${getAllDirections}`, {
      params: {
        usuarioId,
        city
      }
    });
  }

  locationBySearchText(text) {
    const url = this.env.apiGatewayFront + constants.config.locationBySearchText;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();

    body.append('searchText', text);
    body.append('showOnlyValidCountries', '1');
    body.append('showOnlyCitiesInTransportRule', '0');

    return this.http.post(url, body, { headers });
  }

  saveDirection(direction) {
    const url = (direction.id) ? this.env.apiGatewayFront + constants.config.editDirection : this.env.apiGatewayFront + constants.config.saveDirection;
    const headers = new HttpHeaders();
    // TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(direction), { headers });
  }

  deleteDirection(idDirection) {
    const url = this.env.apiGatewayFront + constants.config.deleteDirection;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    body.append('id', idDirection);
    let data = {
      id: idDirection
    };

    return this.http.post(url, JSON.stringify(data), { headers });
  }
}
