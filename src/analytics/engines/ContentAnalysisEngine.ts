
import { EmailContent, ContentMetrics, AnalysisResult } from '../core/interfaces';

export class ContentAnalysisEngine {
  static analyzeContent(content: EmailContent): ContentMetrics {
    const { html, subjectLine } = content;
    
    // Extract text content
    const textContent = html.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    
    // Count elements
    const imageMatches = html.match(/<img[^>]*>/gi) || [];
    const linkMatches = html.match(/<a[^>]*href[^>]*>/gi) || [];
    
    // CTA detection
    const ctaPattern = /(button|btn|cta|click|buy|shop|download|subscribe|register|sign.?up|get.?started|learn.?more|contact|call)/i;
    const ctaMatches = html.match(new RegExp(`<[^>]*(?:${ctaPattern.source})[^>]*>`, 'gi')) || [];
    
    // Preview text
    const previewText = content.previewText || textContent.substring(0, 90).trim();
    
    return {
      sizeKB: Math.round((new Blob([html]).size) / 1024 * 100) / 100,
      wordCount: words.length,
      characterCount: textContent.length,
      imageCount: imageMatches.length,
      linkCount: linkMatches.length,
      ctaCount: ctaMatches.length,
      subjectLineLength: subjectLine.length,
      previewTextLength: previewText.length
    };
  }

  static generateBasicSuggestions(metrics: ContentMetrics, content: EmailContent): any[] {
    const suggestions = [];

    if (metrics.subjectLineLength > 50) {
      suggestions.push({
        id: 'subject-length',
        type: 'engagement',
        severity: 'medium',
        title: 'Subject Line Too Long',
        description: 'Subject line may be truncated on mobile devices',
        recommendation: 'Keep subject line under 50 characters for optimal mobile display',
        confidence: 0.9,
        estimatedImpact: 0.15
      });
    }

    if (metrics.ctaCount === 0) {
      suggestions.push({
        id: 'no-cta',
        type: 'engagement',
        severity: 'high',
        title: 'No Clear Call-to-Action',
        description: 'Email lacks clear call-to-action buttons or links',
        recommendation: 'Add at least one prominent call-to-action button',
        confidence: 0.95,
        estimatedImpact: 0.3
      });
    }

    if (metrics.imageCount > 5) {
      suggestions.push({
        id: 'too-many-images',
        type: 'performance',
        severity: 'medium',
        title: 'High Image Count',
        description: 'Too many images may slow loading and affect deliverability',
        recommendation: 'Reduce image count or optimize image sizes',
        confidence: 0.8,
        estimatedImpact: 0.1
      });
    }

    return suggestions;
  }
}
