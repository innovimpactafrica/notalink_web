// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  const publicUrls = [
    '/auth/signin',
    '/auth/signup',
    '/auth/refresh',
    '/auth/password/reset'
  ];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  // Toujours inclure les credentials (cookies HttpOnly)
  const authReq = req.clone({ withCredentials: true });

  console.log('➡️ FINAL REQUEST (SESSION MODE):', {
    url: authReq.url,
    method: authReq.method,
    headers: authReq.headers.keys().map(k => ({ [k]: authReq.headers.get(k) })),
    body: authReq.body,
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401 && !isPublicUrl) {
        console.warn('❌ Session expired or unauthorized, logging out');
        authService.logout().subscribe();
        return EMPTY;
      }
      return throwError(() => error);
    })
  );
};
