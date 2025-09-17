import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    Cabinet,
    CabinetRequest,
    CabinetAgent,
    CabinetSearchParams
} from '../../shared/interfaces/models.interface';
import {
    ApiResponse,
    PaginatedResponse,
} from '../../shared/interfaces/api-response.interface';

@Injectable({
    providedIn: 'root'
})
export class CabinetService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/cabinets`;
    private readonly httpOptions = {
        withCredentials: true
    };

    /**
     * Récupérer un cabinet par ID
     * GET /cabinets/{id}
     * @param id
     * @returns
     */
    getCabinetById(id: string): Observable<Cabinet> {
        return this.http.get<Cabinet>(
            `${this.apiUrl}/${id}`, this.httpOptions
        );
    }

    /**
     * Mettre à jour un cabinet
     * PUT /cabinets/{id}
     * @param id
     * @returns
     */
    updateCabinet(
        id: string,
        request: CabinetRequest
    ): Observable<ApiResponse<Cabinet>> {
        const formData = new FormData();
        formData.append('name', request.name);
        formData.append('address', request.address);
        formData.append('phone', request.phone);
        formData.append('email', request.email);
        formData.append('latitude', request.latitude.toString());
        formData.append('longitude', request.longitude.toString());
        formData.append('notaryId', request.notaryId);
        formData.append('openingHours', request.openingHours);

        if (request.logoFile) {
            formData.append('logoFile', request.logoFile);
        }

        return this.http.put<ApiResponse<Cabinet>>(
            `${this.apiUrl}/${id}`,
            formData, this.httpOptions
        );
    }

    /**
     * Supprimer un cabinet
     * DELETE /cabinets/{id}
     * @param id
     * @returns 
     */
    deleteCabinet(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(
            `${this.apiUrl}/${id}`, this.httpOptions
        );
    }

    /**
     * Ajouter un agent à un cabinet
     * POST /cabinets/{cabinetId}/agents/{agentId}
     * @param cabinetId 
     * @param agentId
     * @returns
     */
    addAgentToCabinet(
        cabinetId: string,
        agentId: string
    ): Observable<ApiResponse<CabinetAgent>> {
        return this.http.post<ApiResponse<CabinetAgent>>(
            `${this.apiUrl}/${cabinetId}/agents/${agentId}`,
            null, this.httpOptions
        );
    }

    /**
     * Retirer un agent d'un cabinet
     * DELETE /cabinets/{cabinetId}/agents/{agentId}
     * @param cabinetId 
     * @param agentId
     * @returns
     */
    removeAgentFromCabinet(
        cabinetId: string,
        agentId: string
    ): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(
            `${this.apiUrl}/${cabinetId}/agents/${agentId}`, this.httpOptions
        );
    }

    /**
     * Créer un nouveau cabinet
     * POST /cabinets/save
     * @returns
     */
    createCabinet(request: CabinetRequest): Observable<ApiResponse<Cabinet>> {
        const formData = new FormData();
        formData.append('name', request.name);
        formData.append('address', request.address);
        formData.append('phone', request.phone);
        formData.append('email', request.email);
        formData.append('latitude', request.latitude.toString());
        formData.append('longitude', request.longitude.toString());
        formData.append('notaryId', request.notaryId);
        formData.append('openingHours', request.openingHours);

        if (request.logoFile) {
            formData.append('logoFile', request.logoFile);
        }

        return this.http.post<ApiResponse<Cabinet>>(
            `${this.apiUrl}/save`,
            formData, this.httpOptions
        );
    }

    /**
     * Récupérer les agents d'un cabinet
     * GET /cabinets/{cabinetId}/agents
     * @param cabinetId
     * @returns
     */
    getCabinetAgents(cabinetId: string): Observable<ApiResponse<CabinetAgent[]>> {
        return this.http.get<ApiResponse<CabinetAgent[]>>(
            `${this.apiUrl}/${cabinetId}/agents`, this.httpOptions
        );
    }

    /**
     * Rechercher des cabinets
     * GET /cabinets/search
     * @param searchParams
     * @returns
     */
    searchCabinets(searchParams: CabinetSearchParams): Observable<PaginatedResponse<Cabinet>> {
        let params = new HttpParams()
            .set('latitude', searchParams.latitude.toString())
            .set('longitude', searchParams.longitude.toString());

        if (searchParams.name) {
            params = params.set('name', searchParams.name);
        }
        if (searchParams.page) {
            params = params.set('page', searchParams.page.toString());
        }
        if (searchParams.size) {
            params = params.set('size', searchParams.size.toString());
        }

        return this.http.get<PaginatedResponse<Cabinet>>(
            `${this.apiUrl}/search`,
            { ...this.httpOptions, params }
        );
    }

    /**
     * Récupérer les cabinets par notaire
     * GET /cabinets/by-notary/{id}
     * @param id
     * @returns
     */
    getCabinetsByNotary(id: string): Observable<ApiResponse<Cabinet[]>> {
        return this.http.get<ApiResponse<Cabinet[]>>(
            `${this.apiUrl}/by-notary/${id}`, this.httpOptions
        );
    }
}