
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '@/components/BlockRenderer';
import { TextBlock } from '@/types/emailBlocks';

describe('BlockRenderer', () => {
  const mockOnUpdate = vi.fn();
  const mockOnBlockAdd = vi.fn();

  const createMockTextBlock = (): TextBlock => ({
    id: 'test-block-1',
    type: 'text',
    content: {
      html: '<p>Test content</p>',
      textStyle: 'normal'
    },
    styling: {
      desktop: { width: '100%', height: 'auto', backgroundColor: '#ffffff', padding: '16px', margin: '0' },
      tablet: { width: '100%', height: 'auto', backgroundColor: '#ffffff', padding: '16px', margin: '0' },
      mobile: { width: '100%', height: 'auto', backgroundColor: '#ffffff', padding: '16px', margin: '0' }
    },
    position: { x: 0, y: 0 },
    displayOptions: {
      showOnDesktop: true,
      showOnTablet: true,
      showOnMobile: true
    }
  });

  it('should render text block correctly', () => {
    const textBlock = createMockTextBlock();
    
    render(
      <BlockRenderer
        block={textBlock}
        isSelected={false}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
      />
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply selected class when isSelected is true', () => {
    const textBlock = createMockTextBlock();
    
    const { container } = render(
      <BlockRenderer
        block={textBlock}
        isSelected={true}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
      />
    );

    expect(container.firstChild).toHaveClass('selected');
  });

  it('should render unknown block type with error message', () => {
    const unknownBlock = {
      ...createMockTextBlock(),
      type: 'unknown'
    } as any;

    render(
      <BlockRenderer
        block={unknownBlock}
        isSelected={false}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
      />
    );

    expect(screen.getByText(/Unknown block type: unknown/)).toBeInTheDocument();
  });
});
