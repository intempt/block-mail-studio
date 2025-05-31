
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { EmailBlockCanvas } from '../../src/components/EmailBlockCanvas';
import { EmailBlock } from '../../src/types/emailBlocks';

const mockBlocks: EmailBlock[] = [
  {
    id: 'test-1',
    type: 'text',
    content: { html: '<p>Test content</p>' },
    styling: { desktop: { padding: '16px' } },
    position: { x: 0, y: 0 },
    displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
  }
];

describe('EmailBlockCanvas', () => {
  const mockProps = {
    blocks: mockBlocks,
    setBlocks: vi.fn(),
    selectedBlockId: null,
    setSelectedBlockId: vi.fn(),
    getDefaultContent: vi.fn(() => ({})),
    getDefaultStyles: vi.fn(() => ({}))
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders canvas container', () => {
    render(<EmailBlockCanvas {...mockProps} />);
    expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
  });

  it('renders blocks correctly', () => {
    render(<EmailBlockCanvas {...mockProps} />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('handles block selection', () => {
    render(<EmailBlockCanvas {...mockProps} />);
    const block = screen.getByTestId('block-test-1');
    fireEvent.click(block);
    expect(mockProps.setSelectedBlockId).toHaveBeenCalledWith('test-1');
  });

  it('handles drag and drop', () => {
    render(<EmailBlockCanvas {...mockProps} />);
    const canvas = screen.getByTestId('email-canvas');
    
    fireEvent.dragOver(canvas, {
      dataTransfer: { getData: vi.fn(() => JSON.stringify({ blockType: 'text' })) }
    });
    
    fireEvent.drop(canvas, {
      dataTransfer: { getData: vi.fn(() => JSON.stringify({ blockType: 'text' })) }
    });
    
    expect(mockProps.setBlocks).toHaveBeenCalled();
  });

  it('shows drop zone indicator during drag', () => {
    render(<EmailBlockCanvas {...mockProps} />);
    const canvas = screen.getByTestId('email-canvas');
    
    fireEvent.dragEnter(canvas);
    expect(screen.getByTestId('drop-zone-indicator')).toBeInTheDocument();
  });

  it('handles empty state', () => {
    render(<EmailBlockCanvas {...mockProps} blocks={[]} />);
    expect(screen.getByText('Drag blocks here to start building')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<EmailBlockCanvas {...mockProps} selectedBlockId="test-1" />);
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(mockProps.setSelectedBlockId).toHaveBeenCalled();
  });

  it('handles block deletion', () => {
    render(<EmailBlockCanvas {...mockProps} selectedBlockId="test-1" />);
    fireEvent.keyDown(document, { key: 'Delete' });
    expect(mockProps.setBlocks).toHaveBeenCalled();
  });

  it('handles block duplication', () => {
    render(<EmailBlockCanvas {...mockProps} selectedBlockId="test-1" />);
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true });
    expect(mockProps.setBlocks).toHaveBeenCalled();
  });

  it('handles responsive preview modes', () => {
    render(<EmailBlockCanvas {...mockProps} previewMode="mobile" />);
    expect(screen.getByTestId('email-canvas')).toHaveClass('mobile-preview');
  });
});
