import { Injectable } from '@angular/core';
import { Dossier } from '../../../shared/interfaces/dossier.interface';

@Injectable({
  providedIn: 'root'
})
export class DossierService {
  private dossiers: Dossier[] = [
    {
      id: '1',
      title: 'Achat Appartement Dakar',
      type: 'Achat immobilier',
      client: 'Amadou Diop',
      createdDate: '15/06/2023',
      lastUpdate: '29/07/2023',
      status: 'En cours',
      progress: 65,
      nextAction: 'Signature Compromis',
      nextActionDate: '10/08/2023',
      color: 'bg-[#D4B036] text-[#D97706]',
      description: 'Acquisition d’un appartement de 3 pièces dans le quartier des Almadies à Dakar.',
      notaire: 'Me Fatou Ndiaye',
      clients: [
        { name: 'Amadou Diop', email: 'amadou.diop@example.com' }
      ],
      documents: [
        { name: 'Titre de propriété', addedDate: '20/06/2023', status: 'Validé' },
        { name: 'Compromis de vente', addedDate: '20/06/2023', status: 'À signer' },
        { name: 'Relevé cadastral', addedDate: '20/06/2023', status: 'En attente' }
      ],
      payments: [
        { label: 'Acompte', date: '15/06/2023', amount: 2000000, status: 'Effectué' },
        { label: 'Montant restant', date: '10/08/2023', amount: 6250000, status: 'En attente' }
      ],
      financialSummary: {
        notaryFees: 4500000,
        taxes: 3750000,
        totalAmount: 8250000,
        paidAmount: 2000000,
        remainingAmount: 6250000,
        paymentProgress: 24
      },
      appointments: [
        { title: 'Lecture du compromis', date: '19/07/2025', time: '10:00', duration: '30 min', status: 'À venir' },
        { title: 'Compromis de vente', date: '19/07/2025', time: '10:00', duration: '30 min', status: 'Terminé' },
        { title: 'Point téléphonique', date: '14/07/2025', time: '11:15', duration: '15 min', status: 'Annulé' }
      ],
      requiredDocuments: [
        { name: 'Pièce d’identité', mandatory: true, status: 'Reçu' },
        { name: 'Justificatif de domicile', mandatory: true, status: 'Reçu' },
        { name: 'Attestation bancaire', mandatory: true, status: 'En attente' }
      ]
    },
    {
      id: '2',
      title: 'Succession Martin',
      type: 'Succession',
      client: 'Fatou Sow, Ibrahim Sow',
      createdDate: '10/05/2023',
      lastUpdate: '20/07/2023',
      status: 'En attente',
      progress: 30,
      nextAction: 'Réception documents manquants',
      nextActionDate: '05/08/2023',
      color: 'bg-[#1C3055] text-[#1C3055]',
      description: 'Gestion de la succession de la famille Martin.',
      notaire: 'Me Abdoulaye Diop',
      clients: [
        { name: 'Fatou Sow', email: 'fatou.sow@example.com' },
        { name: 'Ibrahim Sow', email: 'ibrahim.sow@example.com' }
      ],
      documents: [
        { name: 'Acte de décès', addedDate: '10/05/2023', status: 'Validé' },
        { name: 'Testament', addedDate: '10/05/2023', status: 'En attente' }
      ],
      payments: [
        { label: 'Acompte', date: '10/05/2023', amount: 1000000, status: 'Effectué' }
      ],
      financialSummary: {
        notaryFees: 3000000,
        taxes: 2000000,
        totalAmount: 5000000,
        paidAmount: 1000000,
        remainingAmount: 4000000,
        paymentProgress: 20
      },
      appointments: [
        { title: 'Réunion initiale', date: '15/05/2023', time: '14:00', duration: '1h', status: 'Terminé' }
      ],
      requiredDocuments: [
        { name: 'Acte de naissance', mandatory: true, status: 'Reçu' },
        { name: 'Certificat d’hérédité', mandatory: true, status: 'En attente' }
      ]
    },
    {
      id: '3',
      title: 'Création SARL TechSénégal',
      type: 'Création société',
      client: 'Mamadou Ba',
      createdDate: '01/07/2023',
      lastUpdate: '28/07/2023',
      status: 'En cours',
      progress: 80,
      nextAction: 'Signature statuts',
      nextActionDate: '08/08/2023',
      color: 'bg-[#D4B036] text-[#D97706]',
      description: 'Création d’une SARL pour une entreprise technologique à Dakar.',
      notaire: 'Me Awa Sène',
      clients: [
        { name: 'Mamadou Ba', email: 'mamadou.ba@example.com' }
      ],
      documents: [
        { name: 'Statuts de la société', addedDate: '01/07/2023', status: 'À signer' },
        { name: 'Registre de commerce', addedDate: '01/07/2023', status: 'En attente' }
      ],
      payments: [
        { label: 'Acompte', date: '01/07/2023', amount: 1500000, status: 'Effectué' }
      ],
      financialSummary: {
        notaryFees: 2000000,
        taxes: 1500000,
        totalAmount: 3500000,
        paidAmount: 1500000,
        remainingAmount: 2000000,
        paymentProgress: 43
      },
      appointments: [
        { title: 'Réunion de constitution', date: '05/07/2023', time: '09:00', duration: '1h', status: 'Terminé' }
      ],
      requiredDocuments: [
        { name: 'Pièce d’identité', mandatory: true, status: 'Reçu' },
        { name: 'Plan d’affaires', mandatory: true, status: 'Reçu' }
      ]
    },
    {
      id: '4',
      title: 'Vente Terrain Agricole Thiès',
      type: 'Vente immobilier',
      client: 'Aissatou Ndiaye',
      createdDate: '25/06/2023',
      lastUpdate: '25/07/2023',
      status: 'En cours',
      progress: 45,
      nextAction: 'Mis à jour le',
      nextActionDate: '02/08/2023',
      color: 'bg-[#D4B036] text-[#D97706]',
      description: 'Vente d’un terrain agricole situé à Thiès.',
      notaire: 'Me Cheikh Fall',
      clients: [
        { name: 'Aissatou Ndiaye', email: 'aissatou.ndiaye@example.com' }
      ],
      documents: [
        { name: 'Titre foncier', addedDate: '25/06/2023', status: 'Validé' },
        { name: 'Contrat de vente', addedDate: '25/06/2023', status: 'À signer' }
      ],
      payments: [
        { label: 'Acompte', date: '25/06/2023', amount: 3000000, status: 'Effectué' }
      ],
      financialSummary: {
        notaryFees: 4000000,
        taxes: 2500000,
        totalAmount: 6500000,
        paidAmount: 3000000,
        remainingAmount: 3500000,
        paymentProgress: 46
      },
      appointments: [
        { title: 'Visite du terrain', date: '01/07/2023', time: '11:00', duration: '1h', status: 'Terminé' }
      ],
      requiredDocuments: [
        { name: 'Pièce d’identité', mandatory: true, status: 'Reçu' },
        { name: 'Certificat de propriété', mandatory: true, status: 'Reçu' }
      ]
    },
    {
      id: '5',
      title: 'Testament Olographe',
      type: 'Testament',
      client: 'Cheikh Diallo',
      createdDate: '20/06/2023',
      lastUpdate: '30/07/2023',
      status: 'En attente',
      progress: 90,
      nextAction: 'Signature finale',
      nextActionDate: '05/08/2023',
      color: 'bg-[#D4B036] text-[#D97706]',
      description: 'Rédaction d’un testament olographe pour Cheikh Diallo.',
      notaire: 'Me Awa Sène',
      clients: [
        { name: 'Cheikh Diallo', email: 'cheikh.diallo@example.com' }
      ],
      documents: [
        { name: 'Testament', addedDate: '20/06/2023', status: 'À signer' }
      ],
      payments: [
        { label: 'Acompte', date: '20/06/2023', amount: 500000, status: 'Effectué' }
      ],
      financialSummary: {
        notaryFees: 1000000,
        taxes: 500000,
        totalAmount: 1500000,
        paidAmount: 500000,
        remainingAmount: 1000000,
        paymentProgress: 33
      },
      appointments: [
        { title: 'Consultation testament', date: '25/06/2023', time: '15:00', duration: '45 min', status: 'Terminé' }
      ],
      requiredDocuments: [
        { name: 'Pièce d’identité', mandatory: true, status: 'Reçu' }
      ]
    },
    {
      id: '6',
      title: 'Contrat de Mariage',
      type: 'Contrat',
      client: 'Marie Sarr, Ousmane Ba',
      createdDate: '12/07/2023',
      lastUpdate: '01/08/2023',
      status: 'Terminé',
      progress: 100,
      nextAction: 'Archivé',
      nextActionDate: '01/08/2023',
      color: 'bg-[#16A34A] text-[#16A34A]',
      description: 'Rédaction d’un contrat de mariage pour Marie Sarr et Ousmane Ba.',
      notaire: 'Me Fatou Ndiaye',
      clients: [
        { name: 'Marie Sarr', email: 'marie.sarr@example.com' },
        { name: 'Ousmane Ba', email: 'ousmane.ba@example.com' }
      ],
      documents: [
        { name: 'Contrat de mariage', addedDate: '12/07/2023', status: 'Validé' }
      ],
      payments: [
        { label: 'Paiement complet', date: '12/07/2023', amount: 2000000, status: 'Effectué' }
      ],
      financialSummary: {
        notaryFees: 1500000,
        taxes: 500000,
        totalAmount: 2000000,
        paidAmount: 2000000,
        remainingAmount: 0,
        paymentProgress: 100
      },
      appointments: [
        { title: 'Signature contrat', date: '01/08/2023', time: '10:00', duration: '30 min', status: 'Terminé' }
      ],
      requiredDocuments: [
        { name: 'Pièce d’identité', mandatory: true, status: 'Reçu' },
        { name: 'Justificatif de domicile', mandatory: true, status: 'Reçu' }
      ]
    }
  ];

  getDossierById(id: string): Dossier | undefined {
    return this.dossiers.find(dossier => dossier.id === id);
  }

  getDossiers(): Dossier[] {
    return this.dossiers;
  }
}