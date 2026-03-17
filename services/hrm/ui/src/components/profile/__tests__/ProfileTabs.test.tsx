import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileTabs } from '../ProfileTabs';
import { EmployeeProfile } from '@/types';

const mockProfile: EmployeeProfile = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'Software Engineer',
  department: 'Engineering',
  status: 'active',
  employmentType: 'full_time',
  hireDate: '2023-01-01',
};

describe('ProfileTabs', () => {
  it('renders all tab triggers', () => {
    render(<ProfileTabs employee={mockProfile} />);
    
    expect(screen.getByRole('tab', { name: /individual profile/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /work history/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /payroll & benefits/i })).toBeInTheDocument();
  });

  it('switches content when tab is clicked', () => {
    render(<ProfileTabs employee={mockProfile} />);
    
    const workHistoryTab = screen.getByRole('tab', { name: /work history/i });
    fireEvent.click(workHistoryTab);
    
    expect(screen.getByText(/work history content/i)).toBeInTheDocument();
  });
});
