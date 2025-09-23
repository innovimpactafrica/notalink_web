import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { 
  Rating, 
  RatingRequest, 
  RatingAverage,
  PaginationParams 
} from '../../shared/interfaces/models.interface';
import {
  PaginatedResponse,
} from '../../shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly apiUrl = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) {}

  /**
   * Noter un utilisateur
   * POST /ratings/rate
   */
  rateUser(request: RatingRequest): Observable<Rating> {
    return this.http.post<Rating>(
      `${this.apiUrl}/rate`,
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
    let params = new HttpParams();
    
    if (paginationParams?.page) {
      params = params.set('page', paginationParams.page.toString());
    }
    if (paginationParams?.size) {
      params = params.set('size', paginationParams.size.toString());
    }

    return this.http.get<PaginatedResponse<Rating>>(
      `${this.apiUrl}/user/${userId}`,
      { params }
    );
  }

  /**
   * Récupérer la note moyenne d'un utilisateur
   * GET /ratings/average/{userId}
   */
  getUserAverageRating(userId: string): Observable<RatingAverage> {
    return this.http.get<RatingAverage>(
      `${this.apiUrl}/average/${userId}`
    );
  }
}