// services/hrm/ui/src/types/notification.ts

export type NotificationCategory = 'engineering' | 'marketing' | 'sales' | 'product' | 'hr' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: NotificationCategory;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  senderName?: string;
  senderAvatar?: string;
  createdAt: string;
}
