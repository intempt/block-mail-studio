
import { describe, it, expect } from 'vitest';
import { createBlock } from '@/utils/blockFactory';

describe('blockFactory', () => {
  describe('createBlock', () => {
    it('should create a text block with default content', () => {
      const block = createBlock('text');
      
      expect(block.type).toBe('text');
      expect(block.id).toMatch(/^block-\d+-[a-z0-9]{9}$/);
      expect(block.content.html).toBe('<p>Add your text content here...</p>');
      expect(block.styling).toBeDefined();
      expect(block.styling.desktop).toBeDefined();
      expect(block.styling.tablet).toBeDefined();
      expect(block.styling.mobile).toBeDefined();
      expect(block.displayOptions).toBeDefined();
      expect(block.position).toBeDefined();
    });

    it('should create an image block with placeholder', () => {
      const block = createBlock('image');
      
      expect(block.type).toBe('image');
      expect(block.content).toBeDefined();
      
      // Check for either src or placeholder property
      const hasImageSource = block.content.src || block.content.placeholder;
      expect(hasImageSource).toBeTruthy();
      
      expect(block.content.alt).toBeDefined();
      expect(block.content.alignment).toBeDefined();
      expect(block.styling).toBeDefined();
    });

    it('should create a button block with default styling', () => {
      const block = createBlock('button');
      
      expect(block.type).toBe('button');
      expect(block.content.text).toBeDefined();
      expect(block.content.link).toBeDefined();
      expect(block.content.style).toBeDefined();
      expect(block.content.size).toBeDefined();
      expect(block.styling).toBeDefined();
    });

    it('should create a columns block with specified ratio', () => {
      const block = createBlock('columns', '50-50');
      
      expect(block.type).toBe('columns');
      expect(block.content.columnCount).toBe(2);
      expect(block.content.columnRatio).toBe('50-50');
      expect(block.content.columns).toHaveLength(2);
      expect(block.content.columns[0]).toBeDefined();
      expect(block.content.columns[1]).toBeDefined();
    });

    it('should create a spacer block with default height', () => {
      const block = createBlock('spacer');
      
      expect(block.type).toBe('spacer');
      expect(block.content.height).toBeDefined();
      expect(typeof block.content.height).toBe('string');
    });

    it('should create a divider block with default styling', () => {
      const block = createBlock('divider');
      
      expect(block.type).toBe('divider');
      expect(block.content).toBeDefined();
      expect(block.styling).toBeDefined();
    });

    it('should throw error for unknown block type', () => {
      expect(() => createBlock('unknown')).toThrow('Unknown block type: unknown');
    });

    it('should generate unique IDs for multiple blocks', () => {
      const block1 = createBlock('text');
      const block2 = createBlock('text');
      
      expect(block1.id).not.toBe(block2.id);
    });

    it('should create blocks with proper styling structure', () => {
      const block = createBlock('text');
      
      expect(block.styling.desktop).toMatchObject({
        width: expect.any(String),
        height: expect.any(String),
        backgroundColor: expect.any(String),
        padding: expect.any(String),
        margin: expect.any(String)
      });
    });
  });
});
