// components/notification-modal/notification-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NotificationData {
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="onBackdropClick($event)">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center" (click)="$event.stopPropagation()">
        <!-- Success Icon -->
        <div *ngIf="data?.type === 'success'" class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <!-- Error Icon -->
        <div *ngIf="data?.type === 'error'" class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <p class="text-gray-700 text-lg font-medium">{{ data?.message }}</p>
        
        <button 
          *ngIf="showCloseButton"
          (click)="onClose()"
          class="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
          Fermer
        </button>
      </div>
    </div>
  `
})
export class NotificationModalComponent {
  @Input() show = false;
  @Input() data: NotificationData | null = null;
  @Input() autoClose = true;
  @Input() autoCloseDelay = 3000;
  @Input() showCloseButton = false;
  @Output() close = new EventEmitter<void>();

  private autoCloseTimer?: number;

  ngOnInit() {
    if (this.autoClose && this.show) {
      this.startAutoCloseTimer();
    }
  }

  ngOnChanges() {
    if (this.show && this.autoClose) {
      this.startAutoCloseTimer();
    } else {
      this.clearAutoCloseTimer();
    }
  }

  ngOnDestroy() {
    this.clearAutoCloseTimer();
  }

  private startAutoCloseTimer() {
    this.clearAutoCloseTimer();
    this.autoCloseTimer = window.setTimeout(() => {
      this.onClose();
    }, this.autoCloseDelay);
  }

  private clearAutoCloseTimer() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = undefined;
    }
  }

  onClose() {
    this.clearAutoCloseTimer();
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}