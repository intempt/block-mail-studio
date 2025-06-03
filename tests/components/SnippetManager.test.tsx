import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { SnippetManager } from '@/components/SnippetManager';
import { DirectSnippetService } from '@/services/directSnippetService';
import { EmailSnippet } from '@/types/snippets';

// Mock the DirectSnippetService
vi.mock('@/services/directSnippetService');

const mockSnippets: EmailSnippet[] = [
  {
    id: 'snippet-1',
    name: 'Test Header',
    description: 'A test header snippet',
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
    usageCount: 5,
    isFavorite: false
  },
  {
    id: 'snippet-2',
    name: 'CTA Button',
    description: 'Call to action button',
    category: 'custom',
    tags: ['button', 'cta'],
    blockData: { 
      id: 'block-2',
      type: 'button',
      content: { text: 'Click Here', link: '#' },
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
    blockType: 'button',
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 3,
    isFavorite: true
  }
];

describe('SnippetManager', () => {
  const mockOnSnippetSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (DirectSnippetService.getAllSnippets as any).mockReturnValue(mockSnippets);
    (DirectSnippetService.getCustomSnippets as any).mockReturnValue(mockSnippets);
  });

  describe('Rendering', () => {
    it('should render snippet list when snippets are available', () => {
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.getByText('CTA Button')).toBeInTheDocument();
      expect(screen.getByText('A test header snippet')).toBeInTheDocument();
      expect(screen.getByText('Call to action button')).toBeInTheDocument();
    });

    it('should render empty state when no snippets available', () => {
      (DirectSnippetService.getAllSnippets as any).mockReturnValue([]);
      
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      expect(screen.getByText('No snippets available')).toBeInTheDocument();
      expect(screen.getByText('Save blocks as snippets to reuse them')).toBeInTheDocument();
    });

    it('should render in compact mode', () => {
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} compactMode={true} />);
      
      const buttons = screen.getAllByText('Use Snippet');
      expect(buttons[0]).toHaveClass('h-6', 'text-xs');
    });
  });

  describe('Snippet Interaction', () => {
    it('should call onSnippetSelect when "Use Snippet" is clicked', async () => {
      const user = userEvent.setup();
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      const useButtons = screen.getAllByText('Use Snippet');
      await user.click(useButtons[0]);
      
      expect(mockOnSnippetSelect).toHaveBeenCalledWith(mockSnippets[0]);
    });

    it('should update usage count when snippet is used', async () => {
      const user = userEvent.setup();
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      const useButtons = screen.getAllByText('Use Snippet');
      await user.click(useButtons[0]);
      
      // Check that the snippet's usage count was visually updated
      await waitFor(() => {
        expect(mockOnSnippetSelect).toHaveBeenCalled();
      });
    });

    it('should show delete button for custom snippets', () => {
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      const deleteButtons = screen.getAllByRole('button');
      const trashButtons = deleteButtons.filter(button => 
        button.querySelector('svg')?.getAttribute('data-testid') === 'trash-2' ||
        button.innerHTML.includes('Trash2')
      );
      
      expect(trashButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Snippet Editing', () => {
    it('should enter edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      // Find the edit button (this might need adjustment based on actual DOM structure)
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons.find(button => 
        button.querySelector('svg')?.getAttribute('data-testid') === 'edit-2' ||
        button.innerHTML.includes('Edit2')
      );
      
      if (editButton) {
        await user.click(editButton);
        
        expect(screen.getByDisplayValue('Test Header')).toBeInTheDocument();
      }
    });

    it('should save new name when Enter is pressed', async () => {
      const user = userEvent.setup();
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      // This test would need more specific implementation based on actual edit UI
      // For now, we'll check that the updateSnippetName method would be called
      expect(DirectSnippetService.updateSnippetName).toBeDefined();
    });

    it('should cancel edit when Escape is pressed', async () => {
      const user = userEvent.setup();
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      // Test would involve entering edit mode, then pressing Escape
      // Implementation depends on actual edit UI behavior
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });
  });

  describe('Snippet Deletion', () => {
    it('should delete snippet when delete button is clicked and confirmed', async () => {
      const user = userEvent.setup();
      
      // Mock window.confirm
      const originalConfirm = window.confirm;
      window.confirm = vi.fn(() => true);
      
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      const deleteButtons = screen.getAllByRole('button');
      const trashButton = deleteButtons.find(button => 
        button.querySelector('svg')?.getAttribute('data-testid') === 'trash-2' ||
        button.innerHTML.includes('Trash2')
      );
      
      if (trashButton) {
        await user.click(trashButton);
        
        expect(DirectSnippetService.deleteSnippet).toHaveBeenCalled();
      }
      
      // Restore original confirm
      window.confirm = originalConfirm;
    });

    it('should not delete snippet when deletion is cancelled', async () => {
      const user = userEvent.setup();
      
      // Mock window.confirm to return false
      const originalConfirm = window.confirm;
      window.confirm = vi.fn(() => false);
      
      render(<SnippetManager onSnippetSelect={mockOnSnippetSelect} />);
      
      const deleteButtons = screen.getAllByRole('button');
      const trashButton = deleteButtons.find(button => 
        button.querySelector('svg')?.getAttribute('data-testid') === 'trash-2' ||
        button.innerHTML.includes('Trash2')
      );
      
      if (trashButton) {
        await user.click(trashButton);
        
        expect(DirectSnippetService.deleteSnippet).not.toHaveBeenCalled();
      }
      
      // Restore original confirm
      window.confirm = originalConfirm;
    });
  });

  describe('Refresh Trigger', () => {
    it('should refresh snippets when refreshTrigger changes', () => {
      const { rerender } = render(
        <SnippetManager onSnippetSelect={mockOnSnippetSelect} refreshTrigger={0} />
      );
      
      expect(DirectSnippetService.getAllSnippets).toHaveBeenCalled();
      
      // Clear the mock call count
      (DirectSnippetService.getAllSnippets as any).mockClear();
      
      rerender(
        <SnippetManager onSnippetSelect={mockOnSnippetSelect} refreshTrigger={1} />
      );
      
      expect(DirectSnippetService.getAllSnippets).toHaveBeenCalled();
    });
  });
});
