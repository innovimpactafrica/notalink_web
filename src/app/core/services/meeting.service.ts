import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { 
  Meeting, 
  MeetingRequest,
  PaginationParams 
} from '../../shared/interfaces/models.interface';
import { 
  PaginatedResponse,
} from '../../shared/interfaces/api-response.interface';


@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/meetings`;
  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Récupérer une réunion par ID
   * GET /meetings/{id}
   * @param id
   * @returns
   */
  getMeetingById(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(
      `${this.apiUrl}/${id}`, 
      this.httpOptions
    );
  }

  /**
   * Mettre à jour une réunion
   * PUT /meetings/{id}
   * @param id
   * @returns
   */
  updateMeeting(
    id: string, 
    request: MeetingRequest
  ): Observable<Meeting> {
    return this.http.put<Meeting>(
      `${this.apiUrl}/${id}`,
      request, 
      this.httpOptions
    );
  }

  /**
   * Supprimer une réunion
   * DELETE /meetings/{id}
   * @param id
   * @returns
   */
  deleteMeeting(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`, 
      this.httpOptions
    );
  }

  /**
   * Créer une nouvelle réunion
   * POST /meetings/
   * @returns
   */
  createMeeting(request: MeetingRequest): Observable<Meeting> {
    return this.http.post<Meeting>(
      this.apiUrl,
      request, 
      this.httpOptions
    );
  }

  /**
   * Récupérer les réunions à venir pour un client
   * GET /meetings/upcoming/client/{clientId}
   * @param clientId
   * @param paginationParams
   * @returns
   */
  getUpcomingMeetingsByClient(
    clientId: string, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<Meeting>> {
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<Meeting>>(
      `${this.apiUrl}/upcoming/client/${clientId}`,
      { ...this.httpOptions ,params }
    );
  }

  /**
   * Récupérer les réunions à venir pour un cabinet
   * GET /meetings/upcoming/cabinet/{cabinetId}
   * @param cabinetId
   * @param paginationParams 
   * @returns
   */
  getUpcomingMeetingsByCabinet(
    cabinetId: string, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<Meeting>> {
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<Meeting>>(
      `${this.apiUrl}/upcoming/cabinet/${cabinetId}`,
      { ...this.httpOptions ,params }
    );
  }

  /**
   * Récupérer la prochaine réunion pour un cabinet
   * GET /meetings/next/cabinet/{cabinetId}
   * @param cabinetId
   * @returns
   */
  getNextMeetingByCabinet(cabinetId: string): Observable<Meeting> {
    return this.http.get<Meeting>(
      `${this.apiUrl}/next/cabinet/${cabinetId}`, 
      this.httpOptions
    );
  }

  /**
   * Récupérer les réunions d'un client par date
   * GET /meetings/client/{clientId}/date
   * @param clientId
   * @param date (format YYYY-MM-DD)
   * @returns
   */
  getMeetingsByClientAndDate(
    clientId: string, 
    date: string
  ): Observable<Meeting[]> {
    const params = new HttpParams().set('date', date);

    return this.http.get<Meeting[]>(
      `${this.apiUrl}/client/${clientId}/date`,
      { ...this.httpOptions ,params }
    );
  }

  /**
   * Récupérer les réunions d'un cabinet par date
   * GET /meetings/cabinet/{cabinetId}/date
   * @param cabinetId
   * @param date (format YYYY-MM-DD)
   * @returns
   */
  getMeetingsByCabinetAndDate(
    cabinetId: string, 
    date: string
  ): Observable<Meeting[]> {
    const params = new HttpParams().set('date', date);

    return this.http.get<Meeting[]>(
      `${this.apiUrl}/cabinet/${cabinetId}/date`,
      { ...this.httpOptions ,params }
    );
  }

  /**
   * Récupérer les réunions archivées pour un client
   * GET /meetings/archived/client/{clientId}
   * @param clientId
   * @param paginationParams 
   * @returns
   */
  getArchivedMeetingsByClient(
    clientId: string, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<Meeting>> {
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<Meeting>>(
      `${this.apiUrl}/archived/client/${clientId}`,
      { ...this.httpOptions ,params }
    );
  }

  /**
   * Récupérer les réunions archivées pour un cabinet
   * GET /meetings/archived/cabinet/{cabinetId}
   * @param cabinetId
   * @param paginationParams 
   * @returns
   */
  getArchivedMeetingsByCabinet(
    cabinetId: string, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<Meeting>> {
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<Meeting>>(
      `${this.apiUrl}/archived/cabinet/${cabinetId}`,
      { ...this.httpOptions ,params }
    );
  }
}