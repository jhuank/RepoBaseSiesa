import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { constants } from '../../../../config/app.constants';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '@core/models/user.model';
import { EnvService } from '../env/env.service';

const {
  recoverPassword,
  userLogin,
  getPageParametersRegister,
  getCmsRestablecerContrasena
} = constants.config;

const { STORAGE_USER } = constants.storage;

@Injectable({
    providedIn: 'root',
})
export class AuthService {

  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public currentUser$: Observable<User> = this.userSubject.asObservable();

  constructor(
    private envService: EnvService,
    private http: HttpClient
  ) { }

  get currentUserValue(): User {
    return this.userSubject?.value;
  }

  getUser(): User | null {
    const user = this.userSubject.value;

    if (user && user.hasOwnProperty('userId')) {
      return user;
    }

    return null;
  }

  setCurrentUser(user: User): void {
    this.userSubject.next(user);

    if (this.envService.isBrowser) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    }
  }

  findAndSetUserInStorage() {
    if (this.envService.isBrowser) {
      const userInStorage = localStorage.getItem(STORAGE_USER);
      if (userInStorage) {
        this.userSubject.next(JSON.parse(userInStorage));
      }
    }
  }

  get isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  getUserId(): string {
    if (this.currentUserValue && this.currentUserValue.hasOwnProperty('userId')) {
      return this.currentUserValue.userId;
    }

    return '';
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders();
    const body: FormData = new FormData();

    headers.append('Content-Type', 'application/form-data');
    body.append('username', username);
    body.append('password', password);

    return this.http.post(`${this.envService.apiGatewayFront}${userLogin}`, body, { headers });
  }

  logout() {
    this.setCurrentUser(null);
  }

  recoveryPassword(email: string) {
    return this.http.post(`${this.envService.apiGatewayFront}/${recoverPassword}`, { email });
  }
  getParamsRegister():Observable<any>{
    return this.http.post(`${this.envService.apiGatewayFront}/${getPageParametersRegister}`, null);
  }
  getCmsRestablecerContrasena():Observable<any>{
    return this.http.post(`${this.envService.apiGatewayFront}/${getCmsRestablecerContrasena}`, null);
  }
}
