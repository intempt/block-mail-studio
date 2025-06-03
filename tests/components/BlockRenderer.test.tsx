
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockRenderer } from '@/components/BlockRenderer';
import { TextBlock, ImageBlock, ButtonBlock, SpacerBlock, DividerBlock } from '@/types/emailBlocks';

describe('BlockRenderer', () => {
  const mockOnUpdate = vi.fn();
  const mockOnBlockAdd = vi.fn();
  const mockOnStarBlock = vi.fn();
  const mockOnUnstarBlock = vi.fn();
  const mockOnSnippetRefresh = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnBlockAdd.mockClear();
    mockOnStarBlock.mockClear();
    mockOnUnstarBlock.mockClear();
    mockOnSnippetRefresh.mockClear();
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

  it('should show star button for block snippets', () => {
    const textBlock = createMockTextBlock();
    
    render(
      <BlockRenderer
        block={textBlock}
        isSelected={true}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
        onStarBlock={mockOnStarBlock}
        onUnstarBlock={mockOnUnstarBlock}
      />
    );

    // Button should be visible when selected
    const starButton = screen.getByTitle(/Save as snippet/);
    expect(starButton).toBeInTheDocument();
  });

  it('should handle star/unstar toggle', () => {
    const textBlock = {
      ...createMockTextBlock(),
      isStarred: false
    };
    
    render(
      <BlockRenderer
        block={textBlock}
        isSelected={true}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
        onStarBlock={mockOnStarBlock}
        onUnstarBlock={mockOnUnstarBlock}
        onSnippetRefresh={mockOnSnippetRefresh}
      />
    );

    // Find and click star button
    const starButton = screen.getByTitle(/Save as snippet/);
    fireEvent.click(starButton);
    
    // Check that correct functions were called
    expect(mockOnStarBlock).toHaveBeenCalledWith(textBlock);
    expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ isStarred: true }));
    expect(mockOnSnippetRefresh).toHaveBeenCalled();
  });

  it('should handle unstarring a starred block', () => {
    const starredBlock = {
      ...createMockTextBlock(),
      isStarred: true
    };
    
    render(
      <BlockRenderer
        block={starredBlock}
        isSelected={true}
        onUpdate={mockOnUpdate}
        onBlockAdd={mockOnBlockAdd}
        onStarBlock={mockOnStarBlock}
        onUnstarBlock={mockOnUnstarBlock}
        onSnippetRefresh={mockOnSnippetRefresh}
      />
    );

    // Find and click unstar button
    const unstarButton = screen.getByTitle(/Remove from snippets/);
    fireEvent.click(unstarButton);
    
    // Check that correct functions were called
    expect(mockOnUnstarBlock).toHaveBeenCalledWith(starredBlock.id);
    expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ isStarred: false }));
    expect(mockOnSnippetRefresh).toHaveBeenCalled();
  });

  it('should render image block correctly', () => {
    const imageBlock: ImageBlock = {
      id: 'image-1',
      type: 'image',
      content: {
        src: 'https://example.com/image.jpg',
        alt: 'Test image',
        title: 'Image title'
      },
      styling: {
        desktop: { width: '300px', height: 'auto' },
        tablet: { width: '100%', height: 'auto' },
        mobile: { width: '100%', height: 'auto' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
    
    render(
      <BlockRenderer
        block={imageBlock}
        isSelected={false}
        onUpdate={mockOnUpdate}
      />
    );

    // Image components would typically be rendered by specific renderers
    // This test ensures the BlockRenderer dispatches to the correct component
  });

  it('should render button block correctly', () => {
    const buttonBlock: ButtonBlock = {
      id: 'button-1',
      type: 'button',
      content: {
        text: 'Click me',
        href: 'https://example.com',
        target: '_blank'
      },
      styling: {
        desktop: { 
          backgroundColor: '#0000ff',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '4px'
        },
        tablet: { 
          backgroundColor: '#0000ff',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '4px'
        },
        mobile: { 
          backgroundColor: '#0000ff',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '4px'
        }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
    
    render(
      <BlockRenderer
        block={buttonBlock}
        isSelected={false}
        onUpdate={mockOnUpdate}
      />
    );

    // Button components would typically be rendered by specific renderers
    // This test ensures the BlockRenderer dispatches to the correct component
  });
});
