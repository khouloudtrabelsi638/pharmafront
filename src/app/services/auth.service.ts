import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { AgentCreated } from '../models/agent-created.model';
import { LoginResponse } from '../models/login-response';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5365/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request)
      .pipe(
        tap(response => {
          if (response && response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('id', String(response.id));

          }
        })
      );
  }

  register(request: RegisterRequest): Observable<AgentCreated> {
    return this.http.post<AgentCreated>(`${this.baseUrl}/register`, request);
  }

  logout(code: string): Observable<any> {
    // Appelle l'API backend pour la déconnexion :
    return this.http.post(`${this.baseUrl}/logout?code=${encodeURIComponent(code)}`, {})
      .pipe(
        tap(() => {
          sessionStorage.removeItem('token');
        })
      );
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getCurrentAgent(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }
}
