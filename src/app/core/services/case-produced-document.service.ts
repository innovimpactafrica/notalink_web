import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
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

@Injectable({
  providedIn: 'root'
})
export class CaseProducedDocumentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/case-produced-documents`;
  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Récupérer tous les types de documents
   * GET /case-produced-documents/types
   * @param paginationParams
   * @returns
   */
  getDocumentTypes(paginationParams?: PaginationParams): Observable<PaginatedResponse<CaseProducedDocumentType>> {
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<CaseProducedDocumentType>>(
      `${this.apiUrl}/types`,
      { ...this.httpOptions, params }
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
    const params = new HttpParams().set('status', status);

    return this.http.put<CaseProducedDocument>(
      `${this.apiUrl}/${id}/status`,
      null,
      { ...this.httpOptions, params }
    );
  }

  /**
   * Récupérer un type de document par ID
   * GET /case-produced-documents/types/{id}
   * @param id
   * @returns
   */
  getDocumentTypeById(id: string): Observable<CaseProducedDocumentType> {
    return this.http.get<CaseProducedDocumentType>(
      `${this.apiUrl}/types/${id}`, this.httpOptions
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
    return this.http.put<CaseProducedDocumentType>(
      `${this.apiUrl}/types/${id}`, 
      request, this.httpOptions
    );
  }

  /**
   * Supprimer un type de document
   * DELETE /case-produced-documents/types/{id}
   * @param id
   * @returns
   */
  deleteDocumentType(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/types/${id}`, this.httpOptions
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
    return this.http.post<CaseProducedDocumentType>(
      `${this.apiUrl}/types`,
      request, this.httpOptions
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

    return this.http.post<CaseProducedDocument>(
      `${this.apiUrl}/save`,
      formData, this.httpOptions
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
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<CaseProducedDocument>>(
      `${this.apiUrl}/client/${clientId}/pending-signatures`,
      { ...this.httpOptions, params }
    );
  }

  /**
   * Récupérer les KPI des documents pour un client
   * GET /case-produced-documents/client/{clientId}/kpi
   * @param clientId
   * @returns
   */
  getClientDocumentKPI(clientId: string): Observable<CaseProducedDocumentKPI> {
    return this.http.get<CaseProducedDocumentKPI>(
      `${this.apiUrl}/client/${clientId}/kpi`, this.httpOptions
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
    let params = new HttpParams();
    
    if (typeId) {
      params = params.set('typeId', typeId);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<CaseProducedDocument>>(
      `${this.apiUrl}/case-file/${caseFileId}`,
      { ...this.httpOptions, params }
    );
  }

  /**
   * Récupérer les KPI des documents pour un dossier
   * GET /case-produced-documents/case-file/{caseFileId}/kpi
   * @param caseFileId
   * @returns
   */
  getCaseFileDocumentKPI(caseFileId: string): Observable<CaseProducedDocumentKPI> {
    return this.http.get<CaseProducedDocumentKPI>(
      `${this.apiUrl}/case-file/${caseFileId}/kpi`, this.httpOptions
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
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<CaseProducedDocument>>(
      `${this.apiUrl}/cabinet/${cabinetId}/urgent-signatures`,
      { ...this.httpOptions, params }
    );
  }

  /**
   * Récupérer les KPI des documents pour un cabinet
   * GET /case-produced-documents/cabinet/{cabinetId}/kpi
   * @param cabinetId
   * @returns
   */
  getCabinetDocumentKPI(cabinetId: string): Observable<CaseProducedDocumentKPI> {
    return this.http.get<CaseProducedDocumentKPI>(
      `${this.apiUrl}/cabinet/${cabinetId}/kpi`, this.httpOptions
    );
  }

  /**
   * Supprimer un document produit
   * DELETE /case-produced-documents/{id}
   * @param id
   * @returns
   */
  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`, this.httpOptions
    );
  }
}