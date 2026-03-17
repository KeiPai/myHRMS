import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { EmployeeGrid } from '../EmployeeGrid';
import { Employee } from '@/types';

const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'Software Engineer',
    department: 'Engineering',
    status: 'active',
    employmentType: 'full_time',
    hireDate: '2023-01-01',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'Product Manager',
    department: 'Product',
    status: 'active',
    employmentType: 'full_time',
    hireDate: '2023-02-01',
  }
];

describe('EmployeeGrid', () => {
  it('renders correctly with employees', () => {
    render(
      <MemoryRouter>
        <EmployeeGrid employees={mockEmployees} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <MemoryRouter>
        <EmployeeGrid employees={[]} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });
});
