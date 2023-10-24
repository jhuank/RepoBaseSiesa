import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../services/blog/blog.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';

@Component({
  selector: 'app-blog-tag',
  templateUrl: '../../templates/blog-tag/blog-tag.component.html',
  styleUrls: ['../../templates/blog-tag/blog-tag.component.scss']
})
export class BlogTagComponent implements OnInit {

  blogTag: any;
  tagSlug: string;
  blogData: any;
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
    this.getBlogTag();
    this.initAdverstisments();
  }

  getBlogTag() {
    this.route.params
      .subscribe( parametros => {
        this.blogService.contentBlogTags(parametros.slug, this.limitPage, this.numerPage)
          .subscribe( (blogResponse: any) => {
            this.tagSlug = parametros.slug;
            this.totalBlog = blogResponse.total;
            this.blogTag = blogResponse;
          });
      });
  }

  initAdverstisments() {
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setMetaTags({title: data?.seo?.title ,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords});
    });
  }

  handlePageChange(page: number): void {
    // TODO: Cambiar la forma de obtener datos, muy lenta
    this.numerPage = page;
    this.getBlogTag();
  }
}
