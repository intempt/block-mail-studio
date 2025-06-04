
import { HeuristicAnalysisEngine } from '../../../src/analytics/engines/HeuristicAnalysisEngine';
import { EmailContent } from '../../../src/analytics/core/interfaces';

describe('HeuristicAnalysisEngine', () => {
  let engine: HeuristicAnalysisEngine;

  beforeEach(() => {
    engine = new HeuristicAnalysisEngine();
  });

  const goodEmailContent: EmailContent = {
    html: `
      <div class="email-container" style="max-width: 100%;">
        <h1>Welcome to Our Service</h1>
        <p>Thank you for joining us. We're excited to have you on board.</p>
        <img src="logo.png" alt="Company Logo" style="max-width: 100%;" />
        <a href="https://example.com" class="button">Get Started</a>
        <p>Best regards, The Team</p>
        <style>@media (max-width: 600px) { .button { width: 100% !important; } }</style>
      </div>
    `,
    subjectLine: 'Welcome to Our Service',
    previewText: 'Thank you for joining us'
  };

  const spamyEmailContent: EmailContent = {
    html: `
      <div>
        <h1>FREE URGENT OFFER - ACT NOW!</h1>
        <p>LIMITED TIME! Click here immediately!</p>
        <img src="ad1.jpg" />
        <img src="ad2.jpg" />
        <img src="ad3.jpg" />
        <img src="ad4.jpg" />
        <img src="ad5.jpg" />
        <img src="ad6.jpg" />
        <a href="spam.com">CLICK HERE NOW!</a>
      </div>
    `,
    subjectLine: 'FREE URGENT LIMITED TIME OFFER!!!',
    previewText: 'Act now or miss out forever!'
  };

  const mobileOptimizedContent: EmailContent = {
    html: `
      <div style="max-width: 100%;">
        <style>
          @media (max-width: 600px) {
            .container { width: 100% !important; }
            .button { width: 100% !important; display: block !important; }
          }
        </style>
        <table class="container" style="max-width: 600px;">
          <tr><td>
            <h1>Mobile Optimized Email</h1>
            <img src="hero.jpg" alt="Hero Image" style="max-width: 100%; height: auto;" />
            <a href="#" class="button">Call to Action</a>
          </td></tr>
        </table>
      </div>
    `,
    subjectLine: 'Mobile Optimized Newsletter',
    previewText: 'Optimized for mobile viewing'
  };

  describe('analyze', () => {
    it('should provide performance scores based on content metrics', async () => {
      const result = await engine.analyze(goodEmailContent);

      expect(result.scores).toBeDefined();
      expect(result.scores!.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.scores!.overallScore).toBeLessThanOrEqual(100);
      expect(result.scores!.deliverabilityScore).toBeGreaterThanOrEqual(0);
      expect(result.scores!.deliverabilityScore).toBeLessThanOrEqual(100);
      expect(result.scores!.spamScore).toBeGreaterThanOrEqual(0);
      expect(result.scores!.spamScore).toBeLessThanOrEqual(100);
      expect(result.scores!.mobileScore).toBeGreaterThanOrEqual(0);
      expect(result.scores!.mobileScore).toBeLessThanOrEqual(100);
      expect(result.scores!.accessibilityScore).toBeGreaterThanOrEqual(0);
      expect(result.scores!.accessibilityScore).toBeLessThanOrEqual(100);
    });

    it('should calculate deliverability score from content factors', async () => {
      const goodResult = await engine.analyze(goodEmailContent);
      const spamyResult = await engine.analyze(spamyEmailContent);

      expect(goodResult.scores!.deliverabilityScore).toBeGreaterThan(
        spamyResult.scores!.deliverabilityScore
      );
      expect(goodResult.scores!.spamScore).toBeLessThan(
        spamyResult.scores!.spamScore
      );
    });

    it('should assess spam risk based on content patterns', async () => {
      const spamyResult = await engine.analyze(spamyEmailContent);

      expect(spamyResult.scores!.spamScore).toBeGreaterThan(30); // High spam score
      expect(spamyResult.scores!.deliverabilityScore).toBeLessThan(70); // Low deliverability
    });

    it('should score mobile optimization factors', async () => {
      const mobileResult = await engine.analyze(mobileOptimizedContent);
      const basicResult = await engine.analyze(goodEmailContent);

      // Mobile optimized email should score higher
      expect(mobileResult.scores!.mobileScore).toBeGreaterThanOrEqual(
        basicResult.scores!.mobileScore
      );
      expect(mobileResult.scores!.mobileScore).toBeGreaterThan(90);
    });

    it('should predict engagement rates using heuristics', async () => {
      const result = await engine.analyze(goodEmailContent);

      expect(result.prediction).toBeDefined();
      expect(result.prediction!.openRate).toBeGreaterThan(0);
      expect(result.prediction!.openRate).toBeLessThan(100);
      expect(result.prediction!.clickRate).toBeGreaterThan(0);
      expect(result.prediction!.clickRate).toBeLessThan(100);
      expect(result.prediction!.conversionRate).toBeGreaterThan(0);
      expect(result.prediction!.conversionRate).toBeLessThan(100);
      expect(result.prediction!.confidence).toBeGreaterThan(0);
      expect(result.prediction!.confidence).toBeLessThanOrEqual(1);
    });

    it('should generate accessibility recommendations', async () => {
      const noAltTextContent: EmailContent = {
        html: '<img src="image.jpg" /><p>Content without alt text</p>',
        subjectLine: 'Accessibility Test',
        previewText: 'Testing accessibility'
      };

      const withAltTextContent: EmailContent = {
        html: '<img src="image.jpg" alt="Descriptive alt text" /><p>Content with alt text</p>',
        subjectLine: 'Accessibility Test',
        previewText: 'Testing accessibility'
      };

      const noAltResult = await engine.analyze(noAltTextContent);
      const withAltResult = await engine.analyze(withAltTextContent);

      expect(withAltResult.scores!.accessibilityScore).toBeGreaterThan(
        noAltResult.scores!.accessibilityScore
      );
    });

    it('should handle edge cases gracefully', async () => {
      const emptyContent: EmailContent = {
        html: '',
        subjectLine: '',
        previewText: ''
      };

      const result = await engine.analyze(emptyContent);

      expect(result.scores).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.suggestions).toBeDefined();
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('should return consistent results for same content', async () => {
      const result1 = await engine.analyze(goodEmailContent);
      const result2 = await engine.analyze(goodEmailContent);

      expect(result1.scores!.overallScore).toBe(result2.scores!.overallScore);
      expect(result1.scores!.deliverabilityScore).toBe(result2.scores!.deliverabilityScore);
      expect(result1.prediction!.openRate).toBe(result2.prediction!.openRate);
    });

    it('should include proper metadata', async () => {
      const result = await engine.analyze(goodEmailContent);

      expect(result.metadata).toBeDefined();
      expect(result.metadata!.analysisMethod).toBe('heuristic');
      expect(result.metadata!.processingTimeMs).toBeDefined();
      expect(result.metadata!.version).toBeDefined();
      expect(typeof result.metadata!.processingTimeMs).toBe('number');
    });
  });

  describe('getCapabilities', () => {
    it('should return correct capabilities', () => {
      const capabilities = engine.getCapabilities();
      
      expect(Array.isArray(capabilities)).toBe(true);
      expect(capabilities).toContain('basic-metrics');
      expect(capabilities).toContain('performance-scores');
      expect(capabilities).toContain('simple-suggestions');
    });
  });

  describe('isHealthy', () => {
    it('should always return true for heuristic engine', async () => {
      const isHealthy = await engine.isHealthy();
      expect(isHealthy).toBe(true);
    });
  });

  describe('scoring algorithms', () => {
    it('should penalize excessive spam words', async () => {
      const manySpamWords: EmailContent = {
        html: '<p>FREE URGENT LIMITED TIME ACT NOW CLICK HERE</p>',
        subjectLine: 'FREE URGENT ACT NOW',
        previewText: 'Limited time offer'
      };

      const result = await engine.analyze(manySpamWords);
      expect(result.scores!.spamScore).toBeGreaterThan(50);
      expect(result.scores!.deliverabilityScore).toBeLessThan(60);
    });

    it('should reward good image-to-text ratio', async () => {
      const goodRatioContent: EmailContent = {
        html: `
          <p>This is a substantial amount of text content that provides good value to the reader.</p>
          <p>We include detailed information and meaningful content before showing any images.</p>
          <img src="relevant-image.jpg" alt="Relevant image" />
          <p>More valuable text content continues after the image.</p>
        `,
        subjectLine: 'Good Content Balance',
        previewText: 'Valuable content'
      };

      const poorRatioContent: EmailContent = {
        html: '<img src="1.jpg" /><img src="2.jpg" /><img src="3.jpg" /><p>Hi</p>',
        subjectLine: 'Too Many Images',
        previewText: 'Images everywhere'
      };

      const goodResult = await engine.analyze(goodRatioContent);
      const poorResult = await engine.analyze(poorRatioContent);

      expect(goodResult.scores!.deliverabilityScore).toBeGreaterThan(
        poorResult.scores!.deliverabilityScore
      );
    });

    it('should adjust engagement predictions based on content quality', async () => {
      const engagingContent: EmailContent = {
        html: `
          <h1>Exciting News!</h1>
          <p>We have something special for you.</p>
          <a href="#" class="cta">Discover More</a>
        `,
        subjectLine: 'Something special for you?',
        previewText: 'Exciting news inside'
      };

      const boringContent: EmailContent = {
        html: '<p>Update.</p>',
        subjectLine: 'Update',
        previewText: 'Update'
      };

      const engagingResult = await engine.analyze(engagingContent);
      const boringResult = await engine.analyze(boringContent);

      expect(engagingResult.prediction!.openRate).toBeGreaterThan(
        boringResult.prediction!.openRate
      );
    });
  });

  describe('performance requirements', () => {
    it('should complete analysis within time limits', async () => {
      const startTime = Date.now();
      await engine.analyze(goodEmailContent);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(100); // Should be very fast for heuristic analysis
    });

    it('should handle large content efficiently', async () => {
      const largeContent: EmailContent = {
        html: '<p>' + 'Large content section. '.repeat(1000) + '</p>',
        subjectLine: 'Large content test',
        previewText: 'Testing performance'
      };

      const startTime = Date.now();
      const result = await engine.analyze(largeContent);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(500);
      expect(result.scores).toBeDefined();
    });
  });
});
