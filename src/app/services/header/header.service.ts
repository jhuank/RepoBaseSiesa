import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { EnvService } from '@core/services/env/env.service';
import {constants} from '../../../config/app.constants';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    private contentHeader: any = {};

    constructor(private http: HttpClient,
                private env: EnvService) {
    }
}
