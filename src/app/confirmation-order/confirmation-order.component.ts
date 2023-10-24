import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@core/services/auth/auth.service';
import { OrderService } from '@core/services/order/order.service';
import { EnvService } from '@core/services/env/env.service';

import { constants } from '@config/app.constants';
import {GoogleTagManagerService} from 'angular-google-tag-manager';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import { titles } from '@config/titles.constants';
import {ParametersService} from '@core/services/parameters/parameters.service';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-confirmation-order',
  templateUrl: '../../templates/confirmation-order/confirmation-order.component.html',
  styleUrls: ['../../templates/confirmation-order/confirmation-order.component.scss']
})
export class ConfirmationOrderComponent implements OnInit {
  public loadingDataOrder: boolean;
  public cmsData: any;
  public userId: any;
  public sellerId: any;
  public orderData: any;
  private orderId: any;
  public products = [];

  constructor(
    private envService: EnvService,
    public authService: AuthService,
    public orderService: OrderService,
    private adService: AdvertisementsService,
    private gtmService: GoogleTagManagerService,
    private router: Router,
    public parametersService: ParametersService,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated && !this.parametersService.page?.permitirCompraRapidaB2c) {
      this.router.navigate(['/login']);
    }
    this.adService.setTitle(titles.confirmation);
    this.route.params.subscribe(params => {
      this.orderId = params.orderId;
      this.loadingDataOrder = true;
      let userId = '';
      if (this.parametersService.page?.permitirCompraRapidaB2c && !this.authService.isAuthenticated) {
        userId = localStorage.getItem('userTemporal');
        localStorage.removeItem('userTemporal');
      }
      this.orderService.getOrder(params.orderId, userId).subscribe((response: any) => {
        if (!response.error) {
          this.orderData = response.data.order;
          this.orderData.totalPesoItems = 0;
          this.orderData.cantidadTotalCanasta = 0;
          this.products = [];
          response.data.order.items.forEach(val => {
            this.products.push({
              name: val.nombre,     // Name or ID is required.
              id: val.id,
              price: val.precio_unitario,
              quantity: val.cantidad,
            });
            this.orderData.totalPesoItems += val.cantidad * val.peso_embalaje;
            this.orderData.cantidadTotalCanasta += val.cantidad;
          });
          if (!this.orderData.medioPago.pasarela_pago_id) {
            const gtmTag = {
              event: 'Pageview',
              ecommerce: {
                purchase: {
                  actionField: {
                    step: 3,
                    option: response.data.order.payment.name.toString(),
                    id: response.data.order.id,                         // Transaction ID. Required for purchases and refunds.
                    affiliation: 'Tienda Virtual',
                    revenue: response.data.order.total,                     // Total transaction value (incl. tax and shipping)
                    tax: response.data.order.impuestos,
                    shipping: response.data.order.gestion_y_transporte,
                  },
                  products: this.products
                }
              },
            };
            this.gtmService.pushTag(gtmTag);
          }
          this.orderData = response.data.order;
          this.orderData.totalPesoItems = 0;
          this.orderData.cantidadTotalCanasta = 0;
          response.data.order.items.forEach(val => {
            this.orderData.totalPesoItems += val.cantidad * val.peso_embalaje;
            this.orderData.cantidadTotalCanasta += val.cantidad;
          });
        }
        this.loadingDataOrder = false;
      });
    });
  }

  payNow() {
    const userId = this.authService.getUserId();
    if (this.orderData.estado_pago === 'Procesando pago') {
      this.toastService.error('Ya hay un proceso de pago asociado a su pedido');
      return;
    }
    window.location.href = this.envService.apiGatewayFront + '/order/pay-gate?id=' + this.orderId;
    /*this.orderService.recalculateOrder(this.orderId).subscribe((response: any) => {
      if (!response.error) {
        // TODO: Window
        window.location.href = this.envService.apiGatewayFront + '/order/pay-gate?id=' + this.orderId;
      } else if (this.orderData.estado_pago && response.data) {
        this.orderData.estado_pago = response.data;
        this.orderData.showPayOrderAction = false;
      }
    });*/
  }

}
