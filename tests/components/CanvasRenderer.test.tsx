
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CanvasRenderer } from '@/components/canvas/CanvasRenderer';
import { EmailBlock, TextBlock, ColumnsBlock } from '@/types/emailBlocks';

describe('Canvas Renderer Critical Tests', () => {
  const mockCallbacks = {
    onBlockClick: vi.fn(),
    onBlockDoubleClick: vi.fn(),
    onBlockDragStart: vi.fn(),
    onBlockDrop: vi.fn(),
    onDeleteBlock: vi.fn(),
    onDuplicateBlock: vi.fn(),
    onSaveAsSnippet: vi.fn(),
    onUnstarBlock: vi.fn(),
    onTipTapChange: vi.fn(),
    onTipTapBlur: vi.fn(),
    onColumnDrop: vi.fn(),
    onBlockEditStart: vi.fn(),
    onBlockEditEnd: vi.fn(),
    onBlockUpdate: vi.fn(),
    onAddVariable: vi.fn()
  };

  beforeEach(() => {
    Object.values(mockCallbacks).forEach(mock => mock.mockClear());
  });

  const createTextBlock = (id: string): TextBlock => ({
    id,
    type: 'text',
    content: {
      html: `<p>Text block ${id}</p>`,
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
  });

  const createColumnsBlock = (id: string): ColumnsBlock => ({
    id,
    type: 'columns',
    columns: [
      { id: 'col-1', blocks: [createTextBlock('text-in-col')] },
      { id: 'col-2', blocks: [] }
    ],
    columnConfiguration: {
      columnCount: 2,
      columnRatio: '50-50',
      gutter: 20
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
  });

  it('should render empty state when no blocks provided', () => {
    render(
      <CanvasRenderer
        blocks={[]}
        selectedBlockId={null}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('Ready to build!')).toBeInTheDocument();
    expect(screen.getByText(/Drag a layout from the toolbar/)).toBeInTheDocument();
  });

  it('should render text blocks correctly', () => {
    const textBlock = createTextBlock('test-text');
    
    render(
      <CanvasRenderer
        blocks={[textBlock]}
        selectedBlockId={null}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('Text block test-text')).toBeInTheDocument();
  });

  it('should render columns blocks correctly', () => {
    const columnsBlock = createColumnsBlock('test-columns');
    
    render(
      <CanvasRenderer
        blocks={[columnsBlock]}
        selectedBlockId={null}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('Text block text-in-col')).toBeInTheDocument();
  });

  it('should handle block selection', () => {
    const textBlock = createTextBlock('selectable-text');
    
    render(
      <CanvasRenderer
        blocks={[textBlock]}
        selectedBlockId={'selectable-text'}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    const block = screen.getByTestId('email-block-selectable-text');
    expect(block).toHaveClass('selected');
  });

  it('should handle block clicks', () => {
    const textBlock = createTextBlock('clickable-text');
    
    render(
      <CanvasRenderer
        blocks={[textBlock]}
        selectedBlockId={null}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    const block = screen.getByTestId('email-block-clickable-text');
    fireEvent.click(block);
    
    expect(mockCallbacks.onBlockClick).toHaveBeenCalledWith('clickable-text');
  });

  it('should handle block double clicks', () => {
    const textBlock = createTextBlock('double-clickable-text');
    
    render(
      <CanvasRenderer
        blocks={[textBlock]}
        selectedBlockId={null}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    const block = screen.getByTestId('email-block-double-clickable-text');
    fireEvent.doubleClick(block);
    
    expect(mockCallbacks.onBlockDoubleClick).toHaveBeenCalledWith('double-clickable-text', 'text');
  });

  it('should handle drag and drop operations', () => {
    const textBlock = createTextBlock('draggable-text');
    
    render(
      <CanvasRenderer
        blocks={[textBlock]}
        selectedBlockId={null}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    const block = screen.getByTestId('email-block-draggable-text');
    fireEvent.dragStart(block);
    
    expect(mockCallbacks.onBlockDragStart).toHaveBeenCalled();
  });

  it('should show drop zones during drag operations', () => {
    render(
      <CanvasRenderer
        blocks={[]}
        selectedBlockId={null}
        editingBlockId={null}
        isDraggingOver={true}
        dragOverIndex={0}
        currentDragType="block"
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByTestId('drop-zone-indicator')).toBeInTheDocument();
  });

  it('should handle variable insertion for text blocks', async () => {
    const textBlock = createTextBlock('variable-text');
    
    // Mock the global handler
    (window as any)[`insertVariable_variable-text`] = vi.fn();
    
    render(
      <CanvasRenderer
        blocks={[textBlock]}
        selectedBlockId={null}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    const variableButton = screen.getByTestId('add-variable-button-variable-text');
    fireEvent.click(variableButton);
    
    const variable = { text: 'First Name', value: '{{firstName}}' };
    fireEvent.click(screen.getByText('Insert Variable'));
    
    expect((window as any)[`insertVariable_variable-text`]).toHaveBeenCalled();
  });

  it('should handle block controls interactions', () => {
    const textBlock = createTextBlock('controlled-text');
    
    render(
      <CanvasRenderer
        blocks={[textBlock]}
        selectedBlockId={'controlled-text'}
        editingBlockId={null}
        isDraggingOver={false}
        dragOverIndex={null}
        {...mockCallbacks}
      />
    );
    
    const deleteButton = screen.getByTestId('delete-block-controlled-text');
    fireEvent.click(deleteButton);
    
    expect(mockCallbacks.onDeleteBlock).toHaveBeenCalledWith('controlled-text');
  });
});
