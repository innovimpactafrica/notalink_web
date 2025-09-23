import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { 
  CaseType, 
  CaseTypeRequest, 
  RequiredDocument  
} from '../../shared/interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class CaseTypeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/case-types`;
  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Récupérer un type de dossier par ID
   * GET /case-type/{id}
   * @param id 
   * @returns
   */
  getCaseTypeById(id: string): Observable<CaseType> {
    return this.http.get<CaseType>(
      `${this.apiUrl}/${id}`, this.httpOptions
    );
  }

  /**
   * Mettre à jour un type de dossier
   * PUT /case-type/{id}
   * @param id 
   * @returns
   */
  updateCaseType(
    id: string, 
    request: CaseTypeRequest
  ): Observable<CaseType> {
    return this.http.put<CaseType>(
      `${this.apiUrl}/${id}`,
      request, this.httpOptions
    );
  }

  /**
   * Supprimer un type de dossier
   * DELETE /case-type/{id}
   * @param id 
   * @returns
   */
  deleteCaseType(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`, this.httpOptions
    );
  }

  /**
   * Créer un nouveau type de dossier
   * POST /case-type/
   * @returns
   */
  createCaseType(request: CaseTypeRequest): Observable<CaseType> {
    return this.http.post<CaseType>(
      this.apiUrl,
      request, this.httpOptions
    );
  }

  /**
   * Récupérer tous les types de dossiers
   * GET /case-type/
   * @returns
   */
  getAllCaseTypes(): Observable<CaseType[]> {
    return this.http.get<CaseType[]>(this.apiUrl, this.httpOptions);
  }

  /**
   * Ajouter un document requis à un type de dossier
   * POST /case-type/{caseTypeId}/required-documents
   * @returns
   */
  addRequiredDocument(
    caseTypeId: string, 
    documentName: string
  ): Observable<RequiredDocument> {
    const params = new HttpParams().set('documentName', documentName);

    return this.http.post<RequiredDocument>(
      `${this.apiUrl}/${caseTypeId}/required-documents`,
      null,
      { ...this.httpOptions ,params }
    );
  }

  /**
   * Récupérer les documents requis pour un type de dossier
   * GET /case-type/required-documents/case-type/{caseTypeId}
   * @param caseTypeId 
   * @returns
   */
  getRequiredDocuments(caseTypeId: string): Observable<RequiredDocument[]> {
    return this.http.get<RequiredDocument[]>(
      `${this.apiUrl}/required-documents/case-type/${caseTypeId}`, this.httpOptions
    );
  }

  /**
   * Supprimer un document requis d'un type de dossier
   * DELETE /case-type/{caseTypeId}/required-documents/{documentId}
   * @param caseTypeId 
   * @param documentId 
   * @returns
   */
  removeRequiredDocument(
    caseTypeId: string, 
    documentId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${caseTypeId}/required-documents/${documentId}`, this.httpOptions
    );
  }
}