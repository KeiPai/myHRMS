import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeCard } from '../../shared/EmployeeCard';
import { Employee } from '@/types';

const mockEmployee: Employee = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'Software Engineer',
  department: 'Engineering',
  location: 'HCMC',
  status: 'active',
  employmentType: 'full_time',
  hireDate: '2023-01-01',
};

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('EmployeeCard', () => {
  it('renders employee information correctly', () => {
    render(
      <MemoryRouter>
        <EmployeeCard employee={mockEmployee} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('navigates to profile when clicking the button', () => {
    render(
      <MemoryRouter>
        <EmployeeCard employee={mockEmployee} />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /profile/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/1');
  });
});
