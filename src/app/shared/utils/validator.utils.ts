import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static email(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { email: true };
    }
    return null;
  }

  static password(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const errors: any = {};

    if (!hasMinLength) errors.minLength = true;
    if (!hasUpperCase) errors.upperCase = true;
    if (!hasLowerCase) errors.lowerCase = true;
    if (!hasNumeric) errors.numeric = true;
    if (!hasSpecial) errors.special = true;

    return Object.keys(errors).length ? errors : null;
  }

  static confirmPassword(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.root.get(passwordField);
      const confirmPassword = control.value;

      if (password && confirmPassword && password.value !== confirmPassword) {
        return { confirmPassword: true };
      }
      return null;
    };
  }

  static phone(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (control.value && !phoneRegex.test(control.value)) {
      return { phone: true };
    }
    return null;
  }
}