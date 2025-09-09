import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationModalComponent, NotificationStatus } from '../../../shared/ui/notification-modal/notification-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationModalComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  documentForm!: FormGroup;
  currentStep = 1;
  selectedFile: File | null = null;
  maxFileSize = 10 * 1024 * 1024; // 10MB en bytes
  
  // Propriétés pour le modal de notification
  isModalVisible = false;
  modalStatus: NotificationStatus = 'success';
  modalTitle = '';
  modalDescription = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    // Formulaire étape 1 - Informations personnelles
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      cabinet: [''],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s\+\-\(\)]{8,15}$/)]]
    });

    // Formulaire étape 2 - Document de l'ordre
    this.documentForm = this.fb.group({
      orderNumber: ['', [Validators.required]],
      document: [null, [Validators.required]]
    });
  }

  onContinue(): void {
    if (this.registerForm.valid) {
      this.currentStep = 2;
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  goBack(): void {
    this.currentStep = 1;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Vérifier la taille du fichier
      if (file.size > this.maxFileSize) {
        alert('Le fichier est trop volumineux. La taille maximale autorisée est de 10MB.');
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Type de fichier non autorisé. Seuls les fichiers PNG, JPG, JPEG et PDF sont acceptés.');
        return;
      }

      this.selectedFile = file;
      this.documentForm.patchValue({ document: file });
      this.documentForm.get('document')?.markAsTouched();
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.documentForm.patchValue({ document: null });
    this.documentForm.get('document')?.markAsTouched();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.documentForm.valid && this.registerForm.valid) {
      const registrationData = {
        // Données de l'étape 1
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        cabinet: this.registerForm.get('cabinet')?.value,
        email: this.registerForm.get('email')?.value,
        phone: this.registerForm.get('phone')?.value,
        
        // Données de l'étape 2
        orderNumber: this.documentForm.get('orderNumber')?.value,
        document: this.selectedFile
      };

      console.log('Données d\'inscription:', registrationData);

      // Ici vous pourriez appeler votre service d'inscription
      this.submitRegistration(registrationData);
    
    } else {
      this.markFormGroupTouched(this.documentForm);
    }
  }

  private submitRegistration(data: any): void {
    // Simulation d'un appel API
    console.log('Envoi des données d\'inscription...', data);
    
    // Créer FormData pour l'envoi du fichier
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('cabinet', data.cabinet || '');
    formData.append('email', data.email || '');
    formData.append('phone', data.phone);
    formData.append('orderNumber', data.orderNumber);
    
    if (data.document) {
      formData.append('document', data.document);
    }

    // Simulation d'une réponse avec succès/échec aléatoire pour la démo
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% de chance de succès
      
      if (isSuccess) {
        // Succès
        this.showNotificationModal(
          'success',
          'Inscription réussie !',
          'Votre compte a été créé avec succès.'
        );
      } else {
        // Échec
        this.showNotificationModal(
          'error',
          'Erreur d\'inscription',
          'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.'
        );
      }
    }, 1500);

    // Ici vous feriez l'appel HTTP vers votre backend
    // this.registrationService.register(formData).subscribe({
    //   next: (response) => {
    //     this.showNotificationModal(
    //       'success',
    //       'Inscription réussie !',
    //       'Votre compte a été créé avec succès.'
    //     );
    //   },
    //   error: (error) => {
    //     this.showNotificationModal(
    //       'error',
    //       'Erreur d\'inscription',
    //       'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.'
    //     );
    //   }
    // });
  }

  private showNotificationModal(status: NotificationStatus, title: string, description: string): void {
    this.modalStatus = status;
    this.modalTitle = title;
    this.modalDescription = description;
    this.isModalVisible = true;
  }

  onModalClosed(): void {
    this.isModalVisible = false;
    
    // Si c'est un succès, rediriger vers la page de connexion
    if (this.modalStatus === 'success') {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 300);
    }
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
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get cabinet() { return this.registerForm.get('cabinet'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get orderNumber() { return this.documentForm.get('orderNumber'); }
  get document() { return this.documentForm.get('document'); }
}