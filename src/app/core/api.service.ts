import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { Observable, from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private axiosInstance: AxiosInstance;
  private readonly AUTH_TOKEN_KEY = 'access_token';
  private useAuthHeader = true; // Default to using auth headers
  private redirectOnUnauthorized = true; // Default to redirecting on 401

  constructor(private router: Router) {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      timeout: 100000,
      headers: { 'Content-Type': 'application/json' }
    });

    // Add request interceptor for auth headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Only add auth headers if enabled
        if (this.useAuthHeader) {
          const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
          if (token) {
            // Set Authorization header with Bearer token
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for 401 handling
    this.axiosInstance.interceptors.response.use(
      (response) => response, // Return successful responses as-is
      (error) => {
        // Check if it's a 401 Unauthorized error and redirection is enabled
        if (error.response?.status === 401 && this.redirectOnUnauthorized) {
          console.warn('Unauthorized access detected, redirecting to login');
          // Clear the token as it's likely invalid
          localStorage.removeItem(this.AUTH_TOKEN_KEY);
          // Redirect to login page
          this.router.navigate(['/login']);
        }
        return Promise.reject(error); // Continue with the error for further handling
      }
    );
  }

  /**
   * Enable or disable authentication headers
   * @param enable Whether to enable auth headers
   */
  setUseAuthHeader(enable: boolean): void {
    this.useAuthHeader = enable;
  }

  /**
   * Enable or disable redirection to login on 401 Unauthorized
   * @param enable Whether to enable redirection
   */
  setRedirectOnUnauthorized(enable: boolean): void {
    this.redirectOnUnauthorized = enable;
  }

  /**
   * Create a request config with optional auth header override
   * @param useAuth Override the global auth header setting for this request
   * @param redirectOnUnauth Override the global redirect setting for this request
   * @returns AxiosRequestConfig with appropriate settings
   */
  private createRequestConfig(useAuth?: boolean, redirectOnUnauth?: boolean): AxiosRequestConfig {
    // If useAuth is explicitly set, use it; otherwise use the instance setting
    const shouldUseAuth = useAuth !== undefined ? useAuth : this.useAuthHeader;

    const config: AxiosRequestConfig = {};

    // If we're explicitly disabling auth for this request when it's globally enabled,
    // we need to set a flag that our interceptor can check
    if (this.useAuthHeader && !shouldUseAuth) {
      config.headers = config.headers || {};
      config.headers['Skip-Auth'] = 'true';
    }

    // Store redirect preference in config for the response interceptor
    if (redirectOnUnauth !== undefined) {
      config.headers = config.headers || {};
      // Use a custom header to pass this information to our interceptor
      config.headers['X-Redirect-On-Unauthorized'] = redirectOnUnauth ? 'true' : 'false';
    }

    return config;
  }

  get<T>(url: string, params: Record<string, any> = {}, useAuth: boolean = true, redirectOnUnauth: boolean = true): Observable<T> {
    const config = this.createRequestConfig(useAuth, redirectOnUnauth);
    if (params) {
      config.params = params;
    }
    return from(
      this.axiosInstance.get<T>(url, config)
        .then((response: AxiosResponse<T>) => {
          console.log('API response:', response);
          return response.data
        })
        .catch((error: AxiosError) => {
          console.error('API request failed:', error);
          throw new HttpErrorResponse({
            error: error.response?.data,
            status: error.response?.status
          });
        })
    );
  }

  post<T>(url: string, data: any, useAuth: boolean = true, redirectOnUnauth: boolean = true): Observable<T> {
    return from(
      this.axiosInstance.post<T>(url, data, this.createRequestConfig(useAuth, redirectOnUnauth))
        .then((response: AxiosResponse<T>) => response.data)
        .catch(this.handleError)
    );
  }

  put<T>(url: string, data: any, useAuth?: boolean, redirectOnUnauth?: boolean): Observable<T> {
    return from(
      this.axiosInstance.put<T>(url, data, this.createRequestConfig(useAuth, redirectOnUnauth))
        .then((response: AxiosResponse<T>) => response.data)
        .catch(this.handleError)
    );
  }

  patch<T>(url: string, data: any, useAuth?: boolean, redirectOnUnauth?: boolean): Observable<T> {
    return from(
      this.axiosInstance.patch<T>(url, data, this.createRequestConfig(useAuth, redirectOnUnauth))
        .then((response: AxiosResponse<T>) => response.data)
        .catch(this.handleError)
    );
  }

  delete<T>(url: string, data?: any, useAuth?: boolean, redirectOnUnauth?: boolean): Observable<T> {
    const config = this.createRequestConfig(useAuth, redirectOnUnauth);
    if (data) {
      config.data = data;
    }

    return from(
      this.axiosInstance.delete<T>(url, config)
        .then((response: AxiosResponse<T>) => response.data)
        .catch(this.handleError)
    );
  }

  private handleError(error: AxiosError): never {
    throw new HttpErrorResponse({
      error: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
  }
}