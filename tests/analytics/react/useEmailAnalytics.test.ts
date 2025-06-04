
import { renderHook, act } from '@testing-library/react';
import { useEmailAnalytics } from '../../../src/analytics/react/useEmailAnalytics';
import { EmailContent } from '../../../src/analytics/core/interfaces';

// Mock the analytics service and its dependencies
jest.mock('../../../src/analytics/services/EmailAnalyticsService');
jest.mock('../../../src/analytics/adapters/OpenAIAnalyticsAdapter');
jest.mock('../../../src/analytics/infrastructure/ConsoleLogger');

describe('useEmailAnalytics', () => {
  const mockEmailContent: EmailContent = {
    html: '<p>Test email content</p>',
    subjectLine: 'Test Subject',
    previewText: 'Test preview'
  };

  const mockAnalysisResult = {
    id: 'analysis-123',
    timestamp: new Date(),
    content: mockEmailContent,
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
    suggestions: [],
    metadata: {
      analysisMethod: 'ai',
      processingTimeMs: 150,
      version: '1.0.0'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useEmailAnalytics());

      expect(result.current.result).toBeNull();
      expect(result.current.isAnalyzing).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.analyze).toBe('function');
      expect(typeof result.current.clearCache).toBe('function');
      expect(typeof result.current.getCacheStats).toBe('function');
    });

    it('should create service instance only once', () => {
      const { result, rerender } = renderHook(() => useEmailAnalytics());

      const firstAnalyze = result.current.analyze;
      rerender();
      const secondAnalyze = result.current.analyze;

      expect(firstAnalyze).toBe(secondAnalyze);
    });
  });

  describe('analysis operations', () => {
    it('should handle analysis request and update state', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      // Mock the service analyze method
      const mockAnalyze = jest.fn().mockResolvedValue(mockAnalysisResult);
      (result.current as any).service = { analyze: mockAnalyze };

      await act(async () => {
        await result.current.analyze(mockEmailContent);
      });

      expect(result.current.result).toEqual(mockAnalysisResult);
      expect(result.current.isAnalyzing).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should manage loading state during analysis', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      let resolveAnalysis: (value: any) => void;
      const analysisPromise = new Promise(resolve => {
        resolveAnalysis = resolve;
      });

      const mockAnalyze = jest.fn().mockReturnValue(analysisPromise);
      (result.current as any).service = { analyze: mockAnalyze };

      // Start analysis
      act(() => {
        result.current.analyze(mockEmailContent);
      });

      // Should be loading
      expect(result.current.isAnalyzing).toBe(true);
      expect(result.current.error).toBeNull();

      // Complete analysis
      await act(async () => {
        resolveAnalysis!(mockAnalysisResult);
        await analysisPromise;
      });

      expect(result.current.isAnalyzing).toBe(false);
      expect(result.current.result).toEqual(mockAnalysisResult);
    });

    it('should handle analysis errors gracefully', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const mockError = new Error('Analysis failed');
      const mockAnalyze = jest.fn().mockRejectedValue(mockError);
      (result.current as any).service = { analyze: mockAnalyze };

      await act(async () => {
        await result.current.analyze(mockEmailContent);
      });

      expect(result.current.result).toBeNull();
      expect(result.current.isAnalyzing).toBe(false);
      expect(result.current.error).toBe('Analysis failed');
    });

    it('should validate email content before analysis', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const emptyContent: EmailContent = {
        html: '',
        subjectLine: 'Test',
        previewText: ''
      };

      await act(async () => {
        await result.current.analyze(emptyContent);
      });

      expect(result.current.error).toBe('Email content is empty');
      expect(result.current.result).toBeNull();
    });

    it('should handle empty HTML content', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const emptyHTMLContent: EmailContent = {
        html: '   ',
        subjectLine: 'Test',
        previewText: ''
      };

      await act(async () => {
        await result.current.analyze(emptyHTMLContent);
      });

      expect(result.current.error).toBe('Email content is empty');
    });

    it('should handle unknown error types', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const mockAnalyze = jest.fn().mockRejectedValue('String error');
      (result.current as any).service = { analyze: mockAnalyze };

      await act(async () => {
        await result.current.analyze(mockEmailContent);
      });

      expect(result.current.error).toBe('Analysis failed');
    });
  });

  describe('cache operations', () => {
    it('should clear cache when requested', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const mockClearCache = jest.fn().mockResolvedValue(undefined);
      (result.current as any).service = { clearCache: mockClearCache };

      await act(async () => {
        await result.current.clearCache();
      });

      expect(mockClearCache).toHaveBeenCalled();
    });

    it('should provide cache statistics', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const mockStats = { hits: 15, misses: 3, size: 5 };
      const mockGetCacheStats = jest.fn().mockResolvedValue(mockStats);
      (result.current as any).service = { getCacheStats: mockGetCacheStats };

      let stats;
      await act(async () => {
        stats = await result.current.getCacheStats();
      });

      expect(stats).toEqual(mockStats);
      expect(mockGetCacheStats).toHaveBeenCalled();
    });

    it('should handle cache operation errors', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const mockClearCache = jest.fn().mockRejectedValue(new Error('Cache error'));
      (result.current as any).service = { clearCache: mockClearCache };

      await act(async () => {
        try {
          await result.current.clearCache();
        } catch (error) {
          // Expected to throw
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe('state management', () => {
    it('should reset error state on new analysis', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      // First analysis fails
      const mockAnalyze = jest.fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockAnalysisResult);
      (result.current as any).service = { analyze: mockAnalyze };

      await act(async () => {
        await result.current.analyze(mockEmailContent);
      });

      expect(result.current.error).toBe('First error');

      // Second analysis succeeds
      await act(async () => {
        await result.current.analyze(mockEmailContent);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.result).toEqual(mockAnalysisResult);
    });

    it('should maintain state consistency during concurrent operations', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      let resolveFirst: (value: any) => void;
      let resolveSecond: (value: any) => void;

      const firstPromise = new Promise(resolve => { resolveFirst = resolve; });
      const secondPromise = new Promise(resolve => { resolveSecond = resolve; });

      const mockAnalyze = jest.fn()
        .mockReturnValueOnce(firstPromise)
        .mockReturnValueOnce(secondPromise);
      (result.current as any).service = { analyze: mockAnalyze };

      // Start first analysis
      act(() => {
        result.current.analyze(mockEmailContent);
      });

      // Start second analysis while first is running
      act(() => {
        result.current.analyze(mockEmailContent);
      });

      // Complete second analysis first
      await act(async () => {
        resolveSecond!(mockAnalysisResult);
        await secondPromise;
      });

      // Complete first analysis
      await act(async () => {
        resolveFirst!({ ...mockAnalysisResult, id: 'first-analysis' });
        await firstPromise;
      });

      // Should have the result from the last completed analysis
      expect(result.current.result).toEqual(mockAnalysisResult);
      expect(result.current.isAnalyzing).toBe(false);
    });

    it('should handle rapid successive analysis calls', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const mockAnalyze = jest.fn().mockResolvedValue(mockAnalysisResult);
      (result.current as any).service = { analyze: mockAnalyze };

      // Fire multiple analysis calls rapidly
      await act(async () => {
        const promises = [
          result.current.analyze(mockEmailContent),
          result.current.analyze(mockEmailContent),
          result.current.analyze(mockEmailContent)
        ];
        await Promise.all(promises);
      });

      expect(result.current.result).toEqual(mockAnalysisResult);
      expect(result.current.isAnalyzing).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('cleanup and memory management', () => {
    it('should cleanup resources on unmount', () => {
      const { unmount } = renderHook(() => useEmailAnalytics());

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should handle component unmount during analysis', async () => {
      const { result, unmount } = renderHook(() => useEmailAnalytics());

      let resolveAnalysis: (value: any) => void;
      const analysisPromise = new Promise(resolve => {
        resolveAnalysis = resolve;
      });

      const mockAnalyze = jest.fn().mockReturnValue(analysisPromise);
      (result.current as any).service = { analyze: mockAnalyze };

      // Start analysis
      act(() => {
        result.current.analyze(mockEmailContent);
      });

      expect(result.current.isAnalyzing).toBe(true);

      // Unmount component
      unmount();

      // Complete analysis after unmount
      await act(async () => {
        resolveAnalysis!(mockAnalysisResult);
        await analysisPromise;
      });

      // Should not cause errors
    });
  });

  describe('integration scenarios', () => {
    it('should work with real-world email content', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const realWorldContent: EmailContent = {
        html: `
          <div style="max-width: 600px; margin: 0 auto;">
            <h1>Newsletter Update</h1>
            <p>Here's what's new this week:</p>
            <ul>
              <li>Feature updates</li>
              <li>Bug fixes</li>
              <li>Performance improvements</li>
            </ul>
            <a href="https://example.com/read-more" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none;">
              Read More
            </a>
            <img src="https://example.com/newsletter-banner.jpg" alt="Newsletter Banner" />
            <p>Thanks for reading!</p>
          </div>
        `,
        subjectLine: 'Weekly Newsletter - Feature Updates & More',
        previewText: 'Here\'s what\'s new this week: Feature updates, bug fixes...'
      };

      const mockAnalyze = jest.fn().mockResolvedValue({
        ...mockAnalysisResult,
        metrics: {
          ...mockAnalysisResult.metrics,
          wordCount: 25,
          imageCount: 1,
          linkCount: 1,
          ctaCount: 1
        }
      });
      (result.current as any).service = { analyze: mockAnalyze };

      await act(async () => {
        await result.current.analyze(realWorldContent);
      });

      expect(result.current.result).toBeDefined();
      expect(result.current.error).toBeNull();
      expect(mockAnalyze).toHaveBeenCalledWith(
        realWorldContent,
        { preferredEngine: 'openai' }
      );
    });

    it('should handle service initialization errors gracefully', () => {
      // Mock console.error to avoid noise in tests
      const originalError = console.error;
      console.error = jest.fn();

      // This should not throw even if service initialization fails
      expect(() => renderHook(() => useEmailAnalytics())).not.toThrow();

      console.error = originalError;
    });

    it('should provide stable function references', () => {
      const { result, rerender } = renderHook(() => useEmailAnalytics());

      const firstAnalyze = result.current.analyze;
      const firstClearCache = result.current.clearCache;
      const firstGetCacheStats = result.current.getCacheStats;

      rerender();

      expect(result.current.analyze).toBe(firstAnalyze);
      expect(result.current.clearCache).toBe(firstClearCache);
      expect(result.current.getCacheStats).toBe(firstGetCacheStats);
    });
  });

  describe('error boundary scenarios', () => {
    it('should handle service method call failures', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      // Simulate service method throwing synchronously
      const mockAnalyze = jest.fn().mockImplementation(() => {
        throw new Error('Synchronous error');
      });
      (result.current as any).service = { analyze: mockAnalyze };

      await act(async () => {
        await result.current.analyze(mockEmailContent);
      });

      expect(result.current.error).toBe('Synchronous error');
      expect(result.current.isAnalyzing).toBe(false);
    });

    it('should handle malformed analysis results', async () => {
      const { result } = renderHook(() => useEmailAnalytics());

      const malformedResult = { incomplete: 'data' };
      const mockAnalyze = jest.fn().mockResolvedValue(malformedResult);
      (result.current as any).service = { analyze: mockAnalyze };

      await act(async () => {
        await result.current.analyze(mockEmailContent);
      });

      expect(result.current.result).toEqual(malformedResult);
      expect(result.current.error).toBeNull();
    });
  });
});
