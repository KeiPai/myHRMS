import { Tabs, TabsList, TabsTrigger } from '@venizia/ardor-ui-kit';

export type NotificationFilter = 'all' | 'unread' | 'requests';

interface NotificationFiltersProps {
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  unreadCount?: number;
  requestCount?: number;
}

export function NotificationFilters({
  activeFilter,
  onFilterChange,
  unreadCount = 0,
  requestCount = 0,
}: NotificationFiltersProps) {
  return (
    <Tabs value={activeFilter} onValueChange={(v) => onFilterChange(v as NotificationFilter)}>
      <TabsList className="h-9">
        <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
        <TabsTrigger value="unread" className="text-sm">
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </TabsTrigger>
        <TabsTrigger value="requests" className="text-sm">
          Requests {requestCount > 0 && `(${requestCount})`}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
