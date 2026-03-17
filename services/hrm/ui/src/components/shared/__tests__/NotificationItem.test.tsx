import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationItem } from '../../shared/NotificationItem';
import { Notification } from '@/types';

const mockNotification: Notification = {
  id: '1',
  userId: 'user1',
  title: 'New Leave Request',
  description: 'John Doe has submitted a new leave request.',
  category: 'hr',
  isRead: false,
  createdAt: new Date().toISOString(),
  actionLabel: 'View Request',
  actionUrl: '/requests/1'
};

describe('NotificationItem', () => {
  it('renders notification content correctly', () => {
    render(<NotificationItem notification={mockNotification} />);
    
    expect(screen.getByText('New Leave Request')).toBeInTheDocument();
    expect(screen.getByText('John Doe has submitted a new leave request.')).toBeInTheDocument();
    expect(screen.getByText('hr')).toBeInTheDocument();
    expect(screen.getByText('View Request')).toBeInTheDocument();
  });

  it('shows unread indicator when isRead is false', () => {
    const { container } = render(<NotificationItem notification={mockNotification} />);
    
    // Check for the unread dot (bg-primary)
    expect(container.querySelector('.bg-\\[hsl\\(var\\(--primary\\)\\)\\]')).toBeInTheDocument();
  });

  it('hides unread indicator when isRead is true', () => {
    const readNotification = { ...mockNotification, isRead: true };
    const { container } = render(<NotificationItem notification={readNotification} />);
    
    expect(container.querySelector('.bg-\\[hsl\\(var\\(--primary\\)\\)\\]')).not.toBeInTheDocument();
  });
});
