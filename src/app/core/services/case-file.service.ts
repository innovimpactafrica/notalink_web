import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { 
  CaseFile, 
  CaseFileRequest, 
  CaseFileKPI, 
  CaseFilePercentageKPI, 
  CaseFileStatus,
  PaginationParams
} from '../../shared/interfaces/models.interface';
import { PaginatedResponse } from '../../shared/interfaces/api-response.interface';
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class CaseFileService {
  private readonly apiService = inject(ApiService);

  /**
   * Mettre à jour un dossier
   * PUT /case-files/{id}
   */
  updateCaseFile(id: string, request: CaseFileRequest): Observable<CaseFile> {
    return this.apiService.put<CaseFile>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.UPDATE,
      request,
      { id }
    );
  }

  /**
   * Créer un nouveau dossier
   * POST /case-files
   */
  createCaseFile(request: CaseFileRequest): Observable<CaseFile> {
    return this.apiService.post<CaseFile>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.CREATE,
      request
    );
  }

  /**
   * Ajouter un client à un dossier
   * POST /case-files/{id}/clients/{clientId}
   */
  addClientToCaseFile(id: string, clientId: string): Observable<void> {
    return this.apiService.post<void>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.ADD_CLIENT,
      null,
      { id, clientId }
    );
  }

  /**
   * Récupérer les KPI en pourcentage pour un client
   * GET /case-files/kpi/percentage/client/{clientId}
   */
  getClientPercentageKPI(clientId: string): Observable<CaseFilePercentageKPI> {
    return this.apiService.get<CaseFilePercentageKPI>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.PERCENTAGE_KPI_BY_CLIENT,
      { clientId }
    );
  }

  /**
   * Récupérer les KPI en pourcentage pour un cabinet
   * GET /case-files/kpi/percentage/cabinet/{cabinetId}
   */
  getCabinetPercentageKPI(cabinetId: string): Observable<CaseFilePercentageKPI> {
    return this.apiService.get<CaseFilePercentageKPI>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.PERCENTAGE_KPI_BY_CABINET,
      { cabinetId }
    );
  }

  /**
   * Récupérer les dossiers d'un client
   * GET /case-files/client/{clientId}
   */
  getCaseFilesByClient(
    clientId: string, 
    status?: CaseFileStatus, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<CaseFile>> {
    return this.apiService.get<PaginatedResponse<CaseFile>>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.BY_CLIENT,
      { clientId, status, ...paginationParams }
    ).pipe(
      tap(data => console.log('Response Data (client):', data))
    );
  }

  /**
   * Récupérer les KPI des dossiers pour un client
   * GET /case-files/client/{clientId}/kpi
   */
  getClientCaseFileKPI(clientId: string): Observable<CaseFileKPI> {
    return this.apiService.get<CaseFileKPI>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.KPI_BY_CLIENT,
      { clientId }
    );
  }

  /**
   * Récupérer les dossiers d'un cabinet
   * GET /case-files/cabinet/{cabinetId}
   */
  getCaseFilesByCabinet(
    cabinetId: string, 
    status?: CaseFileStatus, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<CaseFile>> {
    return this.apiService.get<PaginatedResponse<CaseFile>>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.BY_CABINET,
      { cabinetId, status, ...paginationParams }
    );
  }

  /**
   * Récupérer les KPI des dossiers pour un cabinet
   * GET /case-files/cabinet/{cabinetId}/kpi
   */
  getCabinetCaseFileKPI(cabinetId: string): Observable<CaseFileKPI> {
    return this.apiService.get<CaseFileKPI>(
      APP_CONSTANTS.API_ENDPOINTS.CASE_FILE.KPI_BY_CABINET,
      { cabinetId }
    );
  }
}
