
import { describe, it, expect } from 'vitest';
import { generateUniqueId, createEmailHTML, stripTiptapAttributes } from '@/utils/emailUtils';

describe('emailUtils', () => {
  describe('generateUniqueId', () => {
    it('should generate a unique ID', () => {
      const id = generateUniqueId();
      expect(id).toMatch(/^block-\d+-[a-z0-9]{9}$/);
    });
  });

  describe('createEmailHTML', () => {
    it('should wrap content in a complete HTML document', () => {
      const content = '<div>Test content</div>';
      const html = createEmailHTML(content);
      
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain(content);
    });

    it('should include email-specific CSS styles', () => {
      const html = createEmailHTML('<div>Test</div>');
      
      expect(html).toContain('email-container');
      expect(html).toContain('max-width: 600px');
      expect(html).toContain('-webkit-text-size-adjust');
    });
  });

  describe('stripTiptapAttributes', () => {
    it('should remove TipTap-specific attributes', () => {
      const htmlWithTiptap = '<div data-pm-slice="test" class="ProseMirror" contenteditable="true" spellcheck="false">Content</div>';
      const cleaned = stripTiptapAttributes(htmlWithTiptap);
      
      expect(cleaned).not.toContain('data-pm-slice');
      expect(cleaned).not.toContain('class="ProseMirror');
      expect(cleaned).not.toContain('contenteditable');
      expect(cleaned).not.toContain('spellcheck');
      expect(cleaned).toContain('Content');
    });
  });
});
