import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap, startWith, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AdvertisementsService } from '@shared/services/advertisements/advertisements.service';

@Component({
  templateUrl: '../../templates/cms-pages/cms-pages.component.html',
  styleUrls: ['../../templates/cms-pages/cms-pages.component.scss']
})
export class CMSPagesComponent implements OnInit {
  public slug: string;
  public cms$: Observable<any>;

  constructor(
    public adService: AdvertisementsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cms$ = this.route.params.pipe(
      startWith({slug: ''}),
      delay(0),
      map(params => params.slug),
      tap(slug => this.slug = (slug.split('-').join(' ')).charAt(0).toUpperCase() + (slug.split('-').join(' ')).slice(1)),
      switchMap((slug) => this.adService.getAdvertisements('', { slug }).pipe(
        tap(cms => {
          this.adService.setMetaTags({
            title: cms?.seo?.title || this.slug,
            meta_description: cms?.seo?.meta_description,
            image: cms?.image,
            og_title: cms?.seo?.og_title,
            og_description: cms?.seo?.og_description,
            keywords: cms?.seo?.keywords});
        })
      ))
    );
  }

}
