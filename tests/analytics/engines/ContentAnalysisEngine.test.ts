
import { ContentAnalysisEngine } from '../../../src/analytics/engines/ContentAnalysisEngine';
import { EmailContent } from '../../../src/analytics/core/interfaces';

describe('ContentAnalysisEngine', () => {
  const sampleEmailContent: EmailContent = {
    html: `
      <div class="email-container">
        <h1>Welcome to Our Service</h1>
        <p>Thank you for joining us. We're excited to have you on board.</p>
        <img src="logo.png" alt="Company Logo" />
        <img src="hero.jpg" alt="Hero Image" />
        <a href="https://example.com" class="button">Get Started</a>
        <a href="https://example.com/learn">Learn More</a>
        <button class="cta-button">Subscribe Now</button>
        <p>Contact us at <a href="mailto:support@example.com">support@example.com</a></p>
      </div>
    `,
    subjectLine: 'Welcome to Our Amazing Service - Get Started Today!',
    previewText: 'Thank you for joining us. We are excited to have you on board and can\'t wait to show you...'
  };

  const emptyEmailContent: EmailContent = {
    html: '',
    subjectLine: '',
    previewText: ''
  };

  const malformedEmailContent: EmailContent = {
    html: '<div><p>Unclosed paragraph<img src="broken.jpg"><a href="incomplete',
    subjectLine: 'Test Subject',
    previewText: 'Test preview'
  };

  describe('analyzeContent', () => {
    it('should analyze email content metrics correctly', () => {
      const metrics = ContentAnalysisEngine.analyzeContent(sampleEmailContent);

      expect(metrics.sizeKB).toBeGreaterThan(0);
      expect(metrics.wordCount).toBeGreaterThan(0);
      expect(metrics.characterCount).toBeGreaterThan(0);
      expect(metrics.imageCount).toBe(2);
      expect(metrics.linkCount).toBe(3);
      expect(metrics.ctaCount).toBeGreaterThanOrEqual(1);
      expect(metrics.subjectLineLength).toBe(52);
      expect(metrics.previewTextLength).toBeGreaterThan(0);
    });

    it('should count images, links, and CTAs accurately', () => {
      const metrics = ContentAnalysisEngine.analyzeContent(sampleEmailContent);

      // Verify specific counts
      expect(metrics.imageCount).toBe(2); // Two img tags
      expect(metrics.linkCount).toBe(3); // Three anchor tags with href
      expect(metrics.ctaCount).toBeGreaterThanOrEqual(2); // Button elements + CTA-like links
    });

    it('should calculate email size in KB', () => {
      const metrics = ContentAnalysisEngine.analyzeContent(sampleEmailContent);
      
      expect(metrics.sizeKB).toBeGreaterThan(0);
      expect(typeof metrics.sizeKB).toBe('number');
      expect(metrics.sizeKB).toBe(Math.round((new Blob([sampleEmailContent.html]).size) / 1024 * 100) / 100);
    });

    it('should extract word and character counts', () => {
      const metrics = ContentAnalysisEngine.analyzeContent(sampleEmailContent);
      
      expect(metrics.wordCount).toBeGreaterThan(10);
      expect(metrics.characterCount).toBeGreaterThan(50);
      expect(metrics.wordCount).toBeLessThan(metrics.characterCount);
    });

    it('should handle empty or malformed HTML', () => {
      const emptyMetrics = ContentAnalysisEngine.analyzeContent(emptyEmailContent);
      expect(emptyMetrics.wordCount).toBe(0);
      expect(emptyMetrics.imageCount).toBe(0);
      expect(emptyMetrics.linkCount).toBe(0);

      const malformedMetrics = ContentAnalysisEngine.analyzeContent(malformedEmailContent);
      expect(malformedMetrics.wordCount).toBeGreaterThan(0);
      expect(malformedMetrics.imageCount).toBeGreaterThanOrEqual(0);
    });

    it('should handle content with special characters and encoding', () => {
      const specialContent: EmailContent = {
        html: '<p>Special chars: émojis 🎉, symbols ©®™, and unicode ñáéíóú</p>',
        subjectLine: 'Special Characters Test ✨',
        previewText: 'Testing special chars'
      };

      const metrics = ContentAnalysisEngine.analyzeContent(specialContent);
      expect(metrics.wordCount).toBeGreaterThan(0);
      expect(metrics.characterCount).toBeGreaterThan(0);
      expect(metrics.subjectLineLength).toBeGreaterThan(20);
    });

    it('should handle very large content efficiently', () => {
      const largeContent = '<p>' + 'Large content '.repeat(1000) + '</p>';
      const largeEmail: EmailContent = {
        html: largeContent,
        subjectLine: 'Large Content Test',
        previewText: 'Testing large content'
      };

      const startTime = Date.now();
      const metrics = ContentAnalysisEngine.analyzeContent(largeEmail);
      const processingTime = Date.now() - startTime;

      expect(processingTime).toBeLessThan(1000); // Should process in under 1 second
      expect(metrics.wordCount).toBeGreaterThan(1000);
      expect(metrics.sizeKB).toBeGreaterThan(10);
    });
  });

  describe('generateBasicSuggestions', () => {
    it('should generate basic performance suggestions', () => {
      const metrics = ContentAnalysisEngine.analyzeContent(sampleEmailContent);
      const suggestions = ContentAnalysisEngine.generateBasicSuggestions(metrics, sampleEmailContent);

      expect(Array.isArray(suggestions)).toBe(true);
      suggestions.forEach(suggestion => {
        expect(suggestion).toHaveProperty('id');
        expect(suggestion).toHaveProperty('type');
        expect(suggestion).toHaveProperty('severity');
        expect(suggestion).toHaveProperty('title');
        expect(suggestion).toHaveProperty('description');
        expect(suggestion).toHaveProperty('recommendation');
        expect(suggestion).toHaveProperty('confidence');
        expect(suggestion).toHaveProperty('estimatedImpact');
        expect(suggestion.confidence).toBeGreaterThan(0);
        expect(suggestion.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should detect subject line length issues', () => {
      const longSubjectContent: EmailContent = {
        ...sampleEmailContent,
        subjectLine: 'This is a very long subject line that exceeds the recommended character limit for mobile devices and email clients'
      };

      const metrics = ContentAnalysisEngine.analyzeContent(longSubjectContent);
      const suggestions = ContentAnalysisEngine.generateBasicSuggestions(metrics, longSubjectContent);

      const subjectSuggestion = suggestions.find(s => s.id === 'subject-length');
      expect(subjectSuggestion).toBeDefined();
      expect(subjectSuggestion?.severity).toBe('medium');
    });

    it('should identify missing CTAs', () => {
      const noCTAContent: EmailContent = {
        html: '<p>Just some text without any call to action</p>',
        subjectLine: 'No CTA Email',
        previewText: 'Just text'
      };

      const metrics = ContentAnalysisEngine.analyzeContent(noCTAContent);
      const suggestions = ContentAnalysisEngine.generateBasicSuggestions(metrics, noCTAContent);

      const ctaSuggestion = suggestions.find(s => s.id === 'no-cta');
      expect(ctaSuggestion).toBeDefined();
      expect(ctaSuggestion?.severity).toBe('high');
      expect(ctaSuggestion?.estimatedImpact).toBe(0.3);
    });

    it('should detect too many images', () => {
      const manyImagesContent: EmailContent = {
        html: Array.from({length: 8}, (_, i) => `<img src="image${i}.jpg" alt="Image ${i}" />`).join(''),
        subjectLine: 'Many Images Email',
        previewText: 'Testing many images'
      };

      const metrics = ContentAnalysisEngine.analyzeContent(manyImagesContent);
      const suggestions = ContentAnalysisEngine.generateBasicSuggestions(metrics, manyImagesContent);

      const imageSuggestion = suggestions.find(s => s.id === 'too-many-images');
      expect(imageSuggestion).toBeDefined();
      expect(imageSuggestion?.type).toBe('performance');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle HTML with nested structures', () => {
      const nestedContent: EmailContent = {
        html: `
          <div>
            <table>
              <tr><td><div><p>Nested <a href="#">link</a></p></div></td></tr>
            </table>
            <div class="container">
              <div class="row">
                <div class="col"><button>CTA</button></div>
              </div>
            </div>
          </div>
        `,
        subjectLine: 'Nested Structure Test',
        previewText: 'Testing nested HTML'
      };

      const metrics = ContentAnalysisEngine.analyzeContent(nestedContent);
      expect(metrics.wordCount).toBeGreaterThan(0);
      expect(metrics.linkCount).toBe(1);
      expect(metrics.ctaCount).toBeGreaterThanOrEqual(1);
    });

    it('should handle content with no preview text', () => {
      const noPreviewContent: EmailContent = {
        html: '<p>Content without preview text</p>',
        subjectLine: 'No Preview Test'
      };

      const metrics = ContentAnalysisEngine.analyzeContent(noPreviewContent);
      expect(metrics.previewTextLength).toBeGreaterThan(0); // Should extract from content
    });

    it('should validate metrics ranges', () => {
      const metrics = ContentAnalysisEngine.analyzeContent(sampleEmailContent);
      
      expect(metrics.sizeKB).toBeGreaterThanOrEqual(0);
      expect(metrics.wordCount).toBeGreaterThanOrEqual(0);
      expect(metrics.characterCount).toBeGreaterThanOrEqual(0);
      expect(metrics.imageCount).toBeGreaterThanOrEqual(0);
      expect(metrics.linkCount).toBeGreaterThanOrEqual(0);
      expect(metrics.ctaCount).toBeGreaterThanOrEqual(0);
      expect(metrics.subjectLineLength).toBeGreaterThanOrEqual(0);
      expect(metrics.previewTextLength).toBeGreaterThanOrEqual(0);
    });
  });
});
