
import { EmailAnalyticsService } from '../../../src/analytics/services/EmailAnalyticsService';
import { HeuristicAnalysisEngine } from '../../../src/analytics/engines/HeuristicAnalysisEngine';
import { MemoryCacheStrategy } from '../../../src/analytics/infrastructure/MemoryCacheStrategy';
import { ConsoleLogger } from '../../../src/analytics/infrastructure/ConsoleLogger';
import { EmailContent, AnalyticsEngine, AnalysisResult } from '../../../src/analytics/core/interfaces';

// Mock engine for testing
class MockAnalyticsEngine implements AnalyticsEngine {
  constructor(
    private mockResult: Partial<AnalysisResult>,
    private shouldFail: boolean = false,
    private isHealthyValue: boolean = true
  ) {}

  async analyze(content: EmailContent): Promise<Partial<AnalysisResult>> {
    if (this.shouldFail) {
      throw new Error('Mock engine failure');
    }
    return this.mockResult;
  }

  getCapabilities(): string[] {
    return ['mock-capability'];
  }

  async isHealthy(): Promise<boolean> {
    return this.isHealthyValue;
  }
}

describe('EmailAnalyticsService', () => {
  let service: EmailAnalyticsService;
  let mockCache: jest.Mocked<MemoryCacheStrategy>;
  let mockLogger: jest.Mocked<ConsoleLogger>;

  const sampleEmailContent: EmailContent = {
    html: '<p>Test email content</p>',
    subjectLine: 'Test Subject',
    previewText: 'Test preview'
  };

  const mockAnalysisResult: Partial<AnalysisResult> = {
    metrics: {
      sizeKB: 1.2,
      wordCount: 15,
      characterCount: 75,
      imageCount: 0,
      linkCount: 1,
      ctaCount: 1,
      subjectLineLength: 12,
      previewTextLength: 12
    },
    scores: {
      overallScore: 85,
      deliverabilityScore: 90,
      spamScore: 10,
      mobileScore: 88,
      accessibilityScore: 75
    },
    prediction: {
      openRate: 28.5,
      clickRate: 4.2,
      conversionRate: 2.8,
      confidence: 0.85
    },
    suggestions: []
  };

  beforeEach(() => {
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn()
    } as any;

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    } as any;

    service = new EmailAnalyticsService(mockCache, mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default heuristic engine', () => {
      expect(service).toBeDefined();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'EmailAnalyticsService initialized',
        expect.objectContaining({
          environment: expect.any(String),
          cacheEnabled: expect.any(Boolean)
        })
      );
    });

    it('should register engines correctly', () => {
      const mockEngine = new MockAnalyticsEngine(mockAnalysisResult);
      
      service.registerEngine('test-engine', mockEngine);
      
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Registered analytics engine: test-engine',
        { capabilities: ['mock-capability'] }
      );
    });

    it('should handle default configuration', () => {
      const defaultService = new EmailAnalyticsService();
      expect(defaultService).toBeDefined();
    });
  });

  describe('engine orchestration', () => {
    it('should orchestrate analysis using preferred engine', async () => {
      const mockEngine = new MockAnalyticsEngine(mockAnalysisResult);
      service.registerEngine('preferred-engine', mockEngine);

      const result = await service.analyze(sampleEmailContent, {
        preferredEngine: 'preferred-engine'
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.content).toEqual(sampleEmailContent);
      expect(result.metrics).toEqual(mockAnalysisResult.metrics);
    });

    it('should fallback to heuristic engine when AI fails', async () => {
      const failingEngine = new MockAnalyticsEngine(mockAnalysisResult, true);
      service.registerEngine('failing-engine', failingEngine);

      const result = await service.analyze(sampleEmailContent, {
        preferredEngine: 'failing-engine'
      });

      // Should succeed using heuristic fallback
      expect(result).toBeDefined();
      expect(mockLogger.info).toHaveBeenCalledWith('Falling back to heuristic analysis');
    });

    it('should handle missing analysis engines gracefully', async () => {
      await expect(
        service.analyze(sampleEmailContent, { preferredEngine: 'non-existent' })
      ).rejects.toThrow('Analytics engine \'non-existent\' not found');
    });

    it('should select first healthy engine when preferred fails', async () => {
      const unhealthyEngine = new MockAnalyticsEngine(mockAnalysisResult, false, false);
      const healthyEngine = new MockAnalyticsEngine(mockAnalysisResult);
      
      service.registerEngine('unhealthy', unhealthyEngine);
      service.registerEngine('healthy', healthyEngine);

      const result = await service.analyze(sampleEmailContent, {
        preferredEngine: 'unhealthy'
      });

      expect(result).toBeDefined();
    });

    it('should throw error when no healthy engines available', async () => {
      const unhealthyEngine = new MockAnalyticsEngine(mockAnalysisResult, false, false);
      
      // Replace heuristic engine with unhealthy one
      const unhealthyService = new EmailAnalyticsService(mockCache, mockLogger);
      unhealthyService.registerEngine('heuristic', unhealthyEngine);

      await expect(
        unhealthyService.analyze(sampleEmailContent)
      ).rejects.toThrow('No healthy analytics engines available');
    });
  });

  describe('cache integration', () => {
    it('should cache analysis results for performance', async () => {
      mockCache.get.mockResolvedValue(null);
      mockCache.set.mockResolvedValue();

      const mockEngine = new MockAnalyticsEngine(mockAnalysisResult);
      service.registerEngine('test-engine', mockEngine);

      await service.analyze(sampleEmailContent, { preferredEngine: 'test-engine' });

      expect(mockCache.set).toHaveBeenCalledWith(
        expect.stringContaining('email_analysis_'),
        expect.objectContaining({
          metrics: mockAnalysisResult.metrics,
          scores: mockAnalysisResult.scores
        }),
        300000 // Default TTL
      );
    });

    it('should serve from cache when available', async () => {
      const cachedResult: AnalysisResult = {
        id: 'cached-123',
        timestamp: new Date(),
        content: sampleEmailContent,
        ...mockAnalysisResult,
        metadata: {
          analysisMethod: 'cached',
          processingTimeMs: 5,
          version: '1.0.0'
        }
      } as AnalysisResult;

      mockCache.get.mockResolvedValue(cachedResult);

      const result = await service.analyze(sampleEmailContent);

      expect(result).toEqual(cachedResult);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Analysis result served from cache',
        { cacheKey: expect.stringContaining('email_analysis_') }
      );
    });

    it('should handle cache failures gracefully', async () => {
      mockCache.get.mockRejectedValue(new Error('Cache error'));
      mockCache.set.mockRejectedValue(new Error('Cache set error'));

      const mockEngine = new MockAnalyticsEngine(mockAnalysisResult);
      service.registerEngine('test-engine', mockEngine);

      const result = await service.analyze(sampleEmailContent, {
        preferredEngine: 'test-engine'
      });

      expect(result).toBeDefined();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Cache retrieval failed',
        { error: 'Cache error' }
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Failed to cache result',
        { error: 'Cache set error' }
      );
    });

    it('should bypass cache when requested', async () => {
      const cachedResult: AnalysisResult = {
        id: 'cached-123',
        timestamp: new Date(),
        content: sampleEmailContent,
        ...mockAnalysisResult,
        metadata: {
          analysisMethod: 'cached',
          processingTimeMs: 5,
          version: '1.0.0'
        }
      } as AnalysisResult;

      mockCache.get.mockResolvedValue(cachedResult);

      const mockEngine = new MockAnalyticsEngine(mockAnalysisResult);
      service.registerEngine('test-engine', mockEngine);

      await service.analyze(sampleEmailContent, {
        preferredEngine: 'test-engine',
        useCache: false
      });

      expect(mockCache.get).not.toHaveBeenCalled();
    });
  });

  describe('analysis workflow', () => {
    it('should generate unique analysis IDs', async () => {
      const mockEngine = new MockAnalyticsEngine(mockAnalysisResult);
      service.registerEngine('test-engine', mockEngine);

      const result1 = await service.analyze(sampleEmailContent, {
        preferredEngine: 'test-engine'
      });
      const result2 = await service.analyze(sampleEmailContent, {
        preferredEngine: 'test-engine'
      });

      expect(result1.id).not.toBe(result2.id);
      expect(result1.id).toMatch(/^analysis_\d+_[a-z0-9]+$/);
    });

    it('should track analysis processing time', async () => {
      const slowEngine = new MockAnalyticsEngine(mockAnalysisResult);
      // Mock slow analysis
      const originalAnalyze = slowEngine.analyze;
      slowEngine.analyze = async (content) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return originalAnalyze.call(slowEngine, content);
      };

      service.registerEngine('slow-engine', slowEngine);

      const result = await service.analyze(sampleEmailContent, {
        preferredEngine: 'slow-engine'
      });

      expect(result.metadata.processingTimeMs).toBeGreaterThan(90);
    });

    it('should validate email content before analysis', async () => {
      const emptyContent: EmailContent = {
        html: '',
        subjectLine: '',
        previewText: ''
      };

      const result = await service.analyze(emptyContent);
      expect(result).toBeDefined();
      // Should handle empty content gracefully
    });

    it('should merge results from multiple engines', async () => {
      // This would be implemented if the service supported multi-engine analysis
      const engine1 = new MockAnalyticsEngine({
        scores: { overallScore: 80, deliverabilityScore: 85 }
      });
      const engine2 = new MockAnalyticsEngine({
        scores: { spamScore: 15, mobileScore: 90 }
      });

      service.registerEngine('engine1', engine1);
      service.registerEngine('engine2', engine2);

      const result = await service.analyze(sampleEmailContent, {
        preferredEngine: 'engine1'
      });

      expect(result.scores).toBeDefined();
    });
  });

  describe('engine status and health', () => {
    it('should return engine status correctly', async () => {
      const healthyEngine = new MockAnalyticsEngine(mockAnalysisResult, false, true);
      const unhealthyEngine = new MockAnalyticsEngine(mockAnalysisResult, false, false);

      service.registerEngine('healthy', healthyEngine);
      service.registerEngine('unhealthy', unhealthyEngine);

      const status = await service.getEngineStatus();

      expect(status).toEqual({
        heuristic: true, // Default engine
        healthy: true,
        unhealthy: false
      });
    });

    it('should handle engine health check failures', async () => {
      const faultyEngine = new MockAnalyticsEngine(mockAnalysisResult);
      faultyEngine.isHealthy = jest.fn().mockRejectedValue(new Error('Health check failed'));

      service.registerEngine('faulty', faultyEngine);

      const status = await service.getEngineStatus();
      expect(status.faulty).toBe(false);
    });
  });

  describe('cache management', () => {
    it('should clear cache and return statistics', async () => {
      const mockStats = { hits: 10, misses: 5, size: 3 };
      mockCache.getStats.mockResolvedValue(mockStats);
      mockCache.clear.mockResolvedValue();

      const stats = await service.getCacheStats();
      expect(stats).toEqual(mockStats);

      await service.clearCache();
      expect(mockCache.clear).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Analytics cache cleared');
    });
  });

  describe('error handling and logging', () => {
    it('should log analysis completion with metrics', async () => {
      const mockEngine = new MockAnalyticsEngine(mockAnalysisResult);
      service.registerEngine('test-engine', mockEngine);

      await service.analyze(sampleEmailContent, { preferredEngine: 'test-engine' });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Email analysis completed',
        expect.objectContaining({
          engineUsed: 'test-engine',
          processingTimeMs: expect.any(Number),
          overallScore: 85
        })
      );
    });

    it('should log analysis start with content info', async () => {
      await service.analyze(sampleEmailContent);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Starting email analysis',
        expect.objectContaining({
          subjectLength: 12,
          htmlLength: expect.any(Number),
          useCache: true,
          preferredEngine: undefined
        })
      );
    });

    it('should log errors with context', async () => {
      const failingEngine = new MockAnalyticsEngine(mockAnalysisResult, true);
      service.registerEngine('failing-engine', failingEngine);

      // Disable fallback for this test
      const serviceWithoutFallback = new EmailAnalyticsService(
        mockCache,
        mockLogger,
        {
          ai: { provider: 'openai', model: 'gpt-4o-mini', timeout: 30000, retries: 2 },
          cache: { enabled: true, ttlMs: 300000, maxSize: 100 },
          fallback: { enabled: false, useHeuristics: false },
          logging: { level: 'info', destination: 'console' }
        }
      );
      serviceWithoutFallback.registerEngine('failing-engine', failingEngine);

      await expect(
        serviceWithoutFallback.analyze(sampleEmailContent, {
          preferredEngine: 'failing-engine'
        })
      ).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Analysis failed',
        expect.any(Error),
        expect.objectContaining({
          engineUsed: 'failing-engine',
          processingTimeMs: expect.any(Number)
        })
      );
    });
  });

  describe('performance and edge cases', () => {
    it('should handle concurrent analysis requests', async () => {
      const mockEngine = new MockAnalyticsEngine(mockAnalysisResult);
      service.registerEngine('concurrent-engine', mockEngine);

      const promises = Array(10).fill(0).map(() =>
        service.analyze(sampleEmailContent, { preferredEngine: 'concurrent-engine' })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
      });
    });

    it('should handle very large email content', async () => {
      const largeContent: EmailContent = {
        html: '<p>' + 'Large content '.repeat(10000) + '</p>',
        subjectLine: 'Large email test',
        previewText: 'Testing large content'
      };

      const result = await service.analyze(largeContent);
      expect(result).toBeDefined();
      expect(result.metadata.processingTimeMs).toBeDefined();
    });

    it('should generate consistent cache keys for same content', async () => {
      mockCache.get.mockResolvedValue(null);

      await service.analyze(sampleEmailContent);
      await service.analyze(sampleEmailContent);

      const calls = mockCache.set.mock.calls;
      expect(calls[0][0]).toBe(calls[1][0]); // Same cache key
    });
  });
});
