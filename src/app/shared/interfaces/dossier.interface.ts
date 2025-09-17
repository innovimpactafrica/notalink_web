export interface Dossier {
  id: string;
  title: string;
  type: string;
  client: string;
  createdDate: string;
  lastUpdate: string;
  status: 'En cours' | 'En attente' | 'Terminé';
  progress: number;
  nextAction: string;
  nextActionDate: string;
  color: string;
  description: string;
  notaire: string;
  clients: {
    name: string;
    email: string;
  }[];
  documents: {
    name: string;
    addedDate: string;
    status: 'Validé' | 'À signer' | 'En attente';
  }[];
  payments: {
    label: string;
    date: string;
    amount: number;
    status: 'Effectué' | 'En attente';
  }[];
  financialSummary: {
    notaryFees: number;
    taxes: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    paymentProgress: number;
  };
  appointments: {
    title: string;
    date: string;
    time: string;
    duration: string;
    status: 'À venir' | 'Terminé' | 'Annulé';
  }[];
  requiredDocuments: {
    name: string;
    mandatory: boolean;
    status: 'Reçu' | 'En attente';
  }[];
}