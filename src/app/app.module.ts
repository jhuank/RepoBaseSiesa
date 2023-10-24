import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { NgxImageZoomModule } from 'ngx-image-zoom';

// import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
// import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { CatalogueModule } from './catalogue/catalogue.module';
// import { AuthGuard } from './gards/auth.gard';
import { NgxJsonLdModule } from 'ngx-json-ld';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';

// Pipes
import { KeysPipe } from './pipes/keys.pipe';
import { KeepHtmlPipe } from './pipes/keep-html.pipe';

// Services
import { EnvService } from '@core/services/env/env.service';

// Componentes
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ToastsComponent } from './shared/components/toasts/toasts.component';
import { HomeComponent } from './home/home.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserNotSupportedComponent } from './browser-not-supported/browser-not-supported.component';
import { OfflineExpectationComponent } from './offline-expectation/offline-expectation.component';
import { PasswordComponent } from './password/password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductNotFoundComponent } from './product-not-found/product-not-found.component';
import { AccountComponent } from './account/account.component';
import { OrderComponent } from './order/order.component';
import { TunnelComponent } from './tunnel/tunnel.component';
import { OrdersComponent } from './orders/orders.component';
import { ResponseComponent } from './response/response.component';
import { ConfirmationOrderComponent } from './confirmation-order/confirmation-order.component';
import { ShoppingExperienceComponent } from './shopping-experience/shopping-experience.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddressComponent } from './address/address.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { AsideBlogComponent } from './shared/components/aside-blog/aside-blog.component';
import { BlogSearchComponent } from './blog-search/blog-search.component';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { BlogTagComponent } from './blog-tag/blog-tag.component';
import { CompareProductsComponent } from './compare-products/compare-products.component';
import { EventsComponent } from './events/events.component';
import { EventsDetailComponent } from './events-detail/events-detail.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { HeadquartersComponent } from './headquarters/headquarters.component';
import { CMSPagesComponent } from './cms-pages/cms-pages.component';
import { LoadSpinnerComponent } from './load-spinner/load-spinner.component';
import { HeadquartersDetailComponent } from './headquarters-detail/headquarters-detail.component';
import {SafeHtmlPipe} from './services/tanfromarHtml';
import { HeaderComponent } from './header/header.component';
import { LoadCart } from './load-cart/load-cart.component';
import { DiagnosticComponent} from './diagnostic/diagnostic.component';
import { TrackingComponent } from './tracking/tracking.component';
import {NgSelectModule} from "@ng-select/ng-select";


export function servicesOnRun(envService: EnvService) {
  return () => envService.getEnvironmentConfig().toPromise().then(
    (env) => envService.setEnvironmentConfig(env)
  );
}

@NgModule({
  declarations: [
    KeepHtmlPipe,
    KeysPipe,
    AppComponent,
    HeaderComponent,
    ToastsComponent,
    LoadSpinnerComponent,
    PageNotFoundComponent,
    HomeComponent,
    ListProductsComponent,
    LoginComponent,
    RegisterComponent,
    PasswordComponent,
    ContactUsComponent,
    ProductDetailsComponent,
    AccountComponent,
    OrdersComponent,
    OfflineExpectationComponent,
    BrowserNotSupportedComponent,
    ProductNotFoundComponent,
    ConfirmationOrderComponent,
    TunnelComponent,
    OrderComponent,
    ResponseComponent,
    CategoriesComponent,
    AddressComponent,
    ShoppingExperienceComponent,
    BlogComponent,
    BlogDetailComponent,
    AsideBlogComponent,
    BlogSearchComponent,
    BlogCategoryComponent,
    BlogTagComponent,
    CompareProductsComponent,
    EventsComponent,
    EventsDetailComponent,
    OrderDetailComponent,
    FavoritesComponent,
    HeadquartersComponent,
    CMSPagesComponent,
    HeadquartersDetailComponent,
    SafeHtmlPipe,
    DiagnosticComponent,
    TrackingComponent,
    LoadCart
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    CatalogueModule,
    // ScrollingModule,
    NgbModule,
    // PasswordStrengthMeterModule,
    NgxSmartModalModule.forRoot(),
    NgxJsonLdModule,
    AgmCoreModule.forRoot(),
    FeatherModule.pick(allIcons),
    NgSelectModule,
    NgxImageZoomModule
  ],
  exports: [
    // ReactiveFormsModule,
    // NgxPaginationModule,
    FeatherModule
  ],
  providers: [
    EnvService,
    {
      provide: APP_INITIALIZER,
      useFactory: servicesOnRun,
      multi: true,
      deps: [EnvService]
    },
    {
      provide: 'googleTagManagerId',
      useFactory: (envService: EnvService) => envService.environment?.tagId,
      deps: [EnvService]
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useFactory: (envService: EnvService) => ({
        siteKey: envService.environment?.siteKeyCaptcha
      } as RecaptchaSettings),
      deps: [EnvService]
    },
    {
      provide: LAZY_MAPS_API_CONFIG,
      useFactory: (envService: EnvService) => envService.environment?.apiKeyGoogleMap,
      deps: [EnvService]
    }
    // AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
