// Legacy wrapper for backward compatibility
import { useEmailAnalytics } from '../analytics/react/useEmailAnalytics';
import { EmailContent, AnalysisResult } from '../analytics/core/interfaces';
import { EmailAnalyticsService } from '../analytics/services/EmailAnalyticsService';
import { OpenAIAnalyticsAdapter } from '../analytics/adapters/OpenAIAnalyticsAdapter';
import { ConsoleLogger } from '../analytics/infrastructure/ConsoleLogger';

// Keep the old interface for backward compatibility
export interface UnifiedEmailAnalytics {
  sizeKB: number;
  wordCount: number;
  characterCount: number;
  overallScore: number;
  deliverabilityScore: number;
  spamScore: number;
  mobileScore: number;
  performancePrediction: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  subjectLineLength: number;
  previewTextLength: number;
  ctaCount: number;
  imageCount: number;
  linkCount: number;
  readingLevel: number;
  sentimentScore: number;
  personalizedScore: number;
}

class UnifiedEmailAnalyticsService {
  private service: EmailAnalyticsService;

  constructor() {
    const logger = new ConsoleLogger('info');
    this.service = new EmailAnalyticsService(undefined, logger);
    
    // Register OpenAI adapter
    const openAIAdapter = new OpenAIAnalyticsAdapter(logger);
    this.service.registerEngine('openai', openAIAdapter);
  }

  async analyzeEmail(emailHTML: string, subjectLine: string): Promise<UnifiedEmailAnalytics> {
    const content: EmailContent = { html: emailHTML, subjectLine };
    
    try {
      const result = await this.service.analyze(content, { preferredEngine: 'openai' });
      return this.convertToLegacyFormat(result);
    } catch (error) {
      console.error('Legacy analytics failed:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.service.clearCache();
  }

  static getMetricBenchmark(metric: keyof UnifiedEmailAnalytics, value: number): 'good' | 'warning' | 'poor' {
    const benchmarks: Record<string, { good: [number, number], warning: [number, number] }> = {
      overallScore: { good: [80, 100], warning: [60, 79] },
      deliverabilityScore: { good: [85, 100], warning: [70, 84] },
      spamScore: { good: [0, 20], warning: [21, 40] },
      mobileScore: { good: [80, 100], warning: [60, 79] },
      subjectLineLength: { good: [30, 50], warning: [20, 29] },
      previewTextLength: { good: [40, 90], warning: [20, 39] },
      ctaCount: { good: [1, 3], warning: [0, 0] },
      readingLevel: { good: [8, 12], warning: [6, 7] },
      sentimentScore: { good: [0.2, 0.8], warning: [0.1, 0.19] },
      personalizedScore: { good: [70, 100], warning: [50, 69] }
    };

    const benchmark = benchmarks[metric];
    if (!benchmark) return 'warning';

    if (value >= benchmark.good[0] && value <= benchmark.good[1]) return 'good';
    if (value >= benchmark.warning[0] && value <= benchmark.warning[1]) return 'warning';
    return 'poor';
  }

  private convertToLegacyFormat(result: AnalysisResult): UnifiedEmailAnalytics {
    return {
      sizeKB: result.metrics.sizeKB,
      wordCount: result.metrics.wordCount,
      characterCount: result.metrics.characterCount,
      overallScore: result.scores.overallScore,
      deliverabilityScore: result.scores.deliverabilityScore,
      spamScore: result.scores.spamScore,
      mobileScore: result.scores.mobileScore,
      performancePrediction: {
        openRate: result.prediction.openRate,
        clickRate: result.prediction.clickRate,
        conversionRate: result.prediction.conversionRate
      },
      subjectLineLength: result.metrics.subjectLineLength,
      previewTextLength: result.metrics.previewTextLength,
      ctaCount: result.metrics.ctaCount,
      imageCount: result.metrics.imageCount,
      linkCount: result.metrics.linkCount,
      readingLevel: 8, // Default value
      sentimentScore: 0.5, // Default neutral
      personalizedScore: 70 // Default value
    };
  }
}

export { UnifiedEmailAnalyticsService };
