import { Component } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { CartService } from '@core/services/cart/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { tap, switchMap, filter } from 'rxjs/operators';
import { ToastService } from '@core/services/toast/toast.service';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import { EnvService } from '@core/services/env/env.service';
import { titles } from '@config/titles.constants';

@Component({
  templateUrl: '../../templates/login/login.component.html',
  styleUrls: ['../../templates/login/login.component.scss']
})
export class LoginComponent {
  public loading = false;
  public formLogin = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^([a-zA-Z0-9_.+-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$')
    ]),
    password: new FormControl('', Validators.required)
  });
  public formLoginFeedback = {
    email: {
      required: 'El correo electrónico es requerido',
      pattern: 'Ingrese un correo electrónico válido'
    },
    password: {
      required: 'La contraseña es requerida'
    }
  };
  public cms: any;

  constructor(
    private envService: EnvService,
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private toastService: ToastService,
    private cartService: CartService,
    private adService: AdvertisementsService,
    private router: Router,
  ) {
    if (this.envService.isBrowser) {
      if (this.authService.isAuthenticated) {
        this.router.navigate(['']);
      }
    }

    this.adService.setTitle(titles.login);

    this.adService.getAdvertisements('PAG-6').subscribe((data: any) => {
      this.cms = data;
      this.adService.setMetaTags({
        title: data?.seo?.title,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords
      });
    });
  }

  login() {
    if (this.formLogin.invalid) {
      return this.toastService.warning('Aun hacen falta campos por diligenciar');
    }

    const { email, password } = this.formLogin.value;
    this.loading = true;

    this.authService.login(email, password).pipe(
      tap((authResponse: any) => {
        if (authResponse.data && authResponse.data.isLogged) {
          this.authService.setCurrentUser(authResponse.data);
          this.toastService.success(authResponse.message);
        } else {
          this.authService.setCurrentUser(null);
          this.toastService.error(authResponse.message);
          this.loading = false;
        }
      }),
      filter((authResponse: any) => authResponse.data.isLogged),
      switchMap(() => this.favoritesService.getResumeProductsFavorites(this.authService.getUserId())),
      tap(favoritesResponse => this.authService.setCurrentUser({
        ...this.authService.currentUserValue,
        favoriteItems: favoritesResponse
      })),
      switchMap(() => this.cartService.getShoppingCartSummary(true))
    ).subscribe((cartResponse: any) => {
      if (cartResponse.cartUnified) {
        this.toastService.info('Los ítems de la canasta se han unificado con una canasta que ya tenia creada anteriormente.');
      }

      //si el usuario ya tiene una canasta creada, lo redirecciona a ella
      //reload temporal mientras se ajusta el modal
      if(cartResponse.cartQuantity > 0) {
        this.router.navigate(['/order'])
          .then(() => {
            window.location.reload();
          });
      } else {
        this.router.navigate(['/'])
          .then(() => {
            window.location.reload();
          });
      }


    }, (error: any) => {
      if (error.status === 500 || error.status === 0) {
        console.error(error);
      }
    }, () => this.loading = false);
  }
}

