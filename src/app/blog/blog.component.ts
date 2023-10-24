import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog/blog.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { titles } from '@config/titles.constants';


@Component({
    selector: 'app-blog',
    templateUrl: '../../templates/blog/blog.component.html',
    styleUrls: ['../../templates/blog/blog.component.scss']
  })
  export class BlogComponent implements OnInit {
    public cmsData: any;
    public page = 'PAG-45';
    public blogData: any;
    public numerPage: number;
    public limitPage: number;
    public totalBlog: number;

    constructor(
      private blogService: BlogService,
      private adService: AdvertisementsService,
    ) {
      this.numerPage = 1;
      this.limitPage = 5;
    }

    ngOnInit() {
      this.adService.setTitle(titles.blog);

      this.getContentBlog();
      this.initAdverstisments();
    }

    getContentBlog() {
      this.blogService.contentBlogPreview(this.limitPage, this.numerPage)
        .subscribe((blogResponse: any) => {
          this.totalBlog = blogResponse.total;
          return this.blogData = blogResponse;
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
      this.getContentBlog();
    }
  }
