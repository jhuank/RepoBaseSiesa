import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(@Optional() @Inject(REQUEST) protected request?: Request) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const serverReq: HttpRequest<any> = req;

        return next.handle(serverReq);
    }
}