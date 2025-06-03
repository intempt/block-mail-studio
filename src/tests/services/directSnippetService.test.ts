
import { describe, it, expect, beforeEach } from 'vitest';
import { DirectSnippetService } from '@/services/directSnippetService';
import { EmailBlock } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';

describe('DirectSnippetService', () => {
  beforeEach(() => {
    // Clear all custom snippets before each test
    DirectSnippetService.clearCustomSnippets();
  });

  describe('Snippet Creation', () => {
    it('should create snippet from EmailBlock with auto-generated ID', () => {
      const block: EmailBlock = {
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

      const snippet = DirectSnippetService.createSnippet(block, 'Test Snippet', 'A test snippet');
      
      expect(snippet.id).toMatch(/^snippet_\d+_[a-z0-9]+$/);
      expect(snippet.name).toBe('Test Snippet');
      expect(snippet.description).toBe('A test snippet');
      expect(snippet.category).toBe('custom');
      expect(snippet.blockType).toBe('text');
      expect(snippet.usageCount).toBe(0);
    });

    it('should use default name from block type when name not provided', () => {
      const block: EmailBlock = {
        id: 'test-block',
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

      const snippet = DirectSnippetService.createSnippet(block, '', '');
      
      expect(snippet.name).toBe('button snippet');
      expect(snippet.description).toBe('Saved button block');
    });

    it('should notify listeners when snippet is created', () => {
      const listener = vi.fn();
      DirectSnippetService.addChangeListener(listener);

      const block: EmailBlock = {
        id: 'test-block',
        type: 'image',
        content: { src: 'test.jpg', alt: 'Test image' },
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

      DirectSnippetService.createSnippet(block, 'Image Snippet', 'Test image');
      
      expect(listener).toHaveBeenCalled();
      
      DirectSnippetService.removeChangeListener(listener);
    });
  });

  describe('Snippet Management', () => {
    it('should delete snippet and notify listeners', () => {
      const block: EmailBlock = {
        id: 'test-block',
        type: 'text',
        content: { html: '<p>Test</p>' },
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

      const snippet = DirectSnippetService.createSnippet(block, 'Test', 'Test');
      const listener = vi.fn();
      DirectSnippetService.addChangeListener(listener);

      DirectSnippetService.deleteSnippet(snippet.id);
      
      expect(DirectSnippetService.getCustomSnippets()).toHaveLength(0);
      expect(listener).toHaveBeenCalled();
      
      DirectSnippetService.removeChangeListener(listener);
    });

    it('should update snippet name and timestamp', () => {
      const block: EmailBlock = {
        id: 'test-block',
        type: 'text',
        content: { html: '<p>Test</p>' },
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

      const snippet = DirectSnippetService.createSnippet(block, 'Original Name', 'Test');
      const originalUpdated = snippet.updatedAt;

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        DirectSnippetService.updateSnippetName(snippet.id, 'New Name');
        
        const updatedSnippet = DirectSnippetService.getSnippetById(snippet.id);
        expect(updatedSnippet?.name).toBe('New Name');
        expect(updatedSnippet?.updatedAt).not.toEqual(originalUpdated);
      }, 10);
    });

    it('should increment usage count', () => {
      const block: EmailBlock = {
        id: 'test-block',
        type: 'text',
        content: { html: '<p>Test</p>' },
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

      const snippet = DirectSnippetService.createSnippet(block, 'Test', 'Test');
      
      DirectSnippetService.incrementUsage(snippet.id);
      DirectSnippetService.incrementUsage(snippet.id);
      
      const updatedSnippet = DirectSnippetService.getSnippetById(snippet.id);
      expect(updatedSnippet?.usageCount).toBe(2);
    });
  });

  describe('Snippet Retrieval', () => {
    it('should return all snippets including defaults and custom', () => {
      const block: EmailBlock = {
        id: 'test-block',
        type: 'text',
        content: { html: '<p>Test</p>' },
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

      DirectSnippetService.createSnippet(block, 'Custom Snippet', 'Test');
      
      const allSnippets = DirectSnippetService.getAllSnippets();
      const defaultSnippets = DirectSnippetService.getDefaultSnippets();
      const customSnippets = DirectSnippetService.getCustomSnippets();
      
      expect(allSnippets.length).toBe(defaultSnippets.length + customSnippets.length);
      expect(customSnippets).toHaveLength(1);
    });

    it('should return empty array when no custom snippets exist', () => {
      const customSnippets = DirectSnippetService.getCustomSnippets();
      expect(customSnippets).toHaveLength(0);
    });

    it('should find snippet by ID', () => {
      const block: EmailBlock = {
        id: 'test-block',
        type: 'text',
        content: { html: '<p>Test</p>' },
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

      const snippet = DirectSnippetService.createSnippet(block, 'Test', 'Test');
      const foundSnippet = DirectSnippetService.getSnippetById(snippet.id);
      
      expect(foundSnippet).toBeDefined();
      expect(foundSnippet?.id).toBe(snippet.id);
    });
  });

  describe('Listener Management', () => {
    it('should add and remove listeners correctly', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      DirectSnippetService.addChangeListener(listener1);
      DirectSnippetService.addChangeListener(listener2);
      
      const block: EmailBlock = {
        id: 'test-block',
        type: 'text',
        content: { html: '<p>Test</p>' },
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

      DirectSnippetService.createSnippet(block, 'Test', 'Test');
      
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      
      // Reset mocks
      listener1.mockClear();
      listener2.mockClear();
      
      // Remove one listener
      DirectSnippetService.removeChangeListener(listener1);
      
      DirectSnippetService.createSnippet(block, 'Test 2', 'Test 2');
      
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      
      DirectSnippetService.removeChangeListener(listener2);
    });
  });
});
