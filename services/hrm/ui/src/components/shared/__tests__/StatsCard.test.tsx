import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatsCard } from '../StatsCard';
import { Palmtree } from 'lucide-react';

describe('StatsCard', () => {
  it('renders label and count', () => {
    render(<StatsCard icon={Palmtree} label="Total Leave" count={12} />);
    
    expect(screen.getByText('Total Leave')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders sublabel when provided', () => {
    render(<StatsCard icon={Palmtree} label="Total Leave" count={12} sublabel="Days remaining" />);
    
    expect(screen.getByText('Days remaining')).toBeInTheDocument();
  });
});
