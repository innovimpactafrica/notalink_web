import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user.interface';
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly apiService = inject(ApiService);

  /**
   * Récupérer l'utilisateur courant (méthode de test)
   * GET /api/v1/user/me
   * @returns
   */
  getMe(): Observable<User> {
    return this.apiService.get<User>(APP_CONSTANTS.API_ENDPOINTS.USER.ME);
  }

  /**
     * Se connecter (méthode de test)
     * POST /api/v1/auth/signin
     * @returns
     */
    login(credentials: any): Observable<any> {
      return this.apiService.post<any>(APP_CONSTANTS.API_ENDPOINTS.AUTH.SIGN_IN, credentials);
    }
}