import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  Rating, 
  RatingRequest, 
  RatingAverage,
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
export class RatingService {
  private readonly apiService = inject(ApiService);

  /**
   * Noter un utilisateur
   * POST /ratings/rate
   */
  rateUser(request: RatingRequest): Observable<Rating> {
    return this.apiService.post<Rating>(
      APP_CONSTANTS.API_ENDPOINTS.RATING.RATE,
      request
    );
  }

  /**
   * Récupérer les évaluations d'un utilisateur
   * GET /ratings/user/{userId}
   */
  getUserRatings(
    userId: string, 
    paginationParams?: PaginationParams
  ): Observable<PaginatedResponse<Rating>> {
    return this.apiService.get<PaginatedResponse<Rating>>(
      APP_CONSTANTS.API_ENDPOINTS.RATING.BY_USER,
      { userId, ...paginationParams }
    );
  }

  /**
   * Récupérer la note moyenne d'un utilisateur
   * GET /ratings/average/{userId}
   */
  getUserAverageRating(userId: string): Observable<RatingAverage> {
    return this.apiService.get<RatingAverage>(
      APP_CONSTANTS.API_ENDPOINTS.RATING.AVERAGE,
      { userId }
    );
  }
}