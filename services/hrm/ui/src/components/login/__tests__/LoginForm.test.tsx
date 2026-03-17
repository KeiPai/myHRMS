import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('renders all fields and labels', () => {
    render(<LoginForm onSubmit={() => {}} />);
    
    expect(screen.getByPlaceholderText('Company email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls onSubmit with correct values when form is submitted', () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);
    
    const emailInput = screen.getByPlaceholderText('Company email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const rememberCheckbox = screen.getByLabelText('Remember me');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@venizia.local' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(rememberCheckbox);
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith('test@venizia.local', 'password123', true);
  });

  it('shows loading state when isLoading is true', () => {
    render(<LoginForm onSubmit={() => {}} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /signing in.../i });
    expect(submitButton).toBeDisabled();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Invalid credentials';
    render(<LoginForm onSubmit={() => {}} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('toggles password visibility when eye icon is clicked', () => {
    render(<LoginForm onSubmit={() => {}} />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the eye icon button
    const toggleButton = screen.getByRole('button', { name: '' }); // The icon buttons don't have text
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
