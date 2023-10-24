import { Component, OnInit } from '@angular/core';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetailService } from '@core/services/order-detail/order-detail.service';
import { OrdersService } from '@core/services/orders/orders.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { EnvService } from '@core/services/env/env.service';
import {ToastService} from '@core/services/toast/toast.service';
import {AuthService} from '@core/services/auth/auth.service';
import { titles } from '@config/titles.constants';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-order-detail',
  templateUrl: '../../templates/order-detail/order-detail.component.html',
  styleUrls: ['../../templates/order-detail/order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  public user: any;
  public orderId: any;
  public orderSaved: any;

  public orderData: any;
  public sellerCommentText: any;
  public sellerComment = false;
  public loadingDuplicateOrders = false;

  public page = 'PAG-36';
  public cmsData: any;
  public obsequios = [];

  constructor(private route: ActivatedRoute,
              public parametersService: ParametersService,
              public auth: AuthService,
              private orderDetailService: OrderDetailService,
              private ordersService: OrdersService,
              private router: Router,
              private toastService: ToastService,
              public switchSpinnerService: SwitchSpinnerService,
              private env: EnvService,
              private adService: AdvertisementsService) { }

  ngOnInit(): void {
    this.switchSpinnerService.on();
    if (this.env.isBrowser) {
      const user = this.auth.getUser();
      if (user || +this.route.snapshot.queryParams.client_id > 0) {
        const params = this.route.snapshot.params;
        this.orderId = params.id;
        this.user = user;
        this.getOrder(this.route.snapshot.queryParams.client_id);
      } else {
        this.switchSpinnerService.off();
        this.router.navigate(['/login']);
      }
    }

    this.adService.setTitle(titles.ordersDetails);
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setMetaTags({title: data?.seo?.title ,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords});
    });
  }

  getOrder(clientId? : string) {
    const data = {
      // tslint:disable-next-line:radix
      orderId: +this.orderId,
      typeOrders: '',
      quickResponse: '',
      userId: this.auth.getUserId() || clientId,
      sellerId: this.auth.currentUserValue?.sellerId || ''
    };
    this.orderDetailService.getOrderById(data).pipe(tap(() => this.switchSpinnerService.off()))
      .subscribe( (response: any) => {
        if(!response.error) {

          this.orderData = response.data.order;

          this.orderData.totalPesoItems = 0;
          this.orderData.cantidadTotalCanasta = 0;
          response.data.order.items.forEach(val => {
              if (val?.obsequio?.id) {
                this.obsequios.push(val.obsequio);
              }
              this.orderData.totalPesoItems += val.cantidad * val.peso_embalaje;
              this.orderData.cantidadTotalCanasta += val.cantidad;
          });
        }
        else {
          this.toastService.error(response.message, { delay : 5000 });
          this.router.navigate(['/orders']);
        }
      });
  }

  changeStatus() {
    this.orderSaved = false;
    this.orderDetailService.changeStatus({
        id: this.orderData.id,
        sellerId: this.user.sellerId,
        estado: this.orderData.estado_documento_id
    }).subscribe( (response: any) => {
      this.orderSaved = true;
    });
  }
  payNow(orderId) {
    const userId = this.user.userId;
    this.ordersService.recalculateOrder(orderId, userId).subscribe((response: any) => {
        if (!response.error) {
            if (this.orderData.estado_pago === 'Procesando pago') {
              // tslint:disable-next-line:max-line-length
                this.toastService.error('Lo sentimos! El pago de tu pedido está siendo procesado. Por favor intentalo de nuevo más tarde.');
            }

            // TODO: reemplazar funcionalidad window
            // this.$window.location = window.__env.envApiServiceBaseUri + '/order/pay-gate?id=' + orderId;

        } else {
            if (this.orderData && response.data) {
              this.orderData.estado_pago = response.data;
            }
            this.toastService.error(response.message);
        }
    });
  }

  addCommentary() {
    this.sellerComment = true;
  }

  saveComment() {
      this.orderDetailService.saveSaveComment({
          coment: this.sellerCommentText,
          orderId: this.orderId
      }).subscribe( (response: any) => {
          if (!response.error) {
              this.orderData.anotaciones_vendedor = response.order.anotaciones_vendedor;
              this.sellerComment = false;
              this.sellerCommentText = null;
          }
      });
  }

  duplicateOrder() {
    this.loadingDuplicateOrders = true;

    this.ordersService.duplicateOrderById(this.user.userId, this.user.sellerId, this.orderData.id).subscribe((response:any) => {
      this.loadingDuplicateOrders = false;
      if (!response.error) {
        localStorage.setItem('cartId', response.cartId);
        console.log(response)
        if(response.flagItemsStockInvalid){
          this.toastService.success(
            response.messageValidacionItems,{ delay: 10000 }
          );
        }

        this.router.navigate(['order']);
      } else {
        // alert('No se pudo completar la acción.');
        this.toastService.error(response.message, { delay : 3000});
      }
    });
  }
  cancelComment() {
      this.sellerComment = false;
  }
}
