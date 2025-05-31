
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { EmailEditor } from '../../src/components/EmailEditor';

describe('Drag and Drop Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles block to canvas drop', async () => {
    render(<EmailEditor />);
    
    const textBlock = screen.getByTestId('palette-block-text');
    const canvas = screen.getByTestId('email-canvas');
    
    // Simulate drag and drop
    fireEvent.dragStart(textBlock, {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: 'copy'
      }
    });
    
    fireEvent.dragOver(canvas, {
      dataTransfer: {
        getData: vi.fn(() => JSON.stringify({ blockType: 'text' }))
      }
    });
    
    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: vi.fn(() => JSON.stringify({ blockType: 'text' }))
      }
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('block-text-1')).toBeInTheDocument();
    });
  });

  it('handles block reordering', async () => {
    render(<EmailEditor />);
    
    // Add two blocks
    const textBlock = screen.getByTestId('palette-block-text');
    const imageBlock = screen.getByTestId('palette-block-image');
    const canvas = screen.getByTestId('email-canvas');
    
    // Add first block
    fireEvent.dragStart(textBlock);
    fireEvent.drop(canvas);
    
    await waitFor(() => {
      expect(screen.getByTestId('block-text-1')).toBeInTheDocument();
    });
    
    // Add second block
    fireEvent.dragStart(imageBlock);
    fireEvent.drop(canvas);
    
    await waitFor(() => {
      expect(screen.getByTestId('block-image-1')).toBeInTheDocument();
    });
    
    // Reorder blocks
    const firstBlock = screen.getByTestId('block-text-1');
    const secondBlock = screen.getByTestId('block-image-1');
    
    fireEvent.dragStart(firstBlock, {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: 'move'
      }
    });
    
    fireEvent.dragOver(secondBlock);
    fireEvent.drop(secondBlock);
    
    // Verify order changed
    const blocks = screen.getAllByTestId(/block-/);
    expect(blocks[0]).toHaveAttribute('data-testid', 'block-image-1');
    expect(blocks[1]).toHaveAttribute('data-testid', 'block-text-1');
  });

  it('handles column layout drops', async () => {
    render(<EmailEditor />);
    
    // Add column layout
    const columnsBlock = screen.getByTestId('palette-block-columns');
    const canvas = screen.getByTestId('email-canvas');
    
    fireEvent.dragStart(columnsBlock);
    fireEvent.drop(canvas);
    
    await waitFor(() => {
      expect(screen.getByTestId('block-columns-1')).toBeInTheDocument();
    });
    
    // Add block to column
    const textBlock = screen.getByTestId('palette-block-text');
    const leftColumn = screen.getByTestId('column-0');
    
    fireEvent.dragStart(textBlock);
    fireEvent.dragOver(leftColumn);
    fireEvent.drop(leftColumn);
    
    await waitFor(() => {
      expect(leftColumn).toContainElement(screen.getByTestId('block-text-1'));
    });
  });

  it('handles invalid drop scenarios', () => {
    render(<EmailEditor />);
    
    const textBlock = screen.getByTestId('palette-block-text');
    const palette = screen.getByTestId('block-palette');
    
    // Try to drop block back on palette (should be ignored)
    fireEvent.dragStart(textBlock);
    fireEvent.dragOver(palette);
    fireEvent.drop(palette);
    
    // Verify no new blocks created
    expect(screen.queryByTestId('block-text-1')).not.toBeInTheDocument();
  });

  it('shows visual feedback during drag', () => {
    render(<EmailEditor />);
    
    const textBlock = screen.getByTestId('palette-block-text');
    const canvas = screen.getByTestId('email-canvas');
    
    fireEvent.dragStart(textBlock);
    fireEvent.dragEnter(canvas);
    
    // Should show drop zone indicator
    expect(screen.getByTestId('drop-zone-indicator')).toBeInTheDocument();
    
    fireEvent.dragLeave(canvas);
    
    // Should hide drop zone indicator
    expect(screen.queryByTestId('drop-zone-indicator')).not.toBeInTheDocument();
  });

  it('handles nested column drops', async () => {
    render(<EmailEditor />);
    
    // Create nested structure: columns -> column -> text
    const columnsBlock = screen.getByTestId('palette-block-columns');
    const canvas = screen.getByTestId('email-canvas');
    
    fireEvent.dragStart(columnsBlock);
    fireEvent.drop(canvas);
    
    await waitFor(() => {
      expect(screen.getByTestId('block-columns-1')).toBeInTheDocument();
    });
    
    // Add nested columns to first column
    const nestedColumns = screen.getByTestId('palette-block-columns');
    const leftColumn = screen.getByTestId('column-0');
    
    fireEvent.dragStart(nestedColumns);
    fireEvent.drop(leftColumn);
    
    await waitFor(() => {
      expect(screen.getByTestId('block-columns-2')).toBeInTheDocument();
    });
    
    // Add text to nested column
    const textBlock = screen.getByTestId('palette-block-text');
    const nestedColumn = screen.getByTestId('nested-column-0');
    
    fireEvent.dragStart(textBlock);
    fireEvent.drop(nestedColumn);
    
    await waitFor(() => {
      expect(nestedColumn).toContainElement(screen.getByTestId('block-text-1'));
    });
  });
});
