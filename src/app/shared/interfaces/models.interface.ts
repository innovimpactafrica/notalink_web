export enum DocumentStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  NEEDS_COMPLETION = 'NEEDS_COMPLETION',
  REJECTED = 'REJECTED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export enum ProducedDocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  SIGNED = 'SIGNED',
  ARCHIVED = 'ARCHIVED'
}

export enum CaseFileStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

// Document interfaces
export interface UserDocument {
  id: string;
  userId: string;
  name: string;
  file: File | string;
  status: DocumentStatus;
  uploadDate: Date;
  comment?: string;
}

export interface UserDocumentRequest {
  userId: string;
  name: string;
  file: File;
}

export interface DocumentStatusUpdate {
  documentId: string;
  status: DocumentStatus;
  comment?: string;
}

// Payment interfaces
export interface Payment {
  id: string;
  label: string;
  amount: number;
  type: string;
  statut: PaymentStatus;
  caseFileId: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRequest {
  label: string;
  amount: number;
  type: string;
  statut: PaymentStatus;
  caseFileId: string;
  clientId: string;
}

export interface PaymentKPI {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalPayments: number;
}

// Meeting interfaces
export interface Meeting {
  id: string;
  title: string;
  description: string;
  meetingDate: Date;
  startTime: string;
  endTime: string;
  online: boolean;
  address?: string;
  link?: string;
  minutes?: string;
  caseFileId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingRequest {
  title: string;
  description: string;
  meetingDate: Date;
  startTime: string;
  endTime: string;
  online: boolean;
  address?: string;
  link?: string;
  minutes?: string;
  caseFileId: string;
}

// Case Type interfaces
export interface CaseType {
  id: string;
  name: string;
  requiredDocuments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseTypeRequest {
  name: string;
  requiredDocuments: string[];
}

export interface RequiredDocument {
  id: string;
  caseTypeId: string;
  documentName: string;
}

// Case Produced Document interfaces
export interface CaseProducedDocument {
  id: string;
  title: string;
  caseFileId: string;
  file: File | string;
  documentTypeId: string;
  status: ProducedDocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseProducedDocumentType {
  id: string;
  name: string;
  description: string;
  requiresSignature: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseProducedDocumentTypeRequest {
  name: string;
  description: string;
  requiresSignature: boolean;
}

export interface CaseProducedDocumentRequest {
  title: string;
  caseFileId: string;
  file: File;
  documentTypeId: string;
}

export interface CaseProducedDocumentKPI {
  totalDocuments: number;
  draftDocuments: number;
  pendingSignatures: number;
  signedDocuments: number;
  archivedDocuments: number;
}

// Case File interfaces
export interface CaseFile {
  id: string;
  reference: string;
  title: string;
  description: string;
  openingDate: Date;
  closingDate?: Date;
  lawyerId: string;
  notaryId: string;
  cabinetId: string;
  caseTypeId: string;
  status: CaseFileStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseFileRequest {
  reference: string;
  title: string;
  description: string;
  openingDate: Date;
  closingDate?: Date;
  lawyerId: string;
  notaryId: string;
  cabinetId: string;
  caseTypeId: string;
  status: CaseFileStatus;
}

export interface CaseFileKPI {
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  pendingCases: number;
  closedCases: number;
  archivedCases: number;
}

export interface CaseFilePercentageKPI {
  openPercentage: number;
  inProgressPercentage: number;
  pendingPercentage: number;
  closedPercentage: number;
  archivedPercentage: number;
}

// Cabinet interfaces
export interface Cabinet {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  notaryId: string;
  openingHours: string;
  logoFile?: File | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CabinetRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  notaryId: string;
  openingHours: string;
  logoFile?: File;
}

export interface CabinetAgent {
  id: string;
  cabinetId: string;
  agentId: string;
  joinedAt: Date;
}

// Rating interfaces
export interface Rating {
  id: string;
  ratedUserId: string;
  authorId: string;
  score: number;
  comment: string;
  createdAt: Date;
}

export interface RatingRequest {
  ratedUserId: string;
  authorId: string;
  score: number;
  comment: string;
}

export interface RatingAverage {
  userId: string;
  averageScore: number;
  totalRatings: number;
}

// Signature interfaces
export interface SignaturePosition {
  id: string;
  documentId: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  signerId: string;
  createdAt: Date;
}

export interface SignaturePositionRequest {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  signerId: string;
}

export interface SignFormRequest {
  pdfUrl: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  signatureFile: File;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  size?: number;
}

// Search parameters
export interface CabinetSearchParams extends PaginationParams {
  name?: string;
  latitude: number;
  longitude: number;
}