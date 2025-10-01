import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FilePathInterceptor implements HttpInterceptor {
  private baseUrl = 'https://wakana.online/repertoire_notaire/';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body) {
          return event.clone({
            body: this.transformFilePaths(event.body)
          });
        }
        return event;
      })
    );
  }

  private transformFilePaths(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.transformFilePaths(item));
    } else if (data && typeof data === 'object') {
      if ('filePath' in data && data.filePath && !data.filePath.startsWith(this.baseUrl)) {
        data.filePath = this.baseUrl + data.filePath;
      }
      if (data.content && Array.isArray(data.content)) {
        data.content = data.content.map((item: any) => this.transformFilePaths(item));
      }
      for (const key in data) {
        if (data[key] && typeof data[key] === 'object') {
          data[key] = this.transformFilePaths(data[key]);
        }
      }
    }
    return data;
  }
}