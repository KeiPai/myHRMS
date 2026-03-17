import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileHeader } from '../ProfileHeader';
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

describe('ProfileHeader', () => {
  it('renders employee name and role', () => {
    render(<ProfileHeader employee={mockProfile} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders status badge correctly', () => {
    render(<ProfileHeader employee={mockProfile} />);
    
    expect(screen.getByText(/active full-time/i)).toBeInTheDocument();
  });
});
