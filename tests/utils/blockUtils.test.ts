
import { describe, it, expect, beforeEach } from 'vitest';
import { generateUniqueId, createDefaultBlockStyling, createEmailBlock } from '@/utils/blockUtils';

describe('blockUtils', () => {
  describe('generateUniqueId', () => {
    it('should generate a unique ID with correct format', () => {
      const id = generateUniqueId();
      expect(id).toMatch(/^block-\d+-[a-z0-9]{9}$/);
    });

    it('should generate different IDs on multiple calls', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('createDefaultBlockStyling', () => {
    it('should create default styling with all device types', () => {
      const styling = createDefaultBlockStyling('text');
      
      expect(styling).toHaveProperty('desktop');
      expect(styling).toHaveProperty('tablet');
      expect(styling).toHaveProperty('mobile');
    });

    it('should have consistent default values across devices', () => {
      const styling = createDefaultBlockStyling('text');
      
      expect(styling.desktop.width).toBe('100%');
      expect(styling.tablet.width).toBe('100%');
      expect(styling.mobile.width).toBe('100%');
    });
  });

  describe('createEmailBlock', () => {
    it('should create a text block with default properties', () => {
      const block = createEmailBlock('text');
      
      expect(block.type).toBe('text');
      expect(block.id).toBeDefined();
      expect(block.content).toHaveProperty('html');
    });

    it('should create an image block with default properties', () => {
      const block = createEmailBlock('image');
      
      expect(block.type).toBe('image');
      expect(block.content).toHaveProperty('src');
      expect(block.content).toHaveProperty('alt');
    });
  });
});
