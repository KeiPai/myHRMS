import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeFilters } from '../EmployeeFilters';

describe('EmployeeFilters', () => {
  it('renders search input and department select', () => {
    render(<EmployeeFilters searchQuery="" onSearchChange={() => {}} departmentFilter="all" onDepartmentChange={() => {}} />);
    
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    expect(screen.getByText(/all departments/i)).toBeInTheDocument();
  });

  it('calls onSearchChange when input changes', () => {
    const mockSearch = vi.fn();
    render(<EmployeeFilters searchQuery="" onSearchChange={mockSearch} departmentFilter="all" onDepartmentChange={() => {}} />);
    
    const input = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(input, { target: { value: 'John' } });
    
    expect(mockSearch).toHaveBeenCalledWith('John');
  });
});
