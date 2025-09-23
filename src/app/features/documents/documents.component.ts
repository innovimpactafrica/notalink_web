import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/documents/document.service';
import { CaseProducedDocumentService } from '../../core/services/case-produced-document.service';
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
import { Document, DocumentFolder, DocumentStats, DocumentStatus } from '../../shared/interfaces/document.interface';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseProducedDocument, CaseProducedDocumentRequest } from '../../shared/interfaces/models.interface';

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
      <div class="mb-4 sm:mb-6">

        <!-- Header with title and Add button -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-xl sm:text-3xl font-bold text-gray-900">Gestions des documents</h1>
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
                          <svg *ngIf="document.status === 'en-attente'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EA580C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 6V12L16 14" stroke="#EA580C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <svg *ngIf="document.status === 'a-signer'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5 14.167L15.7033 12.6103C15.644 12.554 15.5693 12.5164 15.4887 12.5023C15.4081 12.4881 15.3251 12.498 15.2501 12.5307C15.1751 12.5634 15.1114 12.6175 15.0669 12.6862C15.0224 12.7549 14.9992 12.8351 15 12.917V13.3336C15 13.5546 14.9122 13.7666 14.7559 13.9229C14.5996 14.0792 14.3877 14.167 14.1667 14.167H12.5C12.279 14.167 12.067 14.0792 11.9107 13.9229C11.7545 13.7666 11.6667 13.5546 11.6667 13.3336C11.6667 11.2128 8.34083 10.0253 4.58333 10.0003C4.0308 10.0003 3.50089 10.2198 3.11019 10.6105C2.71949 11.0012 2.5 11.5311 2.5 12.0836C2.5 12.6362 2.71949 13.1661 3.11019 13.5568C3.50089 13.9475 4.0308 14.167 4.58333 14.167C8.04417 14.167 8.5375 4.75446 9.34 2.91696C9.47556 2.60679 9.68467 2.33433 9.94921 2.12314C10.2138 1.91195 10.5258 1.76841 10.8583 1.70493C11.1908 1.64145 11.5337 1.65995 11.8575 1.75882C12.1812 1.85769 12.476 2.03395 12.7163 2.27237C12.9566 2.51078 13.1352 2.80415 13.2366 3.1271C13.338 3.45006 13.3592 3.79286 13.2984 4.12584C13.2375 4.45883 13.0964 4.77198 12.8873 5.03818C12.6782 5.30438 12.4074 5.51563 12.0983 5.65363" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2.5 17.5H17.5" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <svg *ngIf="document.status === 'valides'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.8006 10.0005C22.2573 12.2418 21.9318 14.5719 20.8785 16.6023C19.8251 18.6326 18.1075 20.2405 16.0121 21.1578C13.9167 22.0751 11.5702 22.2463 9.36391 21.6428C7.15758 21.0394 5.2248 19.6979 3.88789 17.8419C2.55097 15.9859 1.89073 13.7277 2.01728 11.4439C2.14382 9.16001 3.04949 6.98857 4.58326 5.29165C6.11703 3.59473 8.18619 2.47491 10.4457 2.11893C12.7052 1.76295 15.0184 2.19234 16.9996 3.33548" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 11L12 14L22 4" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <svg *ngIf="document.status === 'a-valider'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_1_2844)">
                              <path d="M9.99935 18.3337C14.6017 18.3337 18.3327 14.6027 18.3327 10.0003C18.3327 5.39795 14.6017 1.66699 9.99935 1.66699C5.39698 1.66699 1.66602 5.39795 1.66602 10.0003C1.66602 14.6027 5.39698 18.3337 9.99935 18.3337Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M10 6.66699V10.0003" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M10 13.333H10.0083" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_1_2844">
                                <rect width="20" height="20" fill="white"/>
                              </clipPath>
                            </defs>
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
    private caseProducedDocumentService: CaseProducedDocumentService,
    public notificationService: NotificationService
  ) {
    this.documentStats$ = this.documentService.getDocumentStats();
    this.folders$ = this.documentService.folders$;
    this.filteredDocuments$ = this.getFilteredDocuments();
  }

  ngOnInit(): void {
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

  onDocumentAdded(documentData: CaseProducedDocumentRequest): void {
    this.caseProducedDocumentService.saveDocument(documentData).subscribe({
      next: (document: CaseProducedDocument) => {
        this.closeAddDocumentModal();
        this.notificationService.showSuccess(
          'Document ajouté avec succès',
          `Le document "${document.title}" a été ajouté.`
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