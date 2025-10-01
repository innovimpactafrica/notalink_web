import { Injectable, inject } from '@angular/core';
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
import { ApiService } from './api.service';
import { CabinetService } from './cabinet.service';
import { Cabinet } from '../../shared/interfaces/models.interface';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiService = inject(ApiService);
  private readonly cabinetService = inject(CabinetService);

  /**
   * Récupérer l'utilisateur courant
   * GET /api/v1/user/me
   * @returns 
   */
  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>(APP_CONSTANTS.API_ENDPOINTS.USER.ME);
  }

  /**
   * Récupérer un utilisateur par son ID
   * GET /api/v1/user/{id}
   * @param id 
   * @returns 
   */
  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(APP_CONSTANTS.API_ENDPOINTS.USER.BY_ID, { id });
  }

  /**
   * Mettre à jour un utilisateur
   * PUT /api/v1/user/update/{id}
   * @param id 
   * @param userData 
   * @returns 
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.apiService.put<User>(APP_CONSTANTS.API_ENDPOINTS.USER.UPDATE, userData, { id });
  }

  /**
   * Mettre à jour la localisation d'un utilisateur
   * PUT /api/v1/user/{id}/location
   * @param userId 
   * @param locationData 
   * @returns 
   */
  updateUserLocation(userId: string, locationData: UpdateLocationRequest): Observable<User> {
    return this.apiService.put<User>(APP_CONSTANTS.API_ENDPOINTS.USER.LOCATION, locationData, { id: userId });
  }

  /**
   * Mettre à jour la photo d'un utilisateur
   * POST /api/v1/user/photo/{id}
   * @param id 
   * @param photoData 
   * @returns 
   */
  updateUserPhoto(id: string, photoData: UpdatePhotoRequest): Observable<User> {
    return this.apiService.post<User>(APP_CONSTANTS.API_ENDPOINTS.USER.PHOTO, photoData, { id });
  }

  /**
   * Changer le mot de passe d'un utilisateur
   * POST /api/v1/user/password/change
   * @param changeData 
   * @returns 
   */
  changeUserPassword(changeData: PasswordChangeRequest): Observable<void> {
    return this.apiService.post<void>(APP_CONSTANTS.API_ENDPOINTS.USER.PASSWORD_CHANGE, changeData);
  }

  /**
   * Activer/Désactiver le statut en ligne d'un utilisateur
   * PATCH /api/v1/user/{id}/toggle-online
   * @param id 
   * @returns 
   */
  toggleUserOnlineStatus(id: string): Observable<User> {
    return this.apiService.patch<User>(APP_CONSTANTS.API_ENDPOINTS.USER.TOGGLE_ONLINE, {}, { id });
  }

  /**
   * Mettre à jour le statut marital d'un utilisateur
   * PATCH /api/v1/user/{id}/marital-status
   * @param id 
   * @param maritalStatusData 
   * @returns 
   */
  updateMaritalStatus(id: string, maritalStatusData: UpdateMaritalStatusRequest): Observable<User> {
    return this.apiService.patch<User>(APP_CONSTANTS.API_ENDPOINTS.USER.MARITAL_STATUS, maritalStatusData, { id });
  }

  /**
   * Supprimer un utilisateur
   * DELETE /api/v1/user/{id}
   * @param id 
   * @returns 
   */
  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(APP_CONSTANTS.API_ENDPOINTS.USER.DELETE, { id });
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