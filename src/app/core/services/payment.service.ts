import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  Payment, 
  PaymentRequest, 
  PaymentKPI,
  PaginationParams 
} from '../../shared/interfaces/models.interface';
import { 
  PaginatedResponse,
} from '../../shared/interfaces/api-response.interface';
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiService = inject(ApiService);

  /**
   * Mettre à jour un paiement
   * PUT /payments/{id}
   * @param id 
   * @returns
   */
  updatePayment(
    id: string, 
    request: PaymentRequest
  ): Observable<Payment> {
    return this.apiService.put<Payment>(
      APP_CONSTANTS.API_ENDPOINTS.PAYMENT.UPDATE,
      request,
      { id }
    );
  }

  /**
   * Supprimer un paiement
   * DELETE /payments/{id}
   * @param id 
   * @returns
   */
  deletePayment(id: string): Observable<void> {
    return this.apiService.delete<void>(
      APP_CONSTANTS.API_ENDPOINTS.PAYMENT.DELETE,
      { id }
    );
  }

  /**
   * Créer un nouveau paiement
   * POST /payments/
   * @returns
   */
  createPayment(request: PaymentRequest): Observable<Payment> {
    return this.apiService.post<Payment>(
      APP_CONSTANTS.API_ENDPOINTS.PAYMENT.CREATE,
      request
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
  ): Observable<PaymentKPI> {
    return this.apiService.get<PaymentKPI>(
      APP_CONSTANTS.API_ENDPOINTS.PAYMENT.KPI_BY_CABINET,
      { cabinetId, start, end }
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
    return this.apiService.get<PaginatedResponse<Payment>>(
      APP_CONSTANTS.API_ENDPOINTS.PAYMENT.BY_CASE_FILE,
      { caseFileId, ...paginationParams }
    );
  }
}