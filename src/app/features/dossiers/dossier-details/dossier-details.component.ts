import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../core/layouts/main-layout/main-layout.component';
import { DossierApercuComponent } from '../../../shared/components/dossiers/dossier-apercu/dossier-apercu.component';
import { DossierDocumentsComponent } from '../../../shared/components/dossiers/dossier-documents/dossier-documents.component';
import { DossierPaymentsComponent } from '../../../shared/components/dossiers/dossier-payments/dossier-payments.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseFileService } from '../../../core/services/case-file.service';
import { CaseTypeService } from '../../../core/services/case-type.service';
import { CaseFile, CaseFileStatus, CaseType, PaginationParams } from '../../../shared/interfaces/models.interface';
import { firstValueFrom } from 'rxjs';

interface DisplayDossier {
  id: string;
  title: string;
  type: string;
  status: string;
  createdDate: string;
  lastUpdate: string;
  client: string;
  nextAction: string;
  nextActionDate: string;
  progress: number;
  color: string;
  reference: string;
}

@Component({
  selector: 'app-dossier-details',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    DossierApercuComponent,
    DossierDocumentsComponent,
    DossierPaymentsComponent,
  ],
  templateUrl: './dossier-details.component.html'
})
export class DossierDetailsComponent implements OnInit {
  activeTab: 'apercu' | 'documents' | 'paiements' = 'apercu';
  displayDossier: DisplayDossier | undefined;
  isLoading = true;
  caseTypes: CaseType[] = [];
  cabinetId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseFileService: CaseFileService,
    private caseTypeService: CaseTypeService
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.loadCaseTypes();

    // Récupérer le dossier depuis l'état de navigation
    const state = history.state as { dossier?: DisplayDossier };
    if (state.dossier) {
      this.displayDossier = state.dossier;
      this.isLoading = false;
      return;
    }

    // Si l'état de navigation n'est pas disponible, récupérer via l'API
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id && this.cabinetId) {
        try {
          const caseFile = await this.loadCaseFileById(id);
          if (caseFile) {
            this.displayDossier = await this.mapCaseFileToDisplayDossier(caseFile);
          } else {
            this.displayDossier = undefined;
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du dossier:', error);
          this.displayDossier = undefined;
        } finally {
          this.isLoading = false;
        }
      } else {
        this.isLoading = false;
      }
    });
  }

  private async loadCaseTypes(): Promise<void> {
    try {
      this.caseTypes = await firstValueFrom(this.caseTypeService.getAllCaseTypes());
    } catch (error) {
      console.error('Erreur lors du chargement des types de dossiers:', error);
      this.caseTypes = [];
    }
  }

  private async loadCaseFileById(id: string): Promise<CaseFile | undefined> {
    try {
      if (!this.cabinetId) {
        console.warn('CabinetId non disponible');
        return undefined;
      }
      const paginationParams: PaginationParams = {
        page: 0,
        size: 1,
        search: id, // Utiliser l'ID comme terme de recherche pour filtrer
      };
      const response = await firstValueFrom(
        this.caseFileService.getCaseFilesByCabinet(this.cabinetId, undefined, paginationParams)
      );
      return response.content.find((caseFile) => caseFile.id === id);
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier:', error);
      return undefined;
    }
  }

  private async getCaseTypeName(caseTypeId: string): Promise<string> {
    const cachedType = this.caseTypes.find((type) => type.id === caseTypeId);
    if (cachedType) {
      return cachedType.name;
    }
    try {
      const caseType = await firstValueFrom(this.caseTypeService.getCaseTypeById(caseTypeId));
      if (caseType && caseType.name) {
        this.caseTypes.push(caseType);
        return caseType.name;
      }
      return 'Type inconnu';
    } catch (error) {
      console.error(`Erreur lors de la récupération du nom du type ${caseTypeId}:`, error);
      return 'Type inconnu';
    }
  }

  private async mapCaseFileToDisplayDossier(caseFile: CaseFile): Promise<DisplayDossier> {
    const typeName = await this.getCaseTypeName(caseFile.caseTypeId);
    return {
      id: caseFile.id,
      title: caseFile.title,
      reference: caseFile.reference,
      type: typeName,
      status: caseFile.status,
      createdDate: this.formatDate(caseFile.openingDate),
      lastUpdate: caseFile.reference, // À ajuster si vous avez une propriété spécifique
      client: caseFile.lawyerId, // À remplacer par le nom de l'avocat si nécessaire
      nextAction: 'Prochaine action', // À ajuster selon vos données
      nextActionDate: this.formatDate(new Date()), // À ajuster selon vos données
      progress: this.calculateProgress(caseFile),
      color: this.getStatusColor(caseFile.status),
    };
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  private calculateProgress(caseFile: CaseFile): number {
    switch (caseFile.status) {
      case CaseFileStatus.OPEN:
        return 10;
      case CaseFileStatus.IN_PROGRESS:
        return 50;
      case CaseFileStatus.PENDING:
        return 75;
      case CaseFileStatus.CLOSED:
        return 100;
      case CaseFileStatus.ARCHIVED:
        return 100;
      default:
        return 0;
    }
  }

  private getStatusColor(status: CaseFileStatus): string {
    switch (status) {
      case CaseFileStatus.OPEN:
        return 'bg-blue-500 text-blue-500';
      case CaseFileStatus.IN_PROGRESS:
        return 'bg-yellow-500 text-yellow-500';
      case CaseFileStatus.PENDING:
        return 'bg-orange-500 text-orange-500';
      case CaseFileStatus.CLOSED:
        return 'bg-green-500 text-green-500';
      case CaseFileStatus.ARCHIVED:
        return 'bg-gray-500 text-gray-500';
      default:
        return 'bg-gray-500 text-gray-500';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case CaseFileStatus.OPEN:
        return 'bg-blue-100 text-blue-800';
      case CaseFileStatus.IN_PROGRESS:
        return 'bg-[#FEF3C7] text-[#92400E]';
      case CaseFileStatus.PENDING:
        return 'bg-[#1C3055] bg-opacity-10 text-[#1C3055]';
      case CaseFileStatus.CLOSED:
        return 'bg-[#16A34A] bg-opacity-10 text-[#16A34A]';
      case CaseFileStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case CaseFileStatus.OPEN:
        return 'Ouvert';
      case CaseFileStatus.IN_PROGRESS:
        return 'En cours';
      case CaseFileStatus.PENDING:
        return 'En attente';
      case CaseFileStatus.CLOSED:
        return 'Fermé';
      case CaseFileStatus.ARCHIVED:
        return 'Archivé';
      default:
        return status;
    }
  }

  setActiveTab(tab: 'apercu' | 'documents' | 'paiements') {
    this.activeTab = tab;
  }
}