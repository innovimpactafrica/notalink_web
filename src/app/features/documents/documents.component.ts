import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseProducedDocumentService } from '../../core/services/case-produced-document.service';
import { CaseFileService } from '../../core/services/case-file.service';
import { UserService } from '../../core/services/user.service';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { DocumentSearchComponent } from '../../shared/components/documents/document-search/document-search.component';
import { DocumentTabsComponent } from '../../shared/components/documents/document-tabs/document-tabs.component';
import { DocumentFolderComponent } from '../../shared/components/documents/document-folder/document-folder.component';
import { DocumentStatsComponent } from '../../shared/components/documents/document-stats/document-stats.component';
import { AddDocumentModalComponent } from '../../shared/components/documents/add-document-modal/add-document-modal.component';
import { RequestDocumentsModalComponent } from '../../shared/components/documents/request-documents-modal/request-documents-modal.component';
import { DocumentDetailsModalComponent } from '../../shared/components/documents/document-detail-modal/document-detail-modal.component';
import { NotificationModalComponent, NotificationService } from '../../shared/ui/notification-modal/notification-modal.component';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import { map, switchMap, takeUntil, catchError } from 'rxjs/operators';
import { CaseProducedDocument, CaseProducedDocumentRequest, CaseProducedDocumentKPI, CaseProducedDocumentType, ProducedDocumentStatus, CaseFile } from '../../shared/interfaces/models.interface';
import { PaginatedResponse } from '../../shared/interfaces/api-response.interface';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';

interface DocumentStats {
  total: number;
  aValider: number;
  enAttente: number;
  valides: number;
  aSigner: number;
}

interface DocumentFolder {
  id: string;
  name: string;
  expanded: boolean;
  subfolders: DocumentSubfolder[];
  documentsCount: number;
}

interface DocumentSubfolder {
  id: string;
  name: string;
  expanded: boolean;
  documents: CaseProducedDocument[];
  documentsCount: number;
}

