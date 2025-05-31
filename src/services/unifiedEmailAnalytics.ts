
import { OpenAIEmailService } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';
import { toast } from 'sonner';

export interface UnifiedEmailAnalytics {
  // Basic content metrics
  sizeKB: number;
  wordCount: number;
  characterCount: number;
  
  // Critical performance scores (AI-powered)
  overallScore: number;
  deliverabilityScore: number;
  spamScore: number;
  mobileScore: number;
  
  // Engagement predictions (AI-powered)
  performancePrediction: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  
  // Content structure metrics
  subjectLineLength: number;
  previewTextLength: number;
  ctaCount: number;
  imageCount: number;
  linkCount: number;
  
  // Advanced content analysis (AI-powered)
  readingLevel: number; // Grade level (8-12 optimal)
  sentimentScore: number; // -1 to 1 (0.2-0.8 optimal)
  personalizedScore: number; // 0-100 (70+ optimal)
}

class UnifiedEmailAnalyticsService {
  private static cache = new Map<string, { data: UnifiedEmailAnalytics; timestamp: number }>();
  private static CACHE_DURATION = 300000; // 5 minutes

  private static calculateBasicMetrics(emailHTML: string, subjectLine: string): Partial<UnifiedEmailAnalytics> {
    const textContent = emailHTML.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const imageMatches = emailHTML.match(/<img[^>]*>/gi) || [];
    const linkMatches = emailHTML.match(/<a[^>]*href[^>]*>/gi) || [];
    
    // CTA detection (buttons, links with action words)
    const ctaPattern = /(button|btn|cta|click|buy|shop|download|subscribe|register|sign.?up|get.?started|learn.?more|contact|call)/i;
    const ctaMatches = emailHTML.match(new RegExp(`<[^>]*(?:${ctaPattern.source})[^>]*>`, 'gi')) || [];
    
    // Preview text detection (first 90 chars of visible text)
    const previewText = textContent.substring(0, 90).trim();
    
    return {
      sizeKB: Math.round((new Blob([emailHTML]).size) / 1024 * 100) / 100,
      wordCount: words.length,
      characterCount: textContent.length,
      subjectLineLength: subjectLine.length,
      previewTextLength: previewText.length,
      ctaCount: ctaMatches.length,
      imageCount: imageMatches.length,
      linkCount: linkMatches.length
    };
  }

  static async analyzeEmail(emailHTML: string, subjectLine: string): Promise<UnifiedEmailAnalytics> {
    if (!emailHTML.trim()) {
      return {
        sizeKB: 0,
        wordCount: 0,
        characterCount: 0,
        overallScore: 0,
        deliverabilityScore: 0,
        spamScore: 0,
        mobileScore: 0,
        performancePrediction: { openRate: 0, clickRate: 0, conversionRate: 0 },
        subjectLineLength: subjectLine.length,
        previewTextLength: 0,
        ctaCount: 0,
        imageCount: 0,
        linkCount: 0,
        readingLevel: 0,
        sentimentScore: 0,
        personalizedScore: 0
      };
    }

    const cacheKey = `${emailHTML}-${subjectLine}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Unified analytics: Using cached result');
      return cached.data;
    }

    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured - cannot perform real analysis');
      throw new Error('OpenAI API key not available for analysis');
    }

    try {
      console.log('Unified analytics: Calling OpenAI for comprehensive email analysis');
      
      // Get basic metrics
      const basicMetrics = this.calculateBasicMetrics(emailHTML, subjectLine);
      
      // Get OpenAI performance analysis
      const performanceAnalysis = await OpenAIEmailService.analyzePerformance({
        emailHTML,
        subjectLine
      });
      
      // Get OpenAI brand voice analysis for additional insights
      const brandAnalysis = await OpenAIEmailService.analyzeBrandVoice({
        emailHTML,
        subjectLine
      });

      const result: UnifiedEmailAnalytics = {
        ...basicMetrics,
        overallScore: performanceAnalysis.overallScore,
        deliverabilityScore: performanceAnalysis.deliverabilityScore,
        mobileScore: performanceAnalysis.mobileScore,
        spamScore: performanceAnalysis.spamScore,
        performancePrediction: brandAnalysis.performancePrediction,
        readingLevel: brandAnalysis.readabilityScore || 8,
        sentimentScore: (brandAnalysis.engagementScore || 50) / 100, // Convert to -1 to 1 scale
        personalizedScore: brandAnalysis.brandVoiceScore || 0
      } as UnifiedEmailAnalytics;

      // Cache the result
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      toast.success('Email analytics completed with real AI analysis');
      return result;
      
    } catch (error) {
      console.error('Unified analytics error:', error);
      toast.error('Failed to analyze email - please check API configuration');
      throw error;
    }
  }

  static clearCache(): void {
    this.cache.clear();
    toast.info('Analytics cache cleared - fresh analysis will run on next refresh');
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
}

export { UnifiedEmailAnalyticsService };
