import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
import {
  ApiResponse
} from '../../shared/interfaces/api-response.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1/user`;

  private readonly httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
    })
  };

  getCurrentUser(): Observable<User> {
    console.log('Calling getCurrentUser API:', `${this.baseUrl}/me`);
    return this.http.get<User>(`${this.baseUrl}/me`, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error in getCurrentUser:', error);
          return this.handleError(error);
        })
      );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/update/${id}`, userData, this.httpOptions)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  updateUserLocation(userId: string, locationData: UpdateLocationRequest): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/${userId}/location`, locationData, this.httpOptions)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  updateUserPhoto(id: string, photoData: UpdatePhotoRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/photo/${id}`, photoData, this.httpOptions)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  changeUserPassword(changeData: PasswordChangeRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/password/change`, changeData, this.httpOptions)
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  toggleUserOnlineStatus(id: string): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/toggle-online`, {}, this.httpOptions)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  updateMaritalStatus(id: string, maritalStatusData: UpdateMaritalStatusRequest): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/marital-status`, maritalStatusData, this.httpOptions)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  private handleError = (error: any): Observable<never> => {
    console.error('User Service Error:', error);
    throw error;
  };
}