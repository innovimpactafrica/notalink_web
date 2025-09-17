export interface Payment {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  client: string;
  description: string;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  type: string;
}

export interface PaymentStats {
  received: number;
  pending: number;
  overdue: number;
}

export interface PaymentReceipt {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  client: string;
  paidDate: Date;
  paymentMethod: string;
  status: 'paid';
  type: string
}

export interface FinancialReport {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual';
  generatedDate: Date;
  period: string;
}

export interface FinancialMetrics {
  monthlyRevenue: {
    amount: number;
    change: number;
  };
  unpaidInvoices: {
    amount: number;
    change: number;
  };
  recoveryRate: {
    percentage: number;
    change: number;
  };
}

export interface CreatePaymentRequest {
  client: string;
  document: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  description: string;
}

export interface CreateInvoiceRequest {
  title: string;
  amount: number;
  client: string;
  dueDate: Date;
  description: string;
}