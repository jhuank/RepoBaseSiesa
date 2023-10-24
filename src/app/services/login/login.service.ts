import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { EnvService } from '@core/services/env/env.service';
import {constants} from '../../../config/app.constants';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private contenidoCms: any = {};

    constructor(private http: HttpClient,
                private env: EnvService) {
    }

    contentCms(ubucation: string) {
        const urlCms = this.env.apiGatewayFront + constants.config.getContentCms + `=${ubucation}`;
        this.contenidoCms = this.http.get(urlCms);
        return this.contenidoCms;
    }


    getUserInfo(userId) {
        const url = this.env.apiGatewayFront + constants.config.getUserInfo;
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/form-data');
        const body: FormData = new FormData();

        body.append('userId', userId);

        return this.http.post(url, body, {headers});
    }

}
