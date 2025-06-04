
import { EmailContent, AnalysisResult, AnalyticsEngine, PerformanceScores, EngagementPrediction } from '../core/interfaces';
import { ContentAnalysisEngine } from './ContentAnalysisEngine';

export class HeuristicAnalysisEngine implements AnalyticsEngine {
  async analyze(content: EmailContent): Promise<Partial<AnalysisResult>> {
    const metrics = ContentAnalysisEngine.analyzeContent(content);
    const scores = this.calculateScores(content, metrics);
    const prediction = this.predictEngagement(content, metrics, scores);
    const suggestions = ContentAnalysisEngine.generateBasicSuggestions(metrics, content);

    return {
      metrics,
      scores,
      prediction,
      suggestions,
      metadata: {
        analysisMethod: 'heuristic',
        processingTimeMs: 10, // Fast heuristic analysis
        version: '1.0.0'
      }
    };
  }

  getCapabilities(): string[] {
    return ['basic-metrics', 'performance-scores', 'simple-suggestions'];
  }

  async isHealthy(): Promise<boolean> {
    return true; // Heuristic engine is always available
  }

  private calculateScores(content: EmailContent, metrics: any): PerformanceScores {
    let deliverabilityScore = 85;
    let spamScore = 10;
    let mobileScore = 80;
    let accessibilityScore = 70;

    // Spam score based on content analysis
    const spamWords = ['free', 'urgent', 'limited time', 'act now', 'click here'];
    const lowerContent = content.html.toLowerCase() + content.subjectLine.toLowerCase();
    spamWords.forEach(word => {
      if (lowerContent.includes(word)) {
        spamScore += 8;
        deliverabilityScore -= 5;
      }
    });

    // Mobile optimization
    if (content.html.includes('@media') || content.html.includes('mobile')) {
      mobileScore += 15;
    }
    if (content.html.includes('max-width: 100%')) {
      mobileScore += 5;
    }

    // Accessibility
    const hasAltText = content.html.includes('alt=');
    if (hasAltText && metrics.imageCount > 0) {
      accessibilityScore += 20;
    }

    const overallScore = Math.round((deliverabilityScore + mobileScore + accessibilityScore - spamScore) / 3);

    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      deliverabilityScore: Math.max(0, Math.min(100, deliverabilityScore)),
      spamScore: Math.max(0, Math.min(100, spamScore)),
      mobileScore: Math.max(0, Math.min(100, mobileScore)),
      accessibilityScore: Math.max(0, Math.min(100, accessibilityScore))
    };
  }

  private predictEngagement(content: EmailContent, metrics: any, scores: PerformanceScores): EngagementPrediction {
    let openRate = 25.5; // Industry baseline
    let clickRate = 3.2;
    let conversionRate = 2.1;

    // Subject line impact
    if (content.subjectLine.length > 5 && content.subjectLine.length < 50) {
      openRate += 2;
    }
    if (content.subjectLine.includes('?') || content.subjectLine.includes('!')) {
      openRate += 1;
    }

    // Content impact
    if (metrics.linkCount > 0 && metrics.linkCount < 5) {
      clickRate += 1;
    }
    if (metrics.ctaCount >= 1) {
      clickRate += 1.5;
      conversionRate += 0.8;
    }

    // Mobile optimization impact
    if (scores.mobileScore > 80) {
      openRate += 1.5;
      clickRate += 0.8;
    }

    return {
      openRate: Math.round(openRate * 10) / 10,
      clickRate: Math.round(clickRate * 10) / 10,
      conversionRate: Math.round(conversionRate * 10) / 10,
      confidence: 0.7 // Moderate confidence for heuristic analysis
    };
  }
}
