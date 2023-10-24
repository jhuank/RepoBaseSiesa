import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '@core/services/env/env.service';
import {constants} from '../../config/app.constants';
import {isPlatformBrowser} from "@angular/common";
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private contentFavs: any = {};
  constructor(private http: HttpClient,
              private env: EnvService) { }
  getResumeProductsFavorites(userId: string): Observable<any> {
    const urlResumeFavs = `${this.env.apiGatewayFront}${constants.config.ResumeFavoriteItems}userId=${userId}`;
    return this.http.get(urlResumeFavs);
  }
}
