
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ButtonBlockRenderer } from '../../../src/components/blocks/ButtonBlockRenderer';
import { ButtonBlock } from '../../../src/types/emailBlocks';

const mockButtonBlock: ButtonBlock = {
  id: 'button-1',
  type: 'button',
  content: {
    text: 'Click me',
    link: 'https://example.com',
    style: 'filled'
  },
  styling: {
    desktop: {
      padding: '12px 24px',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF'
    }
  },
  position: { x: 0, y: 0 },
  displayOptions: { showOnDesktop: true, showOnTablet: true, showOnMobile: true }
};

describe('ButtonBlockRenderer', () => {
  const mockProps = {
    block: mockButtonBlock,
    isSelected: false,
    onUpdate: vi.fn()
  };

  it('renders button with text', () => {
    render(<ButtonBlockRenderer {...mockProps} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as link with correct href', () => {
    render(<ButtonBlockRenderer {...mockProps} />);
    const button = screen.getByRole('link');
    expect(button).toHaveAttribute('href', 'https://example.com');
  });

  it('applies filled style', () => {
    render(<ButtonBlockRenderer {...mockProps} />);
    const button = screen.getByRole('link');
    expect(button).toHaveStyle({
      backgroundColor: '#3B82F6',
      color: '#FFFFFF'
    });
  });

  it('applies outline style', () => {
    const outlineBlock = {
      ...mockButtonBlock,
      content: { ...mockButtonBlock.content, style: 'outline' }
    };
    
    render(<ButtonBlockRenderer {...mockProps} block={outlineBlock} />);
    const button = screen.getByRole('link');
    expect(button).toHaveStyle({
      backgroundColor: 'transparent',
      border: '2px solid #3B82F6'
    });
  });

  it('applies text style', () => {
    const textBlock = {
      ...mockButtonBlock,
      content: { ...mockButtonBlock.content, style: 'text' }
    };
    
    render(<ButtonBlockRenderer {...mockProps} block={textBlock} />);
    const button = screen.getByRole('link');
    expect(button).toHaveStyle({
      backgroundColor: 'transparent',
      textDecoration: 'underline'
    });
  });

  it('handles click tracking', () => {
    const onTrackClick = vi.fn();
    render(<ButtonBlockRenderer {...mockProps} onTrackClick={onTrackClick} />);
    
    fireEvent.click(screen.getByRole('link'));
    expect(onTrackClick).toHaveBeenCalledWith('button-1');
  });

  it('shows default text when empty', () => {
    const emptyBlock = { ...mockButtonBlock, content: { ...mockButtonBlock.content, text: '' } };
    render(<ButtonBlockRenderer {...mockProps} block={emptyBlock} />);
    
    expect(screen.getByText('Button Text')).toBeInTheDocument();
  });

  it('handles selection state', () => {
    render(<ButtonBlockRenderer {...mockProps} isSelected={true} />);
    const container = screen.getByTestId('button-block-container');
    expect(container).toHaveClass('selected');
  });
});
