import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap, takeUntil, map } from 'rxjs/operators';
import { Observable, Subject, of, timer, BehaviorSubject, interval, concat } from 'rxjs';

import { CartService } from '@core/services/cart/cart.service';
import { ToastService } from '@core/services/toast/toast.service';
import { CommonService } from '@core/services/common/common.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ModalService } from '@core/services/modal/modal.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { DOCUMENT } from '@angular/common';
import { LocationService } from '@core/services/location/location.service';
import { OrderService } from '@core/services/order/order.service';
import {element} from 'protractor';

@Component({
  templateUrl: '../../templates/tracking/tracking.component.html',
  styleUrls: ['../../templates/tracking/tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  public products = [];
  public paramestroToast: any;
  public toggleOrderComment: boolean;
  public searching = false;
  private locationQuery = new Subject<string>();
  public locations$: Observable<any[]>;
  public customEstados: any;
  public customNovedades: any;
  public trackingInfo: any;
  public UltimoEstado = null;
  public PenultimoEstado = null;
  public showTracking = false;
  public IncidenciasText = false;
  public trackingArray = [
    {
      url : '../assets/images/icon-box.png',
      clases : '',
      estado : 0,
      states : ['ALTA', 'CPCE', 'CA']

    },
    {
      url : '../assets/images/icon-factory.png',
      clases : '',
      estado : 0,
      states : ['COOR']

    },
    {
      url : '../assets/images/icon-truck.png',
      clases : '',
      estado : 0,
      states : ['CPCE', 'C']

    },
    {
      url : '../assets/images/icon-city.png',
      clases : '',
      estado : 0,
      states : ['LLEG', 'ASIG', 'AL']

    },
    {
      url : '../assets/images/icon-truck.png',
      clases : '',
      estado : 0,
      states : ['REPA', 'ASIG', 'AR']

    },
    {
      url : '../assets/images/icon-box-check.png',
      clases : '',
      estado : 0,
      states : ['ENTR']

    },
  ];

  constructor(
    public parametersService: ParametersService,
    public cartService: CartService,
    public locationService: LocationService,
    private adService: AdvertisementsService,
    private commonService: CommonService,
    private toastService: ToastService,
    public modalService: ModalService,
    public switchSpinnerService: SwitchSpinnerService,
    public ngxSmartModalService: NgxSmartModalService,
    private gtmService: GoogleTagManagerService,
    private orderService: OrderService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {

    this.switchSpinnerService.on();

    const cartId = this.route.snapshot.paramMap.get('orderId');
    let tracking = null;
    const response = null;
    this.route.params.subscribe(params => {
      tracking = params.id;

    });
    let UltimoEstado = null;
    let PenultimoEstado = null;

    this.orderService.getTracking(tracking).subscribe((response) => {
      //console.log(response);
      this.showTracking = true;
      let ArrIncidencias = [];

      if(typeof response.data.INCIDENCIAS != 'undefined') {
        if (!Array.isArray(response.data.INCIDENCIAS.INCIDENCIA)) {

          ArrIncidencias.push(response.data.INCIDENCIAS.INCIDENCIA);

        } else {
          ArrIncidencias = response.data.INCIDENCIAS.INCIDENCIA;
        }
      }else{
        this.IncidenciasText = true;
      }
      this.customEstados = response.data.ESTADOS.ESTADO;
      this.customNovedades = ArrIncidencias;/*response.data.INCIDENCIAS.INCIDENCIA;*/
      this.trackingInfo = response.data;

      UltimoEstado = this.customEstados[0];
      PenultimoEstado = this.customEstados[1];
      this.UltimoEstado = UltimoEstado;
      this.PenultimoEstado = PenultimoEstado;
      console.log(UltimoEstado);
       /*UltimoEstado.TIPO_EVENTO_CODIGO = 'CPCE';
       PenultimoEstado.TIPO_EVENTO_CODIGO = 'COOR';*/
      const estadosCopy = this.trackingArray.map((item: any) => {
        // let itemCopy = item;

        const itemCopy = {};
        itemCopy['url'] = item.url;
        itemCopy['estado'] = item.estado;
        itemCopy['states'] = item.states;

        let founded = item.states.find(element  => element === UltimoEstado.TIPO_EVENTO_CODIGO );

        if( UltimoEstado.TIPO_EVENTO_CODIGO === 'ASIG'){
          if(PenultimoEstado.TIPO_EVENTO_CODIGO === 'LLEG'){
            founded = item.states.find(element  => element === 'AL' );
          }else if(PenultimoEstado.TIPO_EVENTO_CODIGO === 'REPA'){
            founded = item.states.find(element  => element === 'AR' );
          }

        }
        if( UltimoEstado.TIPO_EVENTO_CODIGO === 'CPCE'){
          if(PenultimoEstado.TIPO_EVENTO_CODIGO === 'COOR'){
            founded = item.states.find(element  => element === 'C' );
          }else {
            founded = item.states.find(element  => element === 'CA' );
          }

        }

        if (founded) {
          console.log('-----');
          console.log(item);
          itemCopy['estado'] = 1;
          // itemCopy.estado = 1;
        }
        return itemCopy;
      });
      //console.log(estadosCopy);
      //this.trackingArray = estadosCopy;
       this.trackingArray = Object.assign([], estadosCopy);

    });



    // console.log(this.customEstados);
    this.parametersService.getCompanyParameters().toPromise().then((company) => {
      this.paramestroToast = company.config?.toast;

    });
    this.switchSpinnerService.off();
  }

}
