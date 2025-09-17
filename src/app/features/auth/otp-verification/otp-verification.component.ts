import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './otp-verification.component.html'
})
export class OtpVerificationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('otpInput1') otpInput1!: ElementRef;
  @ViewChild('otpInput2') otpInput2!: ElementRef;
  @ViewChild('otpInput3') otpInput3!: ElementRef;
  @ViewChild('otpInput4') otpInput4!: ElementRef;
  @ViewChild('otpInput5') otpInput5!: ElementRef;
  @ViewChild('otpInput6') otpInput6!: ElementRef;

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
    @Inject(PLATFORM_ID) private platformId: Object,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    if (isPlatformBrowser(this.platformId)) {
      this.startResendCountdown();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.focusInput(0);
    }
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

  onDigitChange(index: number, event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').charAt(0) || ''; // Premier chiffre ou vide

    this.otpDigits[index] = value;
    input.value = value; // Synchronise immédiatement

    this.clearError();

    // Focus au suivant si rempli
    if (value && index < 5) {
      this.focusInput(index + 1);
    } else if (!value && index > 0) {
      this.focusInput(index - 1); // Retour si effacé
    }

    this.updateFormValidity();
  }

  private focusInput(index: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const inputs = [this.otpInput1, this.otpInput2, this.otpInput3, this.otpInput4, this.otpInput5, this.otpInput6];
    if (index >= 0 && index < inputs.length && inputs[index]) {
      inputs[index].nativeElement.focus();
    }
  }

  private updateFormValidity(): void {
    // Pas de logique complexe, isCodeComplete suffit
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
    if (this.isCodeComplete && isPlatformBrowser(this.platformId)) {
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
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      this.isLoading = false;
      const isValidCode = this.otpCode === '123456';

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
    if (isPlatformBrowser(this.platformId)) {
      [this.otpInput1, this.otpInput2, this.otpInput3, this.otpInput4, this.otpInput5, this.otpInput6].forEach(input => {
        if (input?.nativeElement instanceof HTMLInputElement) {
          input.nativeElement.value = '';
        }
      });
    }
  }

  resendCode(): void {
    if (this.isResendDisabled || !isPlatformBrowser(this.platformId)) return;

    console.log('Renvoi du code OTP pour:', this.contact);
    this.startResendCountdown();
    alert('Code renvoyé avec succès !');
  }

  private startResendCountdown(): void {
    if (!isPlatformBrowser(this.platformId)) return;

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