import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggedInUser, LoginToken, User } from '../../types/user.type';
import { toObservable } from '@angular/core/rxjs-interop';
@Injectable()
export class UserService {

  private isAuthenticated = signal<boolean>(false);
  private loggedInUserInfo = signal<LoggedInUser>({} as LoggedInUser);

  constructor(private http: HttpClient) { }

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

    this.loggedInUserInfo.set({ ...token.user, firstName, lastName });
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (!token || !expiry) {
      return false;
    }
    return Date.now() < parseInt(expiry, 10);
  }

}
