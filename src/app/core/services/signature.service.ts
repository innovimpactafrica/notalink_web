import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { SignFormRequest } from '../../shared/interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/signature`;
  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Signer un formulaire avec URL
   * POST /signature/sign-form-url
   * @returns
   */
  signFormWithUrl(request: SignFormRequest): Observable<any> {
    const params = new HttpParams()
      .set('pdfUrl', request.pdfUrl)
      .set('page', request.page.toString())
      .set('x', request.x.toString())
      .set('y', request.y.toString())
      .set('width', request.width.toString())
      .set('height', request.height.toString());

    const formData = new FormData();
    formData.append('signatureFile', request.signatureFile);

    return this.http.post<any>(
      `${this.apiUrl}/sign-form-url`,
      formData,
      { ...this.httpOptions ,params }
    );
  }
}