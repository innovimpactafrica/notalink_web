import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1/user`;

  private readonly httpOptions = {
    withCredentials: true,
  };

  /** Récupérer l'utilisateur courant
   * Get /user/me
   * @returns 
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, this.httpOptions);
  }

  /** Récupérer un utilisateur par son ID
   * Get /user/{id}
   * @param id 
   * @returns 
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  /** Mettre à jour un utilisateur
   * Put /user/update/{id}
   * @param id 
   * @param userData 
   * @returns 
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/update/${id}`, userData, this.httpOptions);
  }

  /** Mettre à jour la localisation d'un utilisateur
   * Put /user/{id}/location
   * @param userId 
   * @param locationData 
   * @returns 
   */
  updateUserLocation(userId: string, locationData: UpdateLocationRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}/location`, locationData, this.httpOptions);
  }

  /** Mettre à jour la photo d'un utilisateur
   * Post /user/photo/{id}
   * @param id 
   * @param photoData 
   * @returns 
   */
  updateUserPhoto(id: string, photoData: UpdatePhotoRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/photo/${id}`, photoData, this.httpOptions);
  }

  /** Changer le mot de passe d'un utilisateur
   * Post /user/password/change
   * @param changeData 
   * @returns 
   */
  changeUserPassword(changeData: PasswordChangeRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password/change`, changeData, this.httpOptions);
  }

  /** Activer/Désactiver le statut en ligne d'un utilisateur
   * Patch /user/{id}/toggle-online
   * @param id 
   * @returns 
   */
  toggleUserOnlineStatus(id: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/toggle-online`, {}, this.httpOptions);
  }

  /** Mettre à jour le statut mariel d'un utilisateur
   * Patch /user/{id}/marital-status
   * @param id 
   * @param maritalStatusData 
   * @returns 
   */
  updateMaritalStatus(id: string, maritalStatusData: UpdateMaritalStatusRequest): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/marital-status`, maritalStatusData, this.httpOptions);
  }

  /** Supprimer un utilisateur
   * Delete /user/{id}
   * @param id 
   * @returns 
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
  }
}