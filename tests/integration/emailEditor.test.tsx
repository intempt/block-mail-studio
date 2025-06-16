
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhancedEmailBlockPalette } from '@/components/EnhancedEmailBlockPalette';

describe('Email Editor Integration', () => {
  const mockOnBlockAdd = vi.fn();
  const mockOnUniversalContentAdd = vi.fn();
  const mockUniversalContent: any[] = [];

  beforeEach(() => {
    mockOnBlockAdd.mockClear();
    mockOnUniversalContentAdd.mockClear();
  });

  it('should render layout and block tabs', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    expect(screen.getByText('Layouts')).toBeInTheDocument();
    expect(screen.getByText('Blocks')).toBeInTheDocument();
  });

  it('should switch between tabs correctly', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Switch to blocks tab
    fireEvent.click(screen.getByText('Blocks'));
    
    // Should see block items
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('should call onBlockAdd when block is clicked', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Switch to blocks tab and click text block
    fireEvent.click(screen.getByText('Blocks'));
    fireEvent.click(screen.getByText('Text'));

    expect(mockOnBlockAdd).toHaveBeenCalledWith('text');
  });
});
