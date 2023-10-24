import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog/blog.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-blog-detail',
    templateUrl: '../../templates/blog-detail/blog-detail.component.html',
    styleUrls: ['../../templates/blog-detail/blog-detail.component.scss']
  })
  export class BlogDetailComponent implements OnInit {

    blogDetail: any;
    slug: string;
    blogData: any;
    page = 'PAG-45';
    cmsData: any;

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService,
        private adService: AdvertisementsService
    ) { }

    ngOnInit() {
        this.getDetailBlog();
        this.initAdverstisments();
    }

    getDetailBlog() {
        this.route.params
            .subscribe( parametros => {
                this.blogService.contentDetailBlog(parametros.slug)
                    .subscribe( (blogResponse: any) => {
                        this.slug = parametros.slug;
                        this.blogDetail = blogResponse;
                        this.adService.setMetaTags({title: blogResponse.post.nombre ,
                          meta_description: blogResponse.post.descripcion,
                          image: blogResponse.post.imagen,
                          og_title: blogResponse.post.nombre,
                          og_description: blogResponse.post.descripcion,
                          keywords: ''});
                    });
            });
    }

    initAdverstisments() {
        this.adService.getAdvertisements(this.page).subscribe((data: any) => {
          this.cmsData = data;
        });
    }
  }
