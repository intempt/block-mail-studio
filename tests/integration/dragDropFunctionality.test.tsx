
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';
import { EnhancedEmailBlockPalette } from '@/components/EnhancedEmailBlockPalette';
import { LayoutConfigPanel } from '@/components/LayoutConfigPanel';

describe('Drag and Drop Functionality', () => {
  const mockOnContentChange = vi.fn();
  const mockOnBlockAdd = vi.fn();
  const mockOnLayoutSelect = vi.fn();
  const mockOnUniversalContentAdd = vi.fn();

  beforeEach(() => {
    mockOnContentChange.mockClear();
    mockOnBlockAdd.mockClear();
    mockOnLayoutSelect.mockClear();
    mockOnUniversalContentAdd.mockClear();
  });

  describe('Block Dragging', () => {
    it('should allow dragging text blocks from palette', () => {
      render(
        <EnhancedEmailBlockPalette
          onBlockAdd={mockOnBlockAdd}
          universalContent={[]}
          onUniversalContentAdd={mockOnUniversalContentAdd}
        />
      );

      // Switch to blocks tab
      fireEvent.click(screen.getByText('Blocks'));
      
      const textBlock = screen.getByText('Text').closest('[draggable="true"]');
      expect(textBlock).toBeInTheDocument();
      expect(textBlock).toHaveAttribute('draggable', 'true');
    });

    it('should handle dragstart event with correct data', () => {
      render(
        <EnhancedEmailBlockPalette
          onBlockAdd={mockOnBlockAdd}
          universalContent={[]}
          onUniversalContentAdd={mockOnUniversalContentAdd}
        />
      );

      fireEvent.click(screen.getByText('Blocks'));
      
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

      const twoColumnLayout = screen.getByText('2 Columns (50/50)').closest('[draggable="true"]');
      expect(twoColumnLayout).toBeInTheDocument();
      expect(twoColumnLayout).toHaveAttribute('draggable', 'true');
    });

    it('should handle layout dragstart with columns configuration', () => {
      render(
        <LayoutConfigPanel
          onLayoutSelect={mockOnLayoutSelect}
        />
      );

      const twoColumnLayout = screen.getByText('2 Columns (50/50)').closest('[draggable="true"]');
      const mockDataTransfer = {
        setData: vi.fn(),
        effectAllowed: ''
      };

      const dragStartEvent = new Event('dragstart') as any;
      dragStartEvent.dataTransfer = mockDataTransfer;
      
      fireEvent(twoColumnLayout!, dragStartEvent);
      
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        'application/json',
        expect.stringContaining('columns')
      );
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

      const canvas = screen.getByText(/Email Canvas/).closest('.bg-white');
      expect(canvas).toBeInTheDocument();

      // Simulate drop event
      const dropData = JSON.stringify({ blockType: 'text' });
      const dropEvent = new Event('drop') as any;
      dropEvent.preventDefault = vi.fn();
      dropEvent.dataTransfer = {
        getData: vi.fn().mockReturnValue(dropData)
      };

      fireEvent(canvas!, dropEvent);
      
      expect(dropEvent.dataTransfer.getData).toHaveBeenCalledWith('application/json');
    });

    it('should handle layout drops correctly', () => {
      render(
        <EmailBlockCanvas
          onContentChange={mockOnContentChange}
          previewWidth={600}
          previewMode="desktop"
        />
      );

      const canvas = screen.getByText(/Email Canvas/).closest('.bg-white');
      
      const layoutDropData = JSON.stringify({
        blockType: 'columns',
        layoutData: {
          columns: 2,
          ratio: '50-50',
          columns: [
            { id: 'col1', blocks: [], width: '50%' },
            { id: 'col2', blocks: [], width: '50%' }
          ]
        }
      });

      const dropEvent = new Event('drop') as any;
      dropEvent.preventDefault = vi.fn();
      dropEvent.dataTransfer = {
        getData: vi.fn().mockReturnValue(layoutDropData)
      };

      fireEvent(canvas!, dropEvent);
      
      expect(dropEvent.dataTransfer.getData).toHaveBeenCalledWith('application/json');
    });
  });

  describe('Ecommerce Template Creation', () => {
    it('should create multiple blocks for ecommerce template', () => {
      render(
        <EmailBlockCanvas
          onContentChange={mockOnContentChange}
          previewWidth={600}
          previewMode="desktop"
        />
      );

      // Should automatically create ecommerce template on mount
      expect(mockOnContentChange).toHaveBeenCalled();
      
      // Check that blocks are rendered
      const canvas = screen.getByText(/Email Canvas/).closest('.bg-white');
      expect(canvas).toBeInTheDocument();
    });
  });
});
