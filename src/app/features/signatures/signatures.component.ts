// features/signatures/signatures.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { NotificationModalComponent, NotificationService } from '../../shared/ui/notification-modal/notification-modal.component';
import { SignatureStatsComponent } from '../../shared/components/signatures/signature-stats/signature-stats.component';
import { SignatureRequestModalComponent } from '../../shared/components/signatures/signature-request-modal/signature-request-modal.component';
import { SignatureDetailsModalComponent } from '../../shared/components/signatures/signature-details-modal/signature-details-modal.component';
import { SignatureListComponent } from '../../shared/components/signatures/signature-list/signature-list.component';
import { SignatureService } from '../../core/services/signatures/signature.service';
import { SignatureDocument, SignatureStats, SignatureRequest, Client, Document } from '../../core/interfaces/signature.interface';

@Component({
  selector: 'app-signatures',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MainLayoutComponent,
    NotificationModalComponent,
    SignatureStatsComponent,
    SignatureRequestModalComponent,
    SignatureDetailsModalComponent,
    SignatureListComponent
  ],
  template: `
    <app-main-layout pageTitle="Signatures">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Gestions des signatures</h1>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
            (click)="openRequestModal()"
            class="flex items-center space-x-2 px-4 py-2 bg-[#D4B036] text-white rounded-md hover:bg-yellow-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Demander une signature</span>
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-6 flex items-center justify-between">
        <div class="relative w-1/4">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Rechercher une signature..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#D4B036] focus:border-transparent">
        </div>
        <button 
            (click)="toggleFilter()"
            class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.172a1 1 0 01-.598.912L10 19.828a1 1 0 01-1.402-.912v-4.172a1 1 0 00-.293-.707L2.293 7.121A1 1 0 012 6.414V4z"></path>
            </svg>
            <span>Filter</span>
          </button>
      </div>

      <!-- Statistics -->
      <app-signature-stats [stats]="stats"></app-signature-stats>

      <!-- Documents List -->
      <app-signature-list 
        [documents]="filteredDocuments" 
        (documentClicked)="openDetailsModal($event)">
      </app-signature-list>

      <!-- Request Modal -->
      <app-signature-request-modal
        [isVisible]="showRequestModal"
        [clients]="clients"
        [documents]="availableDocuments"
        (submitted)="onSignatureRequest($event)"
        (cancelled)="closeRequestModal()">
      </app-signature-request-modal>

      <!-- Details Modal -->
      <app-signature-details-modal
        [isVisible]="showDetailsModal"
        [document]="selectedDocument"
        (cancelled)="closeDetailsModal()"
        (scheduleAppointment)="onScheduleAppointment($event)"
        (resendRequest)="onResendRequest($event)"
        (markAsSigned)="onMarkAsSigned($event)">
      </app-signature-details-modal>

      <!-- Success Modal -->
      <div *ngIf="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-50 p-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ successMessage }}</h3>
          <p class="text-gray-600 mb-6">{{ successDescription }}</p>
          <button 
            (click)="closeSuccessModal()"
            class="px-4 py-2 bg-[#D4B036] text-white rounded-md hover:bg-yellow-600">
            Fermer
          </button>
        </div>
      </div>

      <!-- Notification Modal -->
      <app-notification-modal
        [isVisible]="notification !== null"
        [status]="notification?.status || 'info'"
        [title]="notification?.title || ''"
        [description]="notification?.description"
        [buttonConfig]="notification?.buttonConfig"
        (closed)="closeNotification()"
        (buttonClicked)="onNotificationAction($event)">
      </app-notification-modal>
    </app-main-layout>
  `
})
export class SignaturesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data
  documents: SignatureDocument[] = [];
  filteredDocuments: SignatureDocument[] = [];
  stats: SignatureStats | null = null;
  clients: Client[] = [];
  availableDocuments: Document[] = [];

  // UI State
  searchQuery = '';
  showRequestModal = false;
  showDetailsModal = false;
  showSuccessModal = false;
  selectedDocument: SignatureDocument | null = null;
  notification: any = null;
  successMessage = '';
  successDescription = '';

  constructor(
    private signatureService: SignatureService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadData();
    this.setupSearch();
    this.subscribeToNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    // Load documents
    this.signatureService.getDocuments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(documents => {
        this.documents = documents;
        this.filteredDocuments = documents;
      });

    // Load stats
    this.signatureService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.stats = stats;
      });

    // Load clients and documents
    this.clients = this.signatureService.getClients();
    this.availableDocuments = this.signatureService.getAvailableDocuments();
  }

  private setupSearch() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.filterDocuments(query);
      });
  }

  private subscribeToNotifications() {
    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.notification = notification;
      });
  }

  private filterDocuments(query: string) {
    if (!query.trim()) {
      this.filteredDocuments = this.documents;
    } else {
      this.filteredDocuments = this.documents.filter(doc =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(query.toLowerCase()) ||
        doc.folderName.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  onSearchChange(query: string) {
    this.searchSubject.next(query);
  }

  toggleFilter() {
    // Implement filter logic
    console.log('Toggle filter');
  }

  openRequestModal() {
    this.showRequestModal = true;
  }

  closeRequestModal() {
    this.showRequestModal = false;
  }

  openDetailsModal(document: SignatureDocument) {
    this.selectedDocument = document;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedDocument = null;
  }

  onSignatureRequest(request: SignatureRequest) {
    this.signatureService.sendSignatureRequest(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.closeRequestModal();
          this.showSuccessMessage(
            'Demande de signature envoyé avec succès',
            'La demande de signature a été envoyée au client par email.'
          );
        }
      });
  }

  onScheduleAppointment(documentId: string) {
    this.signatureService.scheduleAppointment(documentId);
    this.closeDetailsModal();
    this.showSuccessMessage(
      'Rendez-vous planifié',
      'Le rendez-vous pour la signature a été planifié avec succès.'
    );
  }

  onResendRequest(documentId: string) {
    this.signatureService.resendSignatureRequest(documentId);
    this.closeDetailsModal();
    this.showSuccessMessage(
      'Rappel envoyé',
      'Un rappel a été envoyé au client pour la signature du document.'
    );
  }

  onMarkAsSigned(documentId: string) {
    this.signatureService.markAsSigned(documentId);
    this.closeDetailsModal();
    this.showSuccessMessage(
      'Document marqué comme signé',
      'Le document a été marqué comme signé avec succès.'
    );
  }

  private showSuccessMessage(title: string, description: string) {
    this.successMessage = title;
    this.successDescription = description;
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  closeNotification() {
    this.notificationService.hideNotification();
  }

  onNotificationAction(action: any) {
    this.closeNotification();
  }
}