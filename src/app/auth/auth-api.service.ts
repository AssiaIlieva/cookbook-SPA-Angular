import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

import { ErrorService } from '../shared/error.service';
import { LoggedUser } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private usersUrl = '/api/users';
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  private user$$ = new BehaviorSubject<LoggedUser | null>(
    this.getLoggedUserFromStorage()
  );
  user$ = this.user$$.asObservable();

  get isLogged(): boolean {
    return !!this.user$$.value;
  }

  getLoggedUserFromStorage(): LoggedUser | null {
    const user = localStorage.getItem('auth');
    return user ? JSON.parse(user) : null;
  }

  constructor() {
    this.user$.subscribe((user) => {
      if (user) {
        localStorage.setItem('auth', JSON.stringify(user));
      } else {
        localStorage.removeItem('auth');
      }
    });
  }

  login(email: string, password: string) {
    return this.httpClient
      .post<LoggedUser>(`${this.usersUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          this.user$$.next(response);
        }),
        catchError((error) => {
          const errorMessage =
            error.error?.message || 'Login failed. Please try again.';
          this.errorService.showError(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  register(email: string, username: string, password: string) {
    return this.httpClient
      .post<LoggedUser>(`${this.usersUrl}/register`, {
        email,
        username,
        password,
      })
      .pipe(
        tap((response) => {
          this.user$$.next(response);
        }),
        catchError((error) => {
          const errorMessage =
            error.error?.message || 'Registration failed. Please try again.';
          this.errorService.showError(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout() {
    return this.httpClient
      .get(`${this.usersUrl}/logout`, { responseType: 'text' })
      .pipe(
        tap(() => {
          this.user$$.next(null);
        }),
        catchError((error) => {
          const errorMessage =
            error.error?.message || 'Logout failed. Please try again.';
          this.errorService.showError(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
