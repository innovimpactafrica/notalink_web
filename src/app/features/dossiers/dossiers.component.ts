import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CaseFile, CaseFileRequest, CaseType, CaseFileStatus, PaginationParams } from '../../shared/interfaces/models.interface';
import { CaseFileService } from '../../core/services/case-file.service';
import { UserService } from '../../core/services/user.service';
import { CaseTypeService } from '../../core/services/case-type.service';
import { CreateCaseFileModalComponent } from '../../shared/components/dossiers/create-case-file-modal/create-case-file-modal.component';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';

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
  selector: 'app-dossiers',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent, CreateCaseFileModalComponent],
  templateUrl: './dossiers.component.html',
})
export class DossiersComponent implements OnInit {
  @ViewChild(CreateCaseFileModalComponent) createModal!: CreateCaseFileModalComponent;

  // Properties
  searchTerm = '';
  selectedStatus = '';
  sortOption = '';
  showCreateModal = false;
  isLoading = false;
  cabinetId: string | null = null;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 1;
  totalElements = 0;

  // Sorting
  sortField = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Data
  caseFiles: CaseFile[] = [];
  filteredDossiers: DisplayDossier[] = [];
  caseTypes: CaseType[] = [];
  lawyers: any[] = [
    { id: 1, name: 'Jean Dupont' },
    { id: 2, name: 'Marie Martin' },
    { id: 3, name: 'Pierre Durand' },
    { id: 4, name: 'Sophie Bernard' },
  ];

  constructor(
    private router: Router,
    private caseFileService: CaseFileService,
    private userService: UserService,
    private caseTypeService: CaseTypeService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getCabinetIdOfCurrentUser().subscribe({
      next: async (cabinetId) => {
        this.cabinetId = cabinetId;
        await this.loadInitialData();
      },
      error: (err) => {
        console.error('Erreur récupération cabinetId:', err);
        this.isLoading = false;
      },
    });
  }

  private async loadInitialData(): Promise<void> {
    try {
      await Promise.all([this.loadCaseFiles(), this.loadCaseTypes()]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadCaseFiles(): Promise<void> {
    if (!this.cabinetId) {
      console.warn('CabinetId non disponible pour charger les dossiers');
      return;
    }
    try {
      const paginationParams: PaginationParams = {
        page: this.currentPage,
        size: this.pageSize,
        sort: this.sortField,
        direction: this.sortDirection,
        search: this.searchTerm || undefined,
      };
      const response = await firstValueFrom(
        this.caseFileService.getCaseFilesByCabinet(this.cabinetId, this.selectedStatus as CaseFileStatus, paginationParams)
      );
      if (response && response.content) {
        this.caseFiles = response.content.map((caseFile) => ({
          ...caseFile,
          openingDate: new Date(caseFile.openingDate),
          createdAt: new Date(caseFile.createdAt),
          updatedAt: new Date(caseFile.updatedAt),
        }));
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.updateDisplayDossiers();
      } else {
        this.caseFiles = [];
        this.totalPages = 1;
        this.totalElements = 0;
        this.updateDisplayDossiers();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error);
      this.caseFiles = [];
      this.totalPages = 1;
      this.totalElements = 0;
      this.updateDisplayDossiers();
    }
  }

  private async loadCaseTypes(): Promise<void> {
    try {
      this.caseTypes = await firstValueFrom(this.caseTypeService.getAllCaseTypes());
    } catch (error) {
      console.error('Erreur lors du chargement des types de dossiers:', error);
      this.caseTypes = [
        { id: '1', name: 'Vente immobilière', requiredDocuments: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Succession', requiredDocuments: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Donation', requiredDocuments: [], createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'Création société', requiredDocuments: [], createdAt: new Date(), updatedAt: new Date() },
      ];
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

  private async updateDisplayDossiers(): Promise<void> {
    this.filteredDossiers = await Promise.all(
      this.caseFiles.map(async (caseFile) => this.mapCaseFileToDisplayDossier(caseFile))
    );
    this.filteredDossiers = this.filteredDossiers.filter((dossier) => this.applyLocalFilters(dossier));
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
      lastUpdate: caseFile.reference,
      client: caseFile.lawyerId,
      nextAction: 'Prochaine action',
      nextActionDate: this.formatDate(new Date()),
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

  private applyLocalFilters(dossier: DisplayDossier): boolean {
    const searchLower = this.searchTerm.toLowerCase();
    const matchesSearch =
      !this.searchTerm ||
      dossier.title.toLowerCase().includes(searchLower) ||
      dossier.reference.toLowerCase().includes(searchLower) ||
      dossier.client.toLowerCase().includes(searchLower) ||
      dossier.type.toLowerCase().includes(searchLower);
    const matchesStatus = !this.selectedStatus || dossier.status === this.selectedStatus;
    return matchesSearch && matchesStatus;
  }

  applyFilters(): void {
    switch (this.sortOption) {
      case 'title-asc':
        this.sortField = 'title';
        this.sortDirection = 'asc';
        break;
      case 'title-desc':
        this.sortField = 'title';
        this.sortDirection = 'desc';
        break;
      case 'openingDate-desc':
        this.sortField = 'openingDate';
        this.sortDirection = 'desc';
        break;
      case 'openingDate-asc':
        this.sortField = 'openingDate';
        this.sortDirection = 'asc';
        break;
      default:
        this.sortField = 'createdAt';
        this.sortDirection = 'desc';
    }
    this.currentPage = 0;
    this.loadCaseFiles();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadCaseFiles();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow);
    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }
    return pages;
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

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  async createCaseFile(caseFileData: CaseFileRequest): Promise<void> {
    if (!this.cabinetId) {
      console.error('Impossible de créer un dossier sans CabinetId');
      return;
    }

    const payload: CaseFileRequest = {
      ...caseFileData,
      cabinetId: Number(this.cabinetId),
    };

    try {
      const response = await firstValueFrom(this.caseFileService.createCaseFile(payload));
      if (response) {
        this.currentPage = 0;
        await this.loadCaseFiles();
        if (this.createModal) {
          this.createModal.onSubmitComplete();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error);
      if (this.createModal) {
        this.createModal.onSubmitError();
      }
    }
  }

  // dossiers.component.ts
  openDossier(dossier: DisplayDossier): void {
    this.router.navigate(['/folders', dossier.id], {
      state: { dossier } // Passer l'objet DisplayDossier dans l'état de navigation
    });
  }
}