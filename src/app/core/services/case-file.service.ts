import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  CaseFile, 
  CaseFileRequest, 
  CaseFileKPI, 
  CaseFilePercentageKPI, 
  CaseFileStatus,
  PaginationParams
} from '../../shared/interfaces/models.interface';
import { 
  ApiResponse, 
  PaginatedResponse,
} from '../../shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CaseFileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/case-files`;
  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Mettre à jour un dossier
   * PUT /case-files/{id}
   * @param id 
   * @returns
   */
  updateCaseFile(
    id: string, 
    request: CaseFileRequest
  ): Observable<ApiResponse<CaseFile>> {
    return this.http.put<ApiResponse<CaseFile>>(
      `${this.apiUrl}/${id}`,
      request, this.httpOptions
    );
  }

  /**
   * Créer un nouveau dossier
   * POST /case-files
   * @returns
   */
  createCaseFile(request: CaseFileRequest): Observable<ApiResponse<CaseFile>> {
    return this.http.post<ApiResponse<CaseFile>>(
      this.apiUrl,
      request, this.httpOptions
    );
  }

  /**
   * Ajouter un client à un dossier
   * POST /case-files/{id}/clients/{clientId}
   * @param id 
   * @param clientId 
   * @returns
   */
  addClientToCaseFile(
    id: string, 
    clientId: string
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/${id}/clients/${clientId}`,
      null, this.httpOptions
    );
  }

  /**
   * Récupérer les KPI en pourcentage pour un client
   * GET /case-files/kpi/percentage/client/{clientId}
   * @param clientId 
   * @returns
   */
  getClientPercentageKPI(clientId: string): Observable<ApiResponse<CaseFilePercentageKPI>> {
    return this.http.get<ApiResponse<CaseFilePercentageKPI>>(
      `${this.apiUrl}/kpi/percentage/client/${clientId}`, this.httpOptions
    );
  }

  /**
   * Récupérer les KPI en pourcentage pour un cabinet
   * GET /case-files/kpi/percentage/cabinet/{cabinetId}
   * @param cabinetId 
   * @returns
   */
  getCabinetPercentageKPI(cabinetId: string): Observable<ApiResponse<CaseFilePercentageKPI>> {
    return this.http.get<ApiResponse<CaseFilePercentageKPI>>(
      `${this.apiUrl}/kpi/percentage/cabinet/${cabinetId}`, this.httpOptions
    );
  }

  /**
   * Récupérer les dossiers d'un client
   * GET /case-files/client/{clientId}
   * @param status (optionnel) Filtrer par statut
   * @param paginationParams (optionnel) Paramètres de pagination
   * @returns
   */
  getCaseFilesByClient(
    clientId: string, 
    status?: CaseFileStatus, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<CaseFile>> {
    let params = new HttpParams();
    
    if (status) {
      params = params.set('status', status);
    }
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<CaseFile>>(
      `${this.apiUrl}/client/${clientId}`,
      { ...this.httpOptions ,params }
    );
  }

  /**
   * Récupérer les KPI des dossiers pour un client
   * GET /case-files/client/{clientId}/kpi
   * @param clientId 
   * @returns
   */
  getClientCaseFileKPI(clientId: string): Observable<ApiResponse<CaseFileKPI>> {
    return this.http.get<ApiResponse<CaseFileKPI>>(
      `${this.apiUrl}/client/${clientId}/kpi`, this.httpOptions
    );
  }

  /**
   * Récupérer les dossiers d'un cabinet
   * GET /case-files/cabinet/{cabinetId}
   * @param status (optionnel) Filtrer par statut
   * @param paginationParams (optionnel) Paramètres de pagination
   * @returns
   */
  getCaseFilesByCabinet(
    cabinetId: string, 
    status?: CaseFileStatus, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<CaseFile>> {
    let params = new HttpParams();
    
    if (status) {
      params = params.set('status', status);
    }
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<CaseFile>>(
      `${this.apiUrl}/cabinet/${cabinetId}`,
      { ...this.httpOptions ,params }
    );
  }

  /**
   * Récupérer les KPI des dossiers pour un cabinet
   * GET /case-files/cabinet/{cabinetId}/kpi
   * @param cabinetId 
   * @returns
   */
  getCabinetCaseFileKPI(cabinetId: string): Observable<ApiResponse<CaseFileKPI>> {
    return this.http.get<ApiResponse<CaseFileKPI>>(
      `${this.apiUrl}/cabinet/${cabinetId}/kpi`, this.httpOptions
    );
  }
}