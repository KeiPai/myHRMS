import { useMemo } from 'react';
import { NotificationItem } from '@/components/shared/NotificationItem';
import type { Notification } from '@/types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
}

function groupByDate(notifications: Notification[]): Map<string, Notification[]> {
  const groups = new Map<string, Notification[]>();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  for (const n of notifications) {
    const date = new Date(n.createdAt);
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let label: string;
    if (dateOnly.getTime() === today.getTime()) {
      label = 'Today';
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(n);
  }

  return groups;
}

export function NotificationList({ notifications, onMarkRead }: NotificationListProps) {
  const grouped = useMemo(() => groupByDate(notifications), [notifications]);

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No notifications</p>
        <p className="text-sm">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from(grouped.entries()).map(([dateLabel, items]) => (
        <div key={dateLabel}>
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground">{dateLabel}</p>
          <div className="space-y-1">
            {items.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onMarkRead={onMarkRead} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
