import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationList } from '../NotificationList';
import { Notification } from '@/types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Today Notification',
    description: 'Description 1',
    category: 'system',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Yesterday Notification',
    description: 'Description 2',
    category: 'hr',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

describe('NotificationList', () => {
  it('renders notifications grouped by date', () => {
    render(<NotificationList notifications={mockNotifications} />);
    
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByText('Today Notification')).toBeInTheDocument();
    expect(screen.getByText('Yesterday Notification')).toBeInTheDocument();
  });

  it('renders empty state when no notifications', () => {
    render(<NotificationList notifications={[]} />);
    
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/you're all caught up/i)).toBeInTheDocument();
  });
});
