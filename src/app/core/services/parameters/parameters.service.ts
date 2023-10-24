import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { constants } from 'src/config/app.constants';

import { ICompany } from '@core/models/company.model';
import { IPage } from '@core/models/page.model';
import { EnvService } from '../env/env.service';

const { PAGE_PARAMS, COMPANY_PARAMS, STORAGE_CLIENT_NAME } = constants.storage;
const { getPageParameters, getCompanyParameters } = constants.config;

@Injectable({ providedIn: 'root' })
export class ParametersService {
  private pageParamsSubject = new BehaviorSubject<IPage>(null);
  private companyParamsSubject = new BehaviorSubject<ICompany>(null);
  private customParamsSubject = new BehaviorSubject<any>(null);
  public page$ = this.pageParamsSubject.asObservable();
  public company$ = this.companyParamsSubject.asObservable();
  public custom$ = this.customParamsSubject.asObservable();

  constructor(
    private envService: EnvService,
    private http: HttpClient
  ) {}

  get page(): IPage {
    return this.pageParamsSubject.value;
  }

  get company(): ICompany {
    return this.companyParamsSubject.value;
  }

  setClient() {
    if (this.envService.isBrowser) {
      const clientNameInStorage = localStorage.getItem(STORAGE_CLIENT_NAME);

      if (clientNameInStorage) {
        if (clientNameInStorage === this.envService.clientName) {
          return;
        }

        localStorage.clear();
      }

      localStorage.setItem(STORAGE_CLIENT_NAME, this.envService.clientName);
    }
  }

  setPageParams(pageParams: IPage, storage: boolean = false) {
    this.pageParamsSubject.next(pageParams);

    if (this.envService.isBrowser && !storage && this.envService.environment.saveParametersInStorage) {
      localStorage.setItem(PAGE_PARAMS, JSON.stringify(pageParams));
    }
  }

  setCompanyParams(companyParams: ICompany, storage: boolean = false) {
    this.companyParamsSubject.next(companyParams);

    if (this.envService.isBrowser && !storage && this.envService.environment.saveParametersInStorage) {
      localStorage.setItem(COMPANY_PARAMS, JSON.stringify(companyParams));
    }
  }

  /**
   * Obtiene los parámetros generales de la aplicación
   */
  getPageParameters(): Observable<IPage> {
    if (this.envService.isBrowser) {
      const pageParameterInStorage = localStorage.getItem(PAGE_PARAMS);

      if (pageParameterInStorage && this.envService.environment.saveParametersInStorage) {
        const pageParameters = JSON.parse(pageParameterInStorage);

        this.setPageParams(pageParameters, true);

        return of(pageParameters);
      } else if (!this.envService.environment.saveParametersInStorage) {
        localStorage.removeItem(PAGE_PARAMS);
      }
    }

    return this.http.get<IPage>(`${this.envService.apiGatewayFront}/${getPageParameters}`)
      .pipe(tap(page => this.setPageParams(page)));
  }

  /**
   * Obtiene los parámetros de la compañía de la aplicación
   */
  getCompanyParameters(): Observable<ICompany> {
    if (this.envService.isBrowser) {
      const companyParameterInStorage = localStorage.getItem(COMPANY_PARAMS);

      if (companyParameterInStorage && this.envService.environment.saveParametersInStorage) {
        const companyParameters = JSON.parse(companyParameterInStorage);

        this.setCompanyParams(companyParameters, true);

        return of(companyParameters);
      } else if (!this.envService.environment.saveParametersInStorage) {
        localStorage.removeItem(COMPANY_PARAMS);
      }
    }

    return this.http.get<ICompany>(`${this.envService.apiGatewayFront}/${getCompanyParameters}`, {
      params: {
        slug: this.envService.clientName
      }
    }).pipe(tap(company => this.setCompanyParams(company)));
  }

  setSingleParamInStorage(paramName: string, value: any) : void {

    if (this.envService.isBrowser) {

      localStorage.setItem(paramName, JSON.stringify(value));
      this.customParamsSubject.next(value);

    }
  }

  getSingleParamInStorage(paramName: string, value: any) : Observable<Object> {

    if (this.envService.isBrowser) {

      const singleParam = localStorage.getItem(paramName);
      const singleParamParse = JSON.parse(singleParam);
      return of(singleParamParse);
      
    }
  }
}
