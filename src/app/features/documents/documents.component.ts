import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/documents/document.service';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { DocumentSearchComponent } from '../../shared/components/documents/document-search/document-search.component';
import { DocumentTabsComponent } from '../../shared/components/documents/document-tabs/document-tabs.component';
import { DocumentFolderComponent } from '../../shared/components/documents/document-folder/document-folder.component';
import { DocumentStatsComponent } from '../../shared/components/documents/document-stats/document-stats.component';
import { AddDocumentModalComponent } from '../../shared/components/documents/add-document-modal/add-document-modal.component';
import { ValidateDocumentModalComponent } from '../../shared/components/documents/validate-document-modal/validate-document-modal.component';
import { RequestDocumentsModalComponent } from '../../shared/components/documents/request-documents-modal/request-documents-modal.component';
import { DocumentDetailsModalComponent } from '../../shared/components/documents/document-detail-modal/document-detail-modal.component';
import { NotificationModalComponent, NotificationService } from '../../shared/ui/notification-modal/notification-modal.component';
import { Document, DocumentFolder, DocumentStats, DocumentStatus } from '../../core/interfaces/document.interface';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    DocumentSearchComponent,
    DocumentTabsComponent,
    DocumentFolderComponent,
    DocumentStatsComponent,
    AddDocumentModalComponent,
    ValidateDocumentModalComponent,
    RequestDocumentsModalComponent,
    DocumentDetailsModalComponent,
    NotificationModalComponent
  ],
  template: `
    <app-main-layout pageTitle="Documents">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header with title and Add button -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Gestions des documents</h1>
          <button
            (click)="openAddDocumentModal()"
            class="inline-flex items-center px-4 py-2 bg-[#D4B036] text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Ajouter un document
          </button>
        </div>
        
        <!-- Tabs Navigation -->
         <div class="mt-10">
           <app-document-tabs
             [activeTab]="activeTab"
             [stats]="documentStats$ | async"
             (tabChanged)="onTabChange($event)">
           </app-document-tabs>
         </div>

        <!-- Search and Filter Bar -->
        <div class="mb-6 mt-4">
          <app-document-search
            (searchChanged)="onSearchChange($event)"
            (filterClicked)="onFilterClick()">
          </app-document-search>
        </div>


        <!-- Main Content Area -->
        <div class="space-y-6">
          
          <!-- Document List (when activeTab !== 'tous') -->
          <div *ngIf="activeTab !== 'tous' && (filteredDocuments$ | async) as documents" 
               class="bg-white rounded-lg border border-gray-200">
            
            <!-- Individual Documents List -->
            <div class="divide-y divide-gray-200">
              <div *ngFor="let document of documents" 
                   class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150">
                
                <div class="flex flex-col justify-between gap-4 w-full">
                  <div class="flex justify-between"> 
                    <!-- Document Info -->
                    <div class="flex-1 flex items-center gap-4">
                      <!-- Status Icon -->
                      <div class="flex-shrink-0">
                        <div class="w-6 h-6 flex items-center justify-center"
                             [ngClass]="getStatusIconClasses(document.status)">
                          <svg *ngIf="document.status === 'a-valider'" class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                          </svg>
                          <svg *ngIf="document.status === 'en-attente'" class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                          </svg>
                          <svg *ngIf="document.status === 'valides'" class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          <svg *ngIf="document.status === 'a-signer'" class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <h3 class="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                            (click)="onDocumentSelected(document)">
                          {{ document.name }}
                        </h3>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <span>{{ document.type.toUpperCase() }}</span>
                          <span>•</span>
                          <span>{{ document.size }}</span>
                          <span>•</span>
                          <span *ngIf="document.category">{{ document.category }}</span>
                        </div>
                      </div>
                    </div>

                     <!-- Actions -->
                    <div class="flex items-center space-x-4">
                      <!-- Date -->
                      <div class="text-xs text-gray-500">
                        {{ document.createdDate | date:'dd MMM, yyyy' }}
                      </div>
                    
                      <button *ngIf="document.status === 'a-valider'"
                          (click)="validateDocument(document)"
                          class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-150">
                        Valider
                      </button>
                    
                      <!-- View/Download icon -->
                      <button (click)="onDocumentSelected(document)"
                            class="p-1 text-gray-400 hover:text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                    
                      <!-- Download icon -->
                      <button (click)="downloadDocument(document)"
                            class="p-1 text-gray-400 hover:text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Client Info -->
                  <div class="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span *ngIf="document.clientName" class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                      </svg>
                      {{ document.clientName }}
                    </span>
                    <span *ngIf="document.folderName" class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                      </svg>
                      {{ document.folderName }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Empty state when no documents -->
              <div *ngIf="documents.length === 0" class="text-center py-12">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p class="text-gray-600">Aucun document trouvé pour ce filtre</p>
              </div>
            </div>
          </div>

          <!-- Folders View (when activeTab === 'tous') -->
          <div *ngIf="activeTab === 'tous'" class="space-y-4">
            <div *ngFor="let folder of folders$ | async">
              <app-document-folder
                [folder]="folder"
                (folderToggled)="onFolderToggle($event)"
                (subfolderToggled)="onSubfolderToggle($event)"
                (documentSelected)="onDocumentSelected($event)">
              </app-document-folder>
            </div>
          </div>

          <!-- Document Statistics -->
          <app-document-stats [stats]="documentStats$ | async"></app-document-stats>
        </div>
        
        <!-- Modals -->
        <app-add-document-modal
          [isVisible]="isAddModalVisible"
          (closed)="closeAddDocumentModal()"
          (documentAdded)="onDocumentAdded($event)">
        </app-add-document-modal>

        <app-validate-document-modal
          [isVisible]="isValidateModalVisible"
          [document]="selectedDocument"
          (closed)="closeValidateModal()"
          (validated)="onDocumentValidated($event)">
        </app-validate-document-modal>

        <app-request-documents-modal
          [isVisible]="isRequestModalVisible"
          (closed)="closeRequestModal()"
          (documentsRequested)="onDocumentsRequested($event)">
        </app-request-documents-modal>

        <app-document-details-modal
          [isVisible]="isDetailsModalVisible"
          [document]="selectedDocument"
          (closed)="closeDetailsModal()"
          (downloaded)="onDocumentDownloaded($event)"
          (shared)="onDocumentShared($event)">
        </app-document-details-modal>

        <!-- Notification Modal -->
        <app-notification-modal
          [isVisible]="(notificationService.notification$ | async) !== null"
          [status]="(notificationService.notification$ | async)?.status || 'info'"
          [title]="(notificationService.notification$ | async)?.title || ''"
          [description]="(notificationService.notification$ | async)?.description"
          [buttonConfig]="(notificationService.notification$ | async)?.buttonConfig"
          [showCloseButton]="(notificationService.notification$ | async)?.showCloseButton ?? true"
          [closeOnOverlayClick]="(notificationService.notification$ | async)?.closeOnOverlayClick ?? true"
          (closed)="notificationService.hideNotification()"
          (buttonClicked)="onNotificationButtonClicked($event)">
        </app-notification-modal>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class DocumentsComponent implements OnInit {
  documentStats$: Observable<DocumentStats>;
  folders$: Observable<DocumentFolder[]>;
  filteredDocuments$: Observable<Document[]>;
  activeTab: DocumentStatus = 'tous';

  isAddModalVisible = false;
  isValidateModalVisible = false;
  isRequestModalVisible = false;
  isDetailsModalVisible = false;
  selectedDocument: Document | null = null;

  constructor(
    private documentService: DocumentService,
    public notificationService: NotificationService
  ) {
    this.documentStats$ = this.documentService.getDocumentStats();
    this.folders$ = this.documentService.folders$;
    this.filteredDocuments$ = this.getFilteredDocuments();
  }

  ngOnInit(): void {
    this.documentService.folders$.subscribe(folders => {
      console.log('Folders loaded:', folders);
    });
  }

  private getFilteredDocuments(): Observable<Document[]> {
    return combineLatest([
      this.documentService.documents$,
      this.documentService.filter$
    ]).pipe(
      map(([documents, filter]) => {
        let filtered = documents;

        // Filter by status (tab)
        if (this.activeTab !== 'tous') {
          filtered = filtered.filter(doc => doc.status === this.activeTab);
        }

        // Filter by search term
        if (filter.searchTerm) {
          const searchTerm = filter.searchTerm.toLowerCase();
          filtered = filtered.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm) ||
            doc.clientName?.toLowerCase().includes(searchTerm) ||
            doc.folderName?.toLowerCase().includes(searchTerm) ||
            doc.category?.toLowerCase().includes(searchTerm)
          );
        }

        return filtered;
      })
    );
  }

  onSearchChange(term: string): void {
    this.documentService.setFilter({ searchTerm: term });
  }

  onFilterClick(): void {
    console.log('Filter clicked');
  }

  onTabChange(tab: DocumentStatus): void {
    this.activeTab = tab;
    this.documentService.setFilter({ status: tab });
    // Refresh filtered documents
    this.filteredDocuments$ = this.getFilteredDocuments();
  }

  onFolderToggle(folderId: string): void {
    this.documentService.toggleFolder(folderId);
  }

  onSubfolderToggle(event: { folderId: string; subfolderId: string }): void {
    this.documentService.toggleSubfolder(event.folderId, event.subfolderId);
  }

  onDocumentSelected(document: Document): void {
    this.selectedDocument = document;
    this.documentService.selectDocument(document);
    this.openDetailsModal();
  }

  validateDocument(document: Document): void {
    this.selectedDocument = document;
    this.openValidateModal();
  }

  downloadDocument(document: Document): void {
    // Implement download logic
    this.notificationService.showSuccess(
      'Téléchargement démarré',
      `Le document "${document.name}" est en cours de téléchargement.`
    );
  }

  openAddDocumentModal(): void {
    this.isAddModalVisible = true;
  }

  closeAddDocumentModal(): void {
    this.isAddModalVisible = false;
  }

  onDocumentAdded(document: any): void {
    this.documentService.addDocument(document).subscribe({
      next: () => {
        this.closeAddDocumentModal();
        this.notificationService.showSuccess(
          'Document ajouté avec succès',
          `Le document "${document.name}" a été ajouté.`
        );
        // Refresh filtered documents to show the new document
        this.filteredDocuments$ = this.getFilteredDocuments();
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de l\'ajout',
          'Une erreur est survenue lors de l\'ajout du document.'
        );
      }
    });
  }

  openValidateModal(): void {
    if (this.selectedDocument) {
      this.isValidateModalVisible = true;
    }
  }

  closeValidateModal(): void {
    this.isValidateModalVisible = false;
  }

  onDocumentValidated(event: { document: Document; notes: string }): void {
    this.documentService.validateDocument(event.document.id).subscribe({
      next: () => {
        this.closeValidateModal();
        this.notificationService.showSuccess(
          'Document validé avec succès',
          `Le document "${event.document.name}" a été validé.`
        );
        // Refresh filtered documents to show updated status
        this.filteredDocuments$ = this.getFilteredDocuments();
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de la validation',
          'Une erreur est survenue lors de la validation du document.'
        );
      }
    });
  }

  openRequestModal(): void {
    this.isRequestModalVisible = true;
  }

  closeRequestModal(): void {
    this.isRequestModalVisible = false;
  }

  onDocumentsRequested(documents: string[]): void {
    if (this.selectedDocument?.clientId) {
      this.documentService.requestDocuments(this.selectedDocument.clientId, documents).subscribe({
        next: () => {
          this.closeRequestModal();
          this.notificationService.showSuccess(
            'Demande envoyée',
            `La demande de documents a été envoyée avec succès.`
          );
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur lors de l\'envoi',
            'Une erreur est survenue lors de l\'envoi de la demande.'
          );
        }
      });
    }
  }

  openDetailsModal(): void {
    this.isDetailsModalVisible = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalVisible = false;
  }

  onDocumentDownloaded(document: Document): void {
    this.notificationService.showSuccess(
      'Téléchargement réussi',
      `Le document "${document.name}" a été téléchargé.`
    );
  }

  onDocumentShared(document: Document): void {
    this.notificationService.showSuccess(
      'Document partagé',
      `Le document "${document.name}" a été partagé avec succès.`
    );
  }

  onNotificationButtonClicked(action: 'primary' | 'secondary'): void {
    // Handle notification button clicks
    if (action === 'primary') {
      // Handle primary action based on context
    }
    this.notificationService.hideNotification();
  }

  getStatusIconClasses(status: DocumentStatus): string {
    switch (status) {
      case 'a-valider':
        return 'text-red-600';
      case 'en-attente':
        return 'text-orange-600';
      case 'valides':
        return 'text-green-600';
      case 'a-signer':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  getDocumentTypeClasses(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'doc':
      case 'docx':
        return 'bg-blue-100 text-blue-800';
      case 'xls':
      case 'xlsx':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}