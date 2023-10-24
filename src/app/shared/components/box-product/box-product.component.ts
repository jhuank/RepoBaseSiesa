import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {Product} from '@core/models/product.model';
import {CartService} from '@core/services/cart/cart.service';
import {ToastService} from '@core/services/toast/toast.service';
import {AuthService} from '@core/services/auth/auth.service';
import { ProductService } from '@core/services/product/product.service';
import {GoogleTagManagerService} from 'angular-google-tag-manager';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-box-product',
  templateUrl: '../../../../templates/shared/components/box-product/box-product.component.html',
  styleUrls: ['../../../../templates/shared/components/box-product/box-product.component.scss']
})
export class BoxProductComponent implements OnInit {
  @Input() public product: Product;
  @Input() public showRating = false;

  @ViewChild('templateAfterAddToShoppingCart') private toastTemplate: TemplateRef<any>;
  public loading = false;
  public itemAlreadyInCart = false;
  public rating = 0;
  public quantityProduct = 1;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private gtmService: GoogleTagManagerService,
    private toastService: ToastService
  ) {
  }

  get quantity(): number {
    return this.product.cantidad_minima || 1;
  }

  ngOnInit() {
    //console.log("producto",this.product);

    if(Number.isInteger(this.product.discountPercentage)){
      this.product.discountPercentage = parseInt(this.product.discountPercentage.toString(), 0);
    }else{
      this.product.discountPercentage = this.product.discountPercentage.toFixed(2) as any;
    }

   if(this.showRating){
      this.productService.getRatings(this.product.id).subscribe((rating: any) => {
        this.rating = rating?.globalRatingDecimal || 0;
      });
   }
  }


  addToCart() {

    this.loading = true;
    this.itemAlreadyInCart = this.cartService.validateItemAlreadyInShoppingCart(this.product.id);
    console.log(this.itemAlreadyInCart);
    const alreadyInCartQuantity = !this.itemAlreadyInCart ? (this.quantityProduct || this.quantity) : (this.quantityProduct || this.product.factor);
    console.log(alreadyInCartQuantity);
    this.cartService.addItemToShoppingCart(this.product.id, alreadyInCartQuantity || 1).subscribe((response: any) => {
      if (!response.error) {
        const gtmTag = {
          event: 'addToCart',
          ecommerce: {
            add: {
              products: [{
                name: this.product.name,
                id: this.product.id,
                price:  this.product.currentPrice,
                category: this.product.category.slug,
                quantity: this.quantityProduct
              }]
            }
          },
        };
        console.log(response);
        this.gtmService.pushTag(gtmTag);
        return this.toastService.showFeedback({
          ...response,
          message: this.toastTemplate
        });
      }

      this.loading = false;
      return this.toastService.showFeedback(response);
    });
  }

  toggleFavoriteProduct() {
    this.productService.toggleFavoriteProduct(this.product).subscribe((response) => {
      if (!response.error) {
        this.product.isFavorite = !this.product.isFavorite;
      }
    });
  }

  setItemToCompare(){
    this.productService.toggleCompareProduct(this.product);
  }

  selectedToCompare(): boolean {
    return this.productService.listProductCompare.includes(this.product.id);
  }

  get itemIsAlreadyInCart(): boolean {
    return this.itemAlreadyInCart;
  }

  get productFactor(): number {
    return this.quantityProduct || 1;
  }

  handleQuantity(quantity: number) {
    this.quantityProduct = quantity;
  }

}
