import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // reporter l'appel pour éviter NG0100
  setTimeout(() => loadingService.show());

  return next(req).pipe(
    finalize(() => {
      setTimeout(() => loadingService.hide());
    })
  );
};
