import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../services/blog/blog.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { switchMap, map, tap } from 'rxjs/operators';


@Component({
  selector: 'app-blog-search',
  templateUrl: '../../templates/blog-search/blog-search.component.html',
  styleUrls: ['../../templates/blog-search/blog-search.component.scss']
})
export class BlogSearchComponent implements OnInit {
  public loadingBlog: boolean;
  blogSearch: any;
  termino: string;
  p = 1;
  collection: any;
  page = 'PAG-45';
  cmsData: any;
  public numerPage: number;
  public limitPage: number;
  public totalBlog: number;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private adService: AdvertisementsService
  ) {
    this.numerPage = 1;
    this.limitPage = 5;
  }

  ngOnInit() {
    this.getSearchBlog();
    this.initAdvertisements();
  }

  getSearchBlog() {
    this.loadingBlog = true;
    this.route.params.pipe(
      map(params => params.termino),
      tap(term => this.termino = term),
      switchMap(term => this.blogService.searchBlog(term, this.limitPage, this.numerPage))
    ).subscribe((blogResponse: any) => {
      this.totalBlog = blogResponse.total;
      this.blogSearch = blogResponse;
      this.loadingBlog = false;
    });
  }

  initAdvertisements() {
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
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

  handlePageChange(page: number): void {
    this.numerPage = page;
    this.getSearchBlog();
  }
}
