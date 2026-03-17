import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AppSidebar } from '../AppSidebar';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AppSidebar', () => {
  it('renders logo and basic structure', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('NEXPANDO')).toBeInTheDocument();
    expect(screen.getByText('Growing Together')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Directory')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays notification badge when count > 0', () => {
    render(
      <MemoryRouter>
        <AppSidebar notificationCount={5} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays 9+ badge when count > 9', () => {
    render(
      <MemoryRouter>
        <AppSidebar notificationCount={12} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('calls navigate when a menu item is clicked', () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Directory'));
    expect(mockNavigate).toHaveBeenCalledWith('/directory');
  });
});
