import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NgbCarouselModule,
  NgbNavModule,
  NgbRatingModule,
  NgbToastModule,
  NgbTooltipModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';
import { allIcons } from 'angular-feather/icons';

// Pipes
import { DomSeguroPipe } from '../pipes/dom-seguro.pipe';
import {PrettyjsonPipe} from '../pipes/prettyjson.pipe';

// Directives
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { OnlyLettersDirective } from './directives/only-letters.directive';
import { ShowWhenEmptyDirective } from './directives/show-when-empty-directive.directive';
import { MenuDirective} from './directives/menu.directive';

// Components
import { AdvertisementsComponent } from './components/advertisements/advertisements.component';
import { TableComponent } from './components/table/table.component';
import { FooterComponent } from './components/footer/footer.component';
import { BoxProductComponent } from './components/box-product/box-product.component';
import { SearchComponent } from './components/search/search.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import { ModalLocationComponent } from './components/modal-location/modal-location.component';
import { BoxSearchComponent } from './components/box-search/box-search.component';
import { QuantityComponent } from './components/quantity/quantity.component';
import { MegaMenuComponent } from './components/mega-menu/mega-menu.component';
import {ModalComponent} from './components/modal/modal.component';
import { RowsPerPageComponent } from './components/filters/rows-per-page/rows-per-page.component';
import { SortByPipe } from './pipes/sort-by.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { UppercaseFirstLetterPipe } from './pipes/uppercase-first-letter.pipe';
import { InputComponent } from './components/input/input.component';
import {NgxJsonLdModule} from 'ngx-json-ld';
import { FormLocationComponent } from './components/form-location/form-location.component';
import {FeatherModule} from "angular-feather";
import { CustomModalComponent } from './components/custom-modal/custom-modal.component';
import { GiftFormComponent } from './components/gift-form/gift-form.component';
import {NgSelectModule} from "@ng-select/ng-select";

import localEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localEs, 'es');

@NgModule({
  declarations: [
    // Pipes
    SortByPipe,
    FilterPipe,
    DomSeguroPipe,
    EllipsisPipe,
    UppercaseFirstLetterPipe,
    PrettyjsonPipe,

    // Directives
    OnlyNumbersDirective,
    OnlyLettersDirective,
    ShowWhenEmptyDirective,
    MenuDirective,

    // Components
    ModalComponent,
    FormLocationComponent,
    MegaMenuComponent,
    FooterComponent,
    TableComponent,
    AdvertisementsComponent,
    QuantityComponent,
    BoxProductComponent,
    SearchComponent,
    BreadcrumbComponent,
    BoxSearchComponent,
    ModalLocationComponent,
    RowsPerPageComponent,
    InputComponent,
    CustomModalComponent,
    GiftFormComponent,

  ],
  exports: [
    // Pipes
    SortByPipe,
    FilterPipe,
    EllipsisPipe,
    UppercaseFirstLetterPipe,

    // Directives
    OnlyNumbersDirective,
    OnlyLettersDirective,
    ShowWhenEmptyDirective,

    // Components
    ModalComponent,
    FormLocationComponent,
    ModalLocationComponent,
    MegaMenuComponent,
    FooterComponent,
    TableComponent,
    QuantityComponent,
    AdvertisementsComponent,
    BoxProductComponent,
    SearchComponent,
    BreadcrumbComponent,
    BoxSearchComponent,
    RowsPerPageComponent,
    InputComponent,
    EllipsisPipe,
    PrettyjsonPipe,
    FeatherModule,
    CustomModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbCarouselModule,
    NgxSmartModalModule.forChild(),
    NgbRatingModule,
    NgbToastModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    ReactiveFormsModule,
    NgxJsonLdModule,
    FeatherModule.pick(allIcons),
    NgSelectModule
  ],
  providers: [
    {
      provide: LOCALE_ID, useValue: 'es'
    }
  ]
})
export class SharedModule { }