interface EnhancedCaseProducedDocument extends CaseProducedDocument {
  caseFileTitle?: string;
  notaryId?: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    CapitalizePipe,
    MainLayoutComponent,
    DocumentSearchComponent,
    DocumentTabsComponent,
    DocumentFolderComponent,
    DocumentStatsComponent,
    AddDocumentModalComponent,
    RequestDocumentsModalComponent,
    DocumentDetailsModalComponent,
    NotificationModalComponent,
  ],
  template: `
    <app-main-layout pageTitle="Documents">
      <div class="mb-4 sm:mb-6">
        <!-- Loading or No Cabinet Message -->
        <ng-container *ngIf="!isLoading && cabinetId; else loadingOrNoCabinet">
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
              *ngIf="documentStats$ | async as stats"
              [activeTab]="activeTab"
              [stats]="stats"
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
            <!-- Folders View for 'tous' tab -->
            <div *ngIf="activeTab === 'tous'" class="space-y-4">
              <div *ngFor="let folder of folders$ | async">
                <app-document-folder
                  [folder]="folder"
                  [activeTab]="activeTab"
                  [searchTerm]="searchTerm"
                  (folderToggled)="onFolderToggle($event)"
                  (subfolderToggled)="onSubfolderToggle($event)"
                  (documentSelected)="onDocumentSelected($event)">
                </app-document-folder>
              </div>
            </div>

            <!-- Document List (when activeTab !== 'tous') -->
            <div *ngIf="activeTab !== 'tous' && (allDocuments$ | async) as documents" 
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
                            <svg *ngIf="document.status === 'PENDING_SIGNATURE'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EA580C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M12 6V12L16 14" stroke="#EA580C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg *ngIf="document.status === 'SIGNED'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.5 14.167L15.7033 12.6103C15.644 12.554 15.5693 12.5164 15.4887 12.5023C15.4081 12.4881 15.3251 12.498 15.2501 12.5307C15.1751 12.5634 15.1114 12.6175 15.0669 12.6862C15.0224 12.7549 14.9992 12.8351 15 12.917V13.3336C15 13.5546 14.9122 13.7666 14.7559 13.9229C14.5996 14.0792 14.3877 14.167 14.1667 14.167H12.5C12.279 14.167 12.067 14.0792 11.9107 13.9229C11.7545 13.7666 11.6667 13.5546 11.6667 13.3336C11.6667 11.2128 8.34083 10.0253 4.58333 10.0003C4.0308 10.0003 3.50089 10.2198 3.11019 10.6105C2.71949 11.0012 2.5 11.5311 2.5 12.0836C2.5 12.6362 2.71949 13.1661 3.11019 13.5568C3.50089 13.9475 4.0308 14.167 4.58333 14.167C8.04417 14.167 8.5375 4.75446 9.34 2.91696C9.47556 2.60679 9.68467 2.33433 9.94921 2.12314C10.2138 1.91195 10.5258 1.76841 10.8583 1.70493C11.1908 1.64145 11.5337 1.65995 11.8575 1.75882C12.1812 1.85769 12.476 2.03395 12.7163 2.27237C12.9566 2.51078 13.1352 2.80415 13.2366 3.1271C13.338 3.45006 13.3592 3.79286 13.2984 4.12584C13.2375 4.45883 13.0964 4.77198 12.8873 5.03818C12.6782 5.30438 12.4074 5.51563 12.0983 5.65363" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M2.5 17.5H17.5" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg *ngIf="document.status === 'DRAFT'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21.8006 10.0005C22.2573 12.2418 21.9318 14.5719 20.8785 16.6023C19.8251 18.6326 18.1075 20.2405 16.0121 21.1578C13.9167 22.0751 11.5702 22.2463 9.36391 21.6428C7.15758 21.0394 5.2248 19.6979 3.88789 17.8419C2.55097 15.9859 1.89073 13.7277 2.01728 11.4439C2.14382 9.16001 3.04949 6.98857 4.58326 5.29165C6.11703 3.59473 8.18619 2.47491 10.4457 2.11893C12.7052 1.76295 15.0184 2.19234 16.9996 3.33548" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M9 11L12 14L22 4" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg *ngIf="document.status === 'ARCHIVED'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                          <h3 class="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                            {{ document.title | capitalize }}
                          </h3>
                          <div class="flex items-center gap-2 text-xs text-gray-500">
                            <span *ngIf="document.filePath">{{ getFileType(document) }}</span>
                            <span>•</span>
                            <span>{{ document.size || '0MB' }}</span>
                            <span>•</span>
                            <span>{{ document.documentType?.name | capitalize }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="flex items-center space-x-4">
                        <!-- Date -->
                        <div class="text-xs text-gray-500">
                          {{ document.sentDate | date:'dd MMM, yyyy' }}
                        </div>

                        <button *ngIf="document.status === 'DRAFT'"
                            (click)="validateDocument(document)"
                            class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-150">
                          Valider
                        </button>

                        <!-- View/Download icon -->
                        <button (click)="selectDocument(document); $event.stopPropagation()"
                              class="p-1 text-gray-400 hover:text-gray-600">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>

                        <!-- Download icon -->
                        <button (click)="downloadDocument(document); $event.stopPropagation()"
                              class="p-1 text-gray-400 hover:text-gray-600">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- Client Info -->
                    <div class="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                        </svg>
                        {{ getNotaryName(document) || 'Notaire inconnu' }}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                        </svg>
                        {{ getCaseFileName(document) || 'Dossier inconnu' }}
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

            <!-- Document Statistics -->
            <app-document-stats [stats]="documentStats$ | async"></app-document-stats>
          </div>
          
          <!-- Modals -->
          <app-add-document-modal
            [isVisible]="isAddModalVisible"
            (closed)="closeAddDocumentModal()"
            (documentAdded)="onDocumentAdded($event)">
          </app-add-document-modal>

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
        </ng-container>
        <ng-template #loadingOrNoCabinet>
          <div *ngIf="isLoading" class="text-center text-gray-500 py-10">
            <svg class="animate-spin h-8 w-8 mx-auto text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-2">Chargement...</p>
          </div>
          <div *ngIf="!isLoading && !cabinetId" class="text-center text-gray-500 py-10">
            <p>Veuillez sélectionner un cabinet pour afficher les documents.</p>
          </div>
        </ng-template>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documentStats$: Observable<DocumentStats> = of({ total: 0, aValider: 0, enAttente: 0, valides: 0, aSigner: 0 });
  folders$: Observable<DocumentFolder[]> = of([]);
  allDocuments$: Observable<EnhancedCaseProducedDocument[]> = of([]);
  activeTab: ProducedDocumentStatus | 'tous' = 'tous';
  searchTerm: string = '';
  isLoading = false;
  cabinetId: string | null = null;

  isAddModalVisible = false;
  isValidateModalVisible = false;
  isRequestModalVisible = false;
  isDetailsModalVisible = false;
  selectedDocument: CaseProducedDocument | null = null;

  private destroy$ = new Subject<void>();
  private caseFiles: CaseFile[] = []; // Cache pour stocker les CaseFiles

  constructor(
    private caseProducedDocumentService: CaseProducedDocumentService,
    private caseFileService: CaseFileService,
    public notificationService: NotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getCabinetIdOfCurrentUser().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (cabinetId) => {
        this.cabinetId = cabinetId;
        console.log('CabinetId récupéré:', this.cabinetId);
        this.documentStats$ = this.getDocumentStats();
        this.folders$ = this.getFolders();
        this.allDocuments$ = this.getAllDocuments();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur récupération cabinetId:', err);
        this.notificationService.showError(
          'Erreur de chargement',
          'Impossible de récupérer l\'identifiant du cabinet.'
        );
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getDocumentStats(): Observable<DocumentStats> {
    if (!this.cabinetId) {
      console.warn('CabinetId non disponible pour charger les statistiques');
      return of({ total: 0, aValider: 0, enAttente: 0, valides: 0, aSigner: 0 });
    }

    return this.caseProducedDocumentService.getCabinetDocumentKPI(this.cabinetId).pipe(
      map((kpi: CaseProducedDocumentKPI) => ({
        total: kpi.total || 0,
        aValider: kpi.awaitingSignature || 0,
        enAttente: kpi.noSignatureRequired || 0,
        valides: kpi.signed || 0,
        aSigner: kpi.awaitingSignature || 0
      })),
      catchError(error => {
        console.error('Erreur lors de la récupération des KPIs:', error);
        this.notificationService.showError(
          'Erreur de chargement',
          'Impossible de charger les statistiques des documents.'
        );
        return of({ total: 0, aValider: 0, enAttente: 0, valides: 0, aSigner: 0 });
      })
    );
  }

  private getFolders(): Observable<DocumentFolder[]> {
    if (!this.cabinetId) {
      console.warn('CabinetId non disponible pour charger les dossiers');
      return of([]);
    }

    return this.caseFileService.getCaseFilesByCabinet(this.cabinetId).pipe(
      switchMap((response: PaginatedResponse<CaseFile>) => {
        this.caseFiles = response.content; // Stocker les CaseFiles pour réutilisation
        const caseFiles = response.content;
        const folderObservables = caseFiles.map(caseFile =>
          this.caseProducedDocumentService.getDocumentTypes().pipe(
            switchMap((docTypes: CaseProducedDocumentType[]) =>
              this.caseProducedDocumentService.getDocumentsByCaseFile(caseFile.id, this.searchTerm || undefined, this.activeTab === 'tous' ? undefined : this.activeTab).pipe(
                map((docsResponse: PaginatedResponse<CaseProducedDocument>) => {
                  const subfolders: DocumentSubfolder[] = docTypes.map(docType => {
                    const documents = docsResponse.content.filter(doc => doc.documentType?.id === docType.id);
                    return {
                      id: docType.id || '',
                      name: docType.name || 'Type inconnu',
                      expanded: false,
                      documents: documents,
                      documentsCount: documents.length
                    };
                  }).filter(subfolder => subfolder.documentsCount > 0);
                  return {
                    id: caseFile.id,
                    name: caseFile.title,
                    expanded: false,
                    subfolders: subfolders,
                    documentsCount: subfolders.reduce((sum, sf) => sum + sf.documentsCount, 0)
                  };
                }),
                catchError(error => {
                  console.error(`Erreur lors de la récupération des documents pour le dossier ${caseFile.id}:`, error);
                  return of({
                    id: caseFile.id,
                    name: caseFile.title,
                    expanded: false,
                    subfolders: [],
                    documentsCount: 0
                  });
                })
              )
            )
          )
        );
        return combineLatest(folderObservables).pipe(
          map(folders => folders.filter(folder => folder.documentsCount > 0))
        );
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des dossiers:', error);
        this.notificationService.showError(
          'Erreur de chargement',
          'Impossible de charger les dossiers.'
        );
        return of([]);
      })
    );
  }

  private getAllDocuments(): Observable<EnhancedCaseProducedDocument[]> {
    if (!this.cabinetId) {
      console.warn('CabinetId non disponible pour charger tous les documents');
      return of([]);
    }

    return this.caseFileService.getCaseFilesByCabinet(this.cabinetId).pipe(
      switchMap((response: PaginatedResponse<CaseFile>) => {
        this.caseFiles = response.content; // Stocker les CaseFiles pour réutilisation
        const caseFiles = response.content;
        const documentObservables = caseFiles.map(caseFile =>
          this.caseProducedDocumentService.getDocumentsByCaseFile(caseFile.id, this.searchTerm || undefined, this.activeTab !== 'tous' ? this.activeTab : undefined).pipe(
            map((docsResponse: PaginatedResponse<CaseProducedDocument>) =>
              docsResponse.content.map(doc => ({
                ...doc,
                caseFileTitle: caseFile.title, // Ajouter le titre du dossier
                notaryId: caseFile.notaryId // Ajouter l'ID du notaire
              }))
            )
          )
        );
        return combineLatest(documentObservables).pipe(
          map(allDocsArrays => allDocsArrays.flat()),
          map(documents => {
            if (this.searchTerm) {
              const searchTerm = this.searchTerm.toLowerCase();
              return documents.filter(doc =>
                (doc.title?.toLowerCase() || '').includes(searchTerm) ||
                (doc.documentType?.name?.toLowerCase() || '').includes(searchTerm) ||
                (doc.size?.toLowerCase() || '').includes(searchTerm)
              );
            }
            if (this.activeTab !== 'tous') {
              return documents.filter(doc => doc.status === this.activeTab);
            }
            return documents;
          }),
          catchError(error => {
            console.error('Erreur lors de la récupération de tous les documents:', error);
            this.notificationService.showError(
              'Erreur de chargement',
              'Impossible de charger les documents.'
            );
            return of([]);
          })
        );
      })
    );
  }

  getFileType(document: CaseProducedDocument): string {
    if (!document?.filePath) return 'Inconnu';
    const extension = document.filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF';
      case 'doc': case 'docx': return 'Word';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'Image';
      default: return extension?.toUpperCase() || 'Inconnu';
    }
  }

  getCaseFileName(document: EnhancedCaseProducedDocument): Observable<string> {
    return of(document.caseFileTitle || 'Dossier inconnu');
  }

  getNotaryName(document: EnhancedCaseProducedDocument): Observable<string> {
    if (!document.notaryId) {
      return of('Notaire inconnu');
    }
    return this.userService.getUserById(document.notaryId).pipe(
      map((user: any) => `${user.prenom} ${user.nom}` || 'Notaire inconnu'),
      catchError(() => of('Notaire inconnu'))
    );
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.folders$ = this.getFolders();
    this.allDocuments$ = this.getAllDocuments();
  }

  onFilterClick(): void {
    console.log('Filter clicked');
    // Implémenter la logique de filtrage si nécessaire
  }

  onTabChange(tab: ProducedDocumentStatus | 'tous'): void {
    this.activeTab = tab;
    this.folders$ = this.getFolders();
    this.allDocuments$ = this.getAllDocuments();
  }

  onFolderToggle(folderId: string): void {
    this.folders$ = this.folders$.pipe(
      map(folders => folders.map(folder => ({
        ...folder,
        expanded: folder.id === folderId ? !folder.expanded : folder.expanded
      })))
    );
  }

  onSubfolderToggle(event: { folderId: string; subfolderId: string }): void {
    this.folders$ = this.folders$.pipe(
      map(folders => folders.map(folder => {
        if (folder.id === event.folderId) {
          return {
            ...folder,
            subfolders: folder.subfolders.map(subfolder => ({
              ...subfolder,
              expanded: subfolder.id === event.subfolderId ? !subfolder.expanded : subfolder.expanded
            }))
          };
        }
        return folder;
      }))
    );
  }

  onDocumentSelected(document: CaseProducedDocument): void {
    this.selectedDocument = document;
    this.openDetailsModal();
  }

  selectDocument(document: CaseProducedDocument): void {
    this.selectedDocument = document;
    this.openDetailsModal();
  }

  validateDocument(document: CaseProducedDocument): void {
    this.selectedDocument = document;
    this.openValidateModal();
  }

  downloadDocument(document: CaseProducedDocument): void {
    this.notificationService.showSuccess(
      'Téléchargement démarré',
      `Le document "${document.title}" est en cours de téléchargement.`
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
        this.folders$ = this.getFolders();
        this.allDocuments$ = this.getAllDocuments();
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

  onDocumentValidated(event: { document: CaseProducedDocument; notes: string }): void {
    this.caseProducedDocumentService.updateDocumentStatus(event.document.id!, ProducedDocumentStatus.SIGNED).subscribe({
      next: () => {
        this.closeValidateModal();
        this.notificationService.showSuccess(
          'Document validé avec succès',
          `Le document "${event.document.title}" a été validé.`
        );
        this.folders$ = this.getFolders();
        this.allDocuments$ = this.getAllDocuments();
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
    this.closeRequestModal();
    this.notificationService.showSuccess(
      'Demande envoyée',
      `La demande de documents a été envoyée avec succès.`
    );
  }

  openDetailsModal(): void {
    this.isDetailsModalVisible = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalVisible = false;
  }

  onDocumentDownloaded(document: CaseProducedDocument): void {
    this.notificationService.showSuccess(
      'Téléchargement réussi',
      `Le document "${document.title}" a été téléchargé.`
    );
  }

  onDocumentShared(document: CaseProducedDocument): void {
    this.notificationService.showSuccess(
      'Document partagé',
      `Le document "${document.title}" a été partagé avec succès.`
    );
  }

  onNotificationButtonClicked(action: 'primary' | 'secondary'): void {
    if (action === 'primary') {
      // Handle primary action based on context
    }
    this.notificationService.hideNotification();
  }

  getStatusIconClasses(status: ProducedDocumentStatus | undefined): string {
    switch (status) {
      case ProducedDocumentStatus.DRAFT:
        return 'text-red-600';
      case ProducedDocumentStatus.PENDING_SIGNATURE:
        return 'text-orange-600';
      case ProducedDocumentStatus.SIGNED:
        return 'text-green-600';
      case ProducedDocumentStatus.ARCHIVED:
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }
}