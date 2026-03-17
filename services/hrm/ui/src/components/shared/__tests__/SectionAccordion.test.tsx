import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionAccordion } from '../SectionAccordion';

describe('SectionAccordion', () => {
  const fields = [
    { label: 'Label 1', value: 'Value 1' },
    { label: 'Label 2', value: 'Value 2' }
  ];

  it('renders title and fields when open', () => {
    render(<SectionAccordion title="Test Section" fields={fields} defaultOpen={true} />);
    
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();
  });

  it('toggles visibility when header is clicked', () => {
    render(<SectionAccordion title="Test Section" fields={fields} defaultOpen={true} />);
    
    const header = screen.getByText('Test Section');
    
    // Should be visible initially
    expect(screen.getByText('Value 1')).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(header);
    expect(screen.queryByText('Value 1')).not.toBeInTheDocument();
    
    // Click to open
    fireEvent.click(header);
    expect(screen.getByText('Value 1')).toBeInTheDocument();
  });
});
