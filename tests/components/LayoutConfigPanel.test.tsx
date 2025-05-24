
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LayoutConfigPanel } from '@/components/LayoutConfigPanel';

describe('LayoutConfigPanel', () => {
  const mockOnLayoutSelect = vi.fn();

  beforeEach(() => {
    mockOnLayoutSelect.mockClear();
  });

  it('should render layout options', () => {
    render(<LayoutConfigPanel onLayoutSelect={mockOnLayoutSelect} />);
    
    expect(screen.getByText('1 Column')).toBeInTheDocument();
    expect(screen.getByText('2 Columns (50/50)')).toBeInTheDocument();
    expect(screen.getByText('3 Columns (33/33/33)')).toBeInTheDocument();
  });

  it('should call onLayoutSelect when layout is clicked', () => {
    render(<LayoutConfigPanel onLayoutSelect={mockOnLayoutSelect} />);
    
    fireEvent.click(screen.getByText('2 Columns (50/50)'));
    
    expect(mockOnLayoutSelect).toHaveBeenCalledTimes(1);
    expect(mockOnLayoutSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: 2,
        ratio: '50-50'
      })
    );
  });

  it('should render in compact mode', () => {
    render(<LayoutConfigPanel onLayoutSelect={mockOnLayoutSelect} compactMode={true} />);
    
    // In compact mode, grid should have different classes
    const container = screen.getByText('1 Column').closest('.grid');
    expect(container).toHaveClass('grid-cols-2');
  });
});
