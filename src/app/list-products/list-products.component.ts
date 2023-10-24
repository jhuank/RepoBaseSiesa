import { Component, Input, OnInit } from '@angular/core';

import { EnvService } from '@core/services/env/env.service';
import { ProductService } from '@core/services/product/product.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ShareDataService } from '@core/services/share-data/share-data.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-list-products',
  templateUrl: '../../templates/list-products/list-products.component.html',
  styleUrls: ['../../templates/list-products/list-products.component.sass']
})
export class ListProductsComponent implements OnInit {
  @Input() public itemName: string;
  @Input() public productsLimit: string;
  @Input() public withTitle: string;
  public limitFromCompany = false;
  items: any[];
  public productInformation = {
    title: ''
  };
  public loadingRelatedProducts = false;
  constructor(
    public parametersService: ParametersService,
    private envService: EnvService,
    private gtmService: GoogleTagManagerService,
    private productService: ProductService,
    private shareDataService: ShareDataService
  ) { }

  ngOnInit(): void {

    this.getItems();

    const signOutSubscriber = this.shareDataService.signOutEvent.subscribe((response) => {
      if (response) {
        this.getItems();
      }
      signOutSubscriber.unsubscribe();
    });
  }

  getItems() {
    if (this.envService.isBrowser) {

      if (!this.productsLimit){
        this.productsLimit = '10';
      }
      this.limitFromCompany = true
      this.productService.getProducts({
        limit: this.productsLimit,
        type: this.itemName,

      }).subscribe((data: any[]) => {
        this.productInformation.title =  this.itemName;
        if(this.withTitle) {
          this.productInformation.title = this.parametersService?.page?.tituloProductosBajoCanasta;
        }
        this.items = data;
        if (this.items.length) {
          const products = [];
          this.items.forEach((valFor, indexFor) => {
            products.push(
              {
                id: valFor.id,
                name: valFor.name,
                price: valFor.currentPrice,
              }
            );
          });

          if (this.envService.isBrowser) {
            this.generateTagManagerEvent(products);
          }
        }
      });
    }
  }

  generateTagManagerEvent(products: any[]) {
    const gtmTag = {
      event: 'Pageview',
      ecommerce: {
        currencyCode: 'COP',
        impressions: products
      },
    };
    this.gtmService.pushTag(gtmTag);
  }

}
