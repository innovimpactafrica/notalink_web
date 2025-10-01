import { Injectable, inject } from '@angular/core';
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
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  /**
   * Se connecter
   * POST /api/auth/signin
   * @param credentials 
   * @returns 
   */
  signIn(credentials: SignInRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(
      APP_CONSTANTS.API_ENDPOINTS.AUTH.SIGN_IN,
      credentials
    ).pipe(
      tap(authResponse => this.handleAuthSuccess(authResponse)),
      catchError(this.handleError)
    );
  }

  /**
   * S'inscrire
   * POST /api/auth/signup
   * @param userData 
   * @returns 
   */
  signUp(userData: SignUpRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(
      APP_CONSTANTS.API_ENDPOINTS.AUTH.SIGN_UP,
      userData
    ).pipe(
      tap(authResponse => this.handleAuthSuccess(authResponse)),
      catchError(this.handleError)
    );
  }

  /**
   * Réinitialiser le mot de passe
   * POST /api/auth/password/reset
   * @param resetData 
   * @returns 
   */
  resetPassword(resetData: PasswordResetRequest): Observable<void> {
    return this.apiService.post<void>(
      APP_CONSTANTS.API_ENDPOINTS.AUTH.PASSWORD_RESET,
      resetData
    ).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  /**
   * Changer le mot de passe
   * PUT /api/auth/password/change/{id}
   * @param id 
   * @param changeData 
   * @returns 
   */
  changePassword(id: string, changeData: PasswordChangeRequest): Observable<void> {
    return this.apiService.put<void>(
      APP_CONSTANTS.API_ENDPOINTS.AUTH.PASSWORD_CHANGE,
      changeData,
      { id }
    ).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  /**
   * Créer un reservataire
   * POST /api/auth/reservataire/{id}
   * @param id 
   * @param reservataireData 
   * @returns 
   */
  createReservataire(id: string, reservataireData: CreateReservataire): Observable<User> {
    return this.apiService.post<User>(
      APP_CONSTANTS.API_ENDPOINTS.AUTH.RESERVATAIRE,
      reservataireData,
      { id }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Déconnexion
   * GET /api/auth/logout
   * @returns 
   */
  logout(): Observable<void> {
    return this.apiService.get<void>(
      APP_CONSTANTS.API_ENDPOINTS.AUTH.LOGOUT
    ).pipe(
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

    if (error.status === APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED) {
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