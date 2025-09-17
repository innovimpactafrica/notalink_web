import { FormGroup, AbstractControl } from '@angular/forms';

export class FormUtils {
  /**
   * Marquer tous les champs comme touchés
   */
  static markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Obtenir le message d'erreur pour un champ
   */
  static getFieldError(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return `${fieldName} est requis`;
    }
    if (errors['email']) {
      return 'Format d\'email invalide';
    }
    if (errors['minlength']) {
      return `${fieldName} doit contenir au moins ${errors['minlength'].requiredLength} caractères`;
    }
    if (errors['maxlength']) {
      return `${fieldName} ne peut pas dépasser ${errors['maxlength'].requiredLength} caractères`;
    }
    if (errors['pattern']) {
      return `Format de ${fieldName} invalide`;
    }
    if (errors['confirmPassword']) {
      return 'Les mots de passe ne correspondent pas';
    }
    if (errors['phone']) {
      return 'Format de téléphone invalide';
    }
    if (errors['password']) {
      const passwordErrors = [];
      if (errors['password'].minLength) passwordErrors.push('8 caractères minimum');
      if (errors['password'].upperCase) passwordErrors.push('une majuscule');
      if (errors['password'].lowerCase) passwordErrors.push('une minuscule');
      if (errors['password'].numeric) passwordErrors.push('un chiffre');
      if (errors['password'].special) passwordErrors.push('un caractère spécial');
      
      return `Le mot de passe doit contenir: ${passwordErrors.join(', ')}`;
    }

    return `${fieldName} invalide`;
  }

  /**
   * Vérifier si un champ est invalide et touché
   */
  static isFieldInvalid(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Vérifier si un champ est valide et touché
   */
  static isFieldValid(control: AbstractControl | null): boolean {
    return !!(control && control.valid && control.touched);
  }


  /**
   * Réinitialiser un formulaire
   */
  static resetForm(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
  }

  /**
   * Vérifier si un formulaire a des erreurs
   */
  static hasErrors(formGroup: FormGroup): boolean {
    return formGroup.invalid && formGroup.touched;
  }
}