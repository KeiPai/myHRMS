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

    fireEvent.change(emailInput, { target: { value: 'test@nexpando.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(rememberCheckbox);
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith('test@nexpando.com', 'password123', true);
  });

  it('shows loading state when isLoading is true', () => {
    render(<LoginForm onSubmit={() => {}} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /signing in.../i });
    expect(submitButton).toBeDisabled();
  });

  it('displays error message when error prop is provided', () => {
    render(<LoginForm onSubmit={() => {}} error="login_failed" />);

    // The component translates error keys; unknown keys fall back to invalidCredentials
    expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
  });

  it('displays service unavailable error when API is down', () => {
    render(<LoginForm onSubmit={() => {}} error="serviceUnavailable" />);

    expect(screen.getByText('Service temporarily unavailable. Please try again later.')).toBeInTheDocument();
  });
});
