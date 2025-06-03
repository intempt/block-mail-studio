
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockRenderer } from '@/components/BlockRenderer';
import { TextBlock, ImageBlock, ButtonBlock, SpacerBlock, DividerBlock } from '@/types/emailBlocks';

describe('All Block Renderers', () => {
  const mockOnUpdate = vi.fn();
  const mockOnStarBlock = vi.fn();
  const mockOnUnstarBlock = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnStarBlock.mockClear();
    mockOnUnstarBlock.mockClear();
  });

  describe('TextBlock Rendering', () => {
    const textBlock: TextBlock = {
      id: 'text-1',
      type: 'text',
      content: {
        html: '<p>Sample text content</p>',
        textStyle: 'normal'
      },
      styling: {
        desktop: { width: '100%', height: 'auto', backgroundColor: '#ffffff', padding: '16px' },
        tablet: { width: '100%', height: 'auto', backgroundColor: '#ffffff', padding: '16px' },
        mobile: { width: '100%', height: 'auto', backgroundColor: '#ffffff', padding: '16px' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    it('should render text content correctly', () => {
      render(
        <BlockRenderer
          block={textBlock}
          isSelected={false}
          onUpdate={mockOnUpdate}
          onStarBlock={mockOnStarBlock}
          onUnstarBlock={mockOnUnstarBlock}
        />
      );

      expect(screen.getByText('Sample text content')).toBeInTheDocument();
    });

    it('should show star button on hover and selection', () => {
      render(
        <BlockRenderer
          block={textBlock}
          isSelected={true}
          onUpdate={mockOnUpdate}
          onStarBlock={mockOnStarBlock}
          onUnstarBlock={mockOnUnstarBlock}
        />
      );

      const starButton = screen.getByTitle(/Save as snippet/);
      expect(starButton).toBeInTheDocument();
    });

    it('should handle star/unstar actions', () => {
      const starredBlock = { ...textBlock, isStarred: true };
      
      render(
        <BlockRenderer
          block={starredBlock}
          isSelected={false}
          onUpdate={mockOnUpdate}
          onStarBlock={mockOnStarBlock}
          onUnstarBlock={mockOnUnstarBlock}
        />
      );

      const starButton = screen.getByTitle(/Remove from snippets/);
      fireEvent.click(starButton);
      
      expect(mockOnUnstarBlock).toHaveBeenCalledWith(textBlock.id);
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  describe('ImageBlock Rendering', () => {
    const imageBlock: ImageBlock = {
      id: 'image-1',
      type: 'image',
      content: {
        src: 'https://example.com/image.jpg',
        alt: 'Test image',
        title: 'Sample Image'
      },
      styling: {
        desktop: { width: '300px', height: '200px' },
        tablet: { width: '250px', height: '167px' },
        mobile: { width: '100%', height: 'auto' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    it('should render image with correct attributes', () => {
      render(
        <BlockRenderer
          block={imageBlock}
          isSelected={false}
          onUpdate={mockOnUpdate}
        />
      );

      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('title', 'Sample Image');
    });
  });

  describe('ButtonBlock Rendering', () => {
    const buttonBlock: ButtonBlock = {
      id: 'button-1',
      type: 'button',
      content: {
        text: 'Click Me',
        href: 'https://example.com',
        target: '_blank'
      },
      styling: {
        desktop: { 
          backgroundColor: '#007bff', 
          color: '#ffffff', 
          padding: '12px 24px',
          borderRadius: '4px',
          fontSize: '16px'
        },
        tablet: { 
          backgroundColor: '#007bff', 
          color: '#ffffff', 
          padding: '10px 20px',
          borderRadius: '4px',
          fontSize: '14px'
        },
        mobile: { 
          backgroundColor: '#007bff', 
          color: '#ffffff', 
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px'
        }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    it('should render button with correct text and link', () => {
      render(
        <BlockRenderer
          block={buttonBlock}
          isSelected={false}
          onUpdate={mockOnUpdate}
        />
      );

      const button = screen.getByRole('link', { name: 'Click Me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('href', 'https://example.com');
      expect(button).toHaveAttribute('target', '_blank');
    });
  });

  describe('SpacerBlock Rendering', () => {
    const spacerBlock: SpacerBlock = {
      id: 'spacer-1',
      type: 'spacer',
      content: {
        height: '40px'
      },
      styling: {
        desktop: { height: '40px' },
        tablet: { height: '30px' },
        mobile: { height: '20px' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    it('should render spacer with correct height', () => {
      render(
        <BlockRenderer
          block={spacerBlock}
          isSelected={false}
          onUpdate={mockOnUpdate}
        />
      );

      const spacer = screen.getByTestId('spacer-block');
      expect(spacer).toHaveStyle({ height: '40px' });
    });
  });

  describe('DividerBlock Rendering', () => {
    const dividerBlock: DividerBlock = {
      id: 'divider-1',
      type: 'divider',
      content: {
        style: 'solid',
        color: '#cccccc',
        thickness: '1px'
      },
      styling: {
        desktop: { margin: '20px 0', borderTop: '1px solid #cccccc' },
        tablet: { margin: '15px 0', borderTop: '1px solid #cccccc' },
        mobile: { margin: '10px 0', borderTop: '1px solid #cccccc' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    it('should render divider with correct styling', () => {
      render(
        <BlockRenderer
          block={dividerBlock}
          isSelected={false}
          onUpdate={mockOnUpdate}
        />
      );

      const divider = screen.getByTestId('divider-block');
      expect(divider).toHaveStyle({ 
        borderTop: '1px solid #cccccc',
        margin: '20px 0'
      });
    });
  });

  describe('Unknown Block Type', () => {
    it('should render error message for unknown block type', () => {
      const unknownBlock = {
        id: 'unknown-1',
        type: 'unknown',
        content: {},
        styling: {
          desktop: {},
          tablet: {},
          mobile: {}
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      } as any;

      render(
        <BlockRenderer
          block={unknownBlock}
          isSelected={false}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/Unknown block type: unknown/)).toBeInTheDocument();
    });
  });
});
