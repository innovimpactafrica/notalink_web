import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationConfig, ToastNotification } from '../../shared/interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<ToastNotification[]>([]);
  private notificationId = 0;

  public notifications$: Observable<ToastNotification[]> = this.notifications.asObservable();

  show(config: NotificationConfig): string {
    const notification: ToastNotification = {
      id: `notification-${++this.notificationId}`,
      timestamp: new Date(),
      duration: config.duration || 5000,
      closable: config.closable !== false,
      ...config
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, notification]);

    // Auto-remove notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }

  success(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'success',
      message,
      title,
      duration
    });
  }

  error(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'error',
      message,
      title: title || 'Erreur',
      duration: duration || 0 // Erreurs persistent par défaut
    });
  }

  warning(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'warning',
      message,
      title,
      duration
    });
  }

  info(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'info',
      message,
      title,
      duration
    });
  }

  remove(id: string): void {
    const currentNotifications = this.notifications.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(filteredNotifications);
  }

  clear(): void {
    this.notifications.next([]);
  }
}