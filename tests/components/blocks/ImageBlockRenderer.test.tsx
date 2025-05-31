
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ImageBlockRenderer } from '../../../src/components/blocks/ImageBlockRenderer';
import { ImageBlock } from '../../../src/types/emailBlocks';

const mockImageBlock: ImageBlock = {
  id: 'image-1',
  type: 'image',
  content: {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
    link: 'https://example.com'
  },
  styling: {
    desktop: {
      padding: '16px',
      borderRadius: '4px'
    }
  },
  position: { x: 0, y: 0 },
  displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
};

describe('ImageBlockRenderer', () => {
  const mockProps = {
    block: mockImageBlock,
    isSelected: false,
    onUpdate: vi.fn()
  };

  it('renders image correctly', () => {
    render(<ImageBlockRenderer {...mockProps} />);
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders with link wrapper', () => {
    render(<ImageBlockRenderer {...mockProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders without link when not provided', () => {
    const blockWithoutLink = { ...mockImageBlock, content: { ...mockImageBlock.content, link: undefined } };
    render(<ImageBlockRenderer {...mockProps} block={blockWithoutLink} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  it('shows placeholder when no image', () => {
    const emptyBlock = { ...mockImageBlock, content: { src: '', alt: '' } };
    render(<ImageBlockRenderer {...mockProps} block={emptyBlock} />);
    
    expect(screen.getByText('Image')).toBeInTheDocument();
  });

  it('applies styling correctly', () => {
    render(<ImageBlockRenderer {...mockProps} />);
    const container = screen.getByAltText('Test image').parentElement;
    expect(container).toHaveStyle({ padding: '16px' });
  });

  it('handles image load errors', () => {
    render(<ImageBlockRenderer {...mockProps} />);
    const image = screen.getByAltText('Test image');
    
    fireEvent.error(image);
    expect(screen.getByText('Failed to load image')).toBeInTheDocument();
  });

  it('supports lazy loading', () => {
    render(<ImageBlockRenderer {...mockProps} />);
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('handles selection state', () => {
    render(<ImageBlockRenderer {...mockProps} isSelected={true} />);
    const container = screen.getByTestId('image-block-container');
    expect(container).toHaveClass('selected');
  });
});
