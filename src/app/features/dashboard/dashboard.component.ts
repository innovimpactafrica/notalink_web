import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { WelcomeCardComponent } from '../../shared/components/Dashbord/welcome-card/welcome-card.component';
import { StatCardComponent } from '../../shared/components/Dashbord/stat-card/stat-card.component';
import { ChartCardComponent } from '../../shared/components/Dashbord/chart-card/chart-card.component';
import { PaymentCardComponent } from '../../shared/components/Dashbord/payment-card/payment-card.component';
import { AlertCardComponent } from '../../shared/components/Dashbord/alert-card/alert-card.component';
import { SignatureCardComponent } from '../../shared/components/Dashbord/signature-card/signature-card.component';
import { WorkloadCardComponent } from '../../shared/components/Dashbord/workload-card/workload-card.component';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  bgColor: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage: string;
}

interface PaymentData {
  label: string;
  value: string;
  period?: string;
}

interface AlertItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'signature' | 'message' | 'action';
  urgent?: boolean;
}

interface SignatureItem {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  overdue: boolean;
}

interface WorkloadItem {
  title: string;
  count: number;
  status: 'urgent' | 'pending' | 'controlled';
  subtitle?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    WelcomeCardComponent,
    StatCardComponent,
    ChartCardComponent,
    PaymentCardComponent,
    AlertCardComponent,
    SignatureCardComponent,
    WorkloadCardComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  // Static data
  welcomeData = {
    userName: 'Me Fatou Ndiaye',
    date: 'Jeudi 27 Juillet 2025',
    location: 'Cabinet Notarial Dakar',
    stats: [
      { label: 'Total dossiers', value: '100', icon: 'images/dossier.svg', bgColor: 'bg-yellow-100' },
      { label: 'Total clients', value: '48', icon: 'images/users.svg', bgColor: 'bg-blue-100' },
      { label: 'Dossiers ouverts', value: '75', icon: 'images/dossier_open.svg', bgColor: 'bg-green-100' },
      { label: 'Dossiers clôturés', value: '20', icon: 'images/dossier_success.svg', bgColor: 'bg-purple-100' }
    ] as StatItem[]
  };

  chartData = {
    title: 'Répartition des dossiers (%)',
    period: 'Ce mois',
    data: [
      { label: 'Ouvert', value: 40, color: '#3B82F6', percentage: '40%' },
      { label: 'Traitement en cours', value: 25, color: '#8B5CF6', percentage: '25%' },
      { label: 'En attente', value: 10, color: '#F59E0B', percentage: '10%' },
      { label: 'Terminé et clôturé', value: 20, color: '#10B981', percentage: '20%' },
      { label: 'Annulé', value: 5, color: '#EF4444', percentage: '5%' }
    ] as ChartData[]
  };

  documentsData = {
    title: 'Documents',
    period: 'Ce mois',
    data: [
      { label: 'Total', value: 280 },
      { label: 'En attente de signature', value: 60 },
      { label: 'Signé', value: 200 },
      { label: 'Pas de signature requise', value: 20 }
    ]
  };

  paymentsData = {
    title: 'Paiements',
    data: [
      { label: 'Montant encaissé', value: '15 250 F CFA', period: 'Ce mois' },
      { label: 'Montant en attente', value: '4 250 F CFA' },
      { label: 'Factures Payées', value: '58' },
      { label: 'Factures Impayées', value: '12' }
    ] as PaymentData[]
  };

  alertsData = {
    documentsTitle: 'Alertes - Documents urgents',
    messagesTitle: 'Alertes - Messages & actions requises',
    documentAlerts: [
      {
        id: '1',
        title: 'Document en attente depuis 10 jours',
        description: 'Dossier Sari Diop - Achat immobilier',
        type: 'document' as const,
        urgent: true
      },
      {
        id: '2',
        title: 'Signature client en retard',
        description: 'Contrat de mariage Moussa Sow',
        type: 'signature' as const,
        urgent: true
      }
    ] as AlertItem[],
    messageAlerts: [
      {
        id: '3',
        title: 'Nouveau message client',
        description: 'Mme Sow - Précision sur la clause 2',
        type: 'message' as const
      },
      {
        id: '4',
        title: 'Action requise',
        description: 'Pièce refusée - RIB illisible pour DOS-1003',
        type: 'action' as const
      }
    ] as AlertItem[]
  };

  signaturesData = {
    title: 'Signatures en attente',
    items: [
      {
        id: '1',
        name: 'Groupe Ndiaye',
        description: 'Acte de vente - Résidence Les Chênes',
        dueDate: 'Envoyé le 15/06',
        overdue: true
      },
      {
        id: '2',
        name: 'Sari Diop',
        description: 'Bail commercial',
        dueDate: 'Envoyé le 12/06',
        overdue: true
      }
    ] as SignatureItem[]
  };

  workloadData = {
    title: 'Ma charge de travail',
    items: [
      {
        title: 'Dossiers à finaliser',
        count: 12,
        status: 'urgent' as const,
        subtitle: '+2 depuis hier'
      },
      {
        title: 'Rendez-vous',
        count: 7,
        status: 'pending' as const,
        subtitle: '1 nouveau'
      },
      {
        title: 'Signatures prévues',
        count: 7,
        status: 'controlled' as const,
        subtitle: 'Tous confirmés'
      }
    ] as WorkloadItem[]
  };
}