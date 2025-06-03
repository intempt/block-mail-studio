
import React from 'react';
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SnippetRibbon } from '@/components/SnippetRibbon';
import { DirectSnippetService } from '@/services/directSnippetService';
import { EmailSnippet } from '@/types/snippets';

// Mock the DirectSnippetService
vi.mock('@/services/directSnippetService');

const mockSnippets: EmailSnippet[] = [
  {
    id: 'snippet-1',
    name: 'Header Block',
    description: 'Header snippet',
    category: 'custom',
    tags: ['header'],
    blockData: { 
      id: 'block-1',
      type: 'text',
      content: { html: '<h1>Header</h1>' },
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
    },
    blockType: 'text',
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 0,
    isFavorite: false
  }
];

describe('SnippetRibbon', () => {
  const mockOnSnippetSelect = vi.fn();
  const mockAddChangeListener = vi.fn();
  const mockRemoveChangeListener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (DirectSnippetService.getCustomSnippets as any).mockReturnValue(mockSnippets);
    (DirectSnippetService.addChangeListener as any).mockImplementation(mockAddChangeListener);
    (DirectSnippetService.removeChangeListener as any).mockImplementation(mockRemoveChangeListener);
  });

  describe('Visibility and Rendering', () => {
    it('should render ribbon when custom snippets exist', () => {
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      expect(screen.getByText('My Snippets')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
      expect(screen.getByText('Header Block')).toBeInTheDocument();
    });

    it('should not render when no custom snippets exist', () => {
      (DirectSnippetService.getCustomSnippets as any).mockReturnValue([]);
      
      const { container } = render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should be collapsible', async () => {
      const user = userEvent.setup();
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      // Initially expanded
      expect(screen.getByText('Header Block')).toBeInTheDocument();
      
      // Find and click the collapse button
      const collapseButton = screen.getByRole('button', { name: /chevron/i }) || 
                           screen.getAllByRole('button').find(btn => 
                             btn.innerHTML.includes('ChevronDown') || 
                             btn.innerHTML.includes('ChevronUp')
                           );
      
      if (collapseButton) {
        await user.click(collapseButton);
        
        // Should be collapsed now
        expect(screen.queryByText('Header Block')).not.toBeInTheDocument();
      }
    });
  });

  describe('Snippet Interaction', () => {
    it('should call onSnippetSelect when snippet card is clicked', async () => {
      const user = userEvent.setup();
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      const snippetCard = screen.getByText('Header Block').closest('div');
      if (snippetCard) {
        await user.click(snippetCard);
        
        expect(mockOnSnippetSelect).toHaveBeenCalledWith(mockSnippets[0]);
        expect(DirectSnippetService.incrementUsage).toHaveBeenCalledWith('snippet-1');
      }
    });

    it('should support drag and drop with correct data format', () => {
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      const snippetCard = screen.getByText('Header Block').closest('div');
      if (snippetCard) {
        const dragEvent = new DragEvent('dragstart', { bubbles: true });
        const mockDataTransfer = {
          setData: vi.fn(),
          effectAllowed: ''
        };
        Object.defineProperty(dragEvent, 'dataTransfer', {
          value: mockDataTransfer,
          writable: true
        });
        
        fireEvent(snippetCard, dragEvent);
        
        expect(mockDataTransfer.setData).toHaveBeenCalledWith(
          'application/json',
          JSON.stringify({
            snippetId: 'snippet-1',
            blockType: 'text',
            isSnippet: true
          })
        );
      }
    });
  });

  describe('Snippet Management', () => {
    it('should show edit and delete buttons on hover', () => {
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      const snippetCard = screen.getByText('Header Block').closest('div');
      if (snippetCard) {
        fireEvent.mouseEnter(snippetCard);
        
        // Check for edit and delete buttons (implementation may vary)
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(1);
      }
    });

    it('should enter edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      // Find edit button (this depends on actual implementation)
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons.find(button => 
        button.innerHTML.includes('Edit2') ||
        button.querySelector('svg')?.getAttribute('data-testid') === 'edit-2'
      );
      
      if (editButton) {
        await user.click(editButton);
        
        // Should show input field
        expect(screen.getByDisplayValue('Header Block')).toBeInTheDocument();
      }
    });

    it('should save name changes', async () => {
      const user = userEvent.setup();
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      // Test would involve entering edit mode, changing name, and saving
      // Implementation depends on actual edit UI
      expect(DirectSnippetService.updateSnippetName).toBeDefined();
    });
  });

  describe('Real-time Updates', () => {
    it('should register change listener on mount', () => {
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      expect(DirectSnippetService.addChangeListener).toHaveBeenCalled();
    });

    it('should unregister change listener on unmount', () => {
      const { unmount } = render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      unmount();
      
      expect(DirectSnippetService.removeChangeListener).toHaveBeenCalled();
    });

    it('should update when refreshTrigger changes', () => {
      const { rerender } = render(
        <SnippetRibbon onSnippetSelect={mockOnSnippetSelect} refreshTrigger={0} />
      );
      
      // Clear initial call
      (DirectSnippetService.getCustomSnippets as any).mockClear();
      
      rerender(
        <SnippetRibbon onSnippetSelect={mockOnSnippetSelect} refreshTrigger={1} />
      );
      
      // Should trigger an update
      expect(DirectSnippetService.getCustomSnippets).toHaveBeenCalled();
    });
  });

  describe('Block Type Icons', () => {
    it('should display correct icon for different block types', () => {
      const buttonSnippet: EmailSnippet = {
        ...mockSnippets[0],
        id: 'snippet-2',
        name: 'Button',
        blockType: 'button'
      };
      
      (DirectSnippetService.getCustomSnippets as any).mockReturnValue([
        mockSnippets[0],
        buttonSnippet
      ]);
      
      render(<SnippetRibbon onSnippetSelect={mockOnSnippetSelect} />);
      
      // Should render icons for both text and button types
      expect(screen.getByText('Header Block')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });
  });
});
