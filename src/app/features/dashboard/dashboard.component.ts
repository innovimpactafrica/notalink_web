import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { WelcomeCardComponent } from '../../shared/components/Dashbord/welcome-card/welcome-card.component';
import { StatCardComponent } from '../../shared/components/Dashbord/stat-card/stat-card.component';
import { ChartCardComponent } from '../../shared/components/Dashbord/chart-card/chart-card.component';
import { PaymentCardComponent } from '../../shared/components/Dashbord/payment-card/payment-card.component';
import { AlertCardComponent } from '../../shared/components/Dashbord/alert-card/alert-card.component';
import { SignatureCardComponent } from '../../shared/components/Dashbord/signature-card/signature-card.component';
import { WorkloadCardComponent } from '../../shared/components/Dashbord/workload-card/workload-card.component';
import { UserService } from '../../core/services/user.service';
import { CaseFileService } from '../../core/services/case-file.service';
import { User } from '../../shared/interfaces/user.interface';
import { CaseFileKPI } from '../../shared/interfaces/models.interface';
import { forkJoin } from 'rxjs';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  bgColor: string;
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

interface WelcomeData {
  userName: string;
  date: string;
  location: string;
  stats: StatItem[];
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
  template: `
    <app-main-layout [pageTitle]="'Tableau de bord'">
      <!-- Dashboard Content -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-7xl mx-auto">
        <!-- Welcome Card - Spans full width on small screens, 2 columns on larger -->
        <div class="col-span-1 sm:col-span-2 lg:col-span-4">
          <app-welcome-card
            [userName]="welcomeData.userName"
            [date]="welcomeData.date"
            [location]="welcomeData.location"
            [stats]="welcomeData.stats">
          </app-welcome-card>
        </div>

        <!-- Chart Card - 1 column on small, full width on mobile -->
        <div class="col-span-1 sm:col-span-1 lg:col-span-2">
          <app-chart-card [title]="'Répartition des dossiers (%)'"></app-chart-card>
        </div>

        <!-- Documents Chart - 1 column on small, full width on mobile -->
        <div class="col-span-1 sm:col-span-1 lg:col-span-2">
          <app-stat-card [title]="'Documents'"></app-stat-card>
        </div>

        <!-- Payments Card - Spans full width -->
        <div class="col-span-1 sm:col-span-2 lg:col-span-4">
          <app-payment-card [title]="'Paiements'"></app-payment-card>
        </div>

        <!-- Alert Card (Documents) -->
        <div class="col-span-1 sm:col-span-2 lg:col-span-4">
          <app-alert-card
            [title]="alertsData.documentsTitle"
            [type]="'document'">
          </app-alert-card>
        </div>

        <!-- Alert Card (Messages) -->
        <!-- <div class="col-span-1 sm:col-span-1 lg:col-span-2">
          <app-alert-card
            [title]="alertsData.messagesTitle"
            [type]="'message'">
          </app-alert-card>
        </div> -->

        <!-- Signature Card -->
        <div class="col-span-1 sm:col-span-2 lg:col-span-4">
          <app-signature-card
            [title]="signaturesData.title">
          </app-signature-card>
        </div>

        <!-- Workload Card -->
        <div class="col-span-1 sm:col-span-2 lg:col-span-4">
          <app-workload-card
            [title]="workloadData.title">
          </app-workload-card>
        </div>
      </div>
    </app-main-layout>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly caseFileService = inject(CaseFileService);

  // Données dynamiques pour l'utilisateur connecté
  welcomeData: WelcomeData = {
    userName: '',
    date: this.getCurrentDate(),
    location: '',
    stats: [
      { label: 'Total dossiers', value: '0', icon: 'images/dossier.svg', bgColor: 'bg-yellow-100' },
      { label: 'Total clients', value: '0', icon: 'images/users.svg', bgColor: 'bg-blue-100' },
      { label: 'Dossiers ouverts', value: '0', icon: 'images/dossier_open.svg', bgColor: 'bg-green-100' },
      { label: 'Dossiers clôturés', value: '0', icon: 'images/dossier_success.svg', bgColor: 'bg-purple-100' }
    ]
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

  ngOnInit(): void {
    this.loadCurrentUserAndKPI();
  }

  private loadCurrentUserAndKPI(): void {
    this.userService.getCabinetIdOfCurrentUser().subscribe({
      next: (cabinetId) => {
        forkJoin({
          user: this.userService.getCurrentUser(),
          caseKpi: this.caseFileService.getCabinetCaseFileKPI(cabinetId)
        }).subscribe({
          next: ({ user, caseKpi }) => {
            this.updateWelcomeDataWithUser(user);
            this.updateWelcomeDataWithKPI(caseKpi);
          },
          error: (error) => {
            console.error('Erreur lors du chargement des données:', error);
            this.setDefaultWelcomeData();
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'ID du cabinet:', error);
        this.setDefaultWelcomeData();
      }
    });
  }

  private updateWelcomeDataWithUser(user: User): void {
    this.welcomeData = {
      ...this.welcomeData,
      userName: this.formatUserName(user),
      location: user.adress || 'Cabinet Notarial'
    };
  }

  private updateWelcomeDataWithKPI(kpi: CaseFileKPI): void {
    const totalCaseFiles = typeof kpi?.totalCaseFiles === 'number' ? kpi.totalCaseFiles : 0;
    const totalClients = typeof kpi?.totalClients === 'number' ? kpi.totalClients : 0;
    const openCases = typeof kpi?.openCases === 'number' ? kpi.openCases : 0;
    const closedCases = typeof kpi?.closedCases === 'number' ? kpi.closedCases : 0;

    this.welcomeData = {
      ...this.welcomeData,
      stats: [
        { label: 'Total dossiers', value: totalCaseFiles.toString(), icon: 'images/dossier.svg', bgColor: 'bg-yellow-100' },
        { label: 'Total clients', value: totalClients.toString(), icon: 'images/users.svg', bgColor: 'bg-blue-100' },
        { label: 'Dossiers ouverts', value: openCases.toString(), icon: 'images/dossier_open.svg', bgColor: 'bg-green-100' },
        { label: 'Dossiers clôturés', value: closedCases.toString(), icon: 'images/dossier_success.svg', bgColor: 'bg-purple-100' }
      ]
    };
  }

  private formatUserName(user: User): string {
    return `${user.prenom} ${user.nom}`;
  }

  private setDefaultWelcomeData(): void {
    this.welcomeData = {
      ...this.welcomeData,
      userName: 'Utilisateur',
      location: 'Cabinet Notarial',
      stats: [
        { label: 'Total dossiers', value: '0', icon: 'images/dossier.svg', bgColor: 'bg-yellow-100' },
        { label: 'Total clients', value: '0', icon: 'images/users.svg', bgColor: 'bg-blue-100' },
        { label: 'Dossiers ouverts', value: '0', icon: 'images/dossier_open.svg', bgColor: 'bg-green-100' },
        { label: 'Dossiers clôturés', value: '0', icon: 'images/dossier_success.svg', bgColor: 'bg-purple-100' }
      ]
    };
  }

  private getCurrentDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('fr-FR', options)
      .replace(/^\w/, c => c.toUpperCase());
  }
}