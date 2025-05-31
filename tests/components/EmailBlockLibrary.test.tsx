
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { EmailBlockLibrary } from '../../src/components/EmailBlockLibrary';

describe('EmailBlockLibrary', () => {
  it('renders all block categories', () => {
    render(<EmailBlockLibrary />);
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('renders text block', () => {
    render(<EmailBlockLibrary />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('renders image block', () => {
    render(<EmailBlockLibrary />);
    expect(screen.getByText('Image')).toBeInTheDocument();
  });

  it('renders button block', () => {
    render(<EmailBlockLibrary />);
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('handles block drag start', () => {
    render(<EmailBlockLibrary />);
    const textBlock = screen.getByTestId('block-text');
    
    const dragEvent = new Event('dragstart');
    Object.assign(dragEvent, {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: null
      }
    });
    
    fireEvent(textBlock, dragEvent);
    expect(dragEvent.dataTransfer.setData).toHaveBeenCalled();
  });

  it('filters blocks by search', () => {
    render(<EmailBlockLibrary />);
    const searchInput = screen.getByPlaceholderText('Search blocks...');
    
    fireEvent.change(searchInput, { target: { value: 'text' } });
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.queryByText('Image')).not.toBeInTheDocument();
  });

  it('shows block previews on hover', () => {
    render(<EmailBlockLibrary />);
    const textBlock = screen.getByTestId('block-text');
    
    fireEvent.mouseEnter(textBlock);
    expect(screen.getByTestId('block-preview')).toBeInTheDocument();
  });

  it('categorizes blocks correctly', () => {
    render(<EmailBlockLibrary />);
    
    fireEvent.click(screen.getByText('Layout'));
    expect(screen.getByText('Columns')).toBeInTheDocument();
    expect(screen.getByText('Spacer')).toBeInTheDocument();
  });

  it('handles custom block additions', () => {
    const onAddCustomBlock = vi.fn();
    render(<EmailBlockLibrary onAddCustomBlock={onAddCustomBlock} />);
    
    fireEvent.click(screen.getByText('Add Custom Block'));
    expect(onAddCustomBlock).toHaveBeenCalled();
  });
});
