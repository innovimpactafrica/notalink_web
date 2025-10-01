import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  CaseProducedDocument, 
  CaseProducedDocumentType, 
  CaseProducedDocumentTypeRequest, 
  CaseProducedDocumentRequest, 
  CaseProducedDocumentKPI, 
  ProducedDocumentStatus, 
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
export class CaseProducedDocumentService {
  private readonly apiService = inject(ApiService);

  /**
   * Récupérer tous les types de documents
   * GET /case-produced-documents/document-types/all
   */
  getDocumentTypes(): Observable<CaseProducedDocumentType[]> {
    return this.apiService.get<CaseProducedDocumentType[]>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.DOCUMENT_TYPES
    );
  }

  /**
   * Mettre à jour le statut d'un document produit
   * PUT /case-produced-documents/{id}/status
   * @param id
   * @param status
   * @returns
   */
  updateDocumentStatus(
    id: string, 
    status: ProducedDocumentStatus
  ): Observable<CaseProducedDocument> {
    return this.apiService.put<CaseProducedDocument>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.UPDATE_STATUS,
      null,
      { id, status }
    );
  }

  /**
   * Récupérer un type de document par ID
   * GET /case-produced-documents/types/{id}
   * @param id
   * @returns
   */
  getDocumentTypeById(id: string): Observable<CaseProducedDocumentType> {
    return this.apiService.get<CaseProducedDocumentType>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.TYPE_BY_ID,
      { id }
    );
  }

  /**
   * Mettre à jour un type de document
   * PUT /case-produced-documents/types/{id}
   * @param id
   * @returns
   */
  updateDocumentType(
    id: string, 
    request: CaseProducedDocumentTypeRequest
  ): Observable<CaseProducedDocumentType> {
    return this.apiService.put<CaseProducedDocumentType>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.UPDATE_TYPE,
      request,
      { id }
    );
  }

  /**
   * Supprimer un type de document
   * DELETE /case-produced-documents/types/{id}
   * @param id
   * @returns
   */
  deleteDocumentType(id: string): Observable<void> {
    return this.apiService.delete<void>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.DELETE_TYPE,
      { id }
    );
  }

  /**
   * Créer un nouveau type de document
   * POST /case-produced-documents/types
   * @returns
   */
  createDocumentType(
    request: CaseProducedDocumentTypeRequest
  ): Observable<CaseProducedDocumentType> {
    return this.apiService.post<CaseProducedDocumentType>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.CREATE_TYPE,
      request
    );
  }

  /**
   * Sauvegarder un document produit
   * POST /case-produced-documents/save
   * @returns
   */
  saveDocument(request: CaseProducedDocumentRequest): Observable<CaseProducedDocument> {
    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('caseFileId', request.caseFileId);
    formData.append('file', request.file);
    formData.append('documentTypeId', request.documentTypeId);

    return this.apiService.post<CaseProducedDocument>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.SAVE,
      formData
    );
  }

  /**
   * Récupérer les documents en attente de signature pour un client
   * GET /case-produced-documents/client/{clientId}/pending-signatures
   * @param clientId
   * @param paginationParams
   * @returns
   */
  getPendingSignaturesByClient(
    clientId: string, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<CaseProducedDocument>> {
    return this.apiService.get<PaginatedResponse<CaseProducedDocument>>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.PENDING_SIGNATURES_BY_CLIENT,
      { clientId, ...paginationParams }
    );
  }

  /**
   * Récupérer les KPI des documents pour un client
   * GET /case-produced-documents/client/{clientId}/kpi
   * @param clientId
   * @returns
   */
  getClientDocumentKPI(clientId: string): Observable<CaseProducedDocumentKPI> {
    return this.apiService.get<CaseProducedDocumentKPI>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.KPI_BY_CLIENT,
      { clientId }
    );
  }

  /**
   * Récupérer les documents d'un dossier
   * GET /case-produced-documents/case-file/{caseFileId}
   * @param caseFileId
   * @param typeId
   * @param status
   * @param paginationParams
   * @returns
   */
  getDocumentsByCaseFile(
    caseFileId: string, 
    typeId?: string, 
    status?: ProducedDocumentStatus, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<CaseProducedDocument>> {
    return this.apiService.get<PaginatedResponse<CaseProducedDocument>>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.BY_CASE_FILE,
      { caseFileId, typeId, status, ...paginationParams }
    );
  }

  /**
   * Récupérer les KPI des documents pour un dossier
   * GET /case-produced-documents/case-file/{caseFileId}/kpi
   * @param caseFileId
   * @returns
   */
  getCaseFileDocumentKPI(caseFileId: string): Observable<CaseProducedDocumentKPI> {
    return this.apiService.get<CaseProducedDocumentKPI>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.KPI_BY_CASE_FILE,
      { caseFileId }
    );
  }

  /**
   * Récupérer les signatures urgentes pour un cabinet
   * GET /case-produced-documents/cabinet/{cabinetId}/urgent-signatures
   * @param cabinetId
   * @param paginationParams
   * @returns
   */
  getUrgentSignaturesByCabinet(
    cabinetId: string, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<CaseProducedDocument>> {
    return this.apiService.get<PaginatedResponse<CaseProducedDocument>>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.URGENT_SIGNATURES_BY_CABINET,
      { cabinetId, ...paginationParams }
    );
  }

  /**
   * Récupérer les KPI des documents pour un cabinet
   * GET /case-produced-documents/cabinet/{cabinetId}/kpi
   * @param cabinetId
   * @returns
   */
  getCabinetDocumentKPI(cabinetId: string): Observable<CaseProducedDocumentKPI> {
    return this.apiService.get<CaseProducedDocumentKPI>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.KPI_BY_CABINET,
      { cabinetId }
    );
  }

  /**
   * Supprimer un document produit
   * DELETE /case-produced-documents/{id}
   * @param id
   * @returns
   */
  deleteDocument(id: string): Observable<void> {
    return this.apiService.delete<void>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_PRODUCED_DOCUMENT.DELETE,
      { id }
    );
  }
}