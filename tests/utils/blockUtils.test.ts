
import { describe, it, expect, beforeEach } from 'vitest';
import { generateUniqueId, createDefaultBlockStyling } from '@/utils/blockUtils';

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

    it('should apply specific styles for text blocks', () => {
      const styling = createDefaultBlockStyling('text');
      
      expect(styling.desktop.padding).toBe('12px');
      expect(styling.desktop.margin).toBe('8px 0');
      expect(styling.desktop.borderRadius).toBe('4px');
    });

    it('should apply specific styles for button blocks', () => {
      const styling = createDefaultBlockStyling('button');
      
      expect(styling.desktop.textAlign).toBe('center');
      expect(styling.desktop.padding).toBe('16px');
    });

    it('should apply specific styles for image blocks', () => {
      const styling = createDefaultBlockStyling('image');
      
      expect(styling.desktop.textAlign).toBe('center');
      expect(styling.desktop.padding).toBe('16px');
    });

    it('should return base styles for unknown block types', () => {
      const styling = createDefaultBlockStyling('unknown');
      
      expect(styling.desktop.width).toBe('100%');
      expect(styling.desktop.height).toBe('auto');
      expect(styling.tablet.width).toBe('100%');
      expect(styling.mobile.width).toBe('100%');
    });
  });
});
