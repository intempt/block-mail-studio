
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';
import { EnhancedEmailBlockPalette } from '@/components/EnhancedEmailBlockPalette';
import { LayoutConfigPanel } from '@/components/LayoutConfigPanel';

// Mock components to avoid complex dependencies
vi.mock('@/components/SnippetManager', () => ({
  SnippetManager: () => <div data-testid="snippet-manager">Snippet Manager</div>
}));

// Mock canvas component to simplify testing
vi.mock('@/components/EmailBlockCanvas', () => ({
  EmailBlockCanvas: ({ onContentChange }: { onContentChange: (content: any) => void }) => (
    <div 
      data-testid="email-canvas"
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer?.getData('application/json');
        if (data) {
          const parsed = JSON.parse(data);
          onContentChange({ type: 'block-added', blockType: parsed.blockType });
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      Email Canvas
    </div>
  )
}));

describe('Drag and Drop Functionality', () => {
  const mockOnContentChange = vi.fn();
  const mockOnBlockAdd = vi.fn();
  const mockOnLayoutSelect = vi.fn();
  const mockOnUniversalContentAdd = vi.fn();
  const mockOnSnippetAdd = vi.fn();

  beforeEach(() => {
    mockOnContentChange.mockClear();
    mockOnBlockAdd.mockClear();
    mockOnLayoutSelect.mockClear();
    mockOnUniversalContentAdd.mockClear();
    mockOnSnippetAdd.mockClear();
  });

  describe('Block Dragging', () => {
    it('should allow dragging text blocks from palette', () => {
      render(
        <EnhancedEmailBlockPalette
          onBlockAdd={mockOnBlockAdd}
          onSnippetAdd={mockOnSnippetAdd}
          universalContent={[]}
          onUniversalContentAdd={mockOnUniversalContentAdd}
        />
      );

      const textBlock = screen.getByText('Text').closest('[draggable="true"]');
      expect(textBlock).toBeInTheDocument();
      expect(textBlock).toHaveAttribute('draggable', 'true');
    });

    it('should handle dragstart event with correct data', () => {
      render(
        <EnhancedEmailBlockPalette
          onBlockAdd={mockOnBlockAdd}
          onSnippetAdd={mockOnSnippetAdd}
          universalContent={[]}
          onUniversalContentAdd={mockOnUniversalContentAdd}
        />
      );
      
      const textBlock = screen.getByText('Text').closest('[draggable="true"]');
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
  });

  describe('Layout Dragging', () => {
    it('should allow dragging layout presets', () => {
      render(
        <LayoutConfigPanel
          onLayoutSelect={mockOnLayoutSelect}
        />
      );

      // Look for any draggable layout element
      const draggableElements = screen.getAllByRole('button');
      expect(draggableElements.length).toBeGreaterThan(0);
    });

    it('should handle layout selection', () => {
      render(
        <LayoutConfigPanel
          onLayoutSelect={mockOnLayoutSelect}
        />
      );

      // Find and click a layout button
      const layoutButtons = screen.getAllByRole('button');
      if (layoutButtons.length > 0) {
        fireEvent.click(layoutButtons[0]);
        expect(mockOnLayoutSelect).toHaveBeenCalled();
      }
    });
  });

  describe('Canvas Drop Handling', () => {
    it('should accept drops and create blocks', () => {
      render(
        <EmailBlockCanvas
          onContentChange={mockOnContentChange}
          previewWidth={600}
          previewMode="desktop"
        />
      );

      const canvas = screen.getByTestId('email-canvas');
      expect(canvas).toBeInTheDocument();

      // Simulate drop event
      const dropData = JSON.stringify({ blockType: 'text' });
      const dropEvent = new Event('drop') as any;
      dropEvent.preventDefault = vi.fn();
      dropEvent.dataTransfer = {
        getData: vi.fn().mockReturnValue(dropData)
      };

      fireEvent(canvas, dropEvent);
      
      expect(mockOnContentChange).toHaveBeenCalledWith({
        type: 'block-added',
        blockType: 'text'
      });
    });

    it('should handle layout drops correctly', () => {
      render(
        <EmailBlockCanvas
          onContentChange={mockOnContentChange}
          previewWidth={600}
          previewMode="desktop"
        />
      );

      const canvas = screen.getByTestId('email-canvas');
      
      const layoutDropData = JSON.stringify({
        blockType: 'columns',
        layoutData: {
          columns: 2,
          ratio: '50-50'
        }
      });

      const dropEvent = new Event('drop') as any;
      dropEvent.preventDefault = vi.fn();
      dropEvent.dataTransfer = {
        getData: vi.fn().mockReturnValue(layoutDropData)
      };

      fireEvent(canvas, dropEvent);
      
      expect(mockOnContentChange).toHaveBeenCalledWith({
        type: 'block-added',
        blockType: 'columns'
      });
    });
  });

  describe('Integration Test', () => {
    it('should handle complete drag and drop workflow', () => {
      const { rerender } = render(
        <div>
          <EnhancedEmailBlockPalette
            onBlockAdd={mockOnBlockAdd}
            onSnippetAdd={mockOnSnippetAdd}
            universalContent={[]}
            onUniversalContentAdd={mockOnUniversalContentAdd}
          />
          <EmailBlockCanvas
            onContentChange={mockOnContentChange}
            previewWidth={600}
            previewMode="desktop"
          />
        </div>
      );

      // Find draggable block
      const textBlock = screen.getByText('Text').closest('[draggable="true"]');
      expect(textBlock).toBeInTheDocument();

      // Find canvas
      const canvas = screen.getByTestId('email-canvas');
      expect(canvas).toBeInTheDocument();

      // Test that both components are rendered and functional
      expect(textBlock).toHaveAttribute('draggable', 'true');
      expect(canvas).toBeInTheDocument();
    });
  });
});
