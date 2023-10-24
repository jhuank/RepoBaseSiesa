import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnvService} from '@core/services/env/env.service';
import {constants} from '../../config/app.constants';
import { Observable } from 'rxjs';
import {Validators} from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';

const {
  passwordUpdate
} = constants.config;

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private url: string;
  constructor(
    private env: EnvService,
    private authService: AuthService,
    private http: HttpClient,
  ) {
    this.url = this.env.apiGatewayFront;
  }

  getIdentificationsTypes(): Observable<any> {
    return this.http.get(`${this.url}/${constants.config.getTypeDocumentsUser}`);
  }
  getRegisterMessage(): Observable<any> {
    return this.http.get(`${this.url}/${constants.config.getRegisterMessage}`);
  }
  getEconomicActivities(): Observable<any> {
    return this.http.get(`${this.url}/${constants.config.getActividadEconomica}`);
  }
  getUserInfo(userId): Observable<any> {
    const url = `${this.url}${constants.config.getUserInfo}`;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();
    body.append('userId', userId);
    return this.http.post(url, body, {headers});
  }
  registerUser(registerForm: any): Observable<any> {

    const url = this.env.apiGatewayFront + constants.config.userRegister;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();
    body.append('type', registerForm.type);
    body.append('acceptPolicies', registerForm.acceptPolicies);
    body.append('passwordConfirmation', registerForm.passwordConfirmation);
    body.append('email', registerForm.emailConfirmation);
    if(registerForm.receiveInformation) body.append('receiveInformation', registerForm.receiveInformation);
    if (registerForm.type === 'personas') {
      body.append('personIndicative', registerForm.indicative);
      body.append('phone', registerForm.phone);
      body.append('city', registerForm.city);
      body.append('neighborhood', registerForm.neighborhood);
      body.append('address', registerForm.address);
      body.append('birthdate', registerForm.birthdate);
      body.append('firstName', registerForm.firstName);
      body.append('lastName', registerForm.lastName);
      body.append('numberId', registerForm.numberId);
      body.append('typeId', registerForm.typeId);
      body.append('gender[id]', registerForm.gender);
      body.append('gender[nombre]', (registerForm.gender === '1') ? 'Femenino' : 'Masculino');
    } else {
      body.append('company[companyIndicative]', registerForm.indicative);
      body.append('company[companyPhone]', registerForm.companyPhone);
      body.append('company[companyCity]', registerForm.city);
      body.append('company[companyStree]', registerForm.companyStreet);
      body.append('company[businessName]', registerForm.businessName);
      body.append('company[firstNameContactPerson]', registerForm.firstNameContactPerson);
      body.append('activity[id]', registerForm.activity);
      body.append('company[lastNameContactPerson]', registerForm.lastNameContactPerson);
      body.append('company[nit]', registerForm.nit);
      body.append('company[dv]', registerForm.dv);
      body.append('gender[id]', '');
      body.append('gender[nombre]', '');
    }

    return this.http.post(url, body, {headers});

  }
  registerQuickUser(body: any, allowQuickPurchase: any = null): Observable<any> {
    if(allowQuickPurchase == 1){
      body.allowQuickPurchase = allowQuickPurchase;
    }
    return this.http.post<any>(`${this.env.apiGatewayFront}${constants.config.userQuickRegister}`, body);

  }
  validateEmail(email, allowQuickPurchase: any = null): Observable<any> {
    const url = this.env.apiGatewayFront + constants.config.emailValidator;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();
    body.append('email', email);
    body.append('allowQuickPurchase', allowQuickPurchase);

    return this.http.post(url, body, {headers});
  }
  userUpdate(accountForm): Observable<any> {
    const url = this.env.apiGatewayFront + constants.config.userUpdate;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();
    body.append('dataToUpdate[userId]', accountForm.value.userId);
    body.append('dataToUpdate[numberId]', accountForm.value.numberId);
    // @ts-ignore
    body.append('dataToUpdate[numberIdUpdate]', false);
    body.append('dataToUpdate[typeId]', accountForm.value.typeId);
    body.append('dataToUpdate[firstName]', accountForm.value.firstName);
    body.append('dataToUpdate[middleName]', accountForm.value.middleName ? accountForm.value.middleName : '');
    body.append('dataToUpdate[lastName]', accountForm.value.lastName);
    body.append('dataToUpdate[surName]', accountForm.value.surName ? accountForm.value.surName : '');
    body.append('dataToUpdate[email]', accountForm.value.email);
    body.append('dataToUpdate[emailConfirmation]', accountForm.value.email);
    body.append('dataToUpdate[IndicativeCountry]', accountForm.value.IndicativeCountry ? accountForm.value.IndicativeCountry : '');
    body.append('dataToUpdate[IndicativeCity]', accountForm.value.IndicativeCity ? accountForm.value.IndicativeCity : '');
    body.append('dataToUpdate[phone]', accountForm.value.phone ? accountForm.value.phone : '');
    body.append('dataToUpdate[movil]', accountForm.value.movil);
    body.append('dataToUpdate[indicative]', accountForm.value.indicative);
    body.append('dataToUpdate[gender]', accountForm.value.gender);
    body.append('dataToUpdate[city]', accountForm.value.city);
    body.append('dataToUpdate[address]', accountForm.value.address);
    body.append('dataToUpdate[receiveInformation]', accountForm.value.receiveInformation ? accountForm.value.receiveInformation : false);
    body.append('dataToUpdate[indicativeTwo]', accountForm.value.indicativeTwo ? accountForm.value.indicativeTwo : '');
    body.append('dataToUpdate[movilAlterno]', accountForm.value.movilAlterno ? accountForm.value.movilAlterno : '');
    body.append('typeInfo', 'elementary');

    return this.http.post(url, body, {headers});

  }
  passwordUpdate(form: any): Observable<any> {
    return this.http.post(`${this.env.apiGatewayFront}/${passwordUpdate}`, {
      userId: this.authService.getUserId(),
      ...form
    });

  }

  validateUserId(document, allowQuickPurchase: any = null): Observable<any> {
    const url = this.env.apiGatewayFront + constants.config.validateUserId;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');
    const body: FormData = new FormData();
    body.append('numberId', document);
    body.append('allowQuickPurchase',allowQuickPurchase);

    return this.http.post(url, body, {headers});
  }
}

