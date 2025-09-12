import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../core/layouts/main-layout/main-layout.component';
import { CreateDossierTypeModalComponent } from '../../../shared/components/settings/dossier-type/create-dossier-type-modal/create-dossier-type-modal.component';
import { CreateDocumentTypeModalComponent } from '../../../shared/components/settings/dossier-type/create-document-type-modal/create-document-type-modal.component';
import { DeleteConfirmationModalComponent } from '../../../shared/components/settings/dossier-type/delete-confirmation-modal/delete-confirmation-modal.component';
import { NotificationModalComponent, NotificationData } from '../../../shared/ui/notification-modal2/notification-modal2.component';
import { DossierTypesService } from '../../../core/services/settings/dossier-types.service';
import { DossierType } from '../../../core/interfaces/dossier-type.interface';
import { DocumentType } from '../../../core/interfaces/dossier-type.interface'; // Ensure this is imported
import { DocumentListModalComponent } from '../../../shared/components/settings/dossier-type/document-list-modal/document-list-modal.component';

@Component({
  selector: 'app-dossier-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MainLayoutComponent,
    CreateDossierTypeModalComponent,
    CreateDocumentTypeModalComponent,
    DeleteConfirmationModalComponent,
    NotificationModalComponent,
    DocumentListModalComponent
  ],
  template: `
    <app-main-layout pageTitle="Types de dossiers">
      <div class="mx-auto">
        <!-- Header Section -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Gestion des types de dossiers</h1>
            <p class="text-gray-600">Configurez les différents types de dossiers traités par votre étude notariale.</p>
          </div>

          <!-- Add Button -->
          <button
            (click)="openCreateModal()"
            class="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nouveau type
          </button>
        </div>

        <!-- Controls Section -->
         <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
           <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
             <!-- Search -->
             <div class="relative flex-1 max-w-md">
               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                 </svg>
               </div>
               <input
                 type="text"
                 [(ngModel)]="searchTerm"
                 (input)="filterDossierTypes()"
                 placeholder="Rechercher un type de dossier..."
                 class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
             </div>
           </div>

           <!-- Loading State -->
           <div *ngIf="isLoading" class="flex justify-center items-center py-12">
             <svg class="animate-spin h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
           </div>

           <!-- Dossier Types List -->
           <div *ngIf="!isLoading" class="space-y-4">
             <div *ngFor="let dossierType of filteredDossierTypes; trackBy: trackByDossierType" 
                  class="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
               
               <div class="flex-1">
                 <h3 class="text-lg font-medium text-gray-900">{{ dossierType.nom }}</h3>
                 <p *ngIf="dossierType.description" class="text-sm text-gray-600 mt-1">{{ dossierType.description }}</p>
               </div>
   
               <div class="flex items-center space-x-2 ml-4">
                 <!-- View Documents Button -->
                 <button
                   (click)="viewDocuments(dossierType)"
                   class="p-2 rounded-full bg-gray-100"
                   title="Voir les documents">
                   <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.0013 6.66634C11.1596 6.66634 9.66797 8.15801 9.66797 9.99967V16.6663H3.83464C3.39261 16.6663 2.96868 16.4907 2.65612 16.1782C2.34356 15.8656 2.16797 15.4417 2.16797 14.9997V4.99967C2.16797 4.07467 2.90964 3.33301 3.83464 3.33301H8.83464L10.5013 4.99967H17.168C17.61 4.99967 18.0339 5.17527 18.3465 5.48783C18.659 5.80039 18.8346 6.22431 18.8346 6.66634V8.47467L17.5096 7.15801L17.0263 6.66634H13.0013ZM19.668 11.6663V17.4997C19.668 18.4247 18.9263 19.1663 18.0013 19.1663H13.0013C12.5593 19.1663 12.1354 18.9907 11.8228 18.6782C11.5102 18.3656 11.3346 17.9417 11.3346 17.4997V9.99967C11.3346 9.08301 12.0846 8.33301 13.0013 8.33301H16.3346L19.668 11.6663ZM18.0013 12.358L15.643 9.99967H15.5013V12.4997H18.0013V12.358Z" fill="#6B7280"/>
                    </svg>
                 </button>

                 <!-- Duplicate Button -->
                 <button
                   (click)="openDocumentModal(dossierType)"
                   [disabled]="isDuplicating === dossierType.id"
                   class="p-2 rounded-full bg-blue-100 disabled:opacity-50"
                   title="Dupliquer">
                   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_150_3914)">
                      <path d="M12.845 0.833008H2.5V19.1663H11.5633C10.8494 18.2526 10.4475 17.1339 10.4168 15.9747C10.3861 14.8155 10.7282 13.6771 11.3928 12.7269C12.0574 11.7766 13.0094 11.0648 14.1087 10.6959C15.2081 10.3271 16.3968 10.3208 17.5 10.678V5.48801L12.845 0.833008ZM12.0833 6.24967V2.49967L15.8333 6.24967H12.0833Z" fill="#2563EB"/>
                      <path d="M16.668 11.667V15.0003H20.0013V16.667H16.668V20.0003H15.0013V16.667H11.668V15.0003H15.0013V11.667H16.668Z" fill="#2563EB"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_150_3914">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                   </svg>
                 </button>

                 <!-- Edit Button -->
                 <button
                   (click)="openEditModal(dossierType)"
                   class="p-2 rounded-full bg-orange-100"
                   title="Modifier">
                   <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 15.5V11.9583L11 0.979167C11.1667 0.826389 11.3508 0.708333 11.5525 0.625C11.7542 0.541667 11.9658 0.5 12.1875 0.5C12.4092 0.5 12.6244 0.541667 12.8333 0.625C13.0422 0.708333 13.2228 0.833333 13.375 1L14.5208 2.16667C14.6875 2.31944 14.8092 2.5 14.8858 2.70833C14.9625 2.91667 15.0006 3.125 15 3.33333C15 3.55556 14.9619 3.7675 14.8858 3.96917C14.8097 4.17083 14.6881 4.35472 14.5208 4.52083L3.54167 15.5H0ZM12.1667 4.5L13.3333 3.33333L12.1667 2.16667L11 3.33333L12.1667 4.5Z" fill="#F39C12"/>
                    </svg>
                 </button>
   
                 <!-- Delete Button -->
                 <button
                   (click)="openDeleteModal(dossierType)"
                   class="p-2 rounded-full bg-red-100"
                   title="Supprimer">
                   <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.1693 9.16667V14.1667M8.83594 9.16667V14.1667M5.5026 5.83333V15.8333C5.5026 16.2754 5.6782 16.6993 5.99076 17.0118C6.30332 17.3244 6.72724 17.5 7.16927 17.5H13.8359C14.278 17.5 14.7019 17.3244 15.0144 17.0118C15.327 16.6993 15.5026 16.2754 15.5026 15.8333V5.83333M3.83594 5.83333H17.1693M6.33594 5.83333L8.0026 2.5H13.0026L14.6693 5.83333" stroke="#F44336" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                 </button>
               </div>
             </div>
   
             <!-- Empty State -->
             <div *ngIf="filteredDossierTypes.length === 0" class="text-center py-12">
               <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
               </svg>
               <h3 class="mt-4 text-sm font-medium text-gray-900">
                 {{ searchTerm ? 'Aucun résultat trouvé' : 'Aucun type de dossier' }}
               </h3>
               <p class="mt-2 text-sm text-gray-500">
                 {{ searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre premier type de dossier' }}
               </p>
               <button *ngIf="!searchTerm"
                 (click)="openCreateModal()"
                 class="mt-4 inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition-colors">
                 <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                 </svg>
                 Créer un type de dossier
               </button>
             </div>
           </div>
         </div>
      </div>

      <!-- Modals -->
      <app-create-dossier-type-modal
        [show]="showCreateModal"
        [isEditMode]="isEditMode"
        [initialData]="selectedDossierType"
        [isLoading]="isSubmitting"
        (cancel)="closeCreateModal()"
        (submit)="onSubmitDossierType($event)">
      </app-create-dossier-type-modal>

      <app-create-document-type-modal
        [show]="showDocumentModal"
        [dossierTypes]="dossierTypes"
        [selectedDossierTypeId]="selectedDossierTypeForDocument?.id || null"
        [isLoading]="isSubmitting"
        (cancel)="closeDocumentModal()"
        (submit)="onSubmitDocument($event)">
      </app-create-document-type-modal>

      <app-delete-confirmation-modal
        [show]="showDeleteModal"
        [itemType]="'dossier'"
        [isLoading]="isDeleting"
        (cancel)="closeDeleteModal()"
        (confirm)="confirmDelete()">
      </app-delete-confirmation-modal>

      <app-notification-modal
        [show]="!!notificationData"
        [data]="notificationData"
        (close)="closeNotification()">
      </app-notification-modal>

      <!-- Modal de liste des documents -->
      <app-document-list-modal
        [show]="showDocumentListModal"
        [dossierType]="selectedDossierTypeForDocument"
        [documents]="filteredDocuments"
        (close)="closeDocumentListModal()">
      </app-document-list-modal>
    </app-main-layout>
  `
})
export class DossierTypesComponent implements OnInit {
  // Data
  dossierTypes: DossierType[] = [];
  filteredDossierTypes: DossierType[] = [];
  documentTypes: DocumentType[] = []; // Typé correctement
  filteredDocuments: DocumentType[] = []; // Nouvelle propriété pour les documents filtrés
  searchTerm = '';

