export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  status: DocumentStatus;
  createdDate: Date;
  validatedBy?: string;
  validatedDate?: Date;
  folderId?: string;
  folderName?: string;
  clientId?: string;
  clientName?: string;
  notes?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  documentsCount: number;
  expanded?: boolean;
  documents?: Document[];
  subfolders?: DocumentSubfolder[];
}

export interface DocumentSubfolder {
  id: string;
  name: string;
  documentsCount: number;
  expanded?: boolean;
  documents?: Document[];
}

export type DocumentStatus = 'tous' | 'a-valider' | 'en-attente' | 'valides' | 'a-signer';

export interface DocumentStats {
  total: number;
  aValider: number;
  enAttente: number;
  valides: number;
}

export interface DocumentFilter {
  status: DocumentStatus;
  searchTerm: string;
}