import { OpenAIEmailService } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';
import { toast } from 'sonner';

export interface UnifiedEmailAnalytics {
  // Email metrics
  sizeKB: number;
  imageCount: number;
  linkCount: number;
  wordCount: number;
  characterCount: number;
  
  // OpenAI performance predictions
  overallScore: number;
  deliverabilityScore: number;
  mobileScore: number;
  spamScore: number;
  
  // Performance predictions
  performancePrediction: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  
  // Brand analysis
  brandVoiceScore?: number;
  engagementScore?: number;
  readabilityScore?: number;
}

class UnifiedEmailAnalyticsService {
  private static cache = new Map<string, { data: UnifiedEmailAnalytics; timestamp: number }>();
  private static CACHE_DURATION = 300000; // 5 minutes (extended from 30 seconds)

  private static calculateBasicMetrics(emailHTML: string): Partial<UnifiedEmailAnalytics> {
    const textContent = emailHTML.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const imageMatches = emailHTML.match(/<img[^>]*>/gi) || [];
    const linkMatches = emailHTML.match(/<a[^>]*href[^>]*>/gi) || [];
    
    return {
      sizeKB: Math.round((new Blob([emailHTML]).size) / 1024 * 100) / 100,
      imageCount: imageMatches.length,
      linkCount: linkMatches.length,
      wordCount: words.length,
      characterCount: textContent.length
    };
  }

  static async analyzeEmail(emailHTML: string, subjectLine: string): Promise<UnifiedEmailAnalytics> {
    if (!emailHTML.trim()) {
      return {
        sizeKB: 0,
        imageCount: 0,
        linkCount: 0,
        wordCount: 0,
        characterCount: 0,
        overallScore: 0,
        deliverabilityScore: 0,
        mobileScore: 0,
        spamScore: 0,
        performancePrediction: {
          openRate: 0,
          clickRate: 0,
          conversionRate: 0
        }
      };
    }

    const cacheKey = `${emailHTML}-${subjectLine}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Unified analytics: Using cached result');
      return cached.data;
    }

    // Check if API key is available
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured - cannot perform real analysis');
      throw new Error('OpenAI API key not available for analysis');
    }

    try {
      console.log('Unified analytics: Calling OpenAI for comprehensive email analysis');
      
      // Get basic metrics
      const basicMetrics = this.calculateBasicMetrics(emailHTML);
      
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
        brandVoiceScore: brandAnalysis.brandVoiceScore,
        engagementScore: brandAnalysis.engagementScore,
        readabilityScore: brandAnalysis.readabilityScore
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
}

export { UnifiedEmailAnalyticsService };