  // Loading states
  isLoading = false;
  isSubmitting = false;
  isDeleting = false;
  isDuplicating: string | null = null;

  // Modal states
  showCreateModal = false;
  showDocumentModal = false;
  showDeleteModal = false;
  showDocumentListModal = false;
  isEditMode = false;

  // Selected items
  selectedDossierType: { nom: string; description?: string } | null = null;
  selectedDossierTypeForEdit: DossierType | null = null;
  selectedDossierTypeForDelete: DossierType | null = null;
  selectedDossierTypeForDocument: DossierType | null = null;

  // Notifications
  notificationData: NotificationData | null = null;

  constructor(private dossierTypesService: DossierTypesService) { }

  ngOnInit() {
    this.loadDossierTypes();
    this.loadDocumentTypes();
  }

  trackByDossierType(index: number, item: DossierType): string {
    return item.id;
  }

  private loadDossierTypes() {
    this.isLoading = true;
    this.dossierTypesService.getDossierTypes().subscribe({
      next: (dossierTypes) => {
        this.dossierTypes = dossierTypes;
        this.filterDossierTypes();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de dossiers:', error);
        this.showNotification('error', 'Erreur lors du chargement des données');
        this.isLoading = false;
      }
    });
  }

  private loadDocumentTypes() {
    this.dossierTypesService.getDocumentsByDossierType('1').subscribe({
      next: (docs) => {
        this.documentTypes = docs;
        this.updateFilteredDocuments(); // Mettre à jour les documents filtrés après chargement
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de documents:', error);
      }
    });
  }

