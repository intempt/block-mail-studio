
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ColumnsBlockRenderer } from '../../../src/components/blocks/ColumnsBlockRenderer';
import { ColumnsBlock } from '../../../src/types/emailBlocks';

const mockColumnsBlock: ColumnsBlock = {
  id: 'columns-1',
  type: 'columns',
  content: {
    columnCount: 2,
    columnRatio: '50-50',
    columns: [
      { id: 'col-1', blocks: [], width: '50%' },
      { id: 'col-2', blocks: [], width: '50%' }
    ],
    gap: '16px'
  },
  styling: {
    desktop: { padding: '16px' }
  },
  position: { x: 0, y: 0 },
  displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
};

describe('ColumnsBlockRenderer', () => {
  const mockProps = {
    block: mockColumnsBlock,
    isSelected: false,
    onUpdate: vi.fn(),
    onBlockUpdate: vi.fn()
  };

  it('renders column layout', () => {
    render(<ColumnsBlockRenderer {...mockProps} />);
    expect(screen.getByTestId('columns-container')).toBeInTheDocument();
  });

  it('renders correct number of columns', () => {
    render(<ColumnsBlockRenderer {...mockProps} />);
    const columns = screen.getAllByTestId(/column-\d+/);
    expect(columns).toHaveLength(2);
  });

  it('applies column ratios correctly', () => {
    render(<ColumnsBlockRenderer {...mockProps} />);
    const firstColumn = screen.getByTestId('column-0');
    expect(firstColumn).toHaveStyle({ width: '50%' });
  });

  it('handles 60-40 ratio', () => {
    const ratioBlock = {
      ...mockColumnsBlock,
      content: { ...mockColumnsBlock.content, columnRatio: '60-40' }
    };
    
    render(<ColumnsBlockRenderer {...mockProps} block={ratioBlock} />);
    const firstColumn = screen.getByTestId('column-0');
    expect(firstColumn).toHaveStyle({ width: '60%' });
  });

  it('handles column drag and drop', () => {
    render(<ColumnsBlockRenderer {...mockProps} />);
    const column = screen.getByTestId('column-0');
    
    fireEvent.dragOver(column, {
      dataTransfer: { getData: vi.fn(() => JSON.stringify({ blockType: 'text' })) }
    });
    
    fireEvent.drop(column, {
      dataTransfer: { getData: vi.fn(() => JSON.stringify({ blockType: 'text' })) }
    });
    
    expect(mockProps.onUpdate).toHaveBeenCalled();
  });

  it('shows empty column state', () => {
    render(<ColumnsBlockRenderer {...mockProps} />);
    expect(screen.getByText('Empty Column')).toBeInTheDocument();
  });

  it('renders nested blocks in columns', () => {
    const blockWithContent = {
      ...mockColumnsBlock,
      content: {
        ...mockColumnsBlock.content,
        columns: [
          {
            id: 'col-1',
            blocks: [{
              id: 'nested-1',
              type: 'text',
              content: { html: '<p>Nested content</p>' },
              styling: { desktop: {} },
              position: { x: 0, y: 0 },
              displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
            }],
            width: '50%'
          },
          { id: 'col-2', blocks: [], width: '50%' }
        ]
      }
    };
    
    render(<ColumnsBlockRenderer {...mockProps} block={blockWithContent} />);
    expect(screen.getByText('Nested content')).toBeInTheDocument();
  });

  it('handles responsive column stacking', () => {
    render(<ColumnsBlockRenderer {...mockProps} />);
    const container = screen.getByTestId('columns-container');
    
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 400 });
    fireEvent.resize(window);
    
    expect(container).toHaveClass('stack-mobile');
  });
});
