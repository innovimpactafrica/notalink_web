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
import { SignatureDocument, SignatureStats, SignatureRequest, Client, Document } from '../../shared/interfaces/signature.interface';

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
  providers: [NotificationService],
  templateUrl: './signatures.component.html',
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