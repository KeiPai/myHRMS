import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateRequestDialog } from '../CreateRequestDialog';

describe('CreateRequestDialog', () => {
  it('opens dialog when trigger button is clicked', () => {
    render(<CreateRequestDialog onSubmit={async () => {}} />);
    
    const trigger = screen.getByRole('button', { name: /create request/i });
    fireEvent.click(trigger);
    
    expect(screen.getByText('Create New Request')).toBeInTheDocument();
  });

  it('calls onSubmit with form data', async () => {
    const mockSubmit = vi.fn();
    render(<CreateRequestDialog onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /create request/i }));
    
    screen.getByText(/title/i);
    // In our simplified mock, Input doesn't have ID so we just find the input after the label
    const titleInput = screen.getAllByRole('textbox')[0]; 
    fireEvent.change(titleInput, { target: { value: 'New Monitor' } });
    
    // We'd need to mock Select component behavior if it's complex, 
    // but assuming standard form submission here
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Monitor'
      }));
    });
  });
});
