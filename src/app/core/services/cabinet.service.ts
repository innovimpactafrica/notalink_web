import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
    Cabinet,
    CabinetRequest,
    CabinetAgent,
    CabinetSearchParams
} from '../../shared/interfaces/models.interface';
import {
    PaginatedResponse,
} from '../../shared/interfaces/api-response.interface';
import { ApiService } from './api.service';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
    providedIn: 'root'
})
export class CabinetService {
    private readonly apiService = inject(ApiService);

    /**
     * Récupérer un cabinet par ID
     * GET /cabinets/{id}
     * @param id
     * @returns
     */
    getCabinetById(id: string): Observable<Cabinet> {
        return this.apiService.get<Cabinet>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.BY_ID,
            { id }
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
    ): Observable<Cabinet> {
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

        return this.apiService.put<Cabinet>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.UPDATE,
            formData,
            { id }
        );
    }

    /**
     * Supprimer un cabinet
     * DELETE /cabinets/{id}
     * @param id
     * @returns 
     */
    deleteCabinet(id: string): Observable<void> {
        return this.apiService.delete<void>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.DELETE,
            { id }
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
    ): Observable<CabinetAgent> {
        return this.apiService.post<CabinetAgent>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.ADD_AGENT,
            null,
            { cabinetId, agentId }
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
    ): Observable<void> {
        return this.apiService.delete<void>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.REMOVE_AGENT,
            { cabinetId, agentId }
        );
    }

    /**
     * Créer un nouveau cabinet
     * POST /cabinets/save
     * @returns
     */
    createCabinet(request: CabinetRequest): Observable<Cabinet> {
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

        return this.apiService.post<Cabinet>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.CREATE,
            formData
        );
    }

    /**
     * Récupérer les agents d'un cabinet
     * GET /cabinets/{cabinetId}/agents
     * @param cabinetId
     * @returns
     */
    getCabinetAgents(cabinetId: string): Observable<CabinetAgent[]> {
        return this.apiService.get<CabinetAgent[]>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.AGENTS,
            { cabinetId }
        );
    }

    /**
     * Rechercher des cabinets
     * GET /cabinets/search
     * @param searchParams
     * @returns
     */
    searchCabinets(searchParams: CabinetSearchParams): Observable<PaginatedResponse<Cabinet>> {
        return this.apiService.get<PaginatedResponse<Cabinet>>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.SEARCH,
            {
                latitude: searchParams.latitude,
                longitude: searchParams.longitude,
                name: searchParams.name,
                page: searchParams.page,
                size: searchParams.size
            }
        );
    }

    /**
     * Récupérer les cabinets par notaire
     * GET /cabinets/by-notary/{id}
     * @param id
     * @returns
     */
    getCabinetsByNotary(id: string): Observable<Cabinet> {
        return this.apiService.get<Cabinet>(
            APP_CONSTANTS.API_ENDPOINTS.CABINET.BY_NOTARY,
            { id }
        );
    }
}