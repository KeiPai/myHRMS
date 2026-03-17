import { Badge } from '@venizia/ardor-ui-kit';
import { Bell, FileText, Megaphone, ShoppingBag, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification, NotificationCategory } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

const categoryIcons: Record<NotificationCategory, typeof Bell> = {
  engineering: FileText,
  marketing: Megaphone,
  sales: ShoppingBag,
  product: Users,
  hr: Users,
  system: Bell,
};

const categoryColors: Record<NotificationCategory, string> = {
  engineering: 'bg-[#eff6ff] text-[#2b7fff]',
  marketing: 'bg-[#fff7ed] text-[#f54900]',
  sales: 'bg-[#dcfce7] text-[#008236]',
  product: 'bg-[#f3f4f6] text-[#4a5565]',
  hr: 'bg-[#eff6ff] text-[#2b7fff]',
  system: 'bg-[#f3f4f6] text-[#4a5565]',
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function NotificationItem({ notification, onMarkRead: _onMarkRead }: NotificationItemProps) {
  const Icon = categoryIcons[notification.category] || Bell;

  return (
    <div className={cn('flex items-start gap-4 rounded-lg px-4 py-4', !notification.isRead && 'bg-white')}>
      <div className="mt-2 flex-shrink-0">
        {!notification.isRead ? (
          <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary))]" aria-label="Unread" />
        ) : (
          <div className="h-2.5 w-2.5" />
        )}
      </div>

      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-white">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {notification.title}
              {!notification.isRead && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-foreground" />
              )}
            </p>
            <p className="text-sm text-muted-foreground">{notification.description}</p>
          </div>
          <span className="flex-shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn('border-0 text-[10px] font-medium capitalize', categoryColors[notification.category])}
          >
            {notification.category}
          </Badge>
          {notification.actionLabel && notification.actionUrl && (
            <a href={notification.actionUrl} className="text-xs font-medium text-[hsl(var(--primary))] hover:underline">
              {notification.actionLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
