import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationModalComponent, NotificationData, NotificationService } from '../../../shared/ui/notification-modal/notification-modal.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationModalComponent],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  notificationData: NotificationData | null = null;

  @ViewChild(NotificationModalComponent) notificationModal?: NotificationModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.notificationService.notification$.subscribe(data => {
      this.notificationData = data;
      if (data && this.notificationModal) {
        this.notificationModal.isVisible = true;
        this.notificationModal.status = data.status;
        this.notificationModal.title = data.title;
        this.notificationModal.description = data.description;
        this.notificationModal.buttonConfig = data.buttonConfig;
      } else if (!data && this.notificationModal) {
        this.notificationModal.isVisible = false;
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;

      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.resetPassword({ email }).subscribe({
        next: () => {
          this.isLoading = false;
          this.notificationService.showSuccess(
            'Lien de réinitialisation envoyé',
            'Un lien de réinitialisation a été envoyé avec succès à votre adresse email.',
            {
              type: 'single',
              primaryText: 'Aller à la connexion'
            }
          );
        },
        error: (error) => {
          this.isLoading = false;
          // Afficher une notification personnalisée en cas d'erreur (email inexistant)
          this.notificationService.showWarning(
            'Email non trouvé',
            'Veuillez vérifier que vous avez bien saisi votre email. Si vous n\'avez pas encore de compte, veuillez en créer un en cliquant sur "Créer un compte".',
            {
              type: 'multiple',
              primaryText: 'Créer un compte',
              secondaryText: 'Réécrire l\'email'
            }
          );
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'L\'adresse email est requise';
      }
      if (field.errors['email']) {
        return 'Format d\'email invalide';
      }
    }
    return '';
  }

  onModalButtonClick(action: string): void {
    if (this.notificationModal) {
      if (action === 'primary') { // "Créer un compte"
        this.notificationModal.onClose();
        this.router.navigate(['/register']); // Rediriger vers la page d'inscription
      } else if (action === 'secondary') { // "Réécrire l'email"
        this.notificationModal.onClose();
        this.forgotPasswordForm.get('email')?.reset(); // Réinitialiser le champ email
      }
    }
  }
}