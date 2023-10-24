import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, QueryList, ViewChildren, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { tap, distinctUntilChanged } from 'rxjs/operators';
import { CartService } from '@core/services/cart/cart.service';
import { LocationService } from '@core/services/location/location.service';
import { ShoppingCart } from '@core/models/cart.model';

class MegaMenuItem {
  id?: string;
  nombre: string; // TODO: API, se debe mantener la semántica
  disabled?: boolean;
  icon?: string;
  route?: string;
  slug?: string;
  url_destino?: string;
  hijas?: MegaMenuItem[]; // TODO: API, se debe mantener la semántica
  expanded = false;
}

@Component({
  selector: 'app-mega-menu',
  templateUrl: '../../../../templates/shared/components/mega-menu/mega-menu.component.html',
  styleUrls: ['../../../../templates/shared/components/mega-menu/mega-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MegaMenuComponent implements OnInit,AfterViewInit{
  @Input() menu: MegaMenuItem;
  @Input() advertisement: any;
  @Input() promocion: boolean;
  @Input() footer: boolean;
  @Output() closeMenu = new EventEmitter();

  @ViewChild('mainCattegoryName') mainCattegoryName: ElementRef;
  @ViewChild('dropDownMenu') dropDownMenu: ElementRef;
  @ViewChildren('menuItem') menuItem: QueryList<ElementRef>;

  public textLocationSubject: BehaviorSubject<string>;

  constructor(
    private router: Router,
    public parametersService: ParametersService,
    public cartService: CartService,
    public locationService: LocationService,
    private cd : ChangeDetectorRef
  ) {
    this.textLocationSubject = new BehaviorSubject('');
  }

  ngOnInit() {
    this.textLocation();
  }

  menuAction(item: MegaMenuItem) {
    if (item?.hijas && item?.hijas?.length > 0) {
      return item.expanded = !item.expanded;
    }

    // this.router.navigate(['/', item.slug, 'categories']);
    this.router.navigate(this.navigate(item));
    this.closeMenu.emit();
  }

  navigate(item: MegaMenuItem) {

    if (item?.hijas?.length > 0) {
      return ['/', item?.slug];
    }

    return ['/', item?.slug, 'products'];
  }

  ngAfterViewInit() {

    this.menuItem.forEach((item) => {
      const handlerClick$ = fromEvent(item.nativeElement, 'click').pipe(
        tap(() => this.dropDownMenu.nativeElement.classList.add('hide-menu-child'))
      ).subscribe();
    });

    const handler$ = fromEvent(this.mainCattegoryName.nativeElement, 'mouseover')
    .pipe(
      tap(resp => this.dropDownMenu.nativeElement.classList.remove('hide-menu-child'))
    )
    .subscribe();

    this.cartService.shoppingCart$
    .pipe(
      distinctUntilChanged((prev: ShoppingCart, curr: ShoppingCart) => prev?.cartLocation === curr?.cartLocation)
    )
    .subscribe((response: ShoppingCart) => {
      this.textLocation(response);
      this.cd.detectChanges();
    });
  }

  get subjectTextLocation() : string {
    return this.textLocationSubject.value;
  }

  textLocation(shoppingCart?: ShoppingCart): string {

    const cartLocation = shoppingCart?.cartLocation || this.cartService.shoppingCart?.cartLocation;

    if (
      this.parametersService.page?.deliveryParams?.delivery_mode ||
      this.parametersService.page?.deliveryParams?.store_pickup_mode
    ) {

      if (cartLocation?.storeId) {
        this.textLocationSubject.next(cartLocation.storeName);
        return;
      }

      if (cartLocation?.address) {
        this.textLocationSubject.next(cartLocation.cityName);
        return;
      }
      if (cartLocation?.cityName) {
        this.textLocationSubject.next(cartLocation.cityName);
        return;
      }

      if (this.parametersService.page?.deliveryParams?.store_pickup_mode) {
        this.textLocationSubject.next('Selecciona el destino');
        return;
      }

      this.textLocationSubject.next('Ingresar dirección');
      return;
    }

    if (cartLocation?.cityId) {
      if (cartLocation?.neighborhoodId) {
        this.textLocationSubject.next(`${cartLocation.cityName}, ${cartLocation.neighborhoodName}`);
        return;
      }

      this.textLocationSubject.next(cartLocation.cityName);
      return;
    }

    this.textLocationSubject.next('Ubicación');
    return;
  }
}
