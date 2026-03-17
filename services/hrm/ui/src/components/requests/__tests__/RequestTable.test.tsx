import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RequestTable } from '../RequestTable';
import { Request } from '@/types';

const mockRequests: Request[] = [
  {
    id: '1',
    employeeId: 'emp1',
    type: 'leave',
    title: 'Annual Leave',
    status: 'approved',
    submittedAt: '2023-10-01T00:00:00Z',
  },
  {
    id: '2',
    employeeId: 'emp1',
    type: 'asset',
    title: 'MacBook Pro',
    status: 'pending',
    submittedAt: '2023-10-02T00:00:00Z',
  }
];

describe('RequestTable', () => {
  it('renders all requests initially', () => {
    render(<RequestTable requests={mockRequests} />);
    
    expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
  });

  it('filters requests when tab is changed', () => {
    render(<RequestTable requests={mockRequests} />);
    
    const leaveTab = screen.getByRole('tab', { name: /leave/i });
    fireEvent.click(leaveTab);
    
    expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument();
  });
});
