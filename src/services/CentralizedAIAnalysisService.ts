
import { OpenAIEmailService, BrandVoiceAnalysis, PerformanceAnalysis } from './openAIEmailService';
import { toast } from 'sonner';

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
  blockId?: string;
  targetElement?: string;
  styleChanges?: any;
}

export class CentralizedAIAnalysisService {
  static async runCompleteAnalysis(emailHTML: string, subjectLine: string): Promise<CompleteAnalysisResult> {
    if (!emailHTML || emailHTML.length < 50) {
      throw new Error('Email content is too short for analysis');
    }

    const startTime = Date.now();
    const errors: string[] = [];

    console.log('CentralizedAI: Starting complete analysis for email content');

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
    
    if (errors.length > 0) {
      console.warn(`CentralizedAI: Analysis completed with ${errors.length} errors`);
    } else {
      console.log('CentralizedAI: Analysis completed successfully');
    }

    return {
      brandVoice,
      performance,
      subjectVariants,
      optimizations,
      executionTime,
      errors
    };
  }

  static convertToUnifiedSuggestions(result: CompleteAnalysisResult, emailHTML: string = ''): UnifiedAISuggestion[] {
    const suggestions: UnifiedAISuggestion[] = [];
    
    console.log('CentralizedAI: Converting analysis to unified suggestions');

    // Extract text content from HTML for better targeting
    const extractTextFromHTML = (html: string): string[] => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const textNodes: string[] = [];
      
      // Get text from paragraphs
      const paragraphs = tempDiv.querySelectorAll('p');
      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text && text.length > 10) {
          textNodes.push(text);
        }
      });
      
      // Get text from headers
      const headers = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headers.forEach(h => {
        const text = h.textContent?.trim();
        if (text && text.length > 5) {
          textNodes.push(text);
        }
      });
      
      // Get button text
      const buttons = tempDiv.querySelectorAll('a');
      buttons.forEach(a => {
        const text = a.textContent?.trim();
        if (text && text.length > 2) {
          textNodes.push(text);
        }
      });
      
      return textNodes;
    };

    const emailTextContent = extractTextFromHTML(emailHTML);

    // Brand voice suggestions with enhanced targeting
    if (result.brandVoice?.suggestions) {
      result.brandVoice.suggestions.forEach((suggestion, index) => {
        // Try to match suggestion content with actual email content
        const matchingContent = emailTextContent.find(text => 
          text.toLowerCase().includes(suggestion.current.toLowerCase()) ||
          suggestion.current.toLowerCase().includes(text.toLowerCase())
        );

        suggestions.push({
          id: `brandvoice_${index}`,
          type: suggestion.type as any,
          category: 'brandVoice',
          title: suggestion.title,
          current: matchingContent || suggestion.current,
          suggested: suggestion.suggested,
          reason: suggestion.reason,
          impact: suggestion.impact as any,
          confidence: suggestion.confidence,
          applied: false,
          targetElement: suggestion.type === 'cta' ? 'button' : 'text'
        });
      });
    }

    // Performance suggestions with accessibility focus
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
          applied: false,
          targetElement: 'design',
          styleChanges: {
            color: issue.type.includes('contrast') ? '#000000' : undefined,
            fontSize: issue.type.includes('text') ? '16px' : undefined
          }
        });
      });
    }

    // Subject line variants as suggestions
    if (result.subjectVariants.length > 0) {
      result.subjectVariants.slice(0, 3).forEach((variant, index) => {
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

    // Content optimization suggestions with smart targeting
    Object.entries(result.optimizations).forEach(([type, content], index) => {
      if (content && content.length > 20) {
        // Try to find the best matching content in the email
        const bestMatch = emailTextContent.find(text => 
          text.length > 50 && (text.includes('.') || text.includes('!'))
        ) || emailTextContent[0] || 'Current content';

        suggestions.push({
          id: `optimization_${type}_${index}`,
          type: 'copy',
          category: 'optimization',
          title: `Optimize for ${type}`,
          current: bestMatch,
          suggested: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
          reason: `Improved content optimized for ${type}`,
          impact: type === 'engagement' || type === 'conversion' ? 'high' : 'medium',
          confidence: 75,
          applied: false,
          targetElement: 'text'
        });
      }
    });

    // Add some smart content-based suggestions
    if (emailTextContent.length > 0) {
      const longTexts = emailTextContent.filter(text => text.length > 100);
      if (longTexts.length > 0) {
        suggestions.push({
          id: 'smart_brevity',
          type: 'copy',
          category: 'optimization',
          title: 'Improve readability',
          current: longTexts[0],
          suggested: 'Break this into shorter, more scannable paragraphs for better mobile readability',
          reason: 'Shorter paragraphs improve engagement and readability',
          impact: 'medium',
          confidence: 80,
          applied: false,
          targetElement: 'text'
        });
      }

      // Look for generic button text
      const genericButtons = emailTextContent.filter(text => 
        ['click here', 'read more', 'learn more', 'button'].some(generic => 
          text.toLowerCase().includes(generic)
        )
      );
      
      if (genericButtons.length > 0) {
        suggestions.push({
          id: 'smart_cta',
          type: 'cta',
          category: 'optimization',
          title: 'Improve call-to-action',
          current: genericButtons[0],
          suggested: 'Get Started Now',
          reason: 'Action-oriented CTAs perform better than generic text',
          impact: 'high',
          confidence: 90,
          applied: false,
          targetElement: 'button'
        });
      }
    }

    console.log('CentralizedAI: Generated', suggestions.length, 'unified suggestions');
    return suggestions.slice(0, 8); // Limit to 8 most relevant suggestions
  }

  static async generateContextualSuggestions(blocks: any[], subjectLine: string): Promise<UnifiedAISuggestion[]> {
    console.log('CentralizedAI: Generating contextual suggestions for', blocks.length, 'blocks');
    
    const suggestions: UnifiedAISuggestion[] = [];
    
    // Analyze each block for specific improvements
    blocks.forEach((block, index) => {
      if (block.type === 'text' && block.content.html) {
        const textContent = block.content.html.replace(/<[^>]*>/g, '').trim();
        
        if (textContent.length > 150) {
          suggestions.push({
            id: `block_${block.id}_brevity`,
            type: 'copy',
            category: 'optimization',
            title: 'Shorten text block',
            current: textContent,
            suggested: 'Consider breaking this into shorter, more digestible paragraphs',
            reason: 'Shorter text blocks improve readability and engagement',
            impact: 'medium',
            confidence: 75,
            applied: false,
            blockId: block.id,
            targetElement: 'text'
          });
        }
        
        if (!textContent.includes('?') && !textContent.includes('!') && textContent.length > 50) {
          suggestions.push({
            id: `block_${block.id}_engagement`,
            type: 'tone',
            category: 'optimization', 
            title: 'Add engaging elements',
            current: textContent,
            suggested: 'Add questions or exclamation points to make the content more engaging',
            reason: 'Questions and emotional language increase reader engagement',
            impact: 'medium',
            confidence: 70,
            applied: false,
            blockId: block.id,
            targetElement: 'text'
          });
        }
      }
      
      if (block.type === 'button' && block.content.text) {
        const buttonText = block.content.text.toLowerCase();
        
        if (['click here', 'read more', 'learn more'].includes(buttonText)) {
          suggestions.push({
            id: `block_${block.id}_cta`,
            type: 'cta',
            category: 'optimization',
            title: 'Improve button text',
            current: block.content.text,
            suggested: 'Get Started Today',
            reason: 'Specific action words perform better than generic text',
            impact: 'high',
            confidence: 85,
            applied: false,
            blockId: block.id,
            targetElement: 'button'
          });
        }
      }
    });
    
    // Subject line suggestions
    if (subjectLine) {
      if (subjectLine.length > 50) {
        suggestions.push({
          id: 'subject_length',
          type: 'subject',
          category: 'optimization',
          title: 'Shorten subject line',
          current: subjectLine,
          suggested: subjectLine.substring(0, 45) + '...',
          reason: 'Subject lines over 50 characters may be truncated on mobile',
          impact: 'high',
          confidence: 90,
          applied: false
        });
      }
      
      if (!subjectLine.includes('?') && !subjectLine.includes('!')) {
        suggestions.push({
          id: 'subject_engagement',
          type: 'subject',
          category: 'optimization',
          title: 'Add urgency to subject',
          current: subjectLine,
          suggested: subjectLine + '!',
          reason: 'Adding urgency or questions can improve open rates',
          impact: 'medium',
          confidence: 75,
          applied: false
        });
      }
    }
    
    console.log('CentralizedAI: Generated', suggestions.length, 'contextual suggestions');
    return suggestions;
  }
}
