import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from '@core/services/env/env.service';
import { constants } from '../../../../config/app.constants';
import {Meta, Title} from '@angular/platform-browser';

const { advertisementsCmsSpaces } = constants.config;

export interface Advertisement {
    carrusel: any[];
    espacios: any;
    seo: any[];
};

@Injectable({
    providedIn: 'root',
})
export class AdvertisementsService {

    constructor(
        private envService: EnvService,
        private http: HttpClient,
        private titleTagService: Title,
        private metaTagService: Meta
    ) { }

    getAdvertisements(pageName: string, params?: { slug?: string, ad?: string }): Observable<any> {
        return this.http.get<Advertisement>(`${this.envService.apiGatewayFront}/${advertisementsCmsSpaces}`, {
            params: {
                pageName,
                slug: 'null',
                ...params
            }
        });
    }

    setTitle(title: string) {
        this.titleTagService.setTitle(title);
    }

    setMetaTags(data: any) {
        if (data.title) {
            this.setTitle(data.title);
        }
        this.metaTagService.updateTag({ name: 'title', content: data.title });
        this.metaTagService.updateTag({ name: 'description', content: data.meta_description });
        this.metaTagService.updateTag({ name: 'image', content: data.image });
        this.metaTagService.updateTag({ property: 'og:title', content: data.og_title });
        this.metaTagService.updateTag({ property: 'og:image', content: data.image });
        this.metaTagService.updateTag({ property: 'og:description', content: data.og_description });
        this.metaTagService.updateTag({ name: 'keywords', content: data.keywords });
    }

}
