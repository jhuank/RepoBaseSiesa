import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppEnvironment } from '@core/models/environment.model';
import { constants } from '@config/app.constants';

@Injectable({
  providedIn: 'root',
  // useFactory: () => {
  //   // Read environment variables from browser window
  //   const browserWindow = window || {};
  //   const browserWindowEnv = browserWindow['__env'] || {};

  //   // Assign environment variables from browser window to env
  //   // In the current implementation, properties from env.js overwrite defaults from the EnvService.
  //   // If needed, a deep merge can be performed here to merge properties instead of overwriting them.
  //   for (const key in browserWindowEnv) {
  //     if (browserWindowEnv.hasOwnProperty(key)) {
  //       this[key] = window['__env'][key];
  //     }
  //   }
  //   this.isProduction = environment.production;
  //   this.enableDebug = !environment.production;

  //   return this;
  // }
})
export class EnvService {
  public environment: AppEnvironment;

  // Client
  public customCss: string;
  public siteKeyCaptcha: string;

  // Environment
  public isBrowser: boolean;
  public isServer: boolean;
  public isProduction: boolean;
  public enableDebug: boolean;
  public storage: any;

  constructor(
    private http: HttpClient
  ) {}

  getEnvironmentConfig(): Observable<AppEnvironment> {
    return this.http.get<AppEnvironment>(constants.APP_RUNTIME_CONFIG);
  }

  setEnvironmentConfig(environment: AppEnvironment) {
    this.environment = environment;
  }

  get clientName(): string {
    return this.environment?.clientName;
  }

  get apiGatewayFront(): string {
    return this.environment?.apiGatewayFront;
  }

  get apiGatewayBackOffice(): string {
    return this.environment?.apiGatewayBackOffice;
  }
}
