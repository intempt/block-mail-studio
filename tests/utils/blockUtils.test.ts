
import { describe, it, expect, beforeEach } from 'vitest';
import { generateUniqueId, createDefaultStyling } from '@/utils/blockUtils';

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

  describe('createDefaultStyling', () => {
    it('should create default styling with all device types', () => {
      const styling = createDefaultStyling();
      
      expect(styling).toHaveProperty('desktop');
      expect(styling).toHaveProperty('tablet');
      expect(styling).toHaveProperty('mobile');
    });

    it('should have consistent default values across devices', () => {
      const styling = createDefaultStyling();
      
      expect(styling.desktop.width).toBe('100%');
      expect(styling.tablet.width).toBe('100%');
      expect(styling.mobile.width).toBe('100%');
      
      expect(styling.desktop.backgroundColor).toBe('#ffffff');
      expect(styling.tablet.backgroundColor).toBe('#ffffff');
      expect(styling.mobile.backgroundColor).toBe('#ffffff');
    });
  });
});
