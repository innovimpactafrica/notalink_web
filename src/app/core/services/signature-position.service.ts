import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  SignaturePosition, 
  SignaturePositionRequest 
} from '../../shared/interfaces/models.interface';
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SignaturePositionService {
  private readonly apiService = inject(ApiService);

  /**
   * Récupérer les positions de signature d'un document
   * GET /documents/{documentId}/signatures
   * @param documentId 
   * @returns
   */
  getDocumentSignatures(documentId: string): Observable<SignaturePosition[]> {
    return this.apiService.get<SignaturePosition[]>(
      APP_CONSTANTS.API_ENDPOINTS.SIGNATURE_POSITION.GET_BY_DOCUMENT,
      { documentId }
    );
  }

  /**
   * Ajouter une position de signature à un document
   * POST /documents/{documentId}/signatures
   * @param documentId 
   * @returns
   */
  addSignaturePosition(
    documentId: string, 
    request: SignaturePositionRequest
  ): Observable<SignaturePosition> {
    return this.apiService.post<SignaturePosition>(
      APP_CONSTANTS.API_ENDPOINTS.SIGNATURE_POSITION.ADD,
      request,
      { documentId }
    );
  }

  /**
   * Supprimer une position de signature
   * DELETE /documents/signatures/{positionId}
   * @param positionId 
   * @returns
   */
  deleteSignaturePosition(positionId: string): Observable<void> {
    return this.apiService.delete<void>(
      APP_CONSTANTS.API_ENDPOINTS.SIGNATURE_POSITION.DELETE,
      { positionId }
    );
  }
}