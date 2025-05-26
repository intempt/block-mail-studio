
import { describe, it, expect } from 'vitest';
import { generateUniqueId, createMJMLTemplate, compileMJMLToHTML } from '@/utils/emailUtils';

describe('emailUtils', () => {
  describe('generateUniqueId', () => {
    it('should generate a unique ID', () => {
      const id = generateUniqueId();
      expect(id).toMatch(/^block-\d+-[a-z0-9]{9}$/);
    });
  });

  describe('createMJMLTemplate', () => {
    it('should wrap content in a complete MJML document', () => {
      const content = '<mj-text>Test content</mj-text>';
      const mjml = createMJMLTemplate(content);
      
      expect(mjml).toContain('<mjml>');
      expect(mjml).toContain('<mj-head>');
      expect(mjml).toContain('<mj-body>');
      expect(mjml).toContain(content);
    });

    it('should include email-specific MJML attributes', () => {
      const mjml = createMJMLTemplate('<mj-text>Test</mj-text>');
      
      expect(mjml).toContain('mj-attributes');
      expect(mjml).toContain('font-family="Arial, sans-serif"');
      expect(mjml).toContain('background-color="#f8fafc"');
    });
  });

  describe('compileMJMLToHTML', () => {
    it('should compile valid MJML to HTML', () => {
      const mjml = `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Hello World</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;
      
      const html = compileMJMLToHTML(mjml);
      
      expect(html).toContain('<!doctype html>');
      expect(html).toContain('Hello World');
      expect(html).toContain('<table');
    });
  });
});
