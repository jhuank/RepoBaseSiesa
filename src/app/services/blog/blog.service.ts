import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '@core/services/env/env.service';
import {constants} from '../../../config/app.constants';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private contentBlog: any = {};
    private detailBlog: any;
    private contentPanel: any;
    private contentSearch: any;
    private origin: string;

    constructor(private http: HttpClient,
                private env: EnvService) {
        this.origin = 'B2C';
     }

    contentBlogPreview(limite: number, pagina: number) {
        const urlBlog = `${this.env.apiGatewayFront}${constants.config.getBlogList}`;
        this.contentBlog = this.http.get(urlBlog, {
            params: { limit: limite.toString(), page: pagina.toString(), origin: this.origin }
          });
        return this.contentBlog;
    }

    contentDetailBlog(slug: string) {
        const urlDetailBlog = `${this.env.apiGatewayFront}${constants.config.getPostBlog}=${slug}`;
        this.detailBlog = this.http.get(urlDetailBlog);
        return this.detailBlog;
    }

    contentBlogCategories(categorie: string, limite: number, pagina: number) {
        // tslint:disable-next-line:max-line-length
        const urlCategorieBlog = `${this.env.apiGatewayFront}${constants.config.getBlogList}`;
        this.contentBlog = this.http.get(urlCategorieBlog, {
            params: { category: categorie, limit: limite.toString(), page: pagina.toString(), origin: this.origin}
        });
        return this.contentBlog;
    }

    contentBlogTags(tagBlog: string, limite: number, pagina: number) {
        const urlBlogTag = `${this.env.apiGatewayFront}${constants.config.getBlogList}`;
        this.contentBlog = this.http.get(urlBlogTag, {
            params: { tag: tagBlog, limit: limite.toString(), page: pagina.toString(), origin: this.origin }
        });
        return this.contentBlog;
    }

    contentBlogPanel() {
        const urlContentPanel = `${this.env.apiGatewayFront}${constants.config.getBlogPanel}?&origin=${this.origin}`;
        this.contentPanel = this.http.get(urlContentPanel);
        return this.contentPanel;
    }

    searchBlog(termino: string, limite: number, pagina: number) {
        const urlSearch = `${this.env.apiGatewayFront}${constants.config.getBlogList}`;
        this.contentSearch = this.http.get(urlSearch, {
            params: { searchword: termino, limit: limite.toString(), page: pagina.toString(), origin: 'B2C' }
        });
        return this.contentSearch;
    }

}
