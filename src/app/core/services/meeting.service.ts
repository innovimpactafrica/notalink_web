import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  Meeting, 
  MeetingRequest,
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
export class MeetingService {
  private readonly apiService = inject(ApiService);

  /**
   * Récupérer une réunion par ID
   * GET /meetings/{id}
   * @param id
   * @returns
   */
  getMeetingById(id: string): Observable<Meeting> {
    return this.apiService.get<Meeting>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.BY_ID,
      { id }
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
    return this.apiService.put<Meeting>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.UPDATE,
      request,
      { id }
    );
  }

  /**
   * Supprimer une réunion
   * DELETE /meetings/{id}
   * @param id
   * @returns
   */
  deleteMeeting(id: string): Observable<void> {
    return this.apiService.delete<void>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.DELETE,
      { id }
    );
  }

  /**
   * Créer une nouvelle réunion
   * POST /meetings/
   * @returns
   */
  createMeeting(request: MeetingRequest): Observable<Meeting> {
    return this.apiService.post<Meeting>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.CREATE,
      request
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
    return this.apiService.get<PaginatedResponse<Meeting>>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.UPCOMING_BY_CLIENT,
      { clientId, ...paginationParams }
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
    return this.apiService.get<PaginatedResponse<Meeting>>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.UPCOMING_BY_CABINET,
      { cabinetId, ...paginationParams }
    );
  }

  /**
   * Récupérer la prochaine réunion pour un cabinet
   * GET /meetings/next/cabinet/{cabinetId}
   * @param cabinetId
   * @returns
   */
  getNextMeetingByCabinet(cabinetId: string): Observable<Meeting> {
    return this.apiService.get<Meeting>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.NEXT_BY_CABINET,
      { cabinetId }
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
    return this.apiService.get<Meeting[]>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.BY_CLIENT_AND_DATE,
      { clientId, date }
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
    return this.apiService.get<Meeting[]>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.BY_CABINET_AND_DATE,
      { cabinetId, date }
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
    return this.apiService.get<PaginatedResponse<Meeting>>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.ARCHIVED_BY_CLIENT,
      { clientId, ...paginationParams }
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
    return this.apiService.get<PaginatedResponse<Meeting>>(
      APP_CONSTANTS.API_ENDPOINTS.MEETING.ARCHIVED_BY_CABINET,
      { cabinetId, ...paginationParams }
    );
  }
}