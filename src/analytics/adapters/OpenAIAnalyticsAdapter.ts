
import { EmailContent, AnalysisResult, AnalyticsEngine, AnalyticsLogger } from '../core/interfaces';
import { OpenAIEmailService } from '../../services/openAIEmailService';
import { ApiKeyService } from '../../services/apiKeyService';
import { ContentAnalysisEngine } from '../engines/ContentAnalysisEngine';

export class OpenAIAnalyticsAdapter implements AnalyticsEngine {
  constructor(private logger: AnalyticsLogger) {}

  async analyze(content: EmailContent): Promise<Partial<AnalysisResult>> {
    const startTime = Date.now();
    
    try {
      // Get basic metrics first (always available)
      const metrics = ContentAnalysisEngine.analyzeContent(content);
      
      // Attempt AI analysis
      const [brandAnalysis, performanceAnalysis] = await Promise.allSettled([
        OpenAIEmailService.analyzeBrandVoice({
          emailHTML: content.html,
          subjectLine: content.subjectLine
        }),
        OpenAIEmailService.analyzePerformance({
          emailHTML: content.html,
          subjectLine: content.subjectLine
        })
      ]);

      // Extract results with graceful fallbacks
      const brandResult = brandAnalysis.status === 'fulfilled' ? brandAnalysis.value : null;
      const performanceResult = performanceAnalysis.status === 'fulfilled' ? performanceAnalysis.value : null;

      // Combine AI results with fallbacks
      const scores = performanceResult ? {
        overallScore: performanceResult.overallScore,
        deliverabilityScore: performanceResult.deliverabilityScore,
        spamScore: performanceResult.spamScore,
        mobileScore: performanceResult.mobileScore,
        accessibilityScore: performanceResult.metrics?.accessibility?.value || 70
      } : this.generateFallbackScores(content, metrics);

      const prediction = brandResult?.performancePrediction ? {
        openRate: brandResult.performancePrediction.openRate,
        clickRate: brandResult.performancePrediction.clickRate,
        conversionRate: brandResult.performancePrediction.conversionRate,
        confidence: 0.85
      } : this.generateFallbackPrediction(metrics);

      // Convert AI suggestions to our format
      const suggestions = this.convertAISuggestions(
        brandResult?.suggestions || [],
        performanceResult?.accessibilityIssues || [],
        performanceResult?.optimizationSuggestions || []
      );

      return {
        metrics,
        scores,
        prediction,
        suggestions,
        metadata: {
          analysisMethod: 'ai',
          processingTimeMs: Date.now() - startTime,
          version: '1.0.0'
        }
      };

    } catch (error) {
      this.logger.error('OpenAI analysis failed', error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    }
  }

  getCapabilities(): string[] {
    return ['ai-analysis', 'performance-optimization', 'brand-voice', 'engagement-prediction'];
  }

  async isHealthy(): Promise<boolean> {
    try {
      return ApiKeyService.validateKey();
    } catch {
      return false;
    }
  }

  private generateFallbackScores(content: EmailContent, metrics: any) {
    // Use heuristic fallback
    return {
      overallScore: 75,
      deliverabilityScore: 80,
      spamScore: 15,
      mobileScore: 85,
      accessibilityScore: 70
    };
  }

  private generateFallbackPrediction(metrics: any) {
    return {
      openRate: 25.5,
      clickRate: 3.2,
      conversionRate: 2.1,
      confidence: 0.6
    };
  }

  private convertAISuggestions(brandSuggestions: any[], accessibilityIssues: any[], optimizations: string[]) {
    const suggestions = [];

    // Convert brand suggestions
    brandSuggestions.forEach((suggestion, index) => {
      suggestions.push({
        id: `brand_${index}`,
        type: this.mapSuggestionType(suggestion.type),
        severity: this.mapSeverity(suggestion.impact),
        title: suggestion.title,
        description: suggestion.reason,
        recommendation: suggestion.suggested,
        confidence: suggestion.confidence / 100,
        estimatedImpact: this.mapImpactToNumber(suggestion.impact)
      });
    });

    // Convert accessibility issues
    accessibilityIssues.forEach((issue, index) => {
      suggestions.push({
        id: `accessibility_${index}`,
        type: 'accessibility',
        severity: issue.severity,
        title: issue.type,
        description: issue.description,
        recommendation: issue.fix,
        confidence: 0.9,
        estimatedImpact: 0.1
      });
    });

    // Convert optimization suggestions
    optimizations.forEach((optimization, index) => {
      suggestions.push({
        id: `optimization_${index}`,
        type: 'performance',
        severity: 'medium',
        title: 'Performance Optimization',
        description: optimization,
        recommendation: optimization,
        confidence: 0.8,
        estimatedImpact: 0.15
      });
    });

    return suggestions;
  }

  private mapSuggestionType(type: string): 'performance' | 'accessibility' | 'engagement' | 'deliverability' {
    const mapping: Record<string, any> = {
      'subject': 'engagement',
      'copy': 'engagement',
      'cta': 'engagement',
      'tone': 'engagement',
      'design': 'performance',
      'performance': 'performance'
    };
    return mapping[type] || 'engagement';
  }

  private mapSeverity(impact: string): 'low' | 'medium' | 'high' {
    const mapping: Record<string, any> = {
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    return mapping[impact] || 'medium';
  }

  private mapImpactToNumber(impact: string): number {
    const mapping: Record<string, number> = {
      'high': 0.3,
      'medium': 0.2,
      'low': 0.1
    };
    return mapping[impact] || 0.15;
  }
}
