export type SignatureStatus = 'pending' | 'signed' | 'rejected' | 'scheduled' | 'urgent';
export type DocumentType = 'Compromis de vente' | 'Acte authentique' | 'Statuts société' | 'Procuration' | 'Attestation';

export interface SignatureDocument {
  id: string;
  title: string;
  documentType: DocumentType;
  folderName: string;
  clientName: string;
  clientEmail: string;
  clientInitials: string;
  status: SignatureStatus;
  requestDate: string;
  dueDate: string;
  lastReminder?: string;
  documentUrl: string;
}

export interface SignatureStats {
  total: number;
  toValidate: number;
  pending: number;
  signed: number;
}

export interface SignatureRequest {
  clientId: string;
  documentId: string;
  dueDate: string;
  message: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
}