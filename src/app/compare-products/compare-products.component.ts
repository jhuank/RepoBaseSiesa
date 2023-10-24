import { Component, OnInit } from '@angular/core';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { ProductService } from '@core/services/product/product.service';
import { CompareProductsService } from '@core/services/compare-products/compare-products.service';
import { ActivatedRoute, Router } from '@angular/router';

import {CartService} from '@core/services/cart/cart.service';
import {ToastService} from '@core/services/toast/toast.service';
import { Product } from '@core/models/product.model';
import {AdvertisementsService} from '@shared/services/advertisements/advertisements.service';
import { titles } from '@config/titles.constants';
import { Location } from '@angular/common';

@Component({
  selector: 'app-compare-products',
  templateUrl: '../../templates/compare-products/compare-products.component.html',
  styleUrls: ['../../templates/compare-products/compare-products.component.scss']
})
export class CompareProductsComponent implements OnInit {
    ids: string;
    public user: any = null;
    public productsToCompare: Product[] = [];
    public quantity: number = 1;

    constructor(private route: ActivatedRoute,
                public parametersService: ParametersService,
                public compareProductsService: CompareProductsService,
                private router: Router,
                private cartService: CartService,
                private toastService: ToastService,
                private adService: AdvertisementsService,
                public productService: ProductService,
                private location: Location) { }

    ngOnInit(): void {
      this.adService.setMetaTags({title: titles.compare,
        meta_description: 'Compare sus productos',
        image: '',
        og_title: 'Comparar productos',
        og_description: 'Compare sus productos',
        keywords: ''});
      this.route.params
            .subscribe( parametros => {
                this.ids = parametros.ids;

                if (localStorage.getItem('currentUser') !== null) {
                    this.user = JSON.parse(localStorage.getItem('currentUser'));
                }

                this.getInfoCompareProducts();
        });
      this.productService.listProductCompare = [];
    }

    getInfoCompareProducts() {
        this.compareProductsService.getCompareProducts(this.ids, this.user?.userId).subscribe((response: any) => {
            this.productsToCompare = response;
        });
    }

    AddToCart(product: Product) {

      const itemAlreadyInCart = this.cartService.validateItemAlreadyInShoppingCart(product.id);
      const quantity = !itemAlreadyInCart ? ( this.quantity || 1) : ( this.quantity || 1);
      this.cartService.addItemToShoppingCart(product.id, quantity).subscribe( (response: any) => {
          if (!response.error) {
            return this.toastService.showFeedback({
              ...response,
              message: `
                <h5>${product.name}</h5>
                <p>Ha sido agregado correctamente</p>
                <P>Cantidad añadida: <b>${quantity}</b></P>
              `
            });
          }

          return this.toastService.showFeedback(response);
        });
    }

    delProductToArray(productId) {
        if (productId) {
            this.productsToCompare = this.productsToCompare.filter(product => product.id !== productId);
            if (!this.productsToCompare.length) {
                this.router.navigate(['']);
            }
        }
    }

    backClicked() {
      this.location.back();
    }

    handleQuantity(quantity: number) {
      this.quantity = quantity;
    }
}
