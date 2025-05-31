
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
      expect(block.displayOptions).toBeDefined();
    });

    it('should create an image block with placeholder', () => {
      const block = createBlock('image');
      
      expect(block.type).toBe('image');
      expect(block.content.src).toContain('placeholder');
      expect(block.content.alt).toBe('Image description');
      expect(block.content.alignment).toBe('center');
    });

    it('should create a button block with default styling', () => {
      const block = createBlock('button');
      
      expect(block.type).toBe('button');
      expect(block.content.text).toBe('Click Here');
      expect(block.content.link).toBe('#');
      expect(block.content.style).toBe('solid');
      expect(block.content.size).toBe('medium');
    });

    it('should create a columns block with specified ratio', () => {
      const block = createBlock('columns', '50-50');
      
      expect(block.type).toBe('columns');
      expect(block.content.columnCount).toBe(2);
      expect(block.content.columnRatio).toBe('50-50');
      expect(block.content.columns).toHaveLength(2);
      expect(block.content.columns[0].width).toBe('50%');
      expect(block.content.columns[1].width).toBe('50%');
    });

    it('should throw error for unknown block type', () => {
      expect(() => createBlock('unknown')).toThrow('Unknown block type: unknown');
    });
  });
});
