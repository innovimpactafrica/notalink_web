import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Added FormsModule
  templateUrl: './otp-verification.component.html'
})
export class OtpVerificationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpForm!: FormGroup;
  otpDigits: string[] = ['', '', '', '', '', ''];
  contactMethod: 'email' | 'phone' = 'email';
  contact: string = '';
  maskedContact: string = '';
  
  isLoading = false;
  isInvalid = false;
  errorMessage = '';
  
  isResendDisabled = true;
  resendCountdown = 30;
  private countdownSubscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.startResendCountdown();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusInput(0), 100);
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private initializeComponent(): void {
    this.otpForm = this.formBuilder.group({});
    
    this.route.queryParams.subscribe(params => {
      this.contactMethod = params['method'] || 'email';
      this.contact = params['contact'] || '';
      this.maskedContact = this.maskContact(this.contact);
    });
  }

  private maskContact(contact: string): string {
    if (this.contactMethod === 'email') {
      const [username, domain] = contact.split('@');
      if (username && domain) {
        const maskedUsername = username.charAt(0) + '*'.repeat(Math.max(0, username.length - 2)) + username.charAt(username.length - 1);
        return `${maskedUsername}@${domain}`;
      }
    } else {
      if (contact.length > 4) {
        const visible = contact.slice(-4);
        const masked = '*'.repeat(contact.length - 4);
        return masked + visible;
      }
    }
    return contact;
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, ''); // Only digits

    if (value.length > 1) {
      value = value.charAt(0); // Take the first character
    }

    this.otpDigits[index] = value; // Update the array
    input.value = value; // Ensure input reflects the value
    this.clearError();

    if (value && index < 5) {
      setTimeout(() => this.focusInput(index + 1), 0);
    }

    this.updateFormValidity();
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      event.preventDefault();
      if (input.value) {
        this.otpDigits[index] = '';
        input.value = '';
        this.updateFormValidity();
      } else if (index > 0) {
        this.otpDigits[index - 1] = '';
        const prevInput = this.otpInputs.toArray()[index - 1]?.nativeElement;
        if (prevInput) prevInput.value = '';
        setTimeout(() => this.focusInput(index - 1), 0);
      }
    } else if (event.key === 'Delete') {
      event.preventDefault();
      this.otpDigits[index] = '';
      input.value = '';
      this.updateFormValidity();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      setTimeout(() => this.focusInput(index - 1), 0);
    } else if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      setTimeout(() => this.focusInput(index + 1), 0);
    } else if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6);

    // Start filling from the current index
    for (let i = 0; i < 6; i++) {
      this.otpDigits[i] = digits[i] || '';
      const inputElement = this.otpInputs.toArray()[i]?.nativeElement;
      if (inputElement) {
        inputElement.value = this.otpDigits[i];
      }
    }

    const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
    setTimeout(() => this.focusInput(nextEmptyIndex), 0);

    this.updateFormValidity();
    this.clearError();
  }

  onFocus(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => input.select(), 0);
  }

  private focusInput(index: number): void {
    const inputElement = this.otpInputs.toArray()[index]?.nativeElement;
    if (inputElement) {
      inputElement.focus();
      inputElement.select();
    }
  }

  private updateFormValidity(): void {
    // Validation via isCodeComplete
  }

  private clearError(): void {
    this.isInvalid = false;
    this.errorMessage = '';
  }

  get isCodeComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  get otpCode(): string {
    return this.otpDigits.join('');
  }

  onSubmit(): void {
    if (this.isCodeComplete) {
      this.isLoading = true;
      this.clearError();

      const verificationData = {
        code: this.otpCode,
        contactMethod: this.contactMethod,
        contact: this.contact
      };

      console.log('Données de vérification:', verificationData);
      this.verifyOtpCode(verificationData);
    }
  }

  private verifyOtpCode(data: any): void {
    setTimeout(() => {
      this.isLoading = false;
      const isValidCode = this.otpCode === '123456'; // Test code

      if (isValidCode) {
        console.log('Code OTP vérifié avec succès');
        this.router.navigate(['/reset-password'], {
          queryParams: {
            token: 'verification-token',
            method: this.contactMethod,
            contact: this.contact
          }
        });
      } else {
        this.showError('Code invalide. Veuillez réessayer.');
        this.clearOtpInputs();
        this.focusInput(0);
      }
    }, 2000);
  }

  private showError(message: string): void {
    this.isInvalid = true;
    this.errorMessage = message;
  }

  private clearOtpInputs(): void {
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpInputs.toArray().forEach((input, index) => {
      input.nativeElement.value = '';
    });
  }

  resendCode(): void {
    if (this.isResendDisabled) return;

    console.log('Renvoi du code OTP pour:', this.contact);
    this.startResendCountdown();
    alert('Code renvoyé avec succès !');
  }

  private startResendCountdown(): void {
    this.isResendDisabled = true;
    this.resendCountdown = 30;

    this.countdownSubscription = interval(1000)
      .pipe(takeWhile(() => this.resendCountdown > 0))
      .subscribe(() => {
        this.resendCountdown--;
        if (this.resendCountdown === 0) {
          this.isResendDisabled = false;
        }
      });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateBack(): void {
    this.router.navigate(['/forgot-password']);
  }
}