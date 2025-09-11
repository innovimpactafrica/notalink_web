import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Payment, PaymentStats, PaymentReceipt, FinancialReport, FinancialMetrics, CreatePaymentRequest, CreateInvoiceRequest } from '../../interfaces/payment.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentsSubject = new BehaviorSubject<Payment[]>(this.getMockPayments());
  public payments$ = this.paymentsSubject.asObservable();

  private receiptsSubject = new BehaviorSubject<PaymentReceipt[]>(this.getMockReceipts());
  public receipts$ = this.receiptsSubject.asObservable();

  private reportsSubject = new BehaviorSubject<FinancialReport[]>(this.getMockReports());
  public reports$ = this.reportsSubject.asObservable();

  getPaymentStats(): Observable<PaymentStats> {
    const payments = this.paymentsSubject.value;
    const stats: PaymentStats = {
      received: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
      pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
      overdue: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
    };
    return of(stats);
  }

  getFinancialMetrics(): Observable<FinancialMetrics> {
    return of({
      monthlyRevenue: {
        amount: 5800000,
        change: 12
      },
      unpaidInvoices: {
        amount: 12750000,
        change: 5
      },
      recoveryRate: {
        percentage: 31,
        change: 3
      }
    });
  }

  createPayment(request: CreatePaymentRequest): Observable<boolean> {
    return of(true).pipe(delay(1500));
  }

  createInvoice(request: CreateInvoiceRequest): Observable<boolean> {
    return of(true).pipe(delay(1500));
  }

  private getMockPayments(): Payment[] {
    return [
      {
        id: 'FACT-2025-004',
        invoiceNumber: 'FACT-2025-004',
        amount: 2000000,
        currency: 'F CFA',
        status: 'paid',
        client: 'Vente Terrain Agricole Thiès',
        description: 'Acompte sur honoraires notaire',
        dueDate: new Date('2025-08-11'),
        paidDate: new Date('2025-08-11'),
        paymentMethod: 'Espèces',
        type: 'Acompte sur honoraires notaire'
      },
      {
        id: 'FACT-2025-003',
        invoiceNumber: 'FACT-2025-003',
        amount: 2700000,
        currency: 'F CFA',
        status: 'pending',
        client: 'Vente Terrain Agricole Thiès',
        description: 'Solde honoraires et frais',
        dueDate: new Date('2025-08-10'),
        paidDate: new Date('2025-08-10'),
        paymentMethod: 'Virement bancaire',
        type: 'Solde honoraires et frais'
      },
      {
        id: 'FACT-2025-002',
        invoiceNumber: 'FACT-2025-002',
        amount: 2700000,
        currency: 'F CFA',
        status: 'pending',
        client: 'Vente Terrain Agricole Thiès',
        description: 'Acompte honoraires vente',
        dueDate: new Date('2025-08-10'),
        paymentMethod:  'Especes',
        type: 'Acompte honoraires vente'
      },
      {
        id: 'FACT-2025-001',
        invoiceNumber: 'FACT-2025-001',
        amount: 950000,
        currency: 'F CFA',
        status: 'overdue',
        client: 'Création SARL TechSénégal',
        description: 'Taxes et frais d\'enregistrement',
        dueDate: new Date('2025-08-10'),
        type: 'Taxes et frais d\'enregistrement'
      }
    ];
  }

  private getMockReceipts(): PaymentReceipt[] {
    return [
      {
        id: 'FACT-2025-008',
        invoiceNumber: 'FACT-2025-008',
        amount: 2000000,
        currency: 'F CFA',
        client: 'Vente Terrain Agricole Thiès',
        paidDate: new Date('2025-08-11'),
        paymentMethod: 'Espèces',
        status: 'paid',
        type: 'Acompte sur honoraires notaire'
      },
      {
        id: 'FACT-2025-007',
        invoiceNumber: 'FACT-2025-007',
        amount: 2700000,
        currency: 'F CFA',
        client: 'Vente Terrain Agricole Thiès',
        paidDate: new Date('2025-08-11'),
        paymentMethod: 'Virement bancaire',
        status: 'paid',
        type: 'Solde honoraires et frais'
      },
      {
        id: 'FACT-2025-006',
        invoiceNumber: 'FACT-2025-006',
        amount: 2700000,
        currency: 'F CFA',
        client: 'Vente Terrain Agricole Thiès',
        paidDate: new Date('2025-08-11'),
        paymentMethod: 'Virement bancaire',
        status: 'paid',
        type: 'Acompte honoraires vente'
      }
    ];
  }

  private getMockReports(): FinancialReport[] {
    return [
      {
        id: '1',
        title: 'Rapport mensuel - Juillet 2023',
        type: 'monthly',
        generatedDate: new Date('2023-08-01'),
        period: 'Juillet 2023'
      },
      {
        id: '2',
        title: 'Rapport mensuel - Juin 2023',
        type: 'monthly',
        generatedDate: new Date('2023-07-01'),
        period: 'Juin 2023'
      },
      {
        id: '3',
        title: 'Rapport trimestriel - T2 2023',
        type: 'quarterly',
        generatedDate: new Date('2023-07-01'),
        period: 'T2 2023'
      }
    ];
  }
}