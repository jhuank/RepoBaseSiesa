import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '@core/services/auth/auth.service';
import { EnvService } from '@core/services/env/env.service';

import { constants } from '@config/app.constants';
const { getPaymentInformation, getOrder, recalculateOrder, experienceComment, customTracking } = constants.config;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private envService: EnvService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  getPaymentInformation(orderId: string): Observable<any> {
    return this.http.get(`${this.envService.apiGatewayFront}/${getPaymentInformation}`, {
      params: { idPedido: orderId }
    });
  }
  getOrder(orderId: string, userId?: any): Observable<any> {
    if (userId === '') {
      userId = this.authService.getUserId();
    }
    return this.http.post(`${this.envService.apiGatewayFront}/${getOrder}`, {
      orderId,
      typeOrders: '',
      userId,
      sellerId: this.authService.currentUserValue?.sellerId || ''
    });
  }

  recalculateOrder(orderId: string): Observable<any> {
    return this.http.get(`${this.envService.apiGatewayFront}/${recalculateOrder}?orderId=${orderId}&userId=${this.authService.getUserId()}`, );
  }

  sendExperienceComment(data): Observable<any> {
    return this.http.post(`${this.envService.apiGatewayFront}/${experienceComment}`, {
      orderId: data.orderId,
      qualification: data.qualification,
      commentary: data.commentary,
    });
  }

  getTracking(trackingId: string): Observable<any> {

    return this.http.get(`${this.envService.apiGatewayFront}/${customTracking}?numero_guia=${trackingId}`);

  }

}
