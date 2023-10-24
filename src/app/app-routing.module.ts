import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { BrowserNotSupportedComponent } from './browser-not-supported/browser-not-supported.component';
import { OfflineExpectationComponent } from './offline-expectation/offline-expectation.component';
// import { AuthGuard } from './gards/auth.gard';
import { PasswordComponent } from './password/password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductNotFoundComponent } from './product-not-found/product-not-found.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { OrderComponent } from './order/order.component';
import { ConfirmationOrderComponent } from './confirmation-order/confirmation-order.component';
import { TunnelComponent } from './tunnel/tunnel.component';
import { OrdersComponent } from './orders/orders.component';
import { ResponseComponent } from './response/response.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddressComponent } from './address/address.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogSearchComponent } from './blog-search/blog-search.component';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { BlogTagComponent } from './blog-tag/blog-tag.component';
import { CompareProductsComponent } from './compare-products/compare-products.component';
import { EventsComponent } from './events/events.component';
import { EventsDetailComponent } from './events-detail/events-detail.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { CMSPagesComponent } from './cms-pages/cms-pages.component';
import {HeadquartersComponent} from './headquarters/headquarters.component';
import {HeadquartersDetailComponent} from './headquarters-detail/headquarters-detail.component';
import { LoadCart } from './load-cart/load-cart.component';
import {DiagnosticComponent} from './diagnostic/diagnostic.component';
import { TrackingComponent } from './tracking/tracking.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '', loadChildren: () => import('./catalogue/catalogue.module').then(m => m.CatalogueModule) },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'browser-not-supported', component: BrowserNotSupportedComponent },
  { path: 'offline-expectation', component: OfflineExpectationComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'diagnostico', component: DiagnosticComponent },
  { path: 'password-recovery', component: PasswordComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'account', component: AccountComponent },
  { path: 'checkout', component: TunnelComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'order', component: OrderComponent },
  { path: 'tunnel', component: TunnelComponent},
  { path: 'address', component: AddressComponent},
  { path: 'favorites', component: FavoritesComponent },
  { path: 'headquarters', component: HeadquartersComponent },
  { path: 'events', component: EventsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'load-cart/:id', component: LoadCart },
  { path: 'compare-products/:ids', component: CompareProductsComponent },
  { path: 'politics/:slug', component: CMSPagesComponent },
  { path: 'pages/:slug', component: CMSPagesComponent },
  { path: 'events-detail/:id', component: EventsDetailComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'headquarters/:id', component: HeadquartersDetailComponent },
  { path: 'blog/search/:termino', component: BlogSearchComponent },
  { path: 'blog/category/:slug', component: BlogCategoryComponent },
  { path: 'blog/tag/:slug', component: BlogTagComponent },
  { path: 'order/:id', component: OrderDetailComponent },
  { path: 'tracking/:id', component: TrackingComponent },
  { path: 'response/:orderId', component: ResponseComponent },
  { path: 'product-not-found/:word', component: ProductNotFoundComponent },
  { path: 'confirmation/:orderId/:state', component: ConfirmationOrderComponent },
  { path: ':categorySlug', component: CategoriesComponent },
  { path: ':categorySlug/:productSlug', component: ProductDetailsComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
