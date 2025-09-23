import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  User,
  UpdateUserRequest,
  UpdateLocationRequest,
  UpdatePhotoRequest,
  UpdateMaritalStatusRequest,
} from '../../shared/interfaces/user.interface';
import {
  PasswordChangeRequest,
} from '../../shared/interfaces/auth.interface';
import { environment } from '../../../environments/environment.prod';
import { CabinetService } from './cabinet.service';
import { Cabinet } from '../../shared/interfaces/models.interface';
import { PaginatedResponse } from '../../shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly cabinetService = inject(CabinetService);
  private readonly baseUrl = `${environment.apiUrl}/v1/user`;

  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Récupérer l'utilisateur courant
   * GET /user/me
   * @returns 
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, this.httpOptions);
  }

  /**
   * Récupérer un utilisateur par son ID
   * GET /user/{id}
   * @param id 
   * @returns 
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  /**
   * Récupérer les utilisateurs d'un cabinet
   * GET /user/cabinet/{cabinetId}
   * @param cabinetId
   * @param paginationParams
   * @returns
   */
  getUsersByCabinet(cabinetId: string, paginationParams?: { page?: number; size?: number }): Observable<User[]> {
    let params = new HttpParams();
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }
    return this.http.get<PaginatedResponse<User>>(
      `${this.baseUrl}/cabinet/${cabinetId}`,
      { ...this.httpOptions, params }
    ).pipe(
      map(response => response.content)
    );
  }

  /**
   * Mettre à jour un utilisateur
   * PUT /user/update/{id}
   * @param id 
   * @param userData 
   * @returns 
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/update/${id}`, userData, this.httpOptions);
  }

  /**
   * Mettre à jour la localisation d'un utilisateur
   * PUT /user/{id}/location
   * @param userId 
   * @param locationData 
   * @returns 
   */
  updateUserLocation(userId: string, locationData: UpdateLocationRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}/location`, locationData, this.httpOptions);
  }

  /**
   * Mettre à jour la photo d'un utilisateur
   * POST /user/photo/{id}
   * @param id 
   * @param photoData 
   * @returns 
   */
  updateUserPhoto(id: string, photoData: UpdatePhotoRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/photo/${id}`, photoData, this.httpOptions);
  }

  /**
   * Changer le mot de passe d'un utilisateur
   * POST /user/password/change
   * @param changeData 
   * @returns 
   */
  changeUserPassword(changeData: PasswordChangeRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password/change`, changeData, this.httpOptions);
  }

  /**
   * Activer/Désactiver le statut en ligne d'un utilisateur
   * PATCH /user/{id}/toggle-online
   * @param id 
   * @returns 
   */
  toggleUserOnlineStatus(id: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/toggle-online`, {}, this.httpOptions);
  }

  /**
   * Mettre à jour le statut marital d'un utilisateur
   * PATCH /user/{id}/marital-status
   * @param id 
   * @param maritalStatusData 
   * @returns 
   */
  updateMaritalStatus(id: string, maritalStatusData: UpdateMaritalStatusRequest): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/marital-status`, maritalStatusData, this.httpOptions);
  }

  /**
   * Supprimer un utilisateur
   * DELETE /user/{id}
   * @param id 
   * @returns 
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  /**
   * Récupérer le cabinet de l'utilisateur courant
   * @returns
   */
  getCabinetOfCurrentUser(): Observable<Cabinet> {
    return this.getCurrentUser().pipe(
      switchMap(user => this.cabinetService.getCabinetsByNotary(user.id)),
      map(cabinets => cabinets)
    );
  }

  /**
   * Récupérer l'ID du cabinet de l'utilisateur courant
   * @returns
   */
  getCabinetIdOfCurrentUser(): Observable<string> {
    return this.getCabinetOfCurrentUser().pipe(
      map(cabinet => cabinet.id.toString())
    );
  }
}