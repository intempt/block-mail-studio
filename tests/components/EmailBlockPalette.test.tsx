
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { EmailBlockPalette } from '../../src/components/EmailBlockPalette';

describe('EmailBlockPalette', () => {
  it('renders palette with all blocks', () => {
    render(<EmailBlockPalette />);
    expect(screen.getByTestId('block-palette')).toBeInTheDocument();
  });

  it('renders basic blocks section', () => {
    render(<EmailBlockPalette />);
    expect(screen.getByText('Basic Blocks')).toBeInTheDocument();
  });

  it('renders layout blocks section', () => {
    render(<EmailBlockPalette />);
    expect(screen.getByText('Layout Blocks')).toBeInTheDocument();
  });

  it('handles block drag initialization', () => {
    render(<EmailBlockPalette />);
    const block = screen.getByTestId('palette-block-text');
    
    fireEvent.dragStart(block, {
      dataTransfer: { setData: vi.fn(), effectAllowed: '' }
    });
  });

  it('shows tooltips on hover', () => {
    render(<EmailBlockPalette />);
    const block = screen.getByTestId('palette-block-text');
    
    fireEvent.mouseEnter(block);
    expect(screen.getByText('Add text content to your email')).toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    render(<EmailBlockPalette />);
    const firstBlock = screen.getByTestId('palette-block-text');
    
    firstBlock.focus();
    fireEvent.keyDown(firstBlock, { key: 'ArrowDown' });
    
    expect(screen.getByTestId('palette-block-image')).toHaveFocus();
  });

  it('collapses and expands sections', () => {
    render(<EmailBlockPalette />);
    const sectionHeader = screen.getByText('Basic Blocks');
    
    fireEvent.click(sectionHeader);
    expect(screen.getByTestId('basic-blocks-section')).toHaveClass('collapsed');
  });
});
