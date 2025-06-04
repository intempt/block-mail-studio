
import { useState, useCallback, useEffect } from 'react';
import { AnalysisResult, EmailContent } from '../core/interfaces';
import { EmailAnalyticsService } from '../services/EmailAnalyticsService';
import { OpenAIAnalyticsAdapter } from '../adapters/OpenAIAnalyticsAdapter';
import { ConsoleLogger } from '../infrastructure/ConsoleLogger';

interface UseEmailAnalyticsResult {
  analyze: (content: EmailContent) => Promise<void>;
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  clearCache: () => Promise<void>;
  getCacheStats: () => Promise<any>;
}

export function useEmailAnalytics(): UseEmailAnalyticsResult {
  const [service] = useState(() => {
    const logger = new ConsoleLogger('info');
    const analyticsService = new EmailAnalyticsService(undefined, logger);
    
    // Register OpenAI adapter if available
    const openAIAdapter = new OpenAIAnalyticsAdapter(logger);
    analyticsService.registerEngine('openai', openAIAdapter);
    
    return analyticsService;
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (content: EmailContent) => {
    if (!content.html.trim()) {
      setError('Email content is empty');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Try OpenAI first, fallback to heuristic
      const analysisResult = await service.analyze(content, { 
        preferredEngine: 'openai' 
      });
      setResult(analysisResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      console.error('Email analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [service]);

  const clearCache = useCallback(async () => {
    await service.clearCache();
  }, [service]);

  const getCacheStats = useCallback(async () => {
    return service.getCacheStats();
  }, [service]);

  return {
    analyze,
    result,
    isAnalyzing,
    error,
    clearCache,
    getCacheStats
  };
}
