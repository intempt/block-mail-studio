
import { describe, it, expect } from 'vitest';
import { EmailCompatibilityProcessor } from '@/services/emailCompatibilityProcessor';

describe('EmailCompatibilityProcessor', () => {
  describe('processEmailForGmail', () => {
    it('should strip unsupported elements', () => {
      const html = '<div><script>alert("test")</script><p>Content</p></div>';
      const result = EmailCompatibilityProcessor.processEmailForGmail(html, {
        stripUnsupportedElements: true,
        inlineStyles: false,
        processImages: false,
        darkModeSupport: false
      });

      expect(result).not.toContain('<script>');
      expect(result).toContain('<p>Content</p>');
    });

    it('should convert classes to inline styles', () => {
      const html = '<p class="text-center">Content</p>';
      const result = EmailCompatibilityProcessor.processEmailForGmail(html, {
        stripUnsupportedElements: false,
        inlineStyles: true,
        processImages: false,
        darkModeSupport: false
      });

      expect(result).toContain('style="text-align: center;"');
    });

    it('should process images for Gmail compatibility', () => {
      const html = '<img src="test.jpg">';
      const result = EmailCompatibilityProcessor.processEmailForGmail(html, {
        stripUnsupportedElements: false,
        inlineStyles: false,
        processImages: true,
        darkModeSupport: false
      });

      expect(result).toContain('style="display: block; max-width: 100%; height: auto;"');
      expect(result).toContain('alt=""');
    });

    it('should add dark mode support', () => {
      const html = '<html><head></head><body><p>Content</p></body></html>';
      const result = EmailCompatibilityProcessor.processEmailForGmail(html, {
        stripUnsupportedElements: false,
        inlineStyles: false,
        processImages: false,
        darkModeSupport: true
      });

      expect(result).toContain('color-scheme');
      expect(result).toContain('supported-color-schemes');
      expect(result).toContain('@media (prefers-color-scheme: dark)');
    });
  });

  describe('getGmailPreviewSize', () => {
    it('should return correct desktop dimensions', () => {
      const size = EmailCompatibilityProcessor.getGmailPreviewSize('desktop');
      expect(size).toEqual({ width: 640, height: 480 });
    });

    it('should return correct mobile dimensions', () => {
      const size = EmailCompatibilityProcessor.getGmailPreviewSize('mobile');
      expect(size).toEqual({ width: 375, height: 667 });
    });
  });
});