  filterDossierTypes() {
    if (!this.searchTerm.trim()) {
      this.filteredDossierTypes = [...this.dossierTypes];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredDossierTypes = this.dossierTypes.filter(dt =>
        dt.nom.toLowerCase().includes(term) ||
        (dt.description && dt.description.toLowerCase().includes(term))
      );
    }
  }

  // Méthode pour mettre à jour les documents filtrés en fonction du dossier sélectionné
  private updateFilteredDocuments() {
    if (this.selectedDossierTypeForDocument && this.documentTypes) {
      this.filteredDocuments = this.documentTypes;
    } else {
      this.filteredDocuments = [];
    }
  }

  // Create Modal Methods
  openCreateModal() {
    this.isEditMode = false;
    this.selectedDossierType = null;
    this.showCreateModal = true;
  }

  openEditModal(dossierType: DossierType) {
    this.isEditMode = true;
    this.selectedDossierType = {
      nom: dossierType.nom,
      description: dossierType.description
    };
    this.selectedDossierTypeForEdit = dossierType;
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.isEditMode = false;
    this.selectedDossierType = null;
    this.selectedDossierTypeForEdit = null;
  }

  onSubmitDossierType(data: { nom: string; description?: string }) {
    this.isSubmitting = true;

    const operation = this.isEditMode
      ? this.dossierTypesService.updateDossierType(this.selectedDossierTypeForEdit!.id, data)
      : this.dossierTypesService.createDossierType(data);

    operation.subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.closeCreateModal();
        this.loadDossierTypes();

        const message = this.isEditMode
          ? 'Type de dossier mis à jour avec succès'
          : 'Type de dossier créé avec succès';
        this.showNotification('success', message);
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde:', error);
        this.isSubmitting = false;
        this.showNotification('error', error.message || 'Une erreur est survenue');
      }
    });
  }

  // Document Modal Methods
  openDocumentModal(dossierType: DossierType) {
    this.selectedDossierTypeForDocument = dossierType;
    this.updateFilteredDocuments(); // Mettre à jour les documents filtrés
    this.showDocumentModal = true;
  }

  closeDocumentModal() {
    this.showDocumentModal = false;
    this.selectedDossierTypeForDocument = null;
    this.updateFilteredDocuments(); // Réinitialiser les documents filtrés
  }

  onSubmitDocument(data: any) {
    this.isSubmitting = true;

    this.dossierTypesService.createDocumentType(data).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.closeDocumentModal();
        this.loadDocumentTypes(); // Recharger les documents après création
        this.showNotification('success', 'Type de document créé avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la création du document:', error);
        this.isSubmitting = false;
        this.showNotification('error', error.message || 'Une erreur est survenue');
      }
    });
  }

  // Document List Modal Methods
  viewDocuments(dossierType: DossierType) {
    this.selectedDossierTypeForDocument = dossierType;
    this.updateFilteredDocuments(); // Mettre à jour les documents filtrés
    this.showDocumentListModal = true;
  }

  closeDocumentListModal() {
    this.showDocumentListModal = false;
    this.selectedDossierTypeForDocument = null;
    this.updateFilteredDocuments(); // Réinitialiser les documents filtrés
  }

  // Delete Modal Methods
  openDeleteModal(dossierType: DossierType) {
    this.selectedDossierTypeForDelete = dossierType;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedDossierTypeForDelete = null;
  }

  confirmDelete() {
    if (!this.selectedDossierTypeForDelete) return;

    this.isDeleting = true;
    this.dossierTypesService.deleteDossierType(this.selectedDossierTypeForDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadDossierTypes();
        this.showNotification('success', 'Type de dossier supprimé avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.isDeleting = false;
        this.showNotification('error', error.message || 'Une erreur est survenue');
      }
    });
  }

  // Duplicate Method
  duplicateDossierType(dossierType: DossierType) {
    this.isDuplicating = dossierType.id;

    this.dossierTypesService.duplicateDossierType(dossierType.id).subscribe({
      next: (result) => {
        this.isDuplicating = null;
        this.loadDossierTypes();
        this.showNotification('success', 'Type de dossier dupliqué avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la duplication:', error);
        this.isDuplicating = null;
        this.showNotification('error', error.message || 'Une erreur est survenue');
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
}