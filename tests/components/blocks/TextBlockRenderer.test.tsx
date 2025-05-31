
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { TextBlockRenderer } from '../../../src/components/blocks/TextBlockRenderer';
import { TextBlock } from '../../../src/types/emailBlocks';

const mockTextBlock: TextBlock = {
  id: 'text-1',
  type: 'text',
  content: { html: '<p>Sample text content</p>' },
  styling: {
    desktop: {
      padding: '16px',
      fontSize: '14px',
      textColor: '#333333',
      backgroundColor: 'transparent'
    }
  },
  position: { x: 0, y: 0 },
  displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
};

describe('TextBlockRenderer', () => {
  const mockProps = {
    block: mockTextBlock,
    isSelected: false,
    onUpdate: vi.fn()
  };

  it('renders text content', () => {
    render(<TextBlockRenderer {...mockProps} />);
    expect(screen.getByText('Sample text content')).toBeInTheDocument();
  });

  it('applies styling correctly', () => {
    render(<TextBlockRenderer {...mockProps} />);
    const textElement = screen.getByText('Sample text content').parentElement;
    
    expect(textElement).toHaveStyle({
      padding: '16px',
      fontSize: '14px',
      color: '#333333'
    });
  });

  it('shows placeholder when no content', () => {
    const emptyBlock = { ...mockTextBlock, content: { html: '' } };
    render(<TextBlockRenderer {...mockProps} block={emptyBlock} />);
    
    expect(screen.getByText('Click to add text...')).toBeInTheDocument();
  });

  it('handles HTML content safely', () => {
    const htmlBlock = {
      ...mockTextBlock,
      content: { html: '<script>alert("xss")</script><p>Safe content</p>' }
    };
    
    render(<TextBlockRenderer {...mockProps} block={htmlBlock} />);
    expect(screen.getByText('Safe content')).toBeInTheDocument();
    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
  });

  it('renders with selection state', () => {
    render(<TextBlockRenderer {...mockProps} isSelected={true} />);
    const container = screen.getByText('Sample text content').parentElement;
    expect(container).toHaveClass('selected');
  });

  it('handles rich text formatting', () => {
    const richTextBlock = {
      ...mockTextBlock,
      content: { html: '<p><strong>Bold</strong> and <em>italic</em> text</p>' }
    };
    
    render(<TextBlockRenderer {...mockProps} block={richTextBlock} />);
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
  });

  it('applies responsive styling', () => {
    const responsiveBlock = {
      ...mockTextBlock,
      styling: {
        desktop: { fontSize: '16px' },
        tablet: { fontSize: '14px' },
        mobile: { fontSize: '12px' }
      }
    };
    
    render(<TextBlockRenderer {...mockProps} block={responsiveBlock} />);
    // Test would check computed styles in different viewport sizes
  });
});
