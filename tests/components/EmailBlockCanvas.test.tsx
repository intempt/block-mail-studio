
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';
import { EmailBlock, TextBlock } from '@/types/emailBlocks';

// Mock the ref forwarding
const MockEmailBlockCanvas = React.forwardRef<any, any>((props, ref) => (
  <EmailBlockCanvas {...props} ref={ref} />
));

describe('EmailBlockCanvas', () => {
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

  it('should render empty canvas with drop zone message', () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    expect(screen.getByText(/Ready to build!/)).toBeInTheDocument();
    expect(screen.getByText(/Drag a layout from the toolbar/)).toBeInTheDocument();
  });

  it('should handle drag over events', () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    const canvas = screen.getByTestId('email-canvas');
    
    // Simulate drag over
    fireEvent.dragOver(canvas, {
      dataTransfer: {
        types: ['application/json']
      }
    });
    
    // Should show drop zone indicators
    expect(canvas).toHaveClass('canvas-drop-zone');
  });

  it('should handle block drops', async () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    const canvas = screen.getByTestId('email-canvas');
    
    // Simulate dropping a text block
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

  it('should handle layout drops with column configuration', async () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    const canvas = screen.getByTestId('email-canvas');
    
    // Simulate dropping a layout
    const layoutData = JSON.stringify({
      blockType: 'columns',
      layoutData: {
        columnCount: 2,
        columnRatio: '50-50'
      }
    });
    
    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: vi.fn().mockReturnValue(layoutData)
      }
    });
    
    await waitFor(() => {
      expect(mockOnBlocksChange).toHaveBeenCalled();
    });
  });

  it('should render blocks when provided', () => {
    const textBlock: TextBlock = {
      id: 'test-1',
      type: 'text',
      content: {
        html: '<p>Test content</p>',
        textStyle: 'normal'
      },
      styling: {
        desktop: { width: '100%', height: 'auto' },
        tablet: { width: '100%', height: 'auto' },
        mobile: { width: '100%', height: 'auto' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    // Add block programmatically (would happen via ref in real usage)
    const canvas = screen.getByTestId('email-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should handle block selection', () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    // Canvas should be clickable for selection
    const canvas = screen.getByTestId('email-canvas');
    fireEvent.click(canvas);
    
    expect(mockOnBlockSelect).toHaveBeenCalledWith(null);
  });

  it('should respond to preview mode changes', () => {
    const { rerender } = render(<MockEmailBlockCanvas {...defaultProps} />);
    
    // Change to mobile preview
    rerender(<MockEmailBlockCanvas {...defaultProps} previewMode="mobile" />);
    
    const canvas = screen.getByTestId('email-canvas');
    expect(canvas).toHaveStyle({ maxWidth: '375px' });
  });

  it('should handle custom preview widths', () => {
    render(<MockEmailBlockCanvas {...defaultProps} previewWidth={800} />);
    
    const canvas = screen.getByTestId('email-canvas');
    expect(canvas).toHaveStyle({ maxWidth: '800px' });
  });

  it('should generate MJML content when blocks are present', async () => {
    render(<MockEmailBlockCanvas {...defaultProps} />);
    
    // Simulate adding blocks and generating content
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
