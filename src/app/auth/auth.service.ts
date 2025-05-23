import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../core/api.service';

// Define interfaces for type safety
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface SignupResponse {
  id: number;
  email: string;
  name: string | null;
  password: string;
}

interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_ENDPOINT = '/auth';

  constructor(private apiService: ApiService) { }

  /**
   * Authenticates a user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Observable with login response containing access token
   */
  login(email: string, password: string, shouldRedirect = true): Observable<LoginResponse> {
    // Validate inputs
    if (!email || !this.isValidEmail(email)) {
      return throwError(() => new Error('Please enter a valid email address'));
    }

    if (!password || password.length < 6) {
      return throwError(() => new Error('Password must be at least 6 characters'));
    }

    const loginData: LoginRequest = { email, password };

    return this.apiService.post<LoginResponse>(`${this.AUTH_ENDPOINT}/login`, loginData, shouldRedirect)
      .pipe(
        tap(response => {
          // Store token in localStorage or a token service
          if (response && response.access_token) {
            localStorage.setItem('access_token', response.access_token);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          // Log error if not already logged elsewhere
          console.error('Login failed:', error);

          // Format error message for UI display
          let errorMessage = 'Authentication failed';

          if (error.error && typeof error.error === 'object') {
            const apiError = error.error as ApiError;
            errorMessage = apiError.message || errorMessage;
          }

          // Propagate error for UI handling
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Registers a new user with email, password, and name
   * @param email User's email address
   * @param password User's password
   * @param name User's name
   * @returns Observable with signup response containing user details
   */
  signup(email: string, password: string, name: string): Observable<SignupResponse> {
    // Validate inputs
    if (!email || !this.isValidEmail(email)) {
      return throwError(() => new Error('Please enter a valid email address'));
    }

    if (!password || password.length < 6) {
      return throwError(() => new Error('Password must be at least 6 characters'));
    }

    // Name can be optional in the UI, but we'll pass whatever is provided
    const signupData: SignupRequest = { email, password, name };

    return this.apiService.post<SignupResponse>(`users`, signupData)
      .pipe(
        tap(response => {
          // You could automatically log the user in here if desired
          console.log('User registered successfully:', response.id);
        }),
        catchError((error: HttpErrorResponse) => {
          // Log error if not already logged elsewhere
          console.error('Signup failed:', error);

          // Format error message for UI display
          let errorMessage = 'Registration failed';

          if (error.error && typeof error.error === 'object') {
            const apiError = error.error as ApiError;
            errorMessage = apiError.message || errorMessage;
          }

          // Propagate error for UI handling
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Validates email format using regex
   * @param email Email to validate
   * @returns Boolean indicating if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Validates the current authentication token
   * @param redirectOnFailure Whether to redirect to login page on validation failure
   * @returns Observable with validation status
   */
  validateToken(redirectOnFailure: boolean = true): Observable<boolean> {
    return this.apiService.get<{ status: string }>(`${this.AUTH_ENDPOINT}/status`,
      true, redirectOnFailure
    ).pipe(
      map((response: any) => true),
      catchError((error: HttpErrorResponse) => {
        console.error('Token validation failed:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    window.location.reload();
  }
}
