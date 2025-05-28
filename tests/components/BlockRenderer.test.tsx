
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '@/components/BlockRenderer';
import { TextBlock } from '@/types/emailBlocks';

// Mock the block renderers that might not exist
vi.mock('@/components/blocks/TextBlockRenderer', () => ({
  TextBlockRenderer: ({ block }: { block: any }) => (
    <div data-testid="text-block">{block.content?.html || 'Text content'}</div>
  )
}));

vi.mock('@/components/blocks/ImageBlockRenderer', () => ({
  ImageBlockRenderer: ({ block }: { block: any }) => (
    <div data-testid="image-block">
      <img src={block.content?.src || 'placeholder.jpg'} alt={block.content?.alt || 'Image'} />
    </div>
  )
}));

vi.mock('@/components/blocks/ButtonBlockRenderer', () => ({
  ButtonBlockRenderer: ({ block }: { block: any }) => (
    <button data-testid="button-block">{block.content?.text || 'Button'}</button>
  )
}));

describe('BlockRenderer', () => {
  const mockOnUpdate = vi.fn();
  const mockOnBlockAdd = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnBlockAdd.mockClear();
  });

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

    expect(screen.getByTestId('text-block')).toBeInTheDocument();
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

    const blockElement = container.querySelector('[class*="selected"]');
    expect(blockElement).toBeInTheDocument();
  });

  it('should render unknown block type with error message', () => {
    const unknownBlock = {
      ...createMockTextBlock(),
      type: 'unknown'
    } as any;

    const { container } = render(
      <BlockRenderer
        block={unknownBlock}
        isSelected={false}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
      />
    );

    // Check if error handling is properly displayed
    expect(container.textContent).toContain('unknown');
  });

  it('should handle image block rendering', () => {
    const imageBlock = {
      ...createMockTextBlock(),
      type: 'image',
      content: {
        src: 'test-image.jpg',
        alt: 'Test image',
        alignment: 'center'
      }
    } as any;

    render(
      <BlockRenderer
        block={imageBlock}
        isSelected={false}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
      />
    );

    expect(screen.getByTestId('image-block')).toBeInTheDocument();
  });

  it('should handle button block rendering', () => {
    const buttonBlock = {
      ...createMockTextBlock(),
      type: 'button',
      content: {
        text: 'Click me',
        link: '#',
        style: 'solid',
        size: 'medium'
      }
    } as any;

    render(
      <BlockRenderer
        block={buttonBlock}
        isSelected={false}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
      />
    );

    expect(screen.getByTestId('button-block')).toBeInTheDocument();
  });
});
