import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService } from '@core/services/auth/auth.service';
import { EnvService } from '../env/env.service';

import { AppResponse } from '@core/models/common.model';
import { Product } from '@core/models/product.model';

import { constants } from '@config/app.constants';
import {CartService} from '@core/services/cart/cart.service';
const {
  setFavoriteProduct,
  getAutocomplete,
  getClonePrice,
  getProducts,
  getProduct,
  getRatings,
  setRating,
  getRatingsFiltros,
  saveHistoryProducts
} = constants.config;

interface RequestProducts {
  type?: string;
  slug?: string;
  itemId?: string;
  categoryId?: string;
  limit?: string;
  userId?: string;
  categoryIdFilter?: string;
  origin?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  public listProductCompare: string[] = [];

  constructor(
    private envService: EnvService,
    private authService: AuthService,
    private cartService: CartService,
    private http: HttpClient
  ) { }

  getProduct(reference: { slug?: string; id?: string }): Observable<Product> {
    return this.http.get<Product>(`${this.envService.apiGatewayFront}/${getProduct}`, {
      params: {
        id: '',
        slug: '',
        userId: this.authService.getUserId(),
        cartId: this.cartService.getCartId(),
        ...reference,
        getCloneAttributesInChildItem: '1'
      }
    });
  }

  getProducts(params: RequestProducts): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.envService.apiGatewayFront}/${getProducts}`, {
      params: {
        userId: this.authService.getUserId(),
        cartId: this.cartService.getCartId(),
        ...params
      }
    });
  }
  saveHistoryProducts(pId?: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.envService.apiGatewayFront}/${saveHistoryProducts}`, {
      params: {
        userId: this.authService.getUserId(),
        productId: pId,

      }
    });
  }
  getClonePrice(productTemplateId: string, attributes: any[]) {
    const form = new FormData();

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        form.append(`attributes[${key}]`, attributes[key]);
      }
    }

    form.append('productTemplateId', productTemplateId);
    form.append('userId', this.authService.getUserId());
    form.append('cartId', this.cartService.getCartId());

    return this.http.post(`${this.envService.apiGatewayFront}/${getClonePrice}`, form);
  }

  getRatings(productId: string) {
    return this.http.get(`${this.envService.apiGatewayFront}/${getRatings}?item_id=${productId}`);
  }

  getRatingsFilters(productId: string, order:string): Observable<any> {
    return this.http.get(`${this.envService.apiGatewayFront}/${getRatingsFiltros}?item_id=${productId}&order=${order}`);
  }

  /**
   * Envía una calificación del producto para ser revisada por el administrador
   */
  setRating(productId: string, commentary: string, score: number): Observable<any> {
    return this.http.post(`${this.envService.apiGatewayFront}/${setRating}`, {
      comentario: commentary,
      puntaje: score,
      item_id: productId,
      user_id: this.authService.getUserId()
    });
  }

  search(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return of([]);
    }

    const params = new HttpParams()
      .append('cadena', query)
      .append('cartId',  this.cartService.getCartId())
      .append('limit', '10')
      .append('userId', this.authService.getUserId());

    return this.http.get<Product[]>(`${this.envService.apiGatewayFront}/${getAutocomplete}`, { params })
      .pipe(
        catchError(this.handleError('Buscando producto', []))
      );
  }

  toggleFavoriteProduct({ isFavorite, id }: Product) {
    return this.http.post<AppResponse>(`${this.envService.apiGatewayFront}/${setFavoriteProduct}`, {
      productId: +id,
      setFavorite: `${!isFavorite}`,
      userId: this.authService.getUserId()
    }).pipe(
      tap((response: any) => {
        if (!response.error) {
          const currentFavorites = this.authService.currentUserValue?.favoriteItems || [];
          const findItemOnFavorite = currentFavorites.findIndex(itemId => itemId === id);

          if (findItemOnFavorite === -1) {
            this.authService.setCurrentUser({
              ...this.authService.currentUserValue,
              favoriteItems: currentFavorites.concat(id)
            });
          } else if (findItemOnFavorite !== -1) {
            this.authService.setCurrentUser({
              ...this.authService.currentUserValue,
              favoriteItems: currentFavorites.filter(itemId => itemId !== id)
            });
          }
        }
      })
    );
  }

  /**
   * Deje que la aplicación siga ejecutándose devolviendo un resultado vacío.
   */
  private handleError<T>(operation = 'Operación', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation, error);

      return of(result as T);
    };
  }

  toggleCompareProduct({ reference, id }: Product) {

    if (this.listProductCompare.includes(id)) {
      const index: number = this.listProductCompare.indexOf(id);
      if (index !== -1) {
        this.listProductCompare.splice(index, 1);
      }
    } else {
      this.listProductCompare.push(id);
    }
    return;

  }
}
