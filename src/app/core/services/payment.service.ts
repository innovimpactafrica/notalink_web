import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Payment, 
  PaymentRequest, 
  PaymentKPI,
  PaginationParams 
} from '../../shared/interfaces/models.interface';
import { 
  ApiResponse, 
  PaginatedResponse,
} from '../../shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/payments`;
  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Mettre à jour un paiement
   * PUT /payments/{id}
   * @param id 
   * @returns
   */
  updatePayment(
    id: string, 
    request: PaymentRequest
  ): Observable<ApiResponse<Payment>> {
    return this.http.put<ApiResponse<Payment>>(
      `${this.apiUrl}/${id}`,
      request, 
      this.httpOptions
    );
  }

  /**
   * Supprimer un paiement
   * DELETE /payments/{id}
   * @param id 
   * @returns
   */
  deletePayment(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${id}`, 
      this.httpOptions
    );
  }

  /**
   * Créer un nouveau paiement
   * POST /payments/
   * @returns
   */
  createPayment(request: PaymentRequest): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(
      this.apiUrl,
      request, 
      this.httpOptions
    );
  }

  /**
   * Récupérer les KPI des paiements pour un cabinet
   * GET /payments/kpi/cabinet/{cabinetId}
   * @param cabinetId 
   * @param start 
   * @param end 
   * @returns
   */
  getPaymentKPIByCabinet(
    cabinetId: string, 
    start: string, 
    end: string
  ): Observable<ApiResponse<PaymentKPI>> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);

    return this.http.get<ApiResponse<PaymentKPI>>(
      `${this.apiUrl}/kpi/cabinet/${cabinetId}`,
      { ...this.httpOptions, params }
    );
  }

  /**
   * Récupérer les paiements par dossier
   * GET /payments/case-file/{caseFileId}
   * @param caseFileId 
   * @param paginationParams 
   * @returns
   */
  getPaymentsByCaseFile(
    caseFileId: string, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<Payment>> {
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<Payment>>(
      `${this.apiUrl}/case-file/${caseFileId}`,
      { ...this.httpOptions ,params }
    );
  }
}