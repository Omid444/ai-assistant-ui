import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // آدرس FastAPI backend
  private tokenKey = 'auth_token';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  /** بررسی وجود توکن */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /** لاگین */
  login(username: string, password: string): Observable<LoginResponse> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      body.toString(),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      }
    ).pipe(
      tap((res) => {
        if (res && res.access_token) {
          localStorage.setItem(this.tokenKey, res.access_token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  /** گرفتن توکن */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** لاگ‌اوت */
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  /** بررسی لاگین بودن */
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
  signup(data: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
}
