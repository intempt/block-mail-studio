
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedEmailBlockPalette } from '@/components/EnhancedEmailBlockPalette';
import { LayoutConfigPanel } from '@/components/LayoutConfigPanel';

describe('Drag and Drop Critical Tests', () => {
  const mockOnBlockAdd = vi.fn();
  const mockOnLayoutSelect = vi.fn();
  const mockOnUniversalContentAdd = vi.fn();

  beforeEach(() => {
    mockOnBlockAdd.mockClear();
    mockOnLayoutSelect.mockClear();
    mockOnUniversalContentAdd.mockClear();
  });

  describe('Block Palette Critical Tests', () => {
    it('CRITICAL: Must render all block types', () => {
      render(
        <EnhancedEmailBlockPalette
          onBlockAdd={mockOnBlockAdd}
          universalContent={[]}
          onUniversalContentAdd={mockOnUniversalContentAdd}
        />
      );

      fireEvent.click(screen.getByText('Blocks'));
      
      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('Image')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('CRITICAL: Must make blocks draggable', () => {
      render(
        <EnhancedEmailBlockPalette
          onBlockAdd={mockOnBlockAdd}
          universalContent={[]}
          onUniversalContentAdd={mockOnUniversalContentAdd}
        />
      );

      fireEvent.click(screen.getByText('Blocks'));
      
      const textBlock = screen.getByText('Text').closest('[draggable="true"]');
      expect(textBlock).toBeInTheDocument();
      expect(textBlock).toHaveAttribute('draggable', 'true');
    });

    it('CRITICAL: Must set correct drag data', () => {
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

    it('CRITICAL: Must handle block clicks for direct add', () => {
      render(
        <EnhancedEmailBlockPalette
          onBlockAdd={mockOnBlockAdd}
          universalContent={[]}
          onUniversalContentAdd={mockOnUniversalContentAdd}
        />
      );

      fireEvent.click(screen.getByText('Blocks'));
      fireEvent.click(screen.getByText('Text'));

      expect(mockOnBlockAdd).toHaveBeenCalledWith('text');
    });
  });

  describe('Layout Panel Critical Tests', () => {
    it('CRITICAL: Must render all layout options', () => {
      render(<LayoutConfigPanel onLayoutSelect={mockOnLayoutSelect} />);
      
      expect(screen.getByText('1 Column')).toBeInTheDocument();
      expect(screen.getByText('2 Columns (50/50)')).toBeInTheDocument();
      expect(screen.getByText('3 Columns (33/33/33)')).toBeInTheDocument();
    });

    it('CRITICAL: Must make layouts draggable', () => {
      render(<LayoutConfigPanel onLayoutSelect={mockOnLayoutSelect} />);
      
      const twoColumnLayout = screen.getByText('2 Columns (50/50)').closest('[draggable="true"]');
      expect(twoColumnLayout).toBeInTheDocument();
      expect(twoColumnLayout).toHaveAttribute('draggable', 'true');
    });

    it('CRITICAL: Must set correct layout drag data', () => {
      render(<LayoutConfigPanel onLayoutSelect={mockOnLayoutSelect} />);
      
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

    it('CRITICAL: Must handle layout clicks for direct add', () => {
      render(<LayoutConfigPanel onLayoutSelect={mockOnLayoutSelect} />);
      
      fireEvent.click(screen.getByText('2 Columns (50/50)'));
      
      expect(mockOnLayoutSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: 2,
          ratio: '50-50'
        })
      );
    });
  });
});
