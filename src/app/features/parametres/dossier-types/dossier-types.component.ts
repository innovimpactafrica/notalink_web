import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../core/layouts/main-layout/main-layout.component';
import { CreateDossierTypeModalComponent } from '../../../shared/components/settings/dossier-type/create-dossier-type-modal/create-dossier-type-modal.component';
import { AddRequiredDocumentModalComponent } from '../../../shared/components/settings/dossier-type/create-document-type-modal/create-document-type-modal.component'; import { DeleteConfirmationModalComponent } from '../../../shared/components/settings/dossier-type/delete-confirmation-modal/delete-confirmation-modal.component';
import { NotificationModalComponent, NotificationData } from '../../../shared/ui/notification-modal2/notification-modal2.component';
import { CaseTypeService } from '../../../core/services/case-type.service';
import { CaseType, CaseTypeRequest } from '../../../shared/interfaces/models.interface';
import { RequiredDocument } from '../../../shared/interfaces/models.interface';
import { DocumentListModalComponent } from '../../../shared/components/settings/dossier-type/document-list-modal/document-list-modal.component';

@Component({
  selector: 'app-dossier-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MainLayoutComponent,
    ReactiveFormsModule,
    CreateDossierTypeModalComponent,
    AddRequiredDocumentModalComponent, // Updated
    DeleteConfirmationModalComponent,
    NotificationModalComponent,
    DocumentListModalComponent
  ],
  templateUrl: './dossier-types.component.html'
})
export class DossierTypesComponent implements OnInit {
  // Data
  caseTypes: CaseType[] = [];
  filteredCaseTypes: CaseType[] = [];
  filteredDocuments: RequiredDocument[] = [];
  searchTerm = '';

  // Loading states
  isLoading = false;
  isSubmitting = false;
  isDeleting = false;

  // Modal states
  showCreateModal = false;
  showAddDocumentModal = false;
  showDeleteModal = false;
  showDocumentListModal = false;
  isEditMode = false;

  // Selected items
  selectedCaseType: { name: string } | null = null;
  selectedCaseTypeForEdit: CaseType | null = null;
  selectedCaseTypeForDelete: CaseType | null = null;
  selectedCaseTypeForDocument: CaseType | null = null;

  // Notifications
  notificationData: NotificationData | null = null;

  constructor(private caseTypeService: CaseTypeService) { }

  ngOnInit() {
    this.loadCaseTypes();
  }

  trackByCaseType(index: number, item: CaseType): string {
    return item.id;
  }

  private loadCaseTypes() {
    this.isLoading = true;
    this.caseTypeService.getAllCaseTypes().subscribe({
      next: (caseTypes) => {
        this.caseTypes = caseTypes;
        this.filterCaseTypes();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de dossiers:', error);
        this.showNotification('error', 'Erreur lors du chargement des données');
        this.isLoading = false;
      }
    });
  }

  filterCaseTypes() {
    if (!this.searchTerm.trim()) {
      this.filteredCaseTypes = [...this.caseTypes];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredCaseTypes = this.caseTypes.filter(ct =>
        ct.name.toLowerCase().includes(term)
      );
    }
  }

  // Create Modal Methods
  openCreateModal() {
    this.isEditMode = false;
    this.selectedCaseType = null;
    this.showCreateModal = true;
  }

  openEditModal(caseType: CaseType) {
    this.isEditMode = true;
    this.selectedCaseType = {
      name: caseType.name
    };
    this.selectedCaseTypeForEdit = caseType;
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.isEditMode = false;
    this.selectedCaseType = null;
    this.selectedCaseTypeForEdit = null;
  }

  onSubmitCaseType(data: { name: string }) {
    this.isSubmitting = true;

    const request: CaseTypeRequest = { name: data.name, requiredDocuments: [] };

    const operation = this.isEditMode
      ? this.caseTypeService.updateCaseType(this.selectedCaseTypeForEdit!.id, request)
      : this.caseTypeService.createCaseType(request);

    operation.subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.closeCreateModal();
        this.loadCaseTypes();

        const message = this.isEditMode
          ? 'Type de dossier mis à jour avec succès'
          : 'Type de dossier créé avec succès';
        this.showNotification('success', message);
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde:', error);
        this.isSubmitting = false;
        this.showNotification('error', 'Une erreur est survenue');
      }
    });
  }

  // Add Required Document Modal Methods
  openAddDocumentModal(caseType: CaseType) {
    this.selectedCaseTypeForDocument = caseType;
    this.showAddDocumentModal = true;
  }

  closeAddDocumentModal() {
    this.showAddDocumentModal = false;
    this.selectedCaseTypeForDocument = null;
  }

  onSubmitRequiredDocument(data: { documentName: string }) {
    this.isSubmitting = true;

    this.caseTypeService.addRequiredDocument(this.selectedCaseTypeForDocument!.id, data.documentName).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.closeAddDocumentModal();
        this.loadCaseTypes(); // Reload to update the list
        this.showNotification('success', 'Document requis ajouté avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du document:', error);
        this.isSubmitting = false;
        this.showNotification('error', 'Une erreur est survenue');
      }
    });
  }

  // Document List Modal Methods
  viewDocuments(caseType: CaseType) {
    this.selectedCaseTypeForDocument = caseType;
    this.caseTypeService.getRequiredDocuments(caseType.id).subscribe({
      next: (docs) => {
        this.filteredDocuments = docs;
        this.showDocumentListModal = true;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des documents:', error);
        this.showNotification('error', 'Erreur lors du chargement des documents');
      }
    });
  }

  closeDocumentListModal() {
    this.showDocumentListModal = false;
    this.selectedCaseTypeForDocument = null;
    this.filteredDocuments = [];
  }

  // Delete Modal Methods
  openDeleteModal(caseType: CaseType) {
    this.selectedCaseTypeForDelete = caseType;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedCaseTypeForDelete = null;
  }

  confirmDelete() {
    if (!this.selectedCaseTypeForDelete) return;

    this.isDeleting = true;
    this.caseTypeService.deleteCaseType(this.selectedCaseTypeForDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadCaseTypes();
        this.showNotification('success', 'Type de dossier supprimé avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.isDeleting = false;
        this.showNotification('error', 'Une erreur est survenue');
      }
    });
  }

  // Notification Methods
  private showNotification(type: 'success' | 'error', message: string) {
    this.notificationData = { type, message };
  }

  closeNotification() {
    this.notificationData = null;
  }

  getRequiredDocumentNames(caseType: CaseType): string {
    return caseType.requiredDocuments.map(rd => rd.documentName).join(', ') || 'Aucun document requis';
  }
}