import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogueService } from '@core/services/catalogue/catalogue.service';
import { switchMap, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ParametersService } from '@core/services/parameters/parameters.service';
import {AdvertisementsService} from '@shared/services/advertisements/advertisements.service';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { titles } from '@config/titles.constants';

@Component({
  templateUrl: '../../templates/categories/categories.component.html',
  styleUrls: ['../../templates/categories/categories.component.scss']
})

export class CategoriesComponent implements OnInit {
  private categorySubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public category$: Observable<any> = this.categorySubject.asObservable();

  private treeCategorySubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public treeCategory$: Observable<any> = this.treeCategorySubject.asObservable();

  constructor(
    public parametersService: ParametersService,
    private catalogueService: CatalogueService,
    private adService: AdvertisementsService,
    private switchSpinnerService: SwitchSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.switchSpinnerService.on();
    this.route.params.pipe(
      map(params => params.categorySlug),
      switchMap((slug) => this.catalogueService.getCategory({ slug })),
      tap(() => this.switchSpinnerService.off())
    ).subscribe((category) => {
      this.adService.setMetaTags({title: category?.seo?.title || titles.category,
        meta_description: category?.seo?.meta_description,
        image: category?.image,
        og_title: category?.seo?.og_title,
        og_description: category?.seo?.og_description,
        keywords: category?.seo?.keywords
      });
      this.categorySubject.next(category);
    });

    this.route.params.pipe(
      map(params => params.categorySlug),
      switchMap((slug) => this.catalogueService.getTreeCategory({ id : slug })),
      tap(() => this.switchSpinnerService.off())
    ).subscribe((category) => {
      this.treeCategorySubject.next(category);
      if (category === null) {
        return this.router.navigate(['/', '404']);
      }
    });

  }

  getLink(subcategory: any) {
    if (subcategory.hijas) {
      return ['/', subcategory.slug];
    }

    return ['/', subcategory.slug, 'products'];
  }
}
