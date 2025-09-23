import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { 
  SignaturePosition, 
  SignaturePositionRequest 
} from '../../shared/interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class SignaturePositionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/documents`;
  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Récupérer les positions de signature d'un document
   * GET /documents/{documentId}/signatures
   * @param documentId 
   * @returns
   */
  getDocumentSignatures(documentId: string): Observable<SignaturePosition[]> {
    return this.http.get<SignaturePosition[]>(
      `${this.apiUrl}/${documentId}/signatures`, 
      this.httpOptions
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
    return this.http.post<SignaturePosition>(
      `${this.apiUrl}/${documentId}/signatures`,
      request, 
      this.httpOptions
    );
  }

  /**
   * Supprimer une position de signature
   * DELETE /documents/signatures/{positionId}
   * @param positionId 
   * @returns
   */
  deleteSignaturePosition(positionId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/signatures/${positionId}`, 
      this.httpOptions
    );
  }
}