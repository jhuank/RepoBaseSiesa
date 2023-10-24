import { Component, OnInit, ViewChild } from '@angular/core';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { titles } from '@config/titles.constants';
import { LocationService, CoverageMode } from '@core/services/location/location.service';
import { CartService } from '@core/services/cart/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: '../../templates/home/home.component.html',
  styleUrls: ['../../templates/home/home.component.scss'],
})
export class HomeComponent implements OnInit {
  public cmsData: any;
  public page = 'PAG-1';
  public page2 = 'PAG-68';
  public items: any[];

  constructor(
    public parametersService: ParametersService,
    public locationService: LocationService,
    public cartService: CartService,
    private adService: AdvertisementsService,
  ) {}

  @ViewChild('content') content: any;

  ngOnInit() {
    this.adService.setTitle(titles.home);

    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setTitle(data?.seo?.title || titles.home);
      this.adService.setMetaTags({
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords});
    });
  }

  locationTemplate() {
    return CoverageMode;
  }

  showHomeCarousel(): boolean {
    if (this.parametersService.page?.deliveryParams?.delivery_mode) {
      if (this.cartService.shoppingCart?.cartLocation?.address) {
        return true;
      }

      return false;
    }

    if (this.cmsData) {
      return true;
    }

    return false;
  }

  showDeliverySection() {
    return (
      (this.parametersService.page?.deliveryParams?.delivery_mode || this.parametersService.page?.deliveryParams?.store_pickup_mode) &&
      (
        !this.cartService.shoppingCart?.cartLocation?.cityId &&
        !this.cartService.shoppingCart?.cartLocation?.neighborhoodId &&
        !this.cartService.shoppingCart?.cartLocation?.address
      )
    );
  }
}
