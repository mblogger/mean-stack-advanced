import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthModel } from './auth.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthModel = { email: email, password: password };
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthModel = { email: email, password: password };
    this.http.post<{ token: string }>('http://localhost:3000/api/user/login', authData)
    .subscribe(response => {
      this.token = response.token;
      this.authStatusListener.next(true);
    });
  }
}
