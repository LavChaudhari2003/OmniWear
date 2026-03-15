import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../types/user.type';
@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<any> {
    const url = 'http://localhost:5001/users/signup';
    return this.http.post<any>(url, user);
  }

}
