
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('should render editor', () => {
    const { container } = render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Check if the component renders without crashing
    expect(container).toBeTruthy();
    
    // Check for the main component structure
    const tabsList = container.querySelector('[role="tablist"]');
    expect(tabsList).toBeTruthy();
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

  it('should switch between tabs correctly', async () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('Blocks')).toBeInTheDocument();
    });

    // Switch to blocks tab (should be default)
    const blocksTab = screen.getByRole('tab', { name: /blocks/i });
    expect(blocksTab).toHaveAttribute('data-state', 'active');
    
    // Should see block items
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('should call onBlockAdd when block is clicked', async () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Wait for the text block to be available
    await waitFor(() => {
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    // Click text block
    const textBlock = screen.getByText('Text').closest('div');
    fireEvent.click(textBlock!);

    expect(mockOnBlockAdd).toHaveBeenCalledWith('text');
  });

  it('should handle layout selection', async () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Switch to layouts tab
    await waitFor(() => {
      expect(screen.getByText('Layouts')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Layouts'));
    
    // Wait for layout panel to load
    await waitFor(() => {
      expect(screen.getByText('2 Columns (50/50)')).toBeInTheDocument();
    });
    
    // Click on layout option
    fireEvent.click(screen.getByText('2 Columns (50/50)'));

    expect(mockOnBlockAdd).toHaveBeenCalledWith('columns', { columns: 2, ratio: '50-50' });
  });

  it('should handle snippet selection', async () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Switch to snippets tab
    await waitFor(() => {
      expect(screen.getByText('Snippets')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Snippets'));
    
    // Wait for snippet manager to load
    await waitFor(() => {
      expect(screen.getByText('Test Snippet')).toBeInTheDocument();
    });
    
    // Click on snippet
    fireEvent.click(screen.getByText('Test Snippet'));

    expect(mockOnSnippetAdd).toHaveBeenCalledWith({ id: 'test-snippet', name: 'Test Snippet' });
  });

  it('should handle drag start events', async () => {
    render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Wait for text block to be available
    await waitFor(() => {
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

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
    const { container } = render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
        compactMode={true}
      />
    );

    // Should still render all basic elements
    expect(container).toBeTruthy();
    expect(screen.getByText('Blocks')).toBeInTheDocument();
    expect(screen.getByText('Layouts')).toBeInTheDocument();
    expect(screen.getByText('Snippets')).toBeInTheDocument();
  });

  it('should handle content changes', async () => {
    const { container } = render(
      <EnhancedEmailBlockPalette
        onBlockAdd={mockOnBlockAdd}
        onSnippetAdd={mockOnSnippetAdd}
        universalContent={mockUniversalContent}
        onUniversalContentAdd={mockOnUniversalContentAdd}
      />
    );

    // Verify the component can handle state changes
    expect(container).toBeTruthy();
    
    // Test that the component can handle multiple interactions
    await waitFor(() => {
      expect(screen.getByText('Blocks')).toBeInTheDocument();
    });

    // Click on different tabs to test state management
    fireEvent.click(screen.getByText('Layouts'));
    fireEvent.click(screen.getByText('Blocks'));
    
    // Should still be functional
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(mockOnBlockAdd).not.toHaveBeenCalled(); // Just clicking tabs shouldn't trigger block add
  });
});
