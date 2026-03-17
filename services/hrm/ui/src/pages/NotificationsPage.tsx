import { useState, useMemo } from 'react';
import { Badge } from '@venizia/ardor-ui-kit';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { NotificationFilters, type NotificationFilter } from '@/components/notifications/NotificationFilters';
import { NotificationList } from '@/components/notifications/NotificationList';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationsPage() {
  const { data: notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const { unreadCount, filtered } = useMemo(() => {
    const unread = notifications.filter((n) => !n.isRead);
    let items: typeof notifications;
    switch (filter) {
      case 'unread':
        items = unread;
        break;
      case 'requests':
        items = notifications.filter(
          (n) => n.title.toLowerCase().includes('request') || n.category === 'hr'
        );
        break;
      default:
        items = notifications;
    }
    return { unreadCount: unread.length, filtered: items };
  }, [notifications, filter]);

  return (
    <ScreenLayout
      title={
        <span className="flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <Badge className="rounded-full border-0 bg-destructive px-2 text-xs text-white">
              {unreadCount}
            </Badge>
          )}
        </span>
      }
      description="Stay updated on employee requests and HR activities."
      actions={
        unreadCount > 0 ? (
          <button onClick={markAllAsRead} className="text-sm font-medium text-destructive hover:underline">
            Mark all as read
          </button>
        ) : null
      }
    >
      <div className="space-y-4">
        <NotificationFilters activeFilter={filter} onFilterChange={setFilter} unreadCount={unreadCount} />
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-[hsl(var(--primary))]" />
          </div>
        ) : (
          <NotificationList notifications={filtered} onMarkRead={markAsRead} />
        )}
      </div>
    </ScreenLayout>
  );
}
