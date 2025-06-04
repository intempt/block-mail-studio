
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';
import { TextBlock, EmailBlock } from '@/types/emailBlocks';

const MockEmailBlockCanvas = React.forwardRef<any, any>((props, ref) => (
  <EmailBlockCanvas {...props} ref={ref} />
));

describe('EmailBlockCanvas Critical Tests', () => {
  const mockOnContentChange = vi.fn();
  const mockOnBlockSelect = vi.fn();
  const mockOnBlocksChange = vi.fn();
  const mockOnSubjectChange = vi.fn();

  beforeEach(() => {
    mockOnContentChange.mockClear();
    mockOnBlockSelect.mockClear();
    mockOnBlocksChange.mockClear();
    mockOnSubjectChange.mockClear();
  });

  const defaultProps = {
    onContentChange: mockOnContentChange,
    onBlockSelect: mockOnBlockSelect,
    onBlocksChange: mockOnBlocksChange,
    previewWidth: 600,
    previewMode: 'desktop' as const,
    compactMode: false,
    subject: 'Test Subject',
    onSubjectChange: mockOnSubjectChange,
    showAIAnalytics: false
  };

  it('CRITICAL: Must render empty canvas state', () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    expect(screen.getByText(/Ready to build!/)).toBeInTheDocument();
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('CRITICAL: Must handle drag events without errors', () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    const canvas = screen.getByTestId('email-canvas');
    
    expect(() => {
      fireEvent.dragOver(canvas, {
        dataTransfer: { types: ['application/json'] }
      });
    }).not.toThrow();
  });

  it('CRITICAL: Must accept valid block drops', async () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    const canvas = screen.getByTestId('email-canvas');
    const dropData = JSON.stringify({ blockType: 'text' });
    
    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: vi.fn().mockReturnValue(dropData)
      }
    });
    
    await waitFor(() => {
      expect(mockOnBlocksChange).toHaveBeenCalled();
    });
  });

  it('CRITICAL: Must handle invalid drop data gracefully', () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    const canvas = screen.getByTestId('email-canvas');
    
    expect(() => {
      fireEvent.drop(canvas, {
        dataTransfer: {
          getData: vi.fn().mockReturnValue('invalid json')
        }
      });
    }).not.toThrow();
  });

  it('CRITICAL: Must generate content when blocks change', async () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    // Simulate adding a block
    const canvas = screen.getByTestId('email-canvas');
    const dropData = JSON.stringify({ blockType: 'text' });
    
    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: vi.fn().mockReturnValue(dropData)
      }
    });
    
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });
  });

  it('CRITICAL: Must handle preview width changes', () => {
    const { rerender } = render(<MockEmailBlockCanvas {...defaultProps} />);
    
    rerender(<MockEmailBlockCanvas {...defaultProps} previewWidth={375} />);
    
    const canvas = screen.getByTestId('email-canvas');
    expect(canvas).toHaveStyle({ maxWidth: '375px' });
  });

  it('CRITICAL: Must handle preview mode switching', () => {
    const { rerender } = render(<MockEmailBlockCanvas {...defaultProps} />);
    
    rerender(<MockEmailBlockCanvas {...defaultProps} previewMode="mobile" />);
    
    const canvas = screen.getByTestId('email-canvas');
    expect(canvas).toHaveStyle({ maxWidth: '375px' });
  });

  it('CRITICAL: Must handle block selection', () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    const canvas = screen.getByTestId('email-canvas');
    fireEvent.click(canvas);
    
    expect(mockOnBlockSelect).toHaveBeenCalledWith(null);
  });
});
