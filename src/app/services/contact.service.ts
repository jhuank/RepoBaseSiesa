import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {constants} from '@config/app.constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnvService} from '@core/services/env/env.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient,
              private env: EnvService) { }
  getContactLocations(id = ''): Observable<any> {
    const urllocations = `${this.env.apiGatewayFront}${constants.config.getContactLocations}?operatingCenterId=${id}`;
    return this.http.get(urllocations);
  }
  sendMailContact(form): Observable<any> {
    const url = this.env.apiGatewayFront + constants.config.mailContact;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();
    body.append('city', form.value.city);
    body.append('company', form.value.company);
    body.append('email', form.value.email);
    body.append('gender', form.value.gender);
    body.append('indicative', form.value.indicative);
    body.append('message', form.value.message);
    body.append('email', form.value.email);
    body.append('name', form.value.name);
    body.append('phone', form.value.phone);
    body.append('subject', form.value.subject);

    return this.http.post(url, body, {headers});

  }

  getContactMatters(id = ''): Observable<any> {
    const url = `${this.env.apiGatewayFront}${constants.config.getContactMatters}`;
    return this.http.get(url);
  }

}
