import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CatalogueComponent } from './catalogue.component';

const routes: Routes = [
    { path: ':categorySlug/products', component: CatalogueComponent, pathMatch: 'full' },
    { path: ':query/search', component: CatalogueComponent, pathMatch: 'full' },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class CatalogueRoutingModule {}
