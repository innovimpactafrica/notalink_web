import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { NotificationModalComponent, NotificationService } from '../../shared/ui/notification-modal/notification-modal.component';
import { InformationsGeneralesComponent } from '../../shared/components/espace/informations-generales/informations-generales.component';
import { DocumentsJustificatifsComponent } from '../../shared/components/espace/documents-justificatifs/documents-justificatifs.component';
import { RessourcesHumainesComponent } from '../../shared/components/espace/ressources-humaines/ressources-humaines.component';
import { EmployeModalComponent } from '../../shared/components/espace/employe-modal/employe-modal.component';
import { NotaireService } from '../../core/services/notaire/notaire.service';
import { UserService } from '../../core/services/user.service';
import { UserDocumentService } from '../../core/services/user-document.service';
import { TabType, Employe } from '../../shared/interfaces/notaire.interface';
import { User, UpdateUserRequest } from '../../shared/interfaces/user.interface';
import { UserDocument } from '../../shared/interfaces/models.interface';

@Component({
  selector: 'app-espace',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    NotificationModalComponent,
    InformationsGeneralesComponent,
    DocumentsJustificatifsComponent,
    RessourcesHumainesComponent,
    EmployeModalComponent
  ],
  template: `
    <app-main-layout [pageTitle]="'Espace Notaire'">
      <div class="flex mx-auto space-x-6">
        <!-- Tabs Navigation -->
        <div class="bg-white rounded-lg p-6 shadow-sm h-1/4 w-1/4">
          <div class="flex flex-col space-y-1">
            <button
              *ngFor="let tab of tabs"
              (click)="activeTab = tab.id"
              [ngClass]="getTabClasses(tab.id)"
              class="flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="tab.icon"></path>
              </svg>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="transition-all duration-300 flex-1">
          <app-informations-generales
            *ngIf="activeTab === 'informations'"
            [userData]="currentUser"
            (infoUpdated)="onInfoUpdated($event)">
          </app-informations-generales>

          <app-documents-justificatifs
            *ngIf="activeTab === 'documents'"
            [documents]="userDocuments"
            [userId]="currentUser?.id"
            (documentAdded)="onDocumentAdded()">
          </app-documents-justificatifs>

          <app-ressources-humaines
            *ngIf="activeTab === 'ressources'"
            (employeAdded)="onAddEmploye()"
            (employeEdited)="onEditEmploye($event)"
            (employeDeleted)="onDeleteEmploye($event)"
            (employeStatusChanged)="onEmployeStatusChanged($event)">
          </app-ressources-humaines>
        </div>
      </div>

      <!-- Modal Employé -->
      <app-employe-modal
        [isVisible]="showEmployeModal"
        [employe]="selectedEmploye"
        (closed)="onEmployeModalClosed()"
        (employeSaved)="onEmployeSaved($event)">
      </app-employe-modal>

      <!-- Notification Modal -->
      <app-notification-modal
        [isVisible]="showNotification"
        [status]="notificationData.status"
        [title]="notificationData.title"
        [description]="notificationData.description"
        [buttonConfig]="notificationData.buttonConfig"
        [showCloseButton]="notificationData.showCloseButton"
        [closeOnOverlayClick]="notificationData.closeOnOverlayClick"
        (closed)="onNotificationClosed()"
        (buttonClicked)="onNotificationButtonClicked($event)">
      </app-notification-modal>
    </app-main-layout>
  `,
  styles: [`
    .tab-enter {
      opacity: 0;
      transform: translateY(10px);
    }
    .tab-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 300ms, transform 300ms;
    }
  `]
})
export class EspaceComponent implements OnInit {
  activeTab: TabType = 'informations';
  currentUser: User | null = null;
  userDocuments: UserDocument[] = [];
  
  tabs = [
    {
      id: 'informations' as TabType,
      label: 'Informations générales',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      id: 'documents' as TabType,
      label: 'Documents justificatifs',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      id: 'ressources' as TabType,
      label: 'Ressources humaines',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
    }
  ];

  // Modal et notification states
  showEmployeModal = false;
  selectedEmploye: Employe | null = null;
  showNotification = false;
  notificationData: any = {
    status: 'info',
    title: '',
    description: '',
    buttonConfig: null,
    showCloseButton: true,
    closeOnOverlayClick: true
  };

  // Action en attente pour les confirmations
  pendingAction: { type: string, data: any } | null = null;

  constructor(
    private notificationService: NotificationService,
    private notaireService: NotaireService,
    private userService: UserService,
    private userDocumentService: UserDocumentService
  ) {}

