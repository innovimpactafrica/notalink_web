export interface NotificationConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  closable?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface ToastNotification extends NotificationConfig {
  id: string;
  timestamp: Date;
}