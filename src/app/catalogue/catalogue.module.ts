import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { SharedModule } from '@shared/shared.module';

import { CatalogueComponent } from './catalogue.component';
import { FiltersByAttributesComponent } from './components/filters/filter-by-attribute.component';
import {NumberFormatPipe} from "../pipes/number-format.pipe";


@NgModule({
  declarations: [
    FiltersByAttributesComponent,
    CatalogueComponent,
    NumberFormatPipe
  ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        CatalogueRoutingModule,
        NgbPaginationModule,

    ],
  exports: [],
  providers: [],
})
export class CatalogueModule { }
