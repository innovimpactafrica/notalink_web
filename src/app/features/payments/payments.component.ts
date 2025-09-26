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
import { Observable } from 'rxjs';

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
  template: `
    <app-main-layout pageTitle="Paiements">
      <div class="mx-auto">
        <!-- Page Title and Actions -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Gestions des paiements</h2>
          <div class="flex space-x-4">
            <button 
              (click)="showCreatePaymentModal = true"
              class="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Enregistrer un paiement
            </button>
            <button 
              (click)="showCreateInvoiceModal = true"
              class="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Créer une facture
            </button>
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="flex justify-between items-center mb-6">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Rechercher un paiement..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="loadPayments()"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80">
          </div>
          <!-- Bouton Filtrer avec menu déroulant -->
            <div class="relative">
              <button 
                (click)="showFilterMenu = !showFilterMenu"
                class="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg class="mr-2" width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 5.83333H16.25M5.83333 9.99999H14.1667M8.33333 14.1667H11.6667" stroke="#777777" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Filtrer
              </button>
              <!-- Menu déroulant pour le filtre -->
              <div *ngIf="showFilterMenu" class="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div class="p-4">
                  <label for="caseFileSelect" class="block text-sm font-medium text-gray-700 mb-2">Sélectionner un dossier</label>
                  <select
                    id="caseFileSelect"
                    [(ngModel)]="selectedCaseFileId"
                    (ngModelChange)="loadPayments()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tous les dossiers</option>
                    <option *ngFor="let caseFile of caseFiles" [value]="caseFile.id">{{ caseFile.title }}</option>
                  </select>
                </div>
              </div>
            </div>
        </div>

        <!-- Payment Stats -->
        <app-payment-stats [payments]="payments"></app-payment-stats>

        <!-- Tabs -->
        <div>
          <div class="border-b border-gray-200">
            <nav class="flex">
              <button 
                *ngFor="let tab of tabs; let i = index"
                (click)="activeTab = i"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors w-1/6"
                [class.border-yellow-500]="activeTab === i"
                [class.text-yellow-600]="activeTab === i"
                [class.border-transparent]="activeTab !== i"
                [class.text-gray-500]="activeTab !== i"
                [class.hover:text-gray-700]="activeTab !== i"
                [class.hover:border-gray-300]="activeTab !== i">
                {{ tab }}
              </button>
            </nav>
          </div>

          <div class="py-6">
            <app-invoices-tab [payments]="payments" [caseFiles]="caseFiles" *ngIf="activeTab === 0"></app-invoices-tab>
            <app-payment-receipts-tab [payments]="payments" [caseFiles]="caseFiles" *ngIf="activeTab === 1"></app-payment-receipts-tab>
            <app-financial-reports-tab [caseFiles]="caseFiles" *ngIf="activeTab === 2"></app-financial-reports-tab>
          </div>
        </div>
      </div>
    </app-main-layout>

    <!-- Modals -->
    <app-create-payment-modal 
      [show]="showCreatePaymentModal"
      (close)="showCreatePaymentModal = false"
      (success)="onPaymentCreated()">
    </app-create-payment-modal>

    <app-create-invoice-modal 
      [show]="showCreateInvoiceModal"
      (close)="showCreateInvoiceModal = false"
      (success)="onInvoiceCreated()">
    </app-create-invoice-modal>

    <app-notification-modal
      [show]="showNotification"
      [data]="notificationData"
      (close)="showNotification = false">
    </app-notification-modal>
  `
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