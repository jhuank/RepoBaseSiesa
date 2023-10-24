import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CartService } from '@core/services/cart/cart.service';
import { LocationService, CoverageMode } from '@core/services/location/location.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, switchMap, take } from 'rxjs/operators';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { AuthService } from '@core/services/auth/auth.service';
import {ToastService} from '@core/services/toast/toast.service';
import {NgxSmartModalService} from 'ngx-smart-modal';


@Component({
  selector: 'app-modal-location',
  templateUrl: '../../../../templates/shared/components/modal-location/modal-location.component.html',
  styleUrls: ['../../../../templates/shared/components/modal-location/modal-location.component.scss']
})
export class ModalLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('modalLocation') modalLocation: NgxSmartModalComponent;
  public locationOption: number = null;

  constructor(
    public parametersService: ParametersService,
    public locationService: LocationService,
    public cartService: CartService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private modal: NgxSmartModalService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.autostart();
  }

  ngAfterViewInit(): void {
    this.locationService.modal = this.modalLocation;
    this.locationService.modal.onOpen.subscribe(() => {
      if (this.locationService.modal.getData()?.option) {
        this.locationOption = this.locationService.modal.getData().option;
      }
    });
  }

  getModalTitle(): string {
    if (this.parametersService.page?.deliveryParams?.delivery_mode) {
      return 'Seleccione la ubicación de destino';
    }

    if (this.cartService.shoppingCart?.cartLocation?.neighborhoodId) {
      return [
        this.cartService.shoppingCart?.cartLocation?.cityName,
        this.cartService.shoppingCart?.cartLocation?.neighborhoodName
      ].join(', ');
    }

    return (
      this.cartService.shoppingCart?.cartLocation?.cityName ||
      this.parametersService.page?.titleLocationQuestion ||
      'Seleccione la ubicación de destino'
    );
  }

  getModalSubtitle(): string {

    return (
      this.parametersService.page?.descripcionLocationQuestion ||
      ''
    );
  }

  autostart() {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => (event.url !== '/')),
      switchMap(() => this.cartService.shoppingCart$.pipe(
        filter((shoppingCart) => ('cartLocation' in shoppingCart)),
        take(1)
      ))
    ).subscribe((shoppingCart) => {
      if (!shoppingCart?.cartLocation?.cityId && !shoppingCart?.cartLocation?.address) {
        this.locationService.showLocationModal();
      }
    });
  }
}
