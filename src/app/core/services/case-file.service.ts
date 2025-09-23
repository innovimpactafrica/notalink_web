import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { 
  CaseFile, 
  CaseFileRequest, 
  CaseFileKPI, 
  CaseFilePercentageKPI, 
  CaseFileStatus,
  PaginationParams
} from '../../shared/interfaces/models.interface';
import { PaginatedResponse } from '../../shared/interfaces/api-response.interface';

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
   */
  updateCaseFile(id: string, request: CaseFileRequest): Observable<CaseFile> {
    return this.http.put<CaseFile>(
      `${this.apiUrl}/${id}`,
      request,
      this.httpOptions
    );
  }

  /**
   * Créer un nouveau dossier
   * POST /case-files
   */
  createCaseFile(request: CaseFileRequest): Observable<CaseFile> {
    return this.http.post<CaseFile>(
      this.apiUrl,
      request,
      this.httpOptions
    );
  }

  /**
   * Ajouter un client à un dossier
   * POST /case-files/{id}/clients/{clientId}
   */
  addClientToCaseFile(id: string, clientId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${id}/clients/${clientId}`,
      null,
      this.httpOptions
    );
  }

  /**
   * Récupérer les KPI en pourcentage pour un client
   * GET /case-files/kpi/percentage/client/{clientId}
   */
  getClientPercentageKPI(clientId: string): Observable<CaseFilePercentageKPI> {
    return this.http.get<CaseFilePercentageKPI>(
      `${this.apiUrl}/kpi/percentage/client/${clientId}`,
      this.httpOptions
    );
  }

  /**
   * Récupérer les KPI en pourcentage pour un cabinet
   * GET /case-files/kpi/percentage/cabinet/{cabinetId}
   */
  getCabinetPercentageKPI(cabinetId: string): Observable<CaseFilePercentageKPI> {
    return this.http.get<CaseFilePercentageKPI>(
      `${this.apiUrl}/kpi/percentage/cabinet/${cabinetId}`,
      this.httpOptions
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
      { ...this.httpOptions, params }
    ).pipe(
      tap(data => console.log('Response Data (client):', data))
    );
  }

  /**
   * Récupérer les KPI des dossiers pour un client
   * GET /case-files/client/{clientId}/kpi
   */
  getClientCaseFileKPI(clientId: string): Observable<CaseFileKPI> {
    return this.http.get<CaseFileKPI>(
      `${this.apiUrl}/client/${clientId}/kpi`,
      this.httpOptions
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

    const apiRoute = `${this.apiUrl}/cabinet/${cabinetId}`;

    return this.http.get<PaginatedResponse<CaseFile>>(
      apiRoute,
      { ...this.httpOptions, params }
    )
  }

  /**
   * Récupérer les KPI des dossiers pour un cabinet
   * GET /case-files/cabinet/{cabinetId}/kpi
   */
  getCabinetCaseFileKPI(cabinetId: string): Observable<CaseFileKPI> {
    return this.http.get<CaseFileKPI>(
      `${this.apiUrl}/cabinet/${cabinetId}/kpi`,
      this.httpOptions
    );
  }
}