import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { OrderService } from '@core/services/order/order.service';
import { ToastService } from '@core/services/toast/toast.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import {GoogleTagManagerService} from 'angular-google-tag-manager';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import { titles } from '@config/titles.constants';
import {AuthService} from '@core/services/auth/auth.service';
import {OrderDetailService} from '@core/services/order-detail/order-detail.service';
import {SwitchSpinnerService} from '@core/services/switch-spinner/switch-spinner.service';

@Component({
  templateUrl: '../../templates/response/response.component.html',
  styleUrls: ['../../templates/response/response.component.scss']
})
export class ResponseComponent implements OnInit {
  public paymentInformation$: Observable<any>;
  public client_id: number = 0;
  public orderId: any;
  public orderData: any;
  private products = [];
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private adService: AdvertisementsService,
    private toastService: ToastService,
    public parametersService: ParametersService,
    private orderDetailService: OrderDetailService,
    public switchSpinnerService: SwitchSpinnerService,
    public auth: AuthService,
    private gtmService: GoogleTagManagerService
  ) {}

  ngOnInit(): void {
    this.paymentInformation$ = this.route.params.pipe(
      switchMap((params) => this.orderService.getPaymentInformation(params.orderId) ),
      tap((serviceResponse) => {
        this.getOrder(serviceResponse.id);
        this.client_id = serviceResponse.cliente_id || 0;
      })
    );
    this.adService.setTitle(titles.response);
    console.log(this.paymentInformation$);
  }

  payNow() {
    /* TODO
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
    if (this.orderData.medioPago.id !== 1) {
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
      this.gtmService.pushTag(gtmTag);*/
    this.paymentInformation$.pipe(
      switchMap((paymentInformation: any) => this.orderService.recalculateOrder(paymentInformation.id))
    ).subscribe((response) => {
      if (!response.error) {
        if (response.order.estado_pago === 'Procesando pago' || response.order.estado_pago === 'Pagada') {
          return this.toastService.error(`
            No es posible realizar el pago de tu pedido. Es posible que el pago del pedido esté en proceso o ya haya sido aprobado,
            por favor dirígete al listado de tus pedidos.
          `);
        }

        return this.toastService.success('Redirecionar al "order/pay-gate"');
        // TODO: Redirecionar al pay-gate
        // this.$window.location = window.__env.envApiServiceBaseUri + '/order/pay-gate?id=' + this.payInfo.pedidos_id;
      } else {
        return this.toastService.error(response.message);
      }
    });
  }

  getOrderStatus(status: string) {
    switch (status) {
      case 'Rechazado':
        return 'Rechazada';
      case 'Pagada':
        return 'Exitosa';
      case 'Pendiente':
        return 'Pendiente';
      case 'Procesando pago':
        return 'Procesando pago';
      default:
        return 'Abortada';
    }
  }
  getOrder(orderId?: string) {
    const data = {
      // tslint:disable-next-line:radix
      orderId,
      typeOrders: '',
      quickResponse: '1',
      userId: this.auth.getUserId() ,
      sellerId: this.auth.currentUserValue?.sellerId || ''
    };
    this.orderDetailService.getOrderById(data).pipe(tap(() => this.switchSpinnerService.off()))
      .subscribe( (response: any) => {
        if (!response.error) {
          response.data.order.items.forEach(val => {
            this.products.push({
              name: val.nombre,     // Name or ID is required.
              id: val.id,
              price: val.precio_unitario,
              quantity: val.cantidad,
            });
          });
          if (response.data.order.estado_pago === 'Pagada') {
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
        } else {
          this.toastService.error(response.message, { delay : 5000 });
        }
      });
  }
}
