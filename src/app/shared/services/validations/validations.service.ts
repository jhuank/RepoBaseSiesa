import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { EnvService } from '@core/services/env/env.service';
import { constants } from '../../../../config/app.constants';

@Injectable({
  providedIn: 'root'
})

export class ValidationsService {

  private url: string;

  constructor(private http: HttpClient,private env: EnvService) {
    this.url = this.env.apiGatewayFront;
  }

  validateEmail(email: string){

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();

    body.append('email', email);

    return this.http.post<any>(`${this.url}/${constants.config.emailValidator}`, body, {headers});
  }


}
