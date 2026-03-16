import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggedInUser, LoginToken, User } from '../../types/user.type';
import { toObservable } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class UserService {

  private isAuthenticated = signal<boolean>(false);
  private loggedInUserInfo = signal<LoggedInUser>({} as LoggedInUser);
  private autoLogoutTimer: any;
  private authToken: string = '';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Only load token if we are running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadToken();
    }
  }

  get isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }

  get isUserAuhtenticated$(): Observable<boolean> {
    return toObservable(this.isAuthenticated);
  }

  get loggedInUserInfo$(): Observable<LoggedInUser> {
    return toObservable(this.loggedInUserInfo);
  }

  get loggedInUser(): LoggedInUser {
    return this.loggedInUserInfo();
  }

  get token(): string {
    return this.authToken;
  }
  createUser(user: User): Observable<any> {
    const url = 'http://localhost:5001/users/signup';
    return this.http.post<any>(url, {
      firstname: user.firstName,
      lastname: user.lastName,
      address: user.address,
      city: user.city,
      state: user.state,
      pin: user.pin,
      email: user.email,
      password: user.password,
    });
  }

  login(email: string, password: string): Observable<any> {
    const url = 'http://localhost:5001/users/login';
    return this.http.post<any>(url, { email: email, password: password });
  }

  activateToken(token: LoginToken): void {
    const firstName = token.user.firstName ?? (token.user as any).firstname ?? '';
    const lastName = token.user.lastName ?? (token.user as any).lastname ?? '';

    localStorage.setItem('token', token.token);
    localStorage.setItem('expiry', (Date.now() + token.expiresInSeconds * 1000).toString());
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('email', token.user.email);
    localStorage.setItem('address', token.user.address);
    localStorage.setItem('city', token.user.city);
    localStorage.setItem('state', token.user.state);
    localStorage.setItem('pin', token.user.pin);

    this.authToken = token.token;

    this.loggedInUserInfo.set({ ...token.user, firstName, lastName });
    this.isAuthenticated.set(true);

    this.setAutoLogoput(token.expiresInSeconds);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.loggedInUserInfo.set({} as LoggedInUser);
    this.isAuthenticated.set(false);
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (!token || !expiry) {
      return false;
    }
    return Date.now() < parseInt(expiry, 10);
  }
  
  private setAutoLogoput(expiryTimeInSeconds: number): void {
    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, expiryTimeInSeconds * 1000);
  }


  loadToken(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return; // Do nothing on the server
    }

    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    const expiresInSeconds = expiry ? (parseInt(expiry, 10) - Date.now()) / 1000 : 0;
    if (token && expiry && expiresInSeconds > 0) {
      const firstName = localStorage.getItem('firstName') ?? '';
      const lastName = localStorage.getItem('lastName') ?? '';
      const email = localStorage.getItem('email') ?? '';
      const address = localStorage.getItem('address') ?? '';
      const city = localStorage.getItem('city') ?? '';
      const state = localStorage.getItem('state') ?? '';
      const pin = localStorage.getItem('pin') ?? '';

      const user: LoggedInUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        address: address,
        city: city,
        state: state,
        pin: pin,
      };
      this.authToken = token;
      this.loggedInUserInfo.set(user);
      this.isAuthenticated.set(true);
      this.setAutoLogoput(expiresInSeconds);
    } else {
      this.logout();
    }
  }

}
