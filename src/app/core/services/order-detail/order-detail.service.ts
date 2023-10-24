import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { constants } from '@config/app.constants';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvService } from '@core/services/env/env.service';
import { CartService } from '../cart/cart.service';

const {  compareProducts } = constants.config;

@Injectable({providedIn: 'root'})
export class OrderDetailService {

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private cartService: CartService
  ) { }
/*
  syncOrder(data) {

    const url = this.env.apiGatewayFront + constants.config.sincronizarPedido;
    const headers = new HttpHeaders();
    //TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(data), {headers});
  }

  recalculateOrder(orderId, userId) {
    return this.http.get(`${this.env.apiGatewayFront}${compareProducts}`, {
        params: {
          orderId,
          userId
        }
      });
  }
*/

  changeStatus(data) {
    const url = this.env.apiGatewayFront + constants.config.changeStatus;
    const headers = new HttpHeaders();
    //TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(data), {headers});
  }

  getOrderById(data) {
    const url = this.env.apiGatewayFront + constants.config.getOrderDetail;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');

    const body: FormData = new FormData();
    body.append('orderId',data.orderId);
    body.append('typeOrders',data.typeOrders);
    body.append('userId',data.userId);
    body.append('quickResponse',data.quickResponse);
    body.append('sellerId',data.sellerId);
    body.append('cartId', this.cartService.getCartId());

    return this.http.post(url, body, {headers});
  }

  duplicateOrderById(userId, sellerId, orderId) {
    let data = {'userId': userId, 'sellerId': sellerId, 'orderId': orderId};
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

  saveSaveComment(data) {
    const url = this.env.apiGatewayFront + constants.config.saveComment;
    const headers = new HttpHeaders();
    //TODO: headers.append('Content-Type', 'application/form-data');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body: FormData = new FormData();

    return this.http.post(url, JSON.stringify(data), {headers});
  }
}
