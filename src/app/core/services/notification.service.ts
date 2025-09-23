import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationData, ButtonConfig } from '../../shared/ui/notification-modal/notification-modal.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationData | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  showNotification(data: NotificationData): void {
    this.notificationSubject.next(data);
  }

  hideNotification(): void {
    this.notificationSubject.next(null);
  }

  showSuccess(title: string, description?: string, buttonConfig?: ButtonConfig): void {
    this.showNotification({
      status: 'success',
      title,
      description,
      buttonConfig
    });
  }

  showError(title: string, description?: string, buttonConfig?: ButtonConfig): void {
    this.showNotification({
      status: 'error',
      title,
      description,
      buttonConfig
    });
  }

  showWarning(title: string, description?: string, buttonConfig?: ButtonConfig): void {
    this.showNotification({
      status: 'warning',
      title,
      description,
      buttonConfig
    });
  }

  showInfo(title: string, description?: string, buttonConfig?: ButtonConfig): void {
    this.showNotification({
      status: 'info',
      title,
      description,
      buttonConfig
    });
  }
}