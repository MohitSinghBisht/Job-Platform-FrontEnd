import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            const user: User = {
              id: response.id,
              username: response.username,
              email: response.email,
              firstName: response.firstName,
              lastName: response.lastName,
              roles: response.roles,
              token: response.token
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return response;
        })
      );
  }

  register(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.includes(role);
  }

  isJobSeeker(): boolean {
    return this.hasRole('ROLE_JOB_SEEKER');
  }

  isRecruiter(): boolean {
    return this.hasRole('ROLE_RECRUITER');
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refreshtoken`, {
      refreshToken: this.currentUserValue?.refreshToken
    }).pipe(
      tap(response => {
        if (response && response.token) {
          const user = this.currentUserValue;
          if (user) {
            user.token = response.token;
            user.refreshToken = response.refreshToken;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }
        return response;
      })
    );
  }
}
