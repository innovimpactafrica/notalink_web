import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { 
  UserDocument, 
  UserDocumentRequest, 
  DocumentStatusUpdate 
} from '../../shared/interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class UserDocumentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user/documents`;
  private readonly httpOptions = {
    withCredentials: true
  };

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

    return this.http.put<UserDocument>(
      `${this.apiUrl}/${documentId}`,
      formData, 
      this.httpOptions
    );
  }

  /**
   * Supprimer un document utilisateur
   * DELETE /user/documents/{documentId}
   * @param documentId 
   * @returns
   */
  deleteUserDocument(documentId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${documentId}`, 
      this.httpOptions
    );
  }

  /**
   * Mettre à jour le statut d'un document
   * PUT /user/documents/user-documents/status
   * @returns
   */
  updateDocumentStatus(request: DocumentStatusUpdate): Observable<UserDocument> {
    return this.http.put<UserDocument>(
      `${this.apiUrl}/user-documents/status`,
      request, 
      this.httpOptions
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

    return this.http.post<UserDocument>(
      `${this.apiUrl}/upload`,
      formData, 
      this.httpOptions
    );
  }

  /**
   * Récupérer les documents d'un utilisateur
   * GET /user/documents/{userID}
   * @param userId 
   * @returns
   */
  getUserDocuments(userId: string): Observable<UserDocument[]> {
    return this.http.get<UserDocument[]>(
      `${this.apiUrl}/${userId}`
    );
  }
}