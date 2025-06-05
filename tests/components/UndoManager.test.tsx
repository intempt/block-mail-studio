
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UndoManager } from '@/components/UndoManager';
import { EmailBlock } from '@/types/emailBlocks';

describe('UndoManager', () => {
  const mockOnStateRestore = vi.fn();
  const mockOnUndo = vi.fn();
  const mockOnRedo = vi.fn();

  beforeEach(() => {
    mockOnStateRestore.mockClear();
    mockOnUndo.mockClear();
    mockOnRedo.mockClear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const createTextBlock = (id: string, content: string): EmailBlock => ({
    id,
    type: 'text',
    content: { html: content, textStyle: 'normal' },
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

  const defaultProps = {
    onStateRestore: mockOnStateRestore,
    onUndo: mockOnUndo,
    onRedo: mockOnRedo,
    blocks: [createTextBlock('block-1', '<p>Initial content</p>')],
    subject: 'Initial Subject'
  };

  describe('Initialization', () => {
    it('should render undo and redo buttons', () => {
      render(<UndoManager {...defaultProps} />);
      
      expect(screen.getByTitle(/undo/i)).toBeInTheDocument();
      expect(screen.getByTitle(/redo/i)).toBeInTheDocument();
    });

    it('should initialize with first state when blocks are provided', async () => {
      render(<UndoManager {...defaultProps} />);
      
      // Wait for initialization
      vi.advanceTimersByTime(100);
      
      expect(screen.getByText('1 / 1')).toBeInTheDocument();
    });

    it('should handle empty blocks gracefully', () => {
      render(<UndoManager {...defaultProps} blocks={[]} />);
      
      expect(screen.getByTitle(/undo/i)).toBeDisabled();
      expect(screen.getByTitle(/redo/i)).toBeDisabled();
    });

    it('should disable buttons initially when only one state exists', () => {
      render(<UndoManager {...defaultProps} />);
      
      expect(screen.getByTitle(/undo/i)).toBeDisabled();
      expect(screen.getByTitle(/redo/i)).toBeDisabled();
    });
  });

  describe('State Tracking', () => {
    it('should auto-save state when blocks change', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Initialize first
      vi.advanceTimersByTime(100);
      
      // Change blocks
      const newBlocks = [
        createTextBlock('block-1', '<p>Updated content</p>'),
        createTextBlock('block-2', '<p>New block</p>')
      ];
      
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      
      // Wait for debounced save
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
    });

    it('should auto-save state when subject changes', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Initialize first
      vi.advanceTimersByTime(100);
      
      // Change subject
      rerender(<UndoManager {...defaultProps} subject="Updated Subject" />);
      
      // Wait for debounced save
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
    });

    it('should auto-save state when both blocks and subject change', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Initialize first
      vi.advanceTimersByTime(100);
      
      // Change both blocks and subject
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} subject="Updated Subject" />);
      
      // Wait for debounced save
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
    });

    it('should not save duplicate states', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Initialize first
      vi.advanceTimersByTime(100);
      
      // Change blocks
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      // Make the same change again
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
    });

    it('should limit history to 50 states', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Initialize first
      vi.advanceTimersByTime(100);
      
      // Add 60 different states
      for (let i = 1; i <= 60; i++) {
        const newBlocks = [createTextBlock('block-1', `<p>Content ${i}</p>`)];
        rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
        vi.advanceTimersByTime(1000);
      }
      
      await waitFor(() => {
        expect(screen.getByText('50 / 50')).toBeInTheDocument();
      });
    });
  });

  describe('Undo Functionality', () => {
    it('should enable undo button when multiple states exist', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Initialize and add another state
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByTitle(/undo/i)).not.toBeDisabled();
      });
    });

    it('should call onStateRestore with previous state on undo', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Initialize and add another state
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
      
      // Click undo
      fireEvent.click(screen.getByTitle(/undo/i));
      
      expect(mockOnStateRestore).toHaveBeenCalledWith(
        expect.objectContaining({
          blocks: expect.arrayContaining([
            expect.objectContaining({
              content: { html: '<p>Initial content</p>', textStyle: 'normal' }
            })
          ]),
          subject: 'Initial Subject',
          description: 'Initial state'
        })
      );
    });

    it('should call original onUndo callback if provided', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Setup states
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
      
      // Click undo
      fireEvent.click(screen.getByTitle(/undo/i));
      
      expect(mockOnUndo).toHaveBeenCalled();
    });

    it('should update state indicator after undo', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Setup states
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
      
      // Click undo
      fireEvent.click(screen.getByTitle(/undo/i));
      
      await waitFor(() => {
        expect(screen.getByText('1 / 2')).toBeInTheDocument();
      });
    });

    it('should disable undo button when at first state', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Setup states
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      // Click undo to go back to first state
      fireEvent.click(screen.getByTitle(/undo/i));
      
      await waitFor(() => {
        expect(screen.getByTitle(/undo/i)).toBeDisabled();
      });
    });
  });

  describe('Redo Functionality', () => {
    it('should enable redo button after undo', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Setup states
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      // Undo
      fireEvent.click(screen.getByTitle(/undo/i));
      
      await waitFor(() => {
        expect(screen.getByTitle(/redo/i)).not.toBeDisabled();
      });
    });

    it('should call onStateRestore with next state on redo', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Setup states
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      // Undo first
      fireEvent.click(screen.getByTitle(/undo/i));
      mockOnStateRestore.mockClear();
      
      // Then redo
      fireEvent.click(screen.getByTitle(/redo/i));
      
      expect(mockOnStateRestore).toHaveBeenCalledWith(
        expect.objectContaining({
          blocks: expect.arrayContaining([
            expect.objectContaining({
              content: { html: '<p>Updated content</p>', textStyle: 'normal' }
            })
          ]),
          description: expect.stringContaining('Blocks changed')
        })
      );
    });

    it('should call original onRedo callback if provided', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Setup states
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      // Undo first
      fireEvent.click(screen.getByTitle(/undo/i));
      
      // Then redo
      fireEvent.click(screen.getByTitle(/redo/i));
      
      expect(mockOnRedo).toHaveBeenCalled();
    });

    it('should disable redo button when at latest state', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      // Setup states
      vi.advanceTimersByTime(100);
      const newBlocks = [createTextBlock('block-1', '<p>Updated content</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      // Undo and redo
      fireEvent.click(screen.getByTitle(/undo/i));
      fireEvent.click(screen.getByTitle(/redo/i));
      
      await waitFor(() => {
        expect(screen.getByTitle(/redo/i)).toBeDisabled();
      });
    });
  });

  describe('Multiple Block Operations', () => {
    it('should handle adding multiple blocks', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      vi.advanceTimersByTime(100);
      
      // Add multiple blocks
      const multipleBlocks = [
        createTextBlock('block-1', '<p>Block 1</p>'),
        createTextBlock('block-2', '<p>Block 2</p>'),
        createTextBlock('block-3', '<p>Block 3</p>')
      ];
      
      rerender(<UndoManager {...defaultProps} blocks={multipleBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
    });

    it('should handle removing blocks', async () => {
      const initialBlocks = [
        createTextBlock('block-1', '<p>Block 1</p>'),
        createTextBlock('block-2', '<p>Block 2</p>')
      ];
      
      const { rerender } = render(<UndoManager {...defaultProps} blocks={initialBlocks} />);
      
      vi.advanceTimersByTime(100);
      
      // Remove one block
      const remainingBlocks = [createTextBlock('block-1', '<p>Block 1</p>')];
      rerender(<UndoManager {...defaultProps} blocks={remainingBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
    });

    it('should handle reordering blocks', async () => {
      const initialBlocks = [
        createTextBlock('block-1', '<p>Block 1</p>'),
        createTextBlock('block-2', '<p>Block 2</p>')
      ];
      
      const { rerender } = render(<UndoManager {...defaultProps} blocks={initialBlocks} />);
      
      vi.advanceTimersByTime(100);
      
      // Reorder blocks
      const reorderedBlocks = [
        createTextBlock('block-2', '<p>Block 2</p>'),
        createTextBlock('block-1', '<p>Block 1</p>')
      ];
      
      rerender(<UndoManager {...defaultProps} blocks={reorderedBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
    });
  });

  describe('Complex State Changes', () => {
    it('should handle rapid state changes with debouncing', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      vi.advanceTimersByTime(100);
      
      // Make rapid changes
      for (let i = 1; i <= 5; i++) {
        const newBlocks = [createTextBlock('block-1', `<p>Content ${i}</p>`)];
        rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
        vi.advanceTimersByTime(500); // Less than debounce time
      }
      
      // Complete the debounce
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
      });
    });

    it('should handle complex undo/redo sequences', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      vi.advanceTimersByTime(100);
      
      // Create multiple states
      const states = [
        [createTextBlock('block-1', '<p>State 1</p>')],
        [createTextBlock('block-1', '<p>State 2</p>')],
        [createTextBlock('block-1', '<p>State 3</p>')]
      ];
      
      for (const state of states) {
        rerender(<UndoManager {...defaultProps} blocks={state} />);
        vi.advanceTimersByTime(1000);
      }
      
      await waitFor(() => {
        expect(screen.getByText('4 / 4')).toBeInTheDocument();
      });
      
      // Undo twice
      fireEvent.click(screen.getByTitle(/undo/i));
      await waitFor(() => expect(screen.getByText('3 / 4')).toBeInTheDocument());
      
      fireEvent.click(screen.getByTitle(/undo/i));
      await waitFor(() => expect(screen.getByText('2 / 4')).toBeInTheDocument());
      
      // Redo once
      fireEvent.click(screen.getByTitle(/redo/i));
      await waitFor(() => expect(screen.getByText('3 / 4')).toBeInTheDocument());
    });

    it('should clear future states when new change is made after undo', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      vi.advanceTimersByTime(100);
      
      // Create multiple states
      const state1 = [createTextBlock('block-1', '<p>State 1</p>')];
      const state2 = [createTextBlock('block-1', '<p>State 2</p>')];
      
      rerender(<UndoManager {...defaultProps} blocks={state1} />);
      vi.advanceTimersByTime(1000);
      
      rerender(<UndoManager {...defaultProps} blocks={state2} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => expect(screen.getByText('3 / 3')).toBeInTheDocument());
      
      // Undo
      fireEvent.click(screen.getByTitle(/undo/i));
      await waitFor(() => expect(screen.getByText('2 / 3')).toBeInTheDocument());
      
      // Make new change (should clear future states)
      const newState = [createTextBlock('block-1', '<p>New Branch</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newState} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('3 / 3')).toBeInTheDocument();
        expect(screen.getByTitle(/redo/i)).toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty state history gracefully', () => {
      render(<UndoManager {...defaultProps} blocks={[]} />);
      
      expect(screen.getByTitle(/undo/i)).toBeDisabled();
      expect(screen.getByTitle(/redo/i)).toBeDisabled();
    });

    it('should handle null/undefined blocks', () => {
      render(<UndoManager {...defaultProps} blocks={undefined as any} />);
      
      expect(screen.getByTitle(/undo/i)).toBeDisabled();
      expect(screen.getByTitle(/redo/i)).toBeDisabled();
    });

    it('should handle missing onStateRestore callback', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} onStateRestore={undefined} />);
      
      vi.advanceTimersByTime(100);
      
      const newBlocks = [createTextBlock('block-1', '<p>Updated</p>')];
      rerender(<UndoManager {...defaultProps} onStateRestore={undefined} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      expect(() => {
        fireEvent.click(screen.getByTitle(/undo/i));
      }).not.toThrow();
    });

    it('should generate unique state IDs', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      vi.advanceTimersByTime(100);
      
      // Create multiple states rapidly
      for (let i = 0; i < 3; i++) {
        const newBlocks = [createTextBlock('block-1', `<p>Content ${i}</p>`)];
        rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
        vi.advanceTimersByTime(1001); // Ensure different timestamps
      }
      
      await waitFor(() => {
        expect(screen.getByText('4 / 4')).toBeInTheDocument();
      });
    });
  });

  describe('Tooltips and UI', () => {
    it('should show descriptive tooltips for undo button', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      vi.advanceTimersByTime(100);
      
      const newBlocks = [createTextBlock('block-1', '<p>Updated</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        const undoButton = screen.getByTitle(/undo/i);
        expect(undoButton.title).toContain('Initial state');
      });
    });

    it('should show descriptive tooltips for redo button', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      vi.advanceTimersByTime(100);
      
      const newBlocks = [createTextBlock('block-1', '<p>Updated</p>')];
      rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
      vi.advanceTimersByTime(1000);
      
      // Undo to enable redo
      fireEvent.click(screen.getByTitle(/undo/i));
      
      await waitFor(() => {
        const redoButton = screen.getByTitle(/redo/i);
        expect(redoButton.title).toContain('Blocks changed');
      });
    });

    it('should update state counter accurately', async () => {
      const { rerender } = render(<UndoManager {...defaultProps} />);
      
      vi.advanceTimersByTime(100);
      expect(screen.getByText('1 / 1')).toBeInTheDocument();
      
      // Add states
      for (let i = 1; i <= 3; i++) {
        const newBlocks = [createTextBlock('block-1', `<p>Content ${i}</p>`)];
        rerender(<UndoManager {...defaultProps} blocks={newBlocks} />);
        vi.advanceTimersByTime(1000);
        
        await waitFor(() => {
          expect(screen.getByText(`${i + 1} / ${i + 1}`)).toBeInTheDocument();
        });
      }
    });
  });
});
