import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { APP_CONSTANTS, APP_HELPERS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly fileUrl = environment.apiFileUrl;

  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  private readonly httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders(this.defaultHeaders)
  };

  /**
   * Constructs the full API URL with optional parameters
   * @param endpoint API endpoint from APP_CONSTANTS
   * @param params Optional parameters to replace in the endpoint
   * @param isFileUrl Whether to use the file URL base
   */
  private buildUrl(endpoint: string, params: Record<string, string | number> = {}, isFileUrl: boolean = false): string {
    const base = isFileUrl ? this.fileUrl : this.baseUrl;
    const path = APP_HELPERS.buildUrl(endpoint, params);
    return `${base}/${path}`.replace(/\/+/g, '/');
  }

  /**
   * Handles HTTP errors
   * @param error The HTTP error response
   */
  private handleError(error: any): Observable<never> {
    const errorMessage = APP_HELPERS.getErrorMessage(error.status);
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      originalError: error
    }));
  }

  /**
   * Builds HTTP parameters
   * @param params Key-value pairs for query parameters
   */
  private buildParams(params: Record<string, any> = {}): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  /**
   * Generic request method
   * @param method HTTP method (GET, POST, PUT, PATCH, DELETE)
   * @param endpoint API endpoint
   * @param options Request options (body, params, isFileUrl, custom headers)
   */
  private request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    options: {
      body?: any;
      params?: Record<string, any>;
      isFileUrl?: boolean;
      headers?: Record<string, string>;
      timeoutDuration?: number;
    } = {}
  ): Observable<T> {
    const { body, params, isFileUrl = false, headers, timeoutDuration } = options;
    
    const url = this.buildUrl(endpoint, params || {}, isFileUrl);
    const requestOptions = {
      ...this.httpOptions,
      headers: new HttpHeaders({
        ...this.defaultHeaders,
        ...headers
      }),
      params: this.buildParams(params || {})
    };

    let request$: Observable<T>;

    switch (method.toUpperCase()) {
      case 'GET':
        request$ = this.http.get<T>(url, requestOptions);
        break;
      case 'POST':
        request$ = this.http.post<T>(url, body, requestOptions);
        break;
      case 'PUT':
        request$ = this.http.put<T>(url, body, requestOptions);
        break;
      case 'PATCH':
        request$ = this.http.patch<T>(url, body, requestOptions);
        break;
      case 'DELETE':
        request$ = this.http.delete<T>(url, requestOptions);
        break;
      default:
        return throwError(() => new Error('Unsupported HTTP method'));
    }

    return request$.pipe(
      timeout(timeoutDuration || APP_CONSTANTS.REQUEST_TIMEOUT.DEFAULT),
      catchError(this.handleError)
    );
  }

  /**
   * Performs a GET request
   */
  get<T>(endpoint: string, params: Record<string, any> = {}, isFileUrl: boolean = false): Observable<T> {
    return this.request<T>('GET', endpoint, { params, isFileUrl });
  }

  /**
   * Performs a POST request
   */
  post<T>(endpoint: string, body: any, params: Record<string, any> = {}, isFileUrl: boolean = false): Observable<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>('POST', endpoint, {
      body, 
      params, 
      isFileUrl,
    });
  }

  /**
   * Performs a PUT request
   */
  put<T>(endpoint: string, body: any, params: Record<string, any> = {}, isFileUrl: boolean = false): Observable<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>('PUT', endpoint, { 
      body, 
      params, 
      isFileUrl,
    });
  }

  /**
   * Performs a PATCH request
   */
  patch<T>(endpoint: string, body: any, params: Record<string, any> = {}, isFileUrl: boolean = false): Observable<T> {
    return this.request<T>('PATCH', endpoint, { body, params, isFileUrl });
  }

  /**
   * Performs a DELETE request
   */
  delete<T>(endpoint: string, params: Record<string, any> = {}, isFileUrl: boolean = false): Observable<T> {
    return this.request<T>('DELETE', endpoint, { params, isFileUrl });
  }
}