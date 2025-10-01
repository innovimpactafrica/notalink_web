import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../core/layouts/main-layout/main-layout.component';
import { NotificationModalComponent, NotificationService } from '../../shared/ui/notification-modal/notification-modal.component';
import { InformationsGeneralesComponent } from '../../shared/components/espace/informations-generales/informations-generales.component';
import { DocumentsJustificatifsComponent } from '../../shared/components/espace/documents-justificatifs/documents-justificatifs.component';
import { RessourcesHumainesComponent } from '../../shared/components/espace/ressources-humaines/ressources-humaines.component';
import { EmployeModalComponent } from '../../shared/components/espace/employe-modal/employe-modal.component';
import { UserService } from '../../core/services/user.service';
import { UserDocumentService } from '../../core/services/user-document.service';
import { AuthService } from '../../core/services/auth.service';
import { CabinetService } from '../../core/services/cabinet.service';
import { TabType } from '../../shared/interfaces/notaire.interface';
import { User, UpdateUserRequest } from '../../shared/interfaces/user.interface';
import { UserDocument } from '../../shared/interfaces/models.interface';
import { SignUpRequest } from '../../shared/interfaces/auth.interface';

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
  templateUrl: './espace.component.html',
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
  agents: User[] = [];
  cabinetId: string | null = null;
  
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
  selectedEmploye: User | null = null;
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
    private userService: UserService,
    private userDocumentService: UserDocumentService,
    private authService: AuthService,
    private cabinetService: CabinetService
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
    this.loadCabinet();
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

  private loadCabinet(): void {
    this.userService.getCabinetOfCurrentUser().subscribe({
      next: (cabinet) => {
        this.cabinetId = cabinet.id;
      },
      error: (error) => {
        this.showErrorNotification(
          'Erreur',
          'Impossible de charger le cabinet.'
        );
        console.error('Erreur lors de la récupération du cabinet:', error);
      }
    });
  }

  private loadAgents(): void {
    if (!this.cabinetId) {
      return;
    }

    this.cabinetService.getCabinetAgents(this.cabinetId).subscribe({
      next: (users: any[]) => {
        this.agents = users;
      },
      error: (error) => {
        this.showErrorNotification(
          'Erreur',
          'Impossible de charger les agents.'
        );
        console.error('Erreur lors de la récupération des agents:', error);
      }
    });
  }

  setActiveTab(id: TabType): void {
    this.activeTab = id;
    if (id === 'ressources' && this.cabinetId) {
      this.loadAgents();
    }
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

  onEditEmploye(employe: User): void {
    this.selectedEmploye = employe;
    this.showEmployeModal = true;
  }

  onDeleteEmploye(employe: User): void {
    this.pendingAction = { type: 'delete', data: employe };
    this.showConfirmationModal(
      'Suppression',
      `Êtes-vous sûr de vouloir supprimer l'employé "${employe.prenom} ${employe.nom}" ?`,
      'Supprimer',
      'Annuler'
    );
  }

  onEmployeStatusChanged(event: {employe: User, action: string}): void {
    const { employe, action } = event;
    this.pendingAction = { type: 'toggle-status', data: employe };
    
    const actionText = action === 'activer' ? 'activer' : 'désactiver';
    const actionButtonText = actionText.charAt(0).toUpperCase() + actionText.slice(1);
    
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

  onEmployeSaved(employe: User): void {
    if (this.selectedEmploye) {
      // Mode édition
      const updateData: UpdateUserRequest = {
        nom: employe.nom,
        prenom: employe.prenom,
        email: employe.email,
        telephone: employe.telephone || '',
        profil: employe.profil as string,
        adress: employe.adress || '',
        lat: employe.lat || 0,
        lon: employe.lon || 0,
        password: employe.password || ''
      };
      this.userService.updateUser(this.selectedEmploye.id, updateData).subscribe({
        next: (updatedUser: User) => {
          console.log(updateData);
          this.showSuccessNotification(
            'Employé modifié',
            `Les informations de ${employe.prenom} ${employe.nom} ont été mises à jour.`
          );
          this.loadAgents();
        },
        error: (error) => {
          this.showErrorNotification(
            'Erreur',
            'Une erreur est survenue lors de la mise à jour.'
          );
          console.error('Erreur lors de la mise à jour de l\'employé:', error);
        }
      });
    } else {
      // Mode création
      const signUpData: SignUpRequest = {
        nom: employe.nom,
        prenom: employe.prenom,
        email: employe.email,
        password: '',
        telephone: employe.telephone || '',
        adress: '',
        lat: 0,
        lon: 0,
        profil: employe.profil as string,
      };
      this.authService.signUp(signUpData).subscribe({
        next: (authResponse) => {
          console.log(authResponse);
          const newUser = authResponse;  
          console.log(newUser);        
          if (this.cabinetId && newUser.id) {
            this.cabinetService.addAgentToCabinet(this.cabinetId, newUser.id).subscribe({
              next: () => {
                this.showSuccessNotification(
                  'Employé ajouté',
                  `${employe.prenom} ${employe.nom} a été ajouté à l'équipe.`
                );
                this.loadAgents();
              },
              error: (error) => {
                this.showErrorNotification(
                  'Erreur',
                  'Erreur lors de l\'ajout au cabinet.'
                );
                console.error('Erreur lors de l\'ajout au cabinet:', error);
              }
            });
          } else {
            this.showErrorNotification(
              'Erreur',
              'Cabinet ID manquant.'
            );
          }
        },
        error: (error) => {
          this.showErrorNotification(
            'Erreur',
            'Une erreur est survenue lors de la création.'
          );
          console.error('Erreur lors de la création de l\'employé:', error);
        }
      });
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
          if (this.cabinetId) {
            this.cabinetService.removeAgentFromCabinet(this.cabinetId, this.pendingAction.data.id).subscribe({
              next: () => {
                this.showSuccessNotification(
                  'Employé supprimé',
                  `${this.pendingAction?.data.prenom} ${this.pendingAction?.data.nom} a été supprimé.`
                );
                this.loadAgents();
              },
              error: (error) => {
                this.showErrorNotification(
                  'Erreur',
                  'Erreur lors de la suppression.'
                );
                console.error('Erreur lors de la suppression de l\'employé:', error);
              }
            });
          }
          break;
        
        // case 'toggle-status':
        //   const employe = this.pendingAction.data as User;
        //   const newActivated = !employe.activated;
        //   const updateData: UpdateUserRequest = { activated: newActivated };
        //   this.userService.updateUser(employe.id, updateData).subscribe({
        //     next: (updatedUser: User) => {
        //       const statusText = newActivated ? 'activé' : 'désactivé';
        //       this.showSuccessNotification(
        //         'Statut modifié',
        //         `L'employé ${employe.prenom} ${employe.nom} a été ${statusText}.`
        //       );
        //       this.loadAgents();
        //     },
        //     error: (error) => {
        //       this.showErrorNotification(
        //         'Erreur',
        //         'Erreur lors de la modification du statut.'
        //       );
        //       console.error('Erreur lors de la modification du statut:', error);
        //     }
        //   });
        //   break;
      }
    }
    
    this.hideNotificationModal();
    this.pendingAction = null;
  }
}