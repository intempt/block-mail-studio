
import { OpenAIEmailService, BrandVoiceAnalysis, PerformanceAnalysis } from './openAIEmailService';

export interface CompleteAnalysisResult {
  brandVoice: BrandVoiceAnalysis | null;
  performance: PerformanceAnalysis | null;
  subjectVariants: string[];
  optimizations: {
    engagement: string | null;
    conversion: string | null;
    clarity: string | null;
    brevity: string | null;
  };
  executionTime: number;
  errors: string[];
}

export interface UnifiedAISuggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone' | 'design' | 'performance' | 'optimization';
  category: 'brandVoice' | 'performance' | 'variants' | 'optimization';
  title: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  applied?: boolean;
}

export class CentralizedAIAnalysisService {
  static async runCompleteAnalysis(emailHTML: string, subjectLine: string): Promise<CompleteAnalysisResult> {
    if (!emailHTML || emailHTML.length < 50) {
      throw new Error('Email content is too short for analysis');
    }

    const startTime = Date.now();
    const errors: string[] = [];

    // Run all analyses in parallel
    const [brandVoiceResult, performanceResult, subjectVariantsResult, optimizationResults] = await Promise.allSettled([
      // Brand voice analysis
      OpenAIEmailService.analyzeBrandVoice({ emailHTML, subjectLine }).catch(error => {
        console.error('Brand voice analysis failed:', error);
        errors.push('Brand voice analysis failed');
        return null;
      }),

      // Performance analysis
      OpenAIEmailService.analyzePerformance({ emailHTML, subjectLine }).catch(error => {
        console.error('Performance analysis failed:', error);
        errors.push('Performance analysis failed');
        return null;
      }),

      // Subject line variants
      OpenAIEmailService.generateSubjectLines(emailHTML, 5).catch(error => {
        console.error('Subject line generation failed:', error);
        errors.push('Subject line generation failed');
        return [];
      }),

      // Content optimizations
      Promise.allSettled([
        OpenAIEmailService.optimizeCopy(emailHTML, 'engagement'),
        OpenAIEmailService.optimizeCopy(emailHTML, 'conversion'),
        OpenAIEmailService.optimizeCopy(emailHTML, 'clarity'),
        OpenAIEmailService.optimizeCopy(emailHTML, 'brevity')
      ]).catch(error => {
        console.error('Content optimization failed:', error);
        errors.push('Content optimization failed');
        return [null, null, null, null];
      })
    ]);

    // Process results
    const brandVoice = brandVoiceResult.status === 'fulfilled' ? brandVoiceResult.value : null;
    const performance = performanceResult.status === 'fulfilled' ? performanceResult.value : null;
    const subjectVariants = subjectVariantsResult.status === 'fulfilled' ? subjectVariantsResult.value : [];
    
    let optimizations = {
      engagement: null as string | null,
      conversion: null as string | null,
      clarity: null as string | null,
      brevity: null as string | null
    };

    if (optimizationResults.status === 'fulfilled' && Array.isArray(optimizationResults.value)) {
      const [engagement, conversion, clarity, brevity] = optimizationResults.value;
      optimizations = {
        engagement: engagement.status === 'fulfilled' ? engagement.value : null,
        conversion: conversion.status === 'fulfilled' ? conversion.value : null,
        clarity: clarity.status === 'fulfilled' ? clarity.value : null,
        brevity: brevity.status === 'fulfilled' ? brevity.value : null
      };
    }

    const executionTime = Date.now() - startTime;

    return {
      brandVoice,
      performance,
      subjectVariants,
      optimizations,
      executionTime,
      errors
    };
  }

  static convertToUnifiedSuggestions(result: CompleteAnalysisResult): UnifiedAISuggestion[] {
    const suggestions: UnifiedAISuggestion[] = [];

    // Brand voice suggestions
    if (result.brandVoice?.suggestions) {
      result.brandVoice.suggestions.forEach((suggestion, index) => {
        suggestions.push({
          id: `brandvoice_${index}`,
          type: suggestion.type as any,
          category: 'brandVoice',
          title: suggestion.title,
          current: suggestion.current,
          suggested: suggestion.suggested,
          reason: suggestion.reason,
          impact: suggestion.impact as any,
          confidence: suggestion.confidence,
          applied: false
        });
      });
    }

    // Performance suggestions (derived from accessibility issues and optimization suggestions)
    if (result.performance?.accessibilityIssues) {
      result.performance.accessibilityIssues.forEach((issue, index) => {
        suggestions.push({
          id: `performance_${index}`,
          type: 'design',
          category: 'performance',
          title: `Fix ${issue.type}`,
          current: issue.description,
          suggested: issue.fix,
          reason: `Improve accessibility and performance`,
          impact: issue.severity === 'high' ? 'high' : issue.severity === 'medium' ? 'medium' : 'low',
          confidence: 85,
          applied: false
        });
      });
    }

    // Subject line variants as suggestions
    if (result.subjectVariants.length > 0) {
      result.subjectVariants.forEach((variant, index) => {
        suggestions.push({
          id: `variant_${index}`,
          type: 'subject',
          category: 'variants',
          title: `Subject Line Variant ${index + 1}`,
          current: 'Current subject line',
          suggested: variant,
          reason: 'AI-generated alternative for A/B testing',
          impact: 'medium',
          confidence: 80,
          applied: false
        });
      });
    }

    // Optimization suggestions
    Object.entries(result.optimizations).forEach(([type, content], index) => {
      if (content) {
        suggestions.push({
          id: `optimization_${type}_${index}`,
          type: 'copy',
          category: 'optimization',
          title: `Optimize for ${type}`,
          current: 'Current content',
          suggested: content,
          reason: `Improved content optimized for ${type}`,
          impact: 'medium',
          confidence: 75,
          applied: false
        });
      }
    });

    return suggestions;
  }
}
