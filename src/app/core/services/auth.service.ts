// core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import {
  CreateReservataire,
  User,
} from '../../shared/interfaces/user.interface';
import {
  SignInRequest,
  SignUpRequest,
  PasswordResetRequest,
  PasswordChangeRequest,
  AuthResponse,
} from '../../shared/interfaces/auth.interface';
import {
  ApiResponse
} from '../../shared/interfaces/api-response.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly httpOptions = {
    withCredentials: true,
  };

  /**
   * Se connecter
   * Post /auth/signin
   * @param credentials 
   * @returns 
   */
  signIn(credentials: SignInRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signin`, credentials, this.httpOptions)
      .pipe(
        tap(authResponse => this.handleAuthSuccess(authResponse)),
        catchError(this.handleError)
      );
  }

  /**
   * S'inscrire
   * Post /auth/signup
   * @param userData 
   * @returns 
   */
  signUp(userData: SignUpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, userData, this.httpOptions)
      .pipe(
        tap(authResponse => this.handleAuthSuccess(authResponse)),
        catchError(this.handleError)
      );
  }

  /**
   * Réinitialiser le mot de passe
   * Post /auth/password/reset
   * @param resetData 
   * @returns 
   */
  resetPassword(resetData: PasswordResetRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/password/reset`, resetData, this.httpOptions)
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  /**
   * Changer le mot de passe
   * Put /auth/password/change
   * @param changeData 
   * @returns 
   */
  changePassword(id: string, changeData: PasswordChangeRequest): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/password/change/${id}`, changeData, this.httpOptions)
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  /**
   * Créer un reservataire
   * Post /auth/reservataire/{id}
   * @param id 
   * @param reservataireData 
   * @returns 
   */
  createReservataire(id: string, reservataireData: CreateReservataire): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/reservataire/${id}`, reservataireData, this.httpOptions)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  /**
   * Déconnexion
   * Get /auth/logout
   * @returns 
   */
  logout(): Observable<void> {
    return this.http.get<ApiResponse<void>>(`${this.baseUrl}/logout`, this.httpOptions)
      .pipe(
        tap(() => this.handleLogout()),
        map(() => void 0),
        catchError((error) => {
          this.handleLogout();
          return throwError(() => error);
        })
      );
  }

  // Gestion de la déconnexion locale
  private handleLogout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Gestion des erreurs
  private handleError = (error: any): Observable<never> => {
    console.error('Auth Service Error:', error);

    if (error.status === 401) {
      this.handleLogout();
    }

    return throwError(() => error);
  };

  // Getters pour les valeurs actuelles
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Gestion réussie de l'authentification
  private handleAuthSuccess(authResponse: AuthResponse): void {
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }
}