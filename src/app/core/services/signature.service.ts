import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SignFormRequest } from '../../shared/interfaces/models.interface';
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  private readonly apiService = inject(ApiService);

  /**
   * Signer un formulaire avec URL
   * POST /signature/sign-form-url
   * @returns
   */
  signFormWithUrl(request: SignFormRequest): Observable<any> {
    const formData = new FormData();
    formData.append('signatureFile', request.signatureFile);

    return this.apiService.post<any>(
      APP_CONSTANTS.API_ENDPOINTS.SIGNATURE.SIGN_FORM_URL,
      formData,
      {
        pdfUrl: request.pdfUrl,
        page: request.page,
        x: request.x,
        y: request.y,
        width: request.width,
        height: request.height
      }
    );
  }
}