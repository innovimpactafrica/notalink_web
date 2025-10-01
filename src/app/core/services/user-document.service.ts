import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  UserDocument, 
  UserDocumentRequest, 
  DocumentStatusUpdate 
} from '../../shared/interfaces/models.interface';
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserDocumentService {
  private readonly apiService = inject(ApiService);

  /**
   * Mettre à jour un document utilisateur
   * PUT /user/documents/{documentId}
   * @param documentId 
   * @returns
   */
  updateUserDocument(
    documentId: string, 
    request: UserDocumentRequest
  ): Observable<UserDocument> {
    const formData = new FormData();
    formData.append('userId', request.userId);
    formData.append('name', request.name);
    formData.append('file', request.file);

    return this.apiService.put<UserDocument>(
      APP_CONSTANTS.API_ENDPOINTS.USER_DOCUMENT.UPDATE,
      formData,
      { documentId }
    );
  }

  /**
   * Supprimer un document utilisateur
   * DELETE /user/documents/{documentId}
   * @param documentId 
   * @returns
   */
  deleteUserDocument(documentId: string): Observable<void> {
    return this.apiService.delete<void>(
      APP_CONSTANTS.API_ENDPOINTS.USER_DOCUMENT.DELETE,
      { documentId }
    );
  }

  /**
   * Mettre à jour le statut d'un document
   * PUT /user/documents/user-documents/status
   * @returns
   */
  updateDocumentStatus(request: DocumentStatusUpdate): Observable<UserDocument> {
    return this.apiService.put<UserDocument>(
      APP_CONSTANTS.API_ENDPOINTS.USER_DOCUMENT.STATUS,
      request
    );
  }

  /**
   * Télécharger un document
   * POST /user/documents/upload
   * @returns
   */
  uploadDocument(request: UserDocumentRequest): Observable<UserDocument> {
    const formData = new FormData();
    formData.append('userId', request.userId);
    formData.append('name', request.name);
    formData.append('file', request.file);

    return this.apiService.post<UserDocument>(
      APP_CONSTANTS.API_ENDPOINTS.USER_DOCUMENT.UPLOAD,
      formData
    );
  }

  /**
   * Récupérer les documents d'un utilisateur
   * GET /user/documents/{userId}
   * @param userId 
   * @returns
   */
  getUserDocuments(userId: string): Observable<UserDocument[]> {
    return this.apiService.get<UserDocument[]>(
      APP_CONSTANTS.API_ENDPOINTS.USER_DOCUMENT.BY_USER,
      { userId }
    );
  }
}