import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { EnvService } from '@core/services/env/env.service';
import {constants} from '../../../config/app.constants';

@Injectable({
    providedIn: 'root'
})
export class PasswordService {

    private url: string;
    private contenidoIntro: any = {};
    private contenidoTips: any = {};

    constructor(private http: HttpClient,
                private env: EnvService) {
    }

    recoveryPassword(email: string) {
        const url = this.env.apiGatewayFront + constants.config.recoverPassword;
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/form-data');
        const body: FormData = new FormData();

        body.append('email', email);

        return this.http.post(url, body, {headers});
    }

    contentIntro(location: string) {
        const urlCms = this.env.apiGatewayFront + constants.config.getContentCms + `=${location}`;
        this.contenidoIntro = this.http.get(urlCms);
        return this.contenidoIntro;
    }

    contentTips(location: string) {
        const urlCms = this.env.apiGatewayFront + constants.config.getContentCms + `=${location}`;
        this.contenidoTips = this.http.get(urlCms);
        return this.contenidoTips;
    }

}
