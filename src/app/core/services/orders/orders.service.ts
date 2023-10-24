import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { constants } from '@config/app.constants';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvService } from '@core/services/env/env.service';

const { recalculateOrder } = constants.config;

@Injectable({providedIn: 'root'})
export class OrdersService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getUserOrders(data) {
    const url = this.env.apiGatewayFront + constants.config.getUserOrders;
    const headers = new HttpHeaders();
    //TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(data), {headers});
  }

  getUserOrdersStatistics(data) {
    const url = this.env.apiGatewayFront + constants.config.getUserOrdersStatistics;
    const headers = new HttpHeaders();
    //TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(data), {headers});
  }

  getSummaryQuotes(data) {
    const url = this.env.apiGatewayFront + constants.config.getSummaryQuotes;
    const headers = new HttpHeaders();
    //TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(data), {headers});
  }

  duplicateOrderById(userId, sellerId, orderId) {

    const data = {'userId': userId, 'sellerId': sellerId, 'orderId': orderId};
    const url = this.env.apiGatewayFront + constants.config.duplicateOrder;
    const headers = new HttpHeaders();
    //TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(data), {headers});
  }

  syncOrder(data) {
    
    const url = this.env.apiGatewayFront + constants.config.sincronizarPedido;
    const headers = new HttpHeaders();
    //TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(data), {headers});
  }

  recalculateOrder(orderId, userId) {
    return this.http.get(`${this.env.apiGatewayFront}/${recalculateOrder}`, {
        params: {
          orderId,
          userId
        }
      });
  }

}