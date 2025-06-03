
import { describe, it, expect } from 'vitest';
import { MJMLService } from '@/services/mjmlService';
import { EmailBlock, TextBlock, ImageBlock, ButtonBlock } from '@/types/emailBlocks';

describe('MJMLService', () => {
  describe('generateMJML', () => {
    it('should generate valid MJML for empty email', () => {
      const mjml = MJMLService.generateMJML([], 'Test Subject');
      
      expect(mjml).toContain('<mjml>');
      expect(mjml).toContain('<mj-head>');
      expect(mjml).toContain('<mj-title>Test Subject</mj-title>');
      expect(mjml).toContain('<mj-body>');
      expect(mjml).toContain('</mjml>');
    });

    it('should generate MJML for text block', () => {
      const textBlock: TextBlock = {
        id: 'text-1',
        type: 'text',
        content: {
          html: '<p>Hello World</p>',
          textStyle: 'normal'
        },
        styling: {
          desktop: { fontSize: '16px', color: '#333333' },
          tablet: { fontSize: '14px', color: '#333333' },
          mobile: { fontSize: '14px', color: '#333333' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      const mjml = MJMLService.generateMJML([textBlock], 'Test');
      
      expect(mjml).toContain('<mj-text');
      expect(mjml).toContain('Hello World');
      expect(mjml).toContain('font-size:16px');
      expect(mjml).toContain('color:#333333');
    });

    it('should generate MJML for image block', () => {
      const imageBlock: ImageBlock = {
        id: 'image-1',
        type: 'image',
        content: {
          src: 'https://example.com/image.jpg',
          alt: 'Test image',
          title: 'Sample'
        },
        styling: {
          desktop: { width: '300px' },
          tablet: { width: '250px' },
          mobile: { width: '100%' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      const mjml = MJMLService.generateMJML([imageBlock], 'Test');
      
      expect(mjml).toContain('<mj-image');
      expect(mjml).toContain('src="https://example.com/image.jpg"');
      expect(mjml).toContain('alt="Test image"');
      expect(mjml).toContain('width="300px"');
    });

    it('should generate MJML for button block', () => {
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
            borderRadius: '4px'
          },
          tablet: { 
            backgroundColor: '#007bff',
            color: '#ffffff',
            borderRadius: '4px'
          },
          mobile: { 
            backgroundColor: '#007bff',
            color: '#ffffff',
            borderRadius: '4px'
          }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      const mjml = MJMLService.generateMJML([buttonBlock], 'Test');
      
      expect(mjml).toContain('<mj-button');
      expect(mjml).toContain('href="https://example.com"');
      expect(mjml).toContain('background-color:#007bff');
      expect(mjml).toContain('color:#ffffff');
      expect(mjml).toContain('Click Me');
    });

    it('should handle responsive styling correctly', () => {
      const textBlock: TextBlock = {
        id: 'text-1',
        type: 'text',
        content: { html: '<p>Test</p>', textStyle: 'normal' },
        styling: {
          desktop: { fontSize: '18px', padding: '20px' },
          tablet: { fontSize: '16px', padding: '15px' },
          mobile: { fontSize: '14px', padding: '10px' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      const mjml = MJMLService.generateMJML([textBlock], 'Test');
      
      expect(mjml).toContain('font-size:18px');
      expect(mjml).toContain('padding:20px');
      expect(mjml).toContain('@media');
    });
  });

  describe('convertToHTML', () => {
    it('should convert simple MJML to HTML', async () => {
      const simpleMJML = `
        <mjml>
          <mj-head>
            <mj-title>Test</mj-title>
          </mj-head>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Hello World</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;

      const result = await MJMLService.convertToHTML(simpleMJML);
      
      expect(result.html).toContain('Hello World');
      expect(result.html).toContain('<!doctype html>');
      expect(result.errors).toHaveLength(0);
    });

    it('should handle MJML conversion errors', async () => {
      const invalidMJML = '<mjml><invalid-tag>content</invalid-tag></mjml>';
      
      const result = await MJMLService.convertToHTML(invalidMJML);
      
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateMJML', () => {
    it('should validate correct MJML structure', () => {
      const validMJML = `
        <mjml>
          <mj-head><mj-title>Test</mj-title></mj-head>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Content</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;

      const result = MJMLService.validateMJML(validMJML);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid MJML structure', () => {
      const invalidMJML = '<mjml><mj-body><invalid-tag>test</invalid-tag></mj-body></mjml>';
      
      const result = MJMLService.validateMJML(invalidMJML);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
