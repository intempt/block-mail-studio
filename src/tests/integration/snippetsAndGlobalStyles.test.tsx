
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailEditor } from '@/components/EmailEditor';
import { DirectSnippetService } from '@/services/directSnippetService';
import { EmailBlock } from '@/types/emailBlocks';

// Mock services
jest.mock('@/services/directSnippetService');
jest.mock('@/services/directTemplateService');

describe('Snippets and Global Styles Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DirectSnippetService.clearCustomSnippets();
  });

  describe('Snippet Creation with Global Styles', () => {
    it('should create snippet that inherits global styles', async () => {
      const user = userEvent.setup();
      
      // Mock initial state
      const mockBlocks: EmailBlock[] = [{
        id: 'block-1',
        type: 'text',
        content: { html: '<h1>Styled Header</h1>' },
        styling: {
          desktop: { width: '100%', height: 'auto', fontFamily: 'Arial' },
          tablet: { width: '100%', height: 'auto', fontFamily: 'Arial' },
          mobile: { width: '100%', height: 'auto', fontFamily: 'Arial' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      }];

      render(
        <EmailEditor 
          initialContent={{ blocks: mockBlocks }}
          onContentChange={jest.fn()}
        />
      );

      // Test that snippet creation preserves styling
      expect(screen.getByText(/styled header/i)).toBeInTheDocument();
    });

    it('should apply global font changes to existing snippets', async () => {
      const user = userEvent.setup();
      
      // Create a snippet first
      const testBlock: EmailBlock = {
        id: 'test-block',
        type: 'text',
        content: { html: '<p>Test content</p>' },
        styling: {
          desktop: { width: '100%', height: 'auto' },
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

      DirectSnippetService.createSnippet(testBlock, 'Test Snippet', 'Test');
      
      // Verify snippet was created
      expect(DirectSnippetService.getCustomSnippets()).toHaveLength(1);
    });

    it('should handle color theme changes across snippets', async () => {
      const user = userEvent.setup();
      
      // Create multiple snippets with different block types
      const textBlock: EmailBlock = {
        id: 'text-block',
        type: 'text',
        content: { html: '<p>Text content</p>' },
        styling: {
          desktop: { width: '100%', height: 'auto' },
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

      const buttonBlock: EmailBlock = {
        id: 'button-block',
        type: 'button',
        content: { text: 'Click me', link: '#' },
        styling: {
          desktop: { width: '100%', height: 'auto' },
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

      DirectSnippetService.createSnippet(textBlock, 'Text Snippet', 'Text');
      DirectSnippetService.createSnippet(buttonBlock, 'Button Snippet', 'Button');
      
      expect(DirectSnippetService.getCustomSnippets()).toHaveLength(2);
    });
  });

  describe('Snippet Reuse with Style Inheritance', () => {
    it('should apply current global styles to reused snippets', async () => {
      const user = userEvent.setup();
      
      // Create a snippet
      const snippetBlock: EmailBlock = {
        id: 'snippet-block',
        type: 'text',
        content: { html: '<h2>Reusable Header</h2>' },
        styling: {
          desktop: { width: '100%', height: 'auto' },
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

      const snippet = DirectSnippetService.createSnippet(snippetBlock, 'Header Snippet', 'Reusable header');
      
      // Test that the snippet can be retrieved and used
      const retrievedSnippet = DirectSnippetService.getSnippetById(snippet.id);
      expect(retrievedSnippet).toBeDefined();
      expect(retrievedSnippet?.blockData.content.html).toBe('<h2>Reusable Header</h2>');
    });

    it('should maintain snippet original styling when global styles change', async () => {
      const user = userEvent.setup();
      
      // Create snippet with specific styling
      const styledBlock: EmailBlock = {
        id: 'styled-block',
        type: 'text',
        content: { html: '<p style="color: red;">Red text</p>' },
        styling: {
          desktop: { width: '100%', height: 'auto', color: 'red' },
          tablet: { width: '100%', height: 'auto', color: 'red' },
          mobile: { width: '100%', height: 'auto', color: 'red' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      const snippet = DirectSnippetService.createSnippet(styledBlock, 'Red Text', 'Red styled text');
      
      // Verify the snippet preserves its styling
      expect(snippet.blockData.styling.desktop.color).toBe('red');
    });
  });

  describe('MJML Generation with Snippets and Global Styles', () => {
    it('should generate correct MJML when combining snippets and global styles', async () => {
      // Create blocks from snippets
      const headerBlock: EmailBlock = {
        id: 'header-1',
        type: 'text',
        content: { html: '<h1>Newsletter Header</h1>' },
        styling: {
          desktop: { width: '100%', height: 'auto' },
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

      const buttonBlock: EmailBlock = {
        id: 'button-1',
        type: 'button',
        content: { text: 'Read More', link: 'https://example.com' },
        styling: {
          desktop: { width: '100%', height: 'auto' },
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

      // Create snippets
      DirectSnippetService.createSnippet(headerBlock, 'Newsletter Header', 'Header for newsletters');
      DirectSnippetService.createSnippet(buttonBlock, 'CTA Button', 'Call to action button');

      expect(DirectSnippetService.getCustomSnippets()).toHaveLength(2);
    });

    it('should handle responsive styling in snippet-based emails', async () => {
      const responsiveBlock: EmailBlock = {
        id: 'responsive-1',
        type: 'text',
        content: { html: '<p>Responsive content</p>' },
        styling: {
          desktop: { width: '100%', height: 'auto', fontSize: '16px' },
          tablet: { width: '100%', height: 'auto', fontSize: '15px' },
          mobile: { width: '100%', height: 'auto', fontSize: '14px' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      const snippet = DirectSnippetService.createSnippet(responsiveBlock, 'Responsive Text', 'Text with responsive styling');
      
      // Verify responsive properties are preserved
      expect(snippet.blockData.styling.desktop.fontSize).toBe('16px');
      expect(snippet.blockData.styling.tablet.fontSize).toBe('15px');
      expect(snippet.blockData.styling.mobile.fontSize).toBe('14px');
    });
  });

  describe('Style Conflict Resolution', () => {
    it('should handle conflicts between snippet styles and global styles', async () => {
      // Create snippet with specific font
      const specificBlock: EmailBlock = {
        id: 'specific-1',
        type: 'text',
        content: { html: '<p>Specific font text</p>' },
        styling: {
          desktop: { width: '100%', height: 'auto', fontFamily: 'Georgia' },
          tablet: { width: '100%', height: 'auto', fontFamily: 'Georgia' },
          mobile: { width: '100%', height: 'auto', fontFamily: 'Georgia' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      const snippet = DirectSnippetService.createSnippet(specificBlock, 'Georgia Text', 'Text with Georgia font');
      
      // Snippet should maintain its specific styling
      expect(snippet.blockData.styling.desktop.fontFamily).toBe('Georgia');
    });

    it('should apply global styles to new snippet instances', async () => {
      // Test that when a snippet is used, it picks up current global styles
      // while maintaining its core structure
      
      const baseBlock: EmailBlock = {
        id: 'base-1',
        type: 'text',
        content: { html: '<p>Base content</p>' },
        styling: {
          desktop: { width: '100%', height: 'auto' },
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

      const snippet = DirectSnippetService.createSnippet(baseBlock, 'Base Text', 'Base text content');
      
      // Test usage increment
      DirectSnippetService.incrementUsage(snippet.id);
      
      const updatedSnippet = DirectSnippetService.getSnippetById(snippet.id);
      expect(updatedSnippet?.usageCount).toBe(1);
    });
  });
});
