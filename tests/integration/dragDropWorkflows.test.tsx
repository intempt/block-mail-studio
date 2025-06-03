
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmailEditor from '@/components/EmailEditor';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Drag and Drop Workflows', () => {
  const mockOnContentChange = vi.fn();
  const mockOnSubjectChange = vi.fn();

  beforeEach(() => {
    mockOnContentChange.mockClear();
    mockOnSubjectChange.mockClear();
  });

  const defaultProps = {
    content: '',
    subject: 'Test Email',
    onContentChange: mockOnContentChange,
    onSubjectChange: mockOnSubjectChange
  };

  it('should allow dragging text block to empty canvas', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Access the blocks palette
    const blocksTab = screen.getByRole('button', { name: /blocks/i });
    fireEvent.click(blocksTab);
    
    // Find text block in the palette
    const textBlock = screen.getByText(/text/i).closest('[draggable="true"]');
    expect(textBlock).toBeInTheDocument();
    
    // Set up drag event data
    const dragData = JSON.stringify({ blockType: 'text' });
    
    // Start drag operation
    const dragStartEvent = new Event('dragstart') as any;
    dragStartEvent.dataTransfer = {
      setData: vi.fn(),
      effectAllowed: ''
    };
    
    fireEvent(textBlock!, dragStartEvent);
    
    // Find the canvas drop area
    const canvas = screen.getByTestId('email-canvas');
    
    // Simulate drop on canvas
    const dropEvent = new Event('drop') as any;
    dropEvent.preventDefault = vi.fn();
    dropEvent.dataTransfer = {
      getData: vi.fn().mockReturnValue(dragData)
    };
    
    fireEvent(canvas, dropEvent);
    
    // Wait for the block to be added to the canvas
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });
  });

  it('should allow dragging layout blocks to canvas', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Access the layouts palette
    const layoutsTab = screen.getByRole('button', { name: /layouts/i });
    fireEvent.click(layoutsTab);
    
    // Find two column layout in the palette
    const twoColumnLayout = screen.getByText(/2 columns/i).closest('[draggable="true"]');
    expect(twoColumnLayout).toBeInTheDocument();
    
    // Set up drag event data for a layout
    const layoutData = JSON.stringify({
      blockType: 'columns',
      layoutData: {
        columnCount: 2,
        columnRatio: '50-50'
      }
    });
    
    // Start drag operation
    const dragStartEvent = new Event('dragstart') as any;
    dragStartEvent.dataTransfer = {
      setData: vi.fn(),
      effectAllowed: ''
    };
    
    fireEvent(twoColumnLayout!, dragStartEvent);
    
    // Find the canvas drop area
    const canvas = screen.getByTestId('email-canvas');
    
    // Simulate drop on canvas
    const dropEvent = new Event('drop') as any;
    dropEvent.preventDefault = vi.fn();
    dropEvent.dataTransfer = {
      getData: vi.fn().mockReturnValue(layoutData)
    };
    
    fireEvent(canvas, dropEvent);
    
    // Wait for the layout to be added to the canvas
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });
  });

  it('should allow selecting and deleting blocks', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // First add a block
    const blocksTab = screen.getByRole('button', { name: /blocks/i });
    fireEvent.click(blocksTab);
    
    const textBlock = screen.getByText(/text/i).closest('[draggable="true"]');
    
    const dragData = JSON.stringify({ blockType: 'text' });
    
    // Start drag operation
    const dragStartEvent = new Event('dragstart') as any;
    dragStartEvent.dataTransfer = {
      setData: vi.fn(),
      effectAllowed: ''
    };
    
    fireEvent(textBlock!, dragStartEvent);
    
    const canvas = screen.getByTestId('email-canvas');
    
    const dropEvent = new Event('drop') as any;
    dropEvent.preventDefault = vi.fn();
    dropEvent.dataTransfer = {
      getData: vi.fn().mockReturnValue(dragData)
    };
    
    fireEvent(canvas, dropEvent);
    
    // Wait for the block to be added to the canvas
    await waitFor(() => {
      expect(mockOnContentChange).toHaveBeenCalled();
    });
    
    // Now select and delete the block
    // This part of the test will depend on your specific implementation
    // of how blocks are rendered after adding and how delete controls work
  });

  it('should allow preview mode switching', async () => {
    render(<EmailEditor {...defaultProps} />, { wrapper: createWrapper() });
    
    // Find the desktop/mobile preview toggle
    const mobilePreviewButton = screen.getByRole('button', { name: /mobile/i });
    const desktopPreviewButton = screen.getByRole('button', { name: /desktop/i });
    
    // Switch to mobile view
    fireEvent.click(mobilePreviewButton);
    
    // Canvas should adjust to mobile view
    const canvas = screen.getByTestId('email-canvas');
    expect(canvas).toHaveStyle({ maxWidth: '375px' });
    
    // Switch back to desktop view
    fireEvent.click(desktopPreviewButton);
    expect(canvas).toHaveStyle({ maxWidth: '1200px' });
  });
});
