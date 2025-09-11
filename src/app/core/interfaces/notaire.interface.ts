export interface NotaireInfo {
  id?: string;
  prenom: string;
  nom: string;
  cabinet: string;
  email: string;
  telephone: string;
  numeroOrdre: string;
}

export interface Document {
  id: string;
  nom: string;
  type: string;
  dateMiseAJour: string;
  statut: 'verifie' | 'en_attente' | 'rejete';
}

export interface Employe {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  poste: string;
  statut: 'actif' | 'inactif';
  initiales: string;
}

export type TabType = 'informations' | 'documents' | 'ressources';