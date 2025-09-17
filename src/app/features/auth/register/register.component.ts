// features/auth/register/register.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SignUpRequest } from '../../../shared/interfaces/auth.interface';
import { CustomValidators } from '../../../shared/utils/validator.utils';

type NotificationStatusType = 'success' | 'error' | 'info';

interface NotificationStatus {
  type: NotificationStatusType;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  registerForm!: FormGroup;
  passwordForm!: FormGroup;
  currentStep = 1;
  showPassword = false;
  isLoading = false;
  
  // Propriétés pour les notifications
  notificationMessage = '';
  notificationStatus: NotificationStatus = { type: 'info' };

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    // Formulaire étape 1 - Informations personnelles
    this.registerForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, CustomValidators.phone]],
      adress: ['', [Validators.required]],
      profil: ['', [Validators.required]]
    });

    // Formulaire étape 2 - Mot de passe et coordonnées
    this.passwordForm = this.fb.group({
      lat: [0, [Validators.required]],
      lon: [0, [Validators.required]],
      password: ['', [Validators.required, CustomValidators.password]],
      confirmPassword: ['', [Validators.required, CustomValidators.confirmPassword('password')]]
    });
  }

  onContinue(): void {
    if (this.registerForm.valid) {
      this.currentStep = 2;
      this.clearNotification();
    } else {
      this.markFormGroupTouched(this.registerForm);
      this.showNotification('error', 'Veuillez remplir tous les champs requis');
    }
  }

  goBack(): void {
    this.currentStep = 1;
    this.clearNotification();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.passwordForm.valid && this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.clearNotification();

      const signUpData: SignUpRequest = {
        nom: this.registerForm.get('nom')?.value,
        prenom: this.registerForm.get('prenom')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.passwordForm.get('password')?.value,
        telephone: this.registerForm.get('telephone')?.value,
        adress: this.registerForm.get('adress')?.value,
        lat: this.passwordForm.get('lat')?.value || 0,
        lon: this.passwordForm.get('lon')?.value || 0,
        profil: this.registerForm.get('profil')?.value
      };

      this.authService.signUp(signUpData).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.showNotification('success', 'Inscription réussie ! Redirection en cours...');
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur d\'inscription:', error);
          
          // Gestion des messages d'erreur
          let errorMessage = 'Une erreur est survenue lors de l\'inscription';
          
          if (error.status === 422) {
            errorMessage = 'Données d\'inscription invalides';
          } else if (error.status === 409) {
            errorMessage = 'Un compte avec cet email existe déjà';
          } else if (error.status === 0) {
            errorMessage = 'Erreur de connexion au serveur';
          } else if (error.userMessage) {
            errorMessage = error.userMessage;
          }
          
          this.showNotification('error', errorMessage);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.passwordForm);
      this.showNotification('error', 'Veuillez corriger les erreurs dans le formulaire');
    }
  }

  private showNotification(type: NotificationStatusType, message: string): void {
    this.notificationStatus = { type };
    this.notificationMessage = message;
  }

  private clearNotification(): void {
    this.notificationMessage = '';
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control && typeof control === 'object' && 'controls' in control) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get prenom() { return this.registerForm.get('prenom'); }
  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get telephone() { return this.registerForm.get('telephone'); }
  get adress() { return this.registerForm.get('adress'); }
  get profil() { return this.registerForm.get('profil'); }
  get lat() { return this.passwordForm.get('lat'); }
  get lon() { return this.passwordForm.get('lon'); }
  get password() { return this.passwordForm.get('password'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
}