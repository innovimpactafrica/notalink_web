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
  template: `
    <app-main-layout pageTitle="Dossiers clients">
      <!-- En-tête du dossier -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="p-6 border-b border-gray-200">
          <div class="flex flex-col mb-6">
            <h1 class="text-2xl font-semibold text-[#1C3055]">{{ displayDossier?.title || 'Dossier non trouvé' }}</h1>
            <div *ngIf="displayDossier">
              <span class="text-[#6B7280] text-xs font-medium rounded-full">
                {{ displayDossier.type }}
              </span>
              <span class="hidden sm:inline px-2">•</span>
              <span [ngClass]="getStatusClass(displayDossier.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                {{ getStatusLabel(displayDossier.status) }}
              </span>
            </div>
          </div>

          <!-- Barre de progression -->
          <div class="mb-4" *ngIf="displayDossier">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div [ngClass]="displayDossier.color" class="h-2 rounded-full" [style.width]="displayDossier.progress + '%'"></div>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-medium text-gray-700">Progression</span>
              <span class="text-xs font-medium text-gray-700">{{ displayDossier.progress }}%</span>
            </div>
          </div>
        </div>

        <!-- Navigation par onglets -->
        <div class="border-b border-gray-200" *ngIf="displayDossier">
          <nav class="flex">
            <button
              (click)="setActiveTab('apercu')"
              [class]="activeTab === 'apercu'
                ? 'py-4 px-1 w-full border-b-2 border-yellow-500 text-[#D4B036] font-semibold text-md whitespace-nowrap'
                : 'py-4 px-1 w-full border-b-2 border-transparent text-gray-500 hover:text-[#D4B036] font-semibold text-md whitespace-nowrap'"
            >
              Aperçu
            </button>
            <button
              (click)="setActiveTab('documents')"
              [class]="activeTab === 'documents'
                ? 'py-4 px-1 w-full border-b-2 border-yellow-500 text-[#D4B036] font-semibold text-md whitespace-nowrap'
                : 'py-4 px-1 w-full border-b-2 border-transparent text-gray-500 hover:text-[#D4B036] font-semibold text-md whitespace-nowrap'"
            >
              Documents
            </button>
            <button
              (click)="setActiveTab('paiements')"
              [class]="activeTab === 'paiements'
                ? 'py-4 px-1 w-full border-b-2 border-yellow-500 text-[#D4B036] font-semibold text-md whitespace-nowrap'
                : 'py-4 px-1 w-full border-b-2 border-transparent text-gray-500 hover:text-[#D4B036] font-semibold text-md whitespace-nowrap'"
            >
              Paiements
            </button>
          </nav>
        </div>
      </div>

      <!-- Contenu dynamique selon l'onglet actif -->
      <div class="transition-all duration-300 ease-in-out" *ngIf="displayDossier">
        <app-dossier-apercu *ngIf="activeTab === 'apercu'"></app-dossier-apercu>
        <app-dossier-documents *ngIf="activeTab === 'documents'"></app-dossier-documents>
        <app-dossier-payments *ngIf="activeTab === 'paiements'"></app-dossier-payments>
      </div>
      <!-- [dossier]="displayDossier"  a mettre dans ses trois composants d'en haut-->
      <!-- Message d'erreur si aucun dossier -->
      <div *ngIf="!displayDossier && !isLoading" class="text-center py-8">
        <h3 class="text-sm font-medium text-gray-900">Dossier non trouvé</h3>
        <p class="mt-1 text-xs text-gray-500">Le dossier demandé n'existe pas ou n'est pas accessible.</p>
      </div>

      <!-- État de chargement -->
      <div *ngIf="isLoading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4B036]"></div>
        <span class="ml-3 text-gray-600">Chargement du dossier...</span>
      </div>

      <!-- Bouton flottant -->
      <div class="fixed bottom-10 right-10 mb-4">
        <button class="rounded-full bg-[#D4B036] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 p-4">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.06704 24.975H16.54C17.5276 24.975 17.5276 24.9819 18.0009 25.3317C18.4741 25.6814 23.8786 29.3645 23.8786 29.3645V24.975H24.1324C27.0267 24.975 29.3655 22.794 29.3655 20.078V5.75057C29.3655 3.03459 27.0198 0.833008 24.1324 0.833008H6.06704C3.1796 0.833008 0.833984 3.03459 0.833984 5.75057V20.078C0.833984 22.794 3.1796 24.975 6.06704 24.975Z"
              fill="#1C3055"
            />
          </svg>
        </button>
      </div>
    </app-main-layout>
  `,
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
  ) {}

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