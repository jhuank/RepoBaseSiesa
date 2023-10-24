import { Component, OnInit, TemplateRef,ViewChild,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { ProductService } from '@core/services/product/product.service';
import { IAttributes, Product } from '@core/models/product.model';
import { AuthService } from '@core/services/auth/auth.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { CartService } from '@core/services/cart/cart.service';
import { ToastService } from '@core/services/toast/toast.service';
import { ModalService } from '@core/services/modal/modal.service';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { EnvService } from '@core/services/env/env.service';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { ShoppingCart } from '@core/models/cart.model';
import { IPage } from '@core/models/page.model';

@Component({
  templateUrl: '../../templates/product-details/product-details.component.html',
  styleUrls: ['../../templates/product-details/product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public loadingProductDetail = false;
  public productSubject: BehaviorSubject<Product> = new BehaviorSubject<Product>(null);
  public product$: Observable<Product> = this.productSubject.asObservable();
  public productTemplate: Product;

  public attributes: IAttributes[] = [];
  public cloneAttributes: { [key: string]: string }[] = [];
  public mainImage: string;
  public relatedProducts: Product[] = [];
  public partSuppliesProduct: Product[] = [];
  public partSustitutesProduct: Product[] = [];
  public partSparesProducts: Product[] = [];
  public quantity = 1;
  public commentProduct = '';
  public showAllComments = false;
  public rating = 0;
  public comments: any[] = [];
  public schema: any;
  public activeId: number = 2;
  public currentAttributesItemFromCart: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public quantityAddToCart = 0;

  public originalClonedAttributesArray: any;
  public colorSizeRelationArray: any;
  public productTemplateCopy: any;
  public productExt=null;
  public unidadesMedidas : string;
  public categoriaTitule : any;
  public bandera : boolean ;
  public textoCalcular;
  public clonedFormData: any[] = ["",""];
  @ViewChild('inputItemComment') inputItemCommentRef: ElementRef;

  constructor(
    public parametersService: ParametersService,
    public authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private envService: EnvService,
    private adService: AdvertisementsService,
    private toastService: ToastService,
    private modalService: ModalService,
    private switchSpinnerService: SwitchSpinnerService,
    private gtmService: GoogleTagManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.switchSpinnerService.on();
    this.route.params.pipe(
      switchMap(params => this.productService.getProduct({ slug: params.productSlug })),
      tap((product: Product) => {
        this.partSuppliesProduct = [];
        this.partSustitutesProduct = [];
        this.partSparesProducts = [];
        this.relatedProducts = [];
        this.activeId = 2;
      }),
      tap((product) => this.asignAttributesFromCartToItem(product)),
      tap(() => this.switchSpinnerService.off())
    ).subscribe((product) => {

      if (!product) {
        return this.router.navigate(['/', '404']);
      }

      this.productService.saveHistoryProducts(product.id).toPromise().then();

      if((!product.currentPrice || product.currentPrice < 0) && this.parametersService?.page?.showProductNotFound) {
        this.router.navigate([
          '/',
          'product-not-found',
          product?.name
        ]);
      }

      //this.productExt = Object.assign({}, product);
      //this.productExt =  { ...product }

      this.productExt = JSON.parse(JSON.stringify(product));

      this.schema = {
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: product.name,
        image: [
          product.imagesDetail[0].path + product.imagesDetail[0].image,
        ],
        description: product.description_strip,
        sku: product.reference,
        offers: {
          '@type': 'Offer',
          priceCurrency: product.rate,
          price: product.itemPrice,
          category: product.category.title,
          sku: product.reference,
        }
      };
      this.adService.setMetaTags({
        title: product?.seo?.title,
        meta_description: product?.seo?.meta_description,
        image: product?.imagesDetail[0].path + product?.imagesDetail[0].image,
        og_title: product?.seo?.og_title,
        og_description: product?.seo?.og_description,
        keywords: product?.seo?.keywords
      });
      product.update = true;

      if (Number.isInteger(product.discountPercentage)) {
        product.discountPercentage = parseInt(product.discountPercentage.toString(), 0);
      } else {
        product.discountPercentage = product.discountPercentage.toFixed(2) as any;

      }

      this.productSubject.next(product);
      this.attributes = Object.values(product.attributesDetail) as IAttributes[];
      this.setMainImagePath(product.imagesDetail[0]);

      if (product.isTemplate) {
        this.productTemplate = product;
      }

      if (this.envService.isBrowser) {
        const gtmTag = {
          event: 'Pageview',
          ecommerce: {
            detail: {
              actionField: { list: 'Product' },
              products: [{
                name: product.name,
                id: product.id,
                price: product.currentPrice,
                category: product.category.slug,
              }]
            }
          },
        };
        this.gtmService.pushTag(gtmTag);
      }
      this.categoriaTitule = product.category.title;
      this.originalClonedAttributesArray = JSON.parse(JSON.stringify(product.clonedAttributesDetail)) ;
      this.unidadesMedidas ="" + Object.entries(this.originalClonedAttributesArray[0].value)[1][1];
      this.colorSizeRelationArray = JSON.parse(JSON.stringify(product.colorSizeRelationArray)) ;

      if (product.isTemplate) {
        this.productTemplateCopy = JSON.parse(JSON.stringify(product)) ;
      }

      if( product.clonedAttributesDetail.length == 1 && this.objectLength(product.clonedAttributesDetail[0]?.value) == 1){
        this.clonedAttributesSelected(product.clonedAttributesDetail[0].name,Object.keys(product.clonedAttributesDetail[0].value)[0],null);
      }


    });

    this.product$.pipe(
      filter((product) => (product !== null && product?.update)),
      switchMap((product) => this.productService.getRatings(product.id))
    ).subscribe((rating: any) => {
      this.comments = rating?.data || [];
      this.rating = rating?.globalRatingDecimal || 0;
    });

    this.product$.pipe(
      filter((product) => (product !== null && product?.update)),
      switchMap((product) => this.productService.getProducts({
        type: 'relacionados',
        itemId: product.id,
        slug: product.slug,
        userId: this.authService.getUserId(),
        limit: '8',
      }))
    ).subscribe((products: any | any[]) => this.setRelatedProducts(products));

    this.product$.pipe(
      filter((product) => (product !== null && product?.update)),
      switchMap((product) => this.productService.getProducts({
        type: 'relacionados_categoria',
        itemId: product.id,
        userId: this.authService.getUserId(),
        limit: '8',
        categoryId: product.category.id
      }))
    ).subscribe((products: any | any[]) => this.setRelatedProducts(products));


  }

  urlProduct() {
    if (this.envService.isBrowser) {
      return window.location.href;
    }
    return '';
  }

  setRelatedProducts(products: Product[]) {
    if (this.relatedProducts.length <= 8) {
      this.partSuppliesProduct = [];
      this.partSustitutesProduct = [];
      this.partSparesProducts = [];
      products.forEach((product: Product) => {
        if (this.relatedProducts.length === 0) {
          return this.relatedProducts.push(product);
        }

        const existsRelated = this.relatedProducts.find(item => item?.id === product.id);

        if (!existsRelated) {
          return this.relatedProducts.push(product);
        }
      });

      this.relatedProducts.forEach((product) => {
        switch (product.id_tipo_relacion) {
          case 1:
            this.partSuppliesProduct.push(product);
            break;
          case 2:
            this.partSustitutesProduct.push(product);
            break;
          case 3:
            this.partSparesProducts.push(product);
            break;
          default:
            break;
        }
      });
    }
  }

  setMainImagePath(main: any) {
    this.mainImage = main.path + main.image;
  }

  toggleFavoriteProduct(product: Product) {
    this.productService.toggleFavoriteProduct(product).subscribe((response) => {
      if (!response.error) {
        product.isFavorite = !product.isFavorite;
      }
    });
  }

  clonedAttributesSelected(templateName: string, templateId: string, index:any) {
    if (templateId) {
      this.cloneAttributes[templateName] = templateId;
    } else {
      delete this.cloneAttributes[templateName];

      if(this.productTemplate) {
        this.productSubject.next({
          ...this.productTemplate,
          update: false
        });
      }
      else {
        let copy = Object.assign({}, this.productSubject.value);
        copy.isTemplate = true;
        this.productSubject.next({
          ...copy,
          update: false
        });
      }

    }

    if(index == 0 ) {
        this.filterAttributesDetail(this.originalClonedAttributesArray,templateName);
    }


    for (const { name } of this.productSubject.value?.clonedAttributesDetail) {
      if (!this.cloneAttributes[name]) {
        return;
      }
    }

    const clonePriceProductId = this.productTemplate ? this.productTemplate.id : this.productSubject.value.parentId;
    const clonedAttributesDetail = this.productTemplate ? this.productTemplate.clonedAttributesDetail : this.productSubject.value.clonedAttributesDetail;
    this.productService.getClonePrice(clonePriceProductId, this.cloneAttributes).subscribe((response: any) => {
      if (!response.error) {
        this.productSubject.next({
          ...response.data.dataItem,
          ...response.data,
          id: response.data.dataItem.id,
          clonedAttributesDetail: clonedAttributesDetail,
          update: false
        });
      } else {
        if(this.productSubject) {
          this.productSubject.next({
            ...this.productTemplate,
            update: false
          });
        }
        else {
          let copy = Object.assign({}, this.productSubject.value);
          copy.isTemplate = true;
          this.productSubject.next({
            ...copy,
            update: false
          });
        }
      }
    });


  }

  handleQuantity(quantity: number) {
    this.quantity = quantity;
  }

  getQuantity(){
    return this.quantity;
  }

  disabledAddToCartButton(product: Product): boolean {
    const quantity = this.quantity;
    const factor = product?.factor_pedido || 1;
    const min = product?.cantidad_minima || 1;

    if (!quantity) {
      return true;
    }

    if (this.itemAlreadyInCart() && (quantity < factor)) {
      return true;
    }

    if (quantity < min) {
      return true;
    }

    return false;
  }

  addItemToCart(product: Product, template?: TemplateRef<any>, comment?: any) {

    comment = this.inputItemCommentRef ? this.inputItemCommentRef.nativeElement.value : null;

    const itemAlreadyInCart = this.cartService.validateItemAlreadyInShoppingCart(product.id);
    const quantity = !itemAlreadyInCart ? (this.quantity || product.cantidad_minima || 1) : (this.quantity || product.factor_pedido || 1);
    this.cartService.addItemToShoppingCart(product.id, quantity, comment).subscribe((response) => {
      if (!response.error) {
        const gtmTag = {
          event: 'addToCart',
          ecommerce: {
            add: {
              products: [{
                quantity,
                name: product.name,
                id: product.id,
                price: product.currentPrice,
                category: product.category.slug
              }]
            }
          },
        };
        this.gtmService.pushTag(gtmTag);
        this.quantityAddToCart = quantity;
        if ( product.factor_pedido != null ) {
          this.quantity = product.factor_pedido;
        }

        if (!template) {
          return this.toastService.success(response.message);
        }

        return this.toastService.success(template);
        this.commentProduct = '';
      }

      return this.toastService.showFeedback(response);
    });
  }

  qualificationRequest(commentary: string, score: number) {
    this.productService.setRating(this.productSubject.value.id, commentary, score).subscribe((response) => {
      this.toastService.showFeedback(response);
      this.modalService.dismiss();
    });
  }

  openModal(template: TemplateRef<any>, context?: any) {
    this.modalService.open(template, context);
  }

  getSanitizerVideoUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  itemAlreadyInCart(): boolean {
    const {id} = this.productSubject.value;
    return this.cartService.validateItemAlreadyInShoppingCart(id);
  }

  filtersRating(value) {

    this.productService.getRatingsFilters(this.productSubject.value.id,value).subscribe(
      response=>{
        this.comments = response?.data || [];
        this.rating = response?.globalRatingDecimal || 0;
      }
    )
  }

  get attributesItemFromCart(): any {
    return this.currentAttributesItemFromCart.value;
  }

  // Asigna atributos clones de item desde la canasta al producto actual
  asignAttributesFromCartToItem(product: Product): void {
    const itemInCart = this.cartService.shoppingCart?.itemsCanastaUsuario?.find((item) => +item.id == +product.id);
    const attributesItemInCart =  itemInCart?.attributesDetail;
    this.currentAttributesItemFromCart.next(attributesItemInCart);

    const attrCloneArray = [];
    if(this.attributesItemFromCart) {
      this.attributesItemFromCart.forEach(element => {
        const foundItem = product.clonedAttributesDetail.find(cloneAttr => cloneAttr.name === element.name);
        const indToFind = Object.values(foundItem.value).find(val => val === element.value[0]);
        const attrId = Object.keys(foundItem.value).filter(key => foundItem.value[key] === indToFind);
        attrCloneArray[foundItem.name] = attrId[0];
      });
      this.cloneAttributes = Object.assign({}, attrCloneArray);
    }
  }

  //funcion helper para colocar options de selects de atributos de clon en select = true
  findDefaultSelected(attribute?: any, name?: any): boolean {
    if(this.attributesItemFromCart) {
      const findItem = this.attributesItemFromCart.find(item => item.name === name);
      if(findItem !== undefined)
        if(attribute === findItem.value[0]) return true;
    }
    return false;
  }
  objectLength(obj?: any){
    return  Object.keys(obj).length
  }


  cambiarTexto(){
    document.getElementById('textoExplicacion').innerText = "Ancho x largo del lugar que necesitas cubrir: mt2";
  }

  calcularMt2(mt2 : any){

    let mensaje : string;
    if(mt2 == undefined || mt2 <= 0){
      mensaje = 'Debes ingresar un valor mayor que 0';
    }else{
      let numeroCajas = Math.ceil(mt2/(parseFloat(this.unidadesMedidas.substring(4,9))));
      this.handleQuantity(numeroCajas);
      this.quantity = numeroCajas;
      this.cartService.calculatoQua = numeroCajas;
      mensaje = `Se necesitan ${numeroCajas}  cajas para tu proyecto`;
    }
    this.textoCalcular = mensaje;
    this.bandera = true;
  }

  //Intersecta arrays originalClonedAttributesArray con this.colorSizeRelationArray
  // Para hallar que tallas se deben mostrar segun que color.
  filterAttributesDetail(originalClonedAttributesArray,attribute) {

    if(this.clonedFormData[0] == '' && this.clonedFormData[1]){
      this.clonedFormData[1] = '';
    }

    //  const extensioncolor = Object.keys(this.clonedFormData)[0]
    // //logica de seleccion
    if(Object.keys(this.clonedFormData).length > 0) {
        //Encontrando nombre de color seleccionado

        const objectKey = Object.values(this.clonedFormData);
        var selectedColorName =  objectKey[0];

        //Hallando tallas disponibles para ese color
        var availableSizesToColor = this.colorSizeRelationArray[selectedColorName];
        console.log("1 availableSizesToColor",availableSizesToColor);

        // Crear copia del array de tallas
        if(originalClonedAttributesArray[1]){
          const copyArray = JSON.parse(JSON.stringify(originalClonedAttributesArray[1].value)) ;

          if(availableSizesToColor && this.productExt.clonedAttributesDetail[1]){
            if(Object.keys(availableSizesToColor).length == 1){
                const keyObjectArr = Object.keys(availableSizesToColor)
                const valueObjecArr = Object.values(availableSizesToColor)[0]
                availableSizesToColor = [];
                availableSizesToColor[""+keyObjectArr] = valueObjecArr;
            }

            //Hallando claves en array de tallas
            const sizeAvailableKeys = [];

            if(!Array.isArray(availableSizesToColor)){
                for (let prop in  availableSizesToColor) {
                const foundItem = Object.keys(copyArray).find(key => copyArray[key] == `${availableSizesToColor[prop]}`);
                    if(foundItem != undefined) {
                        sizeAvailableKeys.push(foundItem);
                    }
                }
            }else{
                availableSizesToColor.forEach(function(item) {
                    const foundItem = Object.keys(copyArray).find(key => copyArray[key] === item);
                    if(foundItem != undefined) { sizeAvailableKeys.push(foundItem); }
                });
            }

            //hallando llaves a borrar


            const keysToDelete = [];
            Object.keys(copyArray).forEach(function(key) {

                const keyFounded = sizeAvailableKeys.find(el => el === key);
                if(keyFounded == undefined) { keysToDelete.push(key); }
            });
            //Borrando claves de array de tallas
            keysToDelete.forEach(function(key) {
                delete copyArray[key];
            });


            this.productExt.clonedAttributesDetail[1].value = {};
            this.productExt.clonedAttributesDetail[1].value = JSON.parse(JSON.stringify(copyArray)) ;

            this.productTemplateCopy.clonedAttributesDetail[1].value = JSON.parse(JSON.stringify(copyArray)) ;
          }
        }
    }
    //this.clonedFormData.extensiontalla = null;
  }
}
