import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { PaymentStatsComponent } from '../../shared/components/payments/payment-stats/payment-stats.component';
import { InvoicesTabComponent } from '../../shared/components/payments/invoices-tab/invoices-tab.component';
import { PaymentReceiptsTabComponent } from '../../shared/components/payments/payment-receipts-tab/payment-receipts-tab.component';
import { FinancialReportsTabComponent } from '../../shared/components/payments/financial-reports-tab/financial-reports-tab.component';
import { CreatePaymentModalComponent } from '../../shared/components/payments/create-payment-modal/create-payment-modal.component';
import { CreateInvoiceModalComponent } from '../../shared/components/payments/create-invoice-modal/create-invoice-modal.component';
import { NotificationModalComponent, NotificationData } from '../../shared/ui/notification-modal2/notification-modal2.component';
import { PaymentService } from '../../core/services/payment.service';
import { UserService } from '../../core/services/user.service';
import { CaseFileService } from '../../core/services/case-file.service';
import { Payment, CaseFile } from '../../shared/interfaces/models.interface';
import { PaginatedResponse } from '../../shared/interfaces/api-response.interface';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    PaymentStatsComponent,
    InvoicesTabComponent,
    PaymentReceiptsTabComponent,
    FinancialReportsTabComponent,
    CreatePaymentModalComponent,
    CreateInvoiceModalComponent,
    NotificationModalComponent,
    MainLayoutComponent,
    FormsModule
  ],
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit {
  activeTab = 0;
  tabs = ['Factures', 'Reçu de paiement', 'Rapports financiers'];
  showCreatePaymentModal = false;
  showCreateInvoiceModal = false;
  showNotification = false;
  showFilterMenu = false;
  notificationData: NotificationData | null = null;
  payments: Payment[] = [];
  caseFiles: CaseFile[] = [];
  selectedCaseFileId: string = '';
  searchQuery: string = '';

  constructor(
    private paymentService: PaymentService,
    private caseFileService: CaseFileService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getCabinetIdOfCurrentUser().subscribe({
      next: (cabinetId) => {
        this.loadCaseFiles(cabinetId);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'ID du cabinet:', err);
        this.notificationData = {
          type: 'error',
          message: 'Impossible de récupérer l\'ID du cabinet.'
        };
        this.showNotification = true;
      }
    });
  }

  loadCaseFiles(cabinetId: string) {
    this.caseFileService.getCaseFilesByCabinet(cabinetId).subscribe({
      next: (response: PaginatedResponse<CaseFile>) => {
        this.caseFiles = response.content;
        // Si un dossier est déjà sélectionné, charger ses paiements
        if (this.selectedCaseFileId) {
          this.loadPayments();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des dossiers:', err);
        this.notificationData = {
          type: 'error',
          message: 'Impossible de charger les dossiers.'
        };
        this.showNotification = true;
      }
    });
  }

  loadPayments() {
    if (this.selectedCaseFileId) {
      const paginationParams = {
        page: 0,
        size: 10,
        search: this.searchQuery
      };
      this.paymentService.getPaymentsByCaseFile(this.selectedCaseFileId, paginationParams).subscribe({
        next: (response: PaginatedResponse<Payment>) => {
          this.payments = response.content;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des paiements:', err);
        }
      });
    } else {
      this.payments = [];
    }
  }

  onPaymentCreated() {
    this.notificationData = {
      type: 'success',
      message: 'Paiement enregistré avec succès.'
    };
    this.showNotification = true;
    this.loadPayments(); // Recharger les paiements après création
  }

  onInvoiceCreated() {
    this.notificationData = {
      type: 'success',
      message: 'Facture enregistrée avec succès.'
    };
    this.showNotification = true;
    this.loadPayments(); // Recharger les paiements après création
  }
}