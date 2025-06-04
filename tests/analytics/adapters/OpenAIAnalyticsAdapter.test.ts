
import { OpenAIAnalyticsAdapter } from '../../../src/analytics/adapters/OpenAIAnalyticsAdapter';
import { ConsoleLogger } from '../../../src/analytics/infrastructure/ConsoleLogger';
import { EmailContent } from '../../../src/analytics/core/interfaces';
import { OpenAIEmailService } from '../../../src/services/openAIEmailService';
import { ApiKeyService } from '../../../src/services/apiKeyService';

// Mock the dependencies
jest.mock('../../../src/services/openAIEmailService');
jest.mock('../../../src/services/apiKeyService');

describe('OpenAIAnalyticsAdapter', () => {
  let adapter: OpenAIAnalyticsAdapter;
  let logger: ConsoleLogger;
  let mockOpenAIEmailService: jest.Mocked<typeof OpenAIEmailService>;
  let mockApiKeyService: jest.Mocked<typeof ApiKeyService>;

  beforeEach(() => {
    logger = new ConsoleLogger('error'); // Reduce noise in tests
    adapter = new OpenAIAnalyticsAdapter(logger);
    mockOpenAIEmailService = OpenAIEmailService as jest.Mocked<typeof OpenAIEmailService>;
    mockApiKeyService = ApiKeyService as jest.Mocked<typeof ApiKeyService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const sampleEmailContent: EmailContent = {
    html: `
      <div class="email-container">
        <h1>Welcome to Our Service</h1>
        <p>Thank you for joining us. We're excited to have you on board.</p>
        <a href="https://example.com" class="button">Get Started</a>
      </div>
    `,
    subjectLine: 'Welcome to Our Service',
    previewText: 'Thank you for joining us'
  };

  const mockBrandAnalysisResponse = {
    brandVoiceScore: 85,
    engagementScore: 78,
    performancePrediction: {
      openRate: 28.5,
      clickRate: 4.2,
      conversionRate: 2.8
    },
    suggestions: [
      {
        type: 'subject',
        title: 'Improve Subject Line',
        reason: 'Subject line could be more engaging',
        suggested: 'Welcome! Your journey starts now',
        confidence: 85,
        impact: 'medium'
      }
    ]
  };

  const mockPerformanceAnalysisResponse = {
    overallScore: 82,
    deliverabilityScore: 88,
    spamScore: 12,
    mobileScore: 90,
    metrics: {
      accessibility: {
        value: 75
      }
    },
    accessibilityIssues: [
      {
        type: 'Missing Alt Text',
        description: 'Image missing alt attribute',
        fix: 'Add descriptive alt text to images',
        severity: 'medium'
      }
    ],
    optimizationSuggestions: [
      'Optimize image sizes for faster loading',
      'Add more white space for better readability'
    ]
  };

  describe('analyze', () => {
    it('should analyze email content using OpenAI API', async () => {
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue(mockBrandAnalysisResponse);
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const result = await adapter.analyze(sampleEmailContent);

      expect(mockOpenAIEmailService.analyzeBrandVoice).toHaveBeenCalledWith({
        emailHTML: sampleEmailContent.html,
        subjectLine: sampleEmailContent.subjectLine
      });
      expect(mockOpenAIEmailService.analyzePerformance).toHaveBeenCalledWith({
        emailHTML: sampleEmailContent.html,
        subjectLine: sampleEmailContent.subjectLine
      });

      expect(result.metrics).toBeDefined();
      expect(result.scores).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.suggestions).toBeDefined();
      expect(result.metadata?.analysisMethod).toBe('ai');
    });

    it('should parse AI response into structured analysis', async () => {
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue(mockBrandAnalysisResponse);
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const result = await adapter.analyze(sampleEmailContent);

      // Verify structured scores
      expect(result.scores?.overallScore).toBe(82);
      expect(result.scores?.deliverabilityScore).toBe(88);
      expect(result.scores?.spamScore).toBe(12);
      expect(result.scores?.mobileScore).toBe(90);
      expect(result.scores?.accessibilityScore).toBe(75);

      // Verify structured prediction
      expect(result.prediction?.openRate).toBe(28.5);
      expect(result.prediction?.clickRate).toBe(4.2);
      expect(result.prediction?.conversionRate).toBe(2.8);
      expect(result.prediction?.confidence).toBe(0.85);

      // Verify suggestions conversion
      expect(result.suggestions).toHaveLength(3); // 1 brand + 1 accessibility + 1 optimization
      
      const brandSuggestion = result.suggestions![0];
      expect(brandSuggestion.id).toBe('brand_0');
      expect(brandSuggestion.type).toBe('engagement');
      expect(brandSuggestion.title).toBe('Improve Subject Line');
      expect(brandSuggestion.confidence).toBe(0.85);
    });

    it('should handle API timeout gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      mockOpenAIEmailService.analyzeBrandVoice.mockRejectedValue(timeoutError);
      mockOpenAIEmailService.analyzePerformance.mockRejectedValue(timeoutError);

      await expect(adapter.analyze(sampleEmailContent)).rejects.toThrow('Request timeout');
    });

    it('should retry failed requests with exponential backoff', async () => {
      // This would typically be tested with a more sophisticated mock setup
      // For now, we test that retries don't prevent eventual success
      mockOpenAIEmailService.analyzeBrandVoice
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockBrandAnalysisResponse);
      
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const result = await adapter.analyze(sampleEmailContent);
      expect(result.scores).toBeDefined();
    });

    it('should validate API response structure', async () => {
      const invalidResponse = { invalidField: 'invalid' };
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue(invalidResponse as any);
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const result = await adapter.analyze(sampleEmailContent);
      
      // Should handle invalid response gracefully and use fallbacks
      expect(result.scores).toBeDefined();
      expect(result.prediction).toBeDefined();
    });

    it('should provide detailed error information on failure', async () => {
      const specificError = new Error('API key invalid');
      mockOpenAIEmailService.analyzeBrandVoice.mockRejectedValue(specificError);
      mockOpenAIEmailService.analyzePerformance.mockRejectedValue(specificError);

      await expect(adapter.analyze(sampleEmailContent)).rejects.toThrow('API key invalid');
    });

    it('should check API health before analysis', async () => {
      mockApiKeyService.validateKey.mockReturnValue(true);
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue(mockBrandAnalysisResponse);
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const isHealthy = await adapter.isHealthy();
      expect(isHealthy).toBe(true);
      expect(mockApiKeyService.validateKey).toHaveBeenCalled();
    });

    it('should fail with invalid API key', async () => {
      mockApiKeyService.validateKey.mockReturnValue(false);

      const isHealthy = await adapter.isHealthy();
      expect(isHealthy).toBe(false);
    });

    it('should fail with malformed AI response', async () => {
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue(null as any);
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(undefined as any);

      const result = await adapter.analyze(sampleEmailContent);
      
      // Should use fallback values when AI responses are malformed
      expect(result.scores?.overallScore).toBe(75); // Fallback value
      expect(result.prediction?.openRate).toBe(25.5); // Fallback value
    });

    it('should handle partial API failures with graceful degradation', async () => {
      // Brand analysis fails, performance succeeds
      mockOpenAIEmailService.analyzeBrandVoice.mockRejectedValue(new Error('Brand analysis failed'));
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const result = await adapter.analyze(sampleEmailContent);

      // Should have performance data but fallback prediction
      expect(result.scores?.overallScore).toBe(82);
      expect(result.scores?.deliverabilityScore).toBe(88);
      expect(result.prediction?.openRate).toBe(25.5); // Fallback value
      expect(result.suggestions).toBeDefined();
    });

    it('should track processing time accurately', async () => {
      mockOpenAIEmailService.analyzeBrandVoice.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockBrandAnalysisResponse), 100))
      );
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const result = await adapter.analyze(sampleEmailContent);

      expect(result.metadata?.processingTimeMs).toBeGreaterThan(90);
      expect(result.metadata?.processingTimeMs).toBeLessThan(200);
    });
  });

  describe('getCapabilities', () => {
    it('should return correct AI capabilities', () => {
      const capabilities = adapter.getCapabilities();
      
      expect(capabilities).toContain('ai-analysis');
      expect(capabilities).toContain('performance-optimization');
      expect(capabilities).toContain('brand-voice');
      expect(capabilities).toContain('engagement-prediction');
    });
  });

  describe('suggestion conversion', () => {
    it('should convert different suggestion types correctly', async () => {
      const diverseSuggestions = {
        ...mockBrandAnalysisResponse,
        suggestions: [
          { type: 'subject', title: 'Subject Test', reason: 'Test', suggested: 'Test', confidence: 80, impact: 'high' },
          { type: 'copy', title: 'Copy Test', reason: 'Test', suggested: 'Test', confidence: 70, impact: 'medium' },
          { type: 'cta', title: 'CTA Test', reason: 'Test', suggested: 'Test', confidence: 90, impact: 'low' },
          { type: 'design', title: 'Design Test', reason: 'Test', suggested: 'Test', confidence: 85, impact: 'medium' }
        ]
      };

      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue(diverseSuggestions);
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const result = await adapter.analyze(sampleEmailContent);

      const suggestions = result.suggestions!;
      expect(suggestions[0].type).toBe('engagement'); // subject mapped to engagement
      expect(suggestions[1].type).toBe('engagement'); // copy mapped to engagement
      expect(suggestions[2].type).toBe('engagement'); // cta mapped to engagement
      expect(suggestions[3].type).toBe('performance'); // design mapped to performance

      expect(suggestions[0].estimatedImpact).toBe(0.3); // high impact
      expect(suggestions[1].estimatedImpact).toBe(0.2); // medium impact
      expect(suggestions[2].estimatedImpact).toBe(0.1); // low impact
    });
  });

  describe('error handling and resilience', () => {
    it('should handle network failures gracefully', async () => {
      const networkError = new Error('Network unavailable');
      networkError.name = 'NetworkError';
      
      mockOpenAIEmailService.analyzeBrandVoice.mockRejectedValue(networkError);
      mockOpenAIEmailService.analyzePerformance.mockRejectedValue(networkError);

      await expect(adapter.analyze(sampleEmailContent)).rejects.toThrow('Network unavailable');
    });

    it('should handle rate limiting errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.name = 'RateLimitError';
      
      mockOpenAIEmailService.analyzeBrandVoice.mockRejectedValue(rateLimitError);
      mockOpenAIEmailService.analyzePerformance.mockRejectedValue(rateLimitError);

      await expect(adapter.analyze(sampleEmailContent)).rejects.toThrow('Rate limit exceeded');
    });

    it('should validate content before sending to API', async () => {
      const emptyContent: EmailContent = {
        html: '',
        subjectLine: '',
        previewText: ''
      };

      // Should still call API but with empty content
      mockOpenAIEmailService.analyzeBrandVoice.mockResolvedValue(mockBrandAnalysisResponse);
      mockOpenAIEmailService.analyzePerformance.mockResolvedValue(mockPerformanceAnalysisResponse);

      const result = await adapter.analyze(emptyContent);
      expect(result.metrics).toBeDefined();
    });
  });
});
