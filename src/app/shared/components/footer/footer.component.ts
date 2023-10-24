import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastService } from '@core/services/toast/toast.service';
import { EnvService } from '@core/services/env/env.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { ProductService } from '@core/services/product/product.service';
import { MainService } from '@shared/services/main.service';
import { constants } from '@config/app.constants';
import { CommonService } from '@core/services/common/common.service';
import { DOCUMENT } from '@angular/common';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

const { STORAGE_COOKIES_ACCEPTED } = constants.storage;
const {STORAGE_MENU} = constants.storage;

@Component({
  selector: 'app-footer',
  templateUrl: '../../../../templates/shared/components/footer/footer.component.html',
  styleUrls: ['../../../../templates/shared/components/footer/footer.component.scss']
})
export class FooterComponent implements OnInit {
  public showUpButton = false;
  public cookiesAccepted = false;
  public loadingSubscribeForm = false;
  public categoriesMenu: any;
  public subscribeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^([a-zA-Z0-9_.+-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$')
    ]),
    acceptPolicies: new FormControl(false, Validators.requiredTrue),
  });
  public cmsData: any;
  private page = 'PAG-3';

  constructor(
    private envService: EnvService,
    public parametersService: ParametersService,
    public authService: AuthService,
    private adService: AdvertisementsService,
    private commonService: CommonService,
    private toastService: ToastService,
    private productService: ProductService,
    public mainService: MainService,
    @Inject(DOCUMENT)
    private document: Document
  ) { }
  indicativeRequired(formControl: AbstractControl) {
    if (!formControl.parent) {
      return null;
    }

    if (formControl.parent.get('myCheckbox').value) {
      return Validators.required(formControl);
    }
    return null;
  }
  ngOnInit() {
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
    });
    if (this.envService.isBrowser) {
      this.cookiesAccepted = JSON.parse(localStorage.getItem(STORAGE_COOKIES_ACCEPTED));
      this.getMenu().subscribe(menu => {
        this.categoriesMenu = menu;
        localStorage.setItem('slugCategoriaPrincipal', menu[0]?.slug);
      });
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.showUpButton = (this.document.documentElement.scrollTop > 100);
  }

  fieldIsInvalid(controlName: string): boolean {
    const field = this.subscribeForm.get(controlName);

    return (field.invalid && (field.dirty || field.touched));
  }

  sendSubscribe() {
    if (this.subscribeForm.invalid) {
      return;
    }

    this.loadingSubscribeForm = true;
    
    this.commonService.subscribeToPromotionsAndOffers(this.subscribeForm.value)
      .subscribe((suscribeResponse: any) => {
        this.toastService.showFeedback(suscribeResponse);
        this.loadingSubscribeForm = false;
        this.subscribeForm.reset();
      });
  }

  enableCookies() {
    if (this.envService.isBrowser) {
      this.cookiesAccepted = true;
      localStorage.setItem(STORAGE_COOKIES_ACCEPTED, JSON.stringify(true));
    }
  }

  getNumberElementToCompare() {
    return this.productService.listProductCompare.length;
  }

  getStrElementsToCompare() {
    return this.productService.listProductCompare.join(',');
  }

  scrollToTop() {
    this.document.documentElement.scroll({ top: 0, behavior: 'smooth' });
  }
  getMenu(): Observable<any> {
    if (this.envService.isBrowser) {
      const menuInStorage = localStorage.getItem(STORAGE_MENU);

      if (menuInStorage && this.envService.environment.saveParametersInStorage) {
        return of(JSON.parse(menuInStorage));
      } else if (!this.envService.environment.saveParametersInStorage) {
        localStorage.removeItem(STORAGE_MENU);
      }
    }

    return this.mainService.getCategoriesMenu().pipe(
      tap(menu => menu)
    );

  }
}
