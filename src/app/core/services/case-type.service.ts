import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  CaseType, 
  CaseTypeRequest, 
  RequiredDocument  
} from '../../shared/interfaces/models.interface';
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class CaseTypeService {
  private readonly apiService = inject(ApiService);

  /**
   * Récupérer un type de dossier par ID
   * GET /case-types/{id}
   * @param id 
   * @returns
   */
  getCaseTypeById(id: string): Observable<CaseType> {
    return this.apiService.get<CaseType>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_TYPE.BY_ID,
      { id }
    );
  }

  /**
   * Mettre à jour un type de dossier
   * PUT /case-types/{id}
   * @param id 
   * @returns
   */
  updateCaseType(
    id: string, 
    request: CaseTypeRequest
  ): Observable<CaseType> {
    return this.apiService.put<CaseType>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_TYPE.UPDATE,
      request,
      { id }
    );
  }

  /**
   * Supprimer un type de dossier
   * DELETE /case-types/{id}
   * @param id 
   * @returns
   */
  deleteCaseType(id: string): Observable<void> {
    return this.apiService.delete<void>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_TYPE.DELETE,
      { id }
    );
  }

  /**
   * Créer un nouveau type de dossier
   * POST /case-types/
   * @returns
   */
  createCaseType(request: CaseTypeRequest): Observable<CaseType> {
    return this.apiService.post<CaseType>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_TYPE.CREATE,
      request
    );
  }

  /**
   * Récupérer tous les types de dossiers
   * GET /case-types/
   * @returns
   */
  getAllCaseTypes(): Observable<CaseType[]> {
    return this.apiService.get<CaseType[]>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_TYPE.ALL
    );
  }

  /**
   * Ajouter un document requis à un type de dossier
   * POST /case-types/{caseTypeId}/required-documents
   * @returns
   */
  addRequiredDocument(
    caseTypeId: string, 
    documentName: string
  ): Observable<RequiredDocument> {
    return this.apiService.post<RequiredDocument>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_TYPE.ADD_REQUIRED_DOCUMENT,
      null,
      { caseTypeId, documentName }
    );
  }

  /**
   * Récupérer les documents requis pour un type de dossier
   * GET /case-types/required-documents/case-type/{caseTypeId}
   * @param caseTypeId 
   * @returns
   */
  getRequiredDocuments(caseTypeId: string): Observable<RequiredDocument[]> {
    return this.apiService.get<RequiredDocument[]>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_TYPE.GET_REQUIRED_DOCUMENTS,
      { caseTypeId }
    );
  }

  /**
   * Supprimer un document requis d'un type de dossier
   * DELETE /case-types/{caseTypeId}/required-documents/{documentId}
   * @param caseTypeId 
   * @param documentId 
   * @returns
   */
  removeRequiredDocument(
    caseTypeId: string, 
    documentId: string
  ): Observable<void> {
    return this.apiService.delete<void>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_TYPE.REMOVE_REQUIRED_DOCUMENT,
      { caseTypeId, documentId }
    );
  }
}