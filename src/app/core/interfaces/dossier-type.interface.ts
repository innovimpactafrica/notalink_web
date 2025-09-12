export interface DossierType {
  id: string;
  nom: string;
  description?: string;
  dateCreation: Date;
  dateModification: Date;
  actif: boolean;
}

export interface CreateDossierTypeRequest {
  nom: string;
  description?: string;
}

export interface UpdateDossierTypeRequest {
  nom: string;
  description?: string;
}

export interface DocumentType {
  id: string;
  nom: string;
  description?: string;
  dossierTypeId: string;
  documentRequis: boolean;
  signatureRequise: boolean;
  ordre: number;
  actif: boolean;
}

export interface CreateDocumentTypeRequest {
  nom: string;
  description?: string;
  dossierTypeId: string;
  documentRequis: boolean;
  signatureRequise: boolean;
}