
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhancedEmailBlockPalette } from '@/components/EnhancedEmailBlockPalette';

// Mock the LayoutConfigPanel component
vi.mock('@/components/LayoutConfigPanel', () => ({
  LayoutConfigPanel: ({ onLayoutSelect }: { onLayoutSelect: (layout: any) => void }) => (
    <div data-testid="layout-config-panel">
      <button onClick={() => onLayoutSelect({ columns: 2, ratio: '50-50' })}>
        2 Columns (50/50)
      </button>
    </div>
  )
}));

// Mock the SnippetManager component
vi.mock('@/components/SnippetManager', () => ({
  SnippetManager: ({ onSnippetSelect }: { onSnippetSelect: (snippet: any) => void }) => (
    <div data-testid="snippet-manager">
      <button onClick={() => onSnippetSelect({ id: 'test-snippet', name: 'Test Snippet' })}>
        Test Snippet
      </button>
    </div>
  )
}));

describe('Email Editor Integration', () => {
  const mockOnBlockAdd = vi.fn();
  const mockOnUniversalContentAdd = vi.fn();
  const mockOnSnippetAdd = vi.fn();
  const mockUniversalContent: any[] = [];

  beforeEach(() => {
    mockOnBlockAdd.mockClear();
    mockOnUniversalContentAdd.mockClear();
    mockOnSnippetAdd.mockClear();
  });

  it('should render layout and block tabs', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    expect(screen.getByText('Layouts')).toBeInTheDocument();
    expect(screen.getByText('Blocks')).toBeInTheDocument();
    expect(screen.getByText('Snippets')).toBeInTheDocument();
  });

  it('should switch between tabs correctly', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Switch to blocks tab (should be default)
    const blocksTab = screen.getByRole('tab', { name: /blocks/i });
    expect(blocksTab).toHaveAttribute('data-state', 'active');
    
    // Should see block items
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('should call onBlockAdd when block is clicked', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Click text block
    const textBlock = screen.getByText('Text').closest('div');
    fireEvent.click(textBlock!);

    expect(mockOnBlockAdd).toHaveBeenCalledWith('text');
  });

  it('should handle layout selection', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Switch to layouts tab
    fireEvent.click(screen.getByText('Layouts'));
    
    // Click on layout option
    fireEvent.click(screen.getByText('2 Columns (50/50)'));

    expect(mockOnBlockAdd).toHaveBeenCalledWith('columns', { columns: 2, ratio: '50-50' });
  });

  it('should handle snippet selection', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Switch to snippets tab
    fireEvent.click(screen.getByText('Snippets'));
    
    // Click on snippet
    fireEvent.click(screen.getByText('Test Snippet'));

    expect(mockOnSnippetAdd).toHaveBeenCalledWith({ id: 'test-snippet', name: 'Test Snippet' });
  });

  it('should handle drag start events', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    const textBlock = screen.getByText('Text').closest('[draggable="true"]');
    expect(textBlock).toHaveAttribute('draggable', 'true');

    // Simulate drag start
    const mockDataTransfer = {
      setData: vi.fn(),
      effectAllowed: ''
    };

    const dragStartEvent = new Event('dragstart') as any;
    dragStartEvent.dataTransfer = mockDataTransfer;
    
    fireEvent(textBlock!, dragStartEvent);
    
    expect(mockDataTransfer.setData).toHaveBeenCalledWith(
      'application/json',
      expect.stringContaining('text')
    );
  });

  it('should render in compact mode', () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
        compactMode={true}
      />
    );

    // Should still render all basic elements
    expect(screen.getByText('Blocks')).toBeInTheDocument();
    expect(screen.getByText('Layouts')).toBeInTheDocument();
    expect(screen.getByText('Snippets')).toBeInTheDocument();
  });
});
