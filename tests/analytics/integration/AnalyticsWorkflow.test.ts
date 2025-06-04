
import { EmailAnalyticsService } from '../../../src/analytics/services/EmailAnalyticsService';
import { OpenAIAnalyticsAdapter } from '../../../src/analytics/adapters/OpenAIAnalyticsAdapter';
import { HeuristicAnalysisEngine } from '../../../src/analytics/engines/HeuristicAnalysisEngine';
import { MemoryCacheStrategy } from '../../../src/analytics/infrastructure/MemoryCacheStrategy';
import { ConsoleLogger } from '../../../src/analytics/infrastructure/ConsoleLogger';
import { EmailContent } from '../../../src/analytics/core/interfaces';
import { OpenAIEmailService } from '../../../src/services/openAIEmailService';
import { ApiKeyService } from '../../../src/services/apiKeyService';

// Mock external dependencies
jest.mock('../../../src/services/openAIEmailService');
jest.mock('../../../src/services/apiKeyService');

describe('Analytics Workflow Integration', () => {
  let service: EmailAnalyticsService;
  let cache: MemoryCacheStrategy;
  let logger: ConsoleLogger;
  let mockOpenAIEmailService: jest.Mocked<typeof OpenAIEmailService>;
  let mockApiKeyService: jest.Mocked<typeof ApiKeyService>;

  const sampleEmails = {
    promotional: {
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <header style="background: #ff6b6b; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🎉 Special Offer Inside!</h1>
          </header>
          <main style="padding: 30px;">
            <h2>Don't Miss Out - 50% Off Everything!</h2>
            <p>Limited time offer - grab your favorite items before they're gone!</p>
            <img src="hero-product.jpg" alt="Featured Product" style="width: 100%; max-width: 400px;" />
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://shop.example.com" style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Shop Now
              </a>
            </div>
            <p>Use code: SAVE50 at checkout</p>
          </main>
          <footer style="background: #f8f8f8; padding: 20px; font-size: 12px; color: #666;">
            <p>Unsubscribe | View in browser</p>
          </footer>
        </div>
      `,
      subjectLine: '🎉 50% OFF Everything - Limited Time!',
      previewText: 'Don\'t miss out on this incredible deal - shop now!'
    },
    transactional: {
      html: `
        <div style="max-width: 500px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          <header style="border-bottom: 1px solid #eee; padding: 20px 0;">
            <h1 style="color: #333; font-size: 18px;">Order Confirmation</h1>
          </header>
          <main style="padding: 20px 0;">
            <p>Hi John,</p>
            <p>Thank you for your order! We're processing it now.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 3px; margin: 20px 0;">
              <strong>Order #12345</strong><br>
              Total: $29.99<br>
              Estimated delivery: 3-5 business days
            </div>
            <a href="https://track.example.com/12345" style="color: #007bff;">Track your order</a>
          </main>
        </div>
      `,
      subjectLine: 'Order Confirmation #12345',
      previewText: 'Thank you for your order! We\'re processing it now.'
    },
    newsletter: {
      html: `
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Weekly Tech Digest</h1>
          <p>Stay updated with the latest in technology and innovation.</p>
          
          <article style="margin: 30px 0; padding: 20px; border-left: 4px solid #3498db;">
            <h2>AI Breakthrough in Healthcare</h2>
            <p>Researchers have developed a new AI system that can detect diseases with 95% accuracy...</p>
            <a href="https://news.example.com/ai-healthcare">Read more</a>
          </article>
          
          <article style="margin: 30px 0; padding: 20px; border-left: 4px solid #e74c3c;">
            <h2>Quantum Computing Update</h2>
            <p>Major tech companies are racing to achieve quantum supremacy...</p>
            <a href="https://news.example.com/quantum">Read more</a>
          </article>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://newsletter.example.com/subscribe" style="background: #27ae60; color: white; padding: 12px 24px; text-decoration: none;">
              Subscribe for More
            </a>
          </div>
        </div>
      `,
      subjectLine: 'Weekly Tech Digest - AI & Quantum Updates',
      previewText: 'Your weekly dose of tech news and innovation updates'
    }
  };

  beforeEach(() => {
    // Setup mocks
    mockOpenAIEmailService = OpenAIEmailService as jest.Mocked<typeof OpenAIEmailService>;
    mockApiKeyService = ApiKeyService as jest.Mocked<typeof ApiKeyService>;

    // Setup infrastructure
    cache = new MemoryCacheStrategy();
    logger = new ConsoleLogger('error'); // Reduce test noise
    service = new EmailAnalyticsService(cache, logger);

    // Register engines
    const openAIAdapter = new OpenAIAnalyticsAdapter(logger);
    service.registerEngine('openai', openAIAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('complete analysis workflows', () => {
    it('should complete full analysis workflow with AI engine', async () => {
      // Mock successful AI responses
      mockApiKeyService.validateKey.mockReturnValue(true);
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue({
        brandVoiceScore: 85,
        engagementScore: 78,
        performancePrediction: { openRate: 28.5, clickRate: 4.2, conversionRate: 2.8 },
        suggestions: []
      });
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue({
        overallScore: 82,
        deliverabilityScore: 88,
        spamScore: 12,
        mobileScore: 90,
        metrics: { accessibility: { value: 75 } },
        accessibilityIssues: [],
        optimizationSuggestions: []
      });

      const result = await service.analyze(sampleEmails.promotional, {
        preferredEngine: 'openai'
      });

      expect(result).toBeDefined();
      expect(result.id).toMatch(/^analysis_\d+_[a-z0-9]+$/);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.content).toEqual(sampleEmails.promotional);
      expect(result.metrics).toBeDefined();
      expect(result.scores).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.suggestions).toBeDefined();
      expect(result.metadata.analysisMethod).toBe('ai');
      expect(result.metadata.processingTimeMs).toBeGreaterThan(0);
    });

    it('should fallback to heuristic analysis when AI unavailable', async () => {
      // Mock AI as unavailable
      mockApiKeyService.validateKey.mockReturnValue(false);

      const result = await service.analyze(sampleEmails.transactional, {
        preferredEngine: 'openai'
      });

      expect(result).toBeDefined();
      expect(result.metadata.analysisMethod).toBe('heuristic');
      expect(result.scores.overallScore).toBeGreaterThan(0);
      expect(result.prediction.openRate).toBeGreaterThan(0);
    });

    it('should cache results and serve from cache on repeat requests', async () => {
      // Mock successful AI response
      mockApiKeyService.validateKey.mockReturnValue(true);
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue({
        brandVoiceScore: 85,
        engagementScore: 78,
        performancePrediction: { openRate: 28.5, clickRate: 4.2, conversionRate: 2.8 },
        suggestions: []
      });
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue({
        overallScore: 82,
        deliverabilityScore: 88,
        spamScore: 12,
        mobileScore: 90,
        metrics: { accessibility: { value: 75 } },
        accessibilityIssues: [],
        optimizationSuggestions: []
      });

      // First request
      const result1 = await service.analyze(sampleEmails.newsletter, {
        preferredEngine: 'openai'
      });

      // Second request (should be cached)
      const result2 = await service.analyze(sampleEmails.newsletter, {
        preferredEngine: 'openai'
      });

      expect(result1.id).toBe(result2.id);
      expect(mockOpenAIEmailService.analyzeBrandVoice).toHaveBeenCalledTimes(1);
      expect(mockOpenAIEmailService.analyzePerformance).toHaveBeenCalledTimes(1);
    });

    it('should handle complex email content with multiple blocks', async () => {
      const complexEmail: EmailContent = {
        html: `
          <div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td>
                <div style="max-width: 600px; margin: 0 auto;">
                  <header>
                    <img src="logo.png" alt="Company Logo" />
                    <nav>
                      <a href="/home">Home</a>
                      <a href="/products">Products</a>
                      <a href="/contact">Contact</a>
                    </nav>
                  </header>
                  <main>
                    <section class="hero">
                      <h1>Welcome to Our Platform</h1>
                      <p>Discover amazing features and boost your productivity.</p>
                      <button class="cta-primary">Get Started Free</button>
                    </section>
                    <section class="features">
                      <div class="feature">
                        <img src="feature1.jpg" alt="Feature 1" />
                        <h3>Advanced Analytics</h3>
                        <p>Track performance with detailed insights.</p>
                      </div>
                      <div class="feature">
                        <img src="feature2.jpg" alt="Feature 2" />
                        <h3>Team Collaboration</h3>
                        <p>Work together seamlessly.</p>
                      </div>
                    </section>
                    <section class="testimonials">
                      <blockquote>"This platform changed our workflow completely!"</blockquote>
                      <cite>- Jane Doe, CEO</cite>
                    </section>
                  </main>
                  <footer>
                    <div class="social">
                      <a href="https://twitter.com/company">Twitter</a>
                      <a href="https://linkedin.com/company">LinkedIn</a>
                    </div>
                    <p>© 2024 Company Name. All rights reserved.</p>
                  </footer>
                </div>
              </td></tr>
            </table>
          </div>
        `,
        subjectLine: 'Welcome to Our Platform - Get Started Today!',
        previewText: 'Discover amazing features and boost your productivity with our platform.'
      };

      mockApiKeyService.validateKey.mockReturnValue(true);
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue({
        brandVoiceScore: 88,
        engagementScore: 82,
        performancePrediction: { openRate: 30.2, clickRate: 5.1, conversionRate: 3.2 },
        suggestions: []
      });
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue({
        overallScore: 85,
        deliverabilityScore: 90,
        spamScore: 8,
        mobileScore: 88,
        metrics: { accessibility: { value: 80 } },
        accessibilityIssues: [],
        optimizationSuggestions: []
      });

      const result = await service.analyze(complexEmail, {
        preferredEngine: 'openai'
      });

      expect(result.metrics.imageCount).toBeGreaterThan(2);
      expect(result.metrics.linkCount).toBeGreaterThan(4);
      expect(result.metrics.ctaCount).toBeGreaterThan(0);
      expect(result.scores.overallScore).toBeGreaterThan(80);
    });

    it('should analyze different email types with appropriate scoring', async () => {
      const results = {};

      // Analyze all email types
      for (const [type, content] of Object.entries(sampleEmails)) {
        const result = await service.analyze(content, { preferredEngine: 'heuristic' });
        results[type] = result;
      }

      // Promotional emails might have lower deliverability due to sales language
      expect(results.promotional.scores.spamScore).toBeGreaterThan(results.transactional.scores.spamScore);

      // Transactional emails should have high deliverability
      expect(results.transactional.scores.deliverabilityScore).toBeGreaterThan(80);

      // Newsletter should have balanced scores
      expect(results.newsletter.scores.overallScore).toBeGreaterThan(70);
    });

    it('should maintain analysis quality when switching between engines', async () => {
      const content = sampleEmails.promotional;

      // Analyze with heuristic engine
      const heuristicResult = await service.analyze(content, {
        preferredEngine: 'heuristic'
      });

      // Mock AI and analyze with OpenAI
      mockApiKeyService.validateKey.mockReturnValue(true);
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue({
        brandVoiceScore: 85,
        engagementScore: 78,
        performancePrediction: { openRate: 28.5, clickRate: 4.2, conversionRate: 2.8 },
        suggestions: []
      });
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue({
        overallScore: 82,
        deliverabilityScore: 88,
        spamScore: 12,
        mobileScore: 90,
        metrics: { accessibility: { value: 75 } },
        accessibilityIssues: [],
        optimizationSuggestions: []
      });

      const aiResult = await service.analyze(content, {
        preferredEngine: 'openai',
        useCache: false
      });

      // Both should have valid results
      expect(heuristicResult.scores.overallScore).toBeGreaterThan(0);
      expect(aiResult.scores.overallScore).toBeGreaterThan(0);

      // Basic metrics should be consistent (content-based)
      expect(heuristicResult.metrics.wordCount).toBe(aiResult.metrics.wordCount);
      expect(heuristicResult.metrics.imageCount).toBe(aiResult.metrics.imageCount);
      expect(heuristicResult.metrics.linkCount).toBe(aiResult.metrics.linkCount);
    });

    it('should handle network failures and recovery', async () => {
      // First attempt fails
      mockApiKeyService.validateKey.mockReturnValue(true);
      mockOpenAIEmailService.analyzeBrandVoice.mockRejectedValueOnce(new Error('Network timeout'));
      mockOpenAIEmailService.analyzePerformance.mockRejectedValueOnce(new Error('Network timeout'));

      // Should fallback to heuristic
      const result1 = await service.analyze(sampleEmails.newsletter, {
        preferredEngine: 'openai'
      });

      expect(result1.metadata.analysisMethod).toBe('heuristic');

      // Network recovers for second attempt
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue({
        brandVoiceScore: 85,
        engagementScore: 78,
        performancePrediction: { openRate: 28.5, clickRate: 4.2, conversionRate: 2.8 },
        suggestions: []
      });
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue({
        overallScore: 82,
        deliverabilityScore: 88,
        spamScore: 12,
        mobileScore: 90,
        metrics: { accessibility: { value: 75 } },
        accessibilityIssues: [],
        optimizationSuggestions: []
      });

      const result2 = await service.analyze(sampleEmails.transactional, {
        preferredEngine: 'openai',
        useCache: false
      });

      expect(result2.metadata.analysisMethod).toBe('ai');
    });

    it('should provide consistent results for identical content', async () => {
      const content = sampleEmails.promotional;

      // Analyze same content multiple times
      const results = await Promise.all([
        service.analyze(content, { preferredEngine: 'heuristic', useCache: false }),
        service.analyze(content, { preferredEngine: 'heuristic', useCache: false }),
        service.analyze(content, { preferredEngine: 'heuristic', useCache: false })
      ]);

      // All results should be identical for deterministic heuristic analysis
      const firstResult = results[0];
      results.forEach(result => {
        expect(result.scores).toEqual(firstResult.scores);
        expect(result.prediction.openRate).toBe(firstResult.prediction.openRate);
        expect(result.prediction.clickRate).toBe(firstResult.prediction.clickRate);
        expect(result.metrics).toEqual(firstResult.metrics);
      });
    });
  });

  describe('performance and reliability', () => {
    it('should handle concurrent analysis requests efficiently', async () => {
      const startTime = Date.now();

      // Submit multiple concurrent analyses
      const promises = Object.values(sampleEmails).map(content =>
        service.analyze(content, { preferredEngine: 'heuristic' })
      );

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(3);
      expect(duration).toBeLessThan(1000); // Should complete quickly for heuristic
      results.forEach(result => {
        expect(result.scores.overallScore).toBeGreaterThan(0);
      });
    });

    it('should maintain cache performance under load', async () => {
      const content = sampleEmails.newsletter;
      
      // Fill cache with analysis result
      await service.analyze(content, { preferredEngine: 'heuristic' });

      const startTime = Date.now();

      // Make many concurrent cache requests
      const promises = Array(20).fill(0).map(() =>
        service.analyze(content, { preferredEngine: 'heuristic' })
      );

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(20);
      expect(duration).toBeLessThan(200); // Should be very fast from cache
      
      // All results should be identical (cached)
      const firstId = results[0].id;
      results.forEach(result => {
        expect(result.id).toBe(firstId);
      });
    });

    it('should handle large email content efficiently', async () => {
      const largeContent: EmailContent = {
        html: `
          <div>
            ${'<p>Large email content section. '.repeat(1000)}
            ${'<img src="image.jpg" alt="Image" /> '.repeat(50)}
            ${'<a href="http://example.com">Link</a> '.repeat(100)}
          </div>
        `,
        subjectLine: 'Large Email Performance Test',
        previewText: 'Testing performance with large email content'
      };

      const startTime = Date.now();
      const result = await service.analyze(largeContent, { preferredEngine: 'heuristic' });
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(2000); // Should complete in reasonable time
      expect(result.metrics.wordCount).toBeGreaterThan(1000);
      expect(result.metrics.imageCount).toBe(50);
      expect(result.metrics.linkCount).toBe(100);
    });

    it('should gracefully handle malformed email content', async () => {
      const malformedEmails = [
        {
          html: '<div><p>Unclosed paragraph<img src="broken.jpg"><a href="incomplete',
          subjectLine: 'Malformed HTML Test',
          previewText: 'Testing malformed content'
        },
        {
          html: '<<<invalid>>>html<<<content>>>',
          subjectLine: 'Invalid HTML Characters',
          previewText: 'Testing invalid HTML'
        },
        {
          html: '',
          subjectLine: '',
          previewText: ''
        }
      ];

      for (const email of malformedEmails) {
        const result = await service.analyze(email, { preferredEngine: 'heuristic' });
        
        expect(result).toBeDefined();
        expect(result.scores.overallScore).toBeGreaterThanOrEqual(0);
        expect(result.metrics.wordCount).toBeGreaterThanOrEqual(0);
      }
    });

    it('should provide meaningful error context in failure scenarios', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      try {
        // Force engine failure
        const faultyService = new EmailAnalyticsService(cache, logger, {
          ai: { provider: 'openai', model: 'gpt-4o-mini', timeout: 30000, retries: 2 },
          cache: { enabled: true, ttlMs: 300000, maxSize: 100 },
          fallback: { enabled: false, useHeuristics: false },
          logging: { level: 'error', destination: 'console' }
        });

        await expect(
          faultyService.analyze(sampleEmails.promotional)
        ).rejects.toThrow();

      } finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe('data integrity and validation', () => {
    it('should validate analysis result structure', async () => {
      const result = await service.analyze(sampleEmails.promotional, {
        preferredEngine: 'heuristic'
      });

      // Validate required fields
      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.content).toEqual(sampleEmails.promotional);
      
      // Validate metrics structure
      expect(result.metrics).toHaveProperty('sizeKB');
      expect(result.metrics).toHaveProperty('wordCount');
      expect(result.metrics).toHaveProperty('characterCount');
      expect(result.metrics).toHaveProperty('imageCount');
      expect(result.metrics).toHaveProperty('linkCount');
      expect(result.metrics).toHaveProperty('ctaCount');
      expect(result.metrics).toHaveProperty('subjectLineLength');
      expect(result.metrics).toHaveProperty('previewTextLength');

      // Validate scores structure
      expect(result.scores).toHaveProperty('overallScore');
      expect(result.scores).toHaveProperty('deliverabilityScore');
      expect(result.scores).toHaveProperty('spamScore');
      expect(result.scores).toHaveProperty('mobileScore');
      expect(result.scores).toHaveProperty('accessibilityScore');

      // Validate prediction structure
      expect(result.prediction).toHaveProperty('openRate');
      expect(result.prediction).toHaveProperty('clickRate');
      expect(result.prediction).toHaveProperty('conversionRate');
      expect(result.prediction).toHaveProperty('confidence');

      // Validate metadata
      expect(result.metadata).toHaveProperty('analysisMethod');
      expect(result.metadata).toHaveProperty('processingTimeMs');
      expect(result.metadata).toHaveProperty('version');
    });

    it('should ensure all scores are within valid ranges', async () => {
      const result = await service.analyze(sampleEmails.promotional, {
        preferredEngine: 'heuristic'
      });

      // All scores should be between 0 and 100
      expect(result.scores.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.overallScore).toBeLessThanOrEqual(100);
      expect(result.scores.deliverabilityScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.deliverabilityScore).toBeLessThanOrEqual(100);
      expect(result.scores.spamScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.spamScore).toBeLessThanOrEqual(100);
      expect(result.scores.mobileScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.mobileScore).toBeLessThanOrEqual(100);
      expect(result.scores.accessibilityScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.accessibilityScore).toBeLessThanOrEqual(100);
    });
  });
});