  ngOnInit(): void {
    // Observer les notifications du service global
    this.notificationService.notification$.subscribe(notification => {
      if (notification) {
        this.showNotificationModal(notification);
      } else {
        this.hideNotificationModal();
      }
    });

    // Récupérer les données de l'utilisateur connecté
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        // Récupérer les documents de l'utilisateur
        this.loadUserDocuments(user.id);
      },
      error: (error) => {
        this.showErrorNotification(
          'Erreur',
          'Impossible de récupérer les informations de l\'utilisateur.'
        );
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    });
  }

  private loadUserDocuments(userId: string): void {
    this.userDocumentService.getUserDocuments(userId).subscribe({
      next: (documents: UserDocument[]) => {
        this.userDocuments = documents;
      },
      error: (error) => {
        this.showErrorNotification(
          'Erreur',
          'Impossible de récupérer les documents de l\'utilisateur.'
        );
        console.error('Erreur lors de la récupération des documents:', error);
      }
    });
  }

  getTabClasses(tabId: TabType): string {
    const baseClasses = 'transition-all duration-200';
    if (this.activeTab === tabId) {
      return `${baseClasses} bg-[#D4B036] text-white shadow-md`;
    }
    return `${baseClasses} text-gray-600 hover:bg-gray-100 hover:text-gray-800`;
  }

  // Gestion des informations générales
  onInfoUpdated(updatedData: UpdateUserRequest): void {
    if (this.currentUser?.id) {
      this.userService.updateUser(this.currentUser.id, updatedData).subscribe({
        next: (updatedUser: User) => {
          this.currentUser = updatedUser;
          this.showSuccessNotification(
            'Informations mises à jour',
            'Vos informations personnelles ont été sauvegardées avec succès.'
          );
        },
        error: (error) => {
          this.showErrorNotification(
            'Erreur',
            'Une erreur est survenue lors de la mise à jour des informations.'
          );
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        }
      });
    }
  }

  // Gestion des documents
  onDocumentAdded(): void {
    if (this.currentUser?.id) {
      this.loadUserDocuments(this.currentUser.id);
      this.showSuccessNotification(
        'Document ajouté',
        'Le document a été ajouté avec succès et est en cours de vérification.'
      );
    }
  }

  // Gestion des employés
  onAddEmploye(): void {
    this.selectedEmploye = null;
    this.showEmployeModal = true;
  }

  onEditEmploye(employe: Employe): void {
    this.selectedEmploye = employe;
    this.showEmployeModal = true;
  }

  onDeleteEmploye(employe: Employe): void {
    this.pendingAction = { type: 'delete', data: employe };
    this.showConfirmationModal(
      'Suppression',
      `Êtes-vous sûr de vouloir supprimer l'employé "${employe.prenom} ${employe.nom}" ?`,
      'Supprimer',
      'Annuler'
    );
  }

  onEmployeStatusChanged(event: {employe: Employe, action: string}): void {
    const { employe, action } = event;
    this.pendingAction = { type: 'toggle-status', data: employe };
    
    const actionText = action === 'activer' ? 'activer' : 'désactiver';
    const actionButtonText = action === 'activer' ? 'Activer' : 'Désactiver';
    
    this.showConfirmationModal(
      'Confirmation',
      `Êtes-vous sûr de vouloir ${actionText} l'employé "${employe.prenom} ${employe.nom}" ?`,
      actionButtonText,
      'Annuler'
    );
  }

  onEmployeModalClosed(): void {
    this.showEmployeModal = false;
    this.selectedEmploye = null;
  }

  onEmployeSaved(employe: Employe): void {
    if (this.selectedEmploye) {
      // Mode édition
      this.notaireService.updateEmploye(this.selectedEmploye.id, employe);
      this.showSuccessNotification(
        'Employé modifié',
        `Les informations de ${employe.prenom} ${employe.nom} ont été mises à jour.`
      );
    } else {
      // Mode création
      this.notaireService.addEmploye(employe);
      this.showSuccessNotification(
        'Employé ajouté',
        `${employe.prenom} ${employe.nom} a été ajouté à l'équipe.`
      );
    }
    this.showEmployeModal = false;
    this.selectedEmploye = null;
  }

  // Gestion des notifications
  private showNotificationModal(data: any): void {
    this.notificationData = { ...data };
    this.showNotification = true;
  }

  private hideNotificationModal(): void {
    this.showNotification = false;
  }

  private showSuccessNotification(title: string, description?: string): void {
    this.showNotificationModal({
      status: 'success',
      title,
      description,
      showCloseButton: true,
      closeOnOverlayClick: true
    });
  }

  private showErrorNotification(title: string, description?: string): void {
    this.showNotificationModal({
      status: 'error',
      title,
      description,
      showCloseButton: true,
      closeOnOverlayClick: true
    });
  }

  private showConfirmationModal(title: string, description: string, primaryText: string, secondaryText: string): void {
    this.showNotificationModal({
      status: 'warning',
      title,
      description,
      buttonConfig: {
        type: 'multiple',
        primaryText,
        secondaryText
      },
      showCloseButton: false,
      closeOnOverlayClick: false
    });
  }

  onNotificationClosed(): void {
    this.hideNotificationModal();
    this.pendingAction = null;
  }

  onNotificationButtonClicked(action: 'primary' | 'secondary'): void {
    if (this.pendingAction && action === 'primary') {
      switch (this.pendingAction.type) {
        case 'delete':
          this.notaireService.deleteEmploye(this.pendingAction.data.id);
          this.showSuccessNotification(
            'Employé supprimé',
            `${this.pendingAction.data.prenom} ${this.pendingAction.data.nom} a été supprimé.`
          );
          break;
        
        case 'toggle-status':
          this.notaireService.toggleEmployeStatus(this.pendingAction.data.id);
          const newStatus = this.pendingAction.data.statut === 'actif' ? 'désactivé' : 'activé';
          this.showSuccessNotification(
            'Statut modifié',
            `L'employé ${this.pendingAction.data.prenom} ${this.pendingAction.data.nom} a été ${newStatus}.`
          );
          break;
      }
    }
    
    this.hideNotificationModal();
    this.pendingAction = null;
  }
}