export interface RendezVous {
  id: string;
  motif: string;
  type: 'physique' | 'telephonique' | 'visioconference';
  clientId: string;
  clientName: string;
  dossierId?: string;
  dossierNumero?: string;
  date: Date;
  heure: string;
  duree: number; // en minutes
  statut: 'planifie' | 'confirme' | 'annule' | 'reporte' | 'termine';
  lienVisio?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRendezVousDto {
  motif: string;
  type: 'physique' | 'telephonique' | 'visioconference';
  clientId: string;
  dossierId?: string;
  date: Date;
  heure: string;
  duree: number;
  lienVisio?: string;
  notes?: string;
}