import { emailAIService, BrandVoiceAnalysisResult, SubjectLineAnalysisResult, PerformanceAnalysisResult } from './EmailAIService';
import { OpenAIEmailService } from './openAIEmailService';
import { ServiceResult, handleServiceError, handleServiceSuccess } from '@/utils/serviceErrorHandler';

class DirectAIServiceManager {
  async analyzeSubjectLine(
    subjectLine: string, 
    emailContent: string = ''
  ): Promise<ServiceResult<SubjectLineAnalysisResult>> {
    console.log('Direct subject line analysis for:', subjectLine);
    
    try {
      const suggestions = await OpenAIEmailService.generateSubjectLines(emailContent || subjectLine, 5);
      const score = this.calculateSubjectLineScore(subjectLine);
      
      const result = {
        score,
        suggestions: suggestions.slice(0, 3),
        predictions: {
          openRate: this.predictOpenRate(subjectLine),
          deliverabilityScore: this.calculateDeliverabilityScore(subjectLine)
        }
      };
      
      return handleServiceSuccess(result, 'Subject line analysis completed');
    } catch (error) {
      console.error('Subject line analysis failed:', error);
      return emailAIService.analyzeSubjectLine(subjectLine, emailContent);
    }
  }

  private calculateSubjectLineScore(subjectLine: string): number {
    let score = 70; // Base score
    
    // Email marketing best practices scoring
    if (subjectLine.length <= 50) score += 10; // Mobile optimization
    if (subjectLine.length >= 30) score += 5; // Not too short
    if (subjectLine.length < 10) score -= 20; // Too short penalty
    if (subjectLine.length > 60) score -= 15; // Too long penalty
    
    // Spam trigger analysis
    const spamTriggers = ['free', 'act now', 'limited time', '!!!', '$$$', 'urgent'];
    const spamCount = spamTriggers.filter(trigger => 
      subjectLine.toLowerCase().includes(trigger.toLowerCase())
    ).length;
    score -= spamCount * 5;
    
    // Positive indicators
    if (/\d/.test(subjectLine)) score += 5; // Contains numbers
    if (subjectLine.includes('?')) score += 3; // Question format
    if (subjectLine.match(/[A-Z][a-z]/)) score += 3; // Proper capitalization
    
    return Math.max(0, Math.min(100, score));
  }

  private predictOpenRate(subjectLine: string): number {
    const baseRate = 22; // Industry average
    let multiplier = 1;
    
    // Email marketing factors
    if (subjectLine.length <= 50) multiplier += 0.1;
    if (subjectLine.includes('?')) multiplier += 0.05;
    if (/\d/.test(subjectLine)) multiplier += 0.03;
    
    // Negative factors
    if (subjectLine.toLowerCase().includes('free')) multiplier -= 0.05;
    if (subjectLine.includes('!')) multiplier -= 0.02;
    
    return Math.round(baseRate * multiplier * 100) / 100;
  }

  private calculateDeliverabilityScore(subjectLine: string): number {
    let score = 85; // Base deliverability score
    
    // Spam indicators
    const spamWords = ['free', 'winner', 'congratulations', 'urgent', 'act now'];
    spamWords.forEach(word => {
      if (subjectLine.toLowerCase().includes(word)) score -= 5;
    });
    
    // Excessive punctuation
    const exclamationCount = (subjectLine.match(/!/g) || []).length;
    if (exclamationCount > 1) score -= exclamationCount * 3;
    
    // All caps penalty
    if (subjectLine === subjectLine.toUpperCase() && subjectLine.length > 3) score -= 10;
    
    return Math.max(60, Math.min(100, score));
  }

  async analyzeBrandVoice(
    emailHTML: string, 
    subjectLine: string = ''
  ): Promise<ServiceResult<BrandVoiceAnalysisResult>> {
    console.log('Direct brand voice analysis with email marketing expertise');
    try {
      const result = await OpenAIEmailService.analyzeBrandVoice({ emailHTML, subjectLine });
      return handleServiceSuccess(result, 'Brand voice analysis completed');
    } catch (error) {
      return handleServiceError(error, 'analyzeBrandVoice');
    }
  }

  async analyzePerformance(
    emailHTML: string, 
    subjectLine: string = ''
  ): Promise<ServiceResult<PerformanceAnalysisResult>> {
    console.log('Direct performance analysis with email standards');
    try {
      const result = await OpenAIEmailService.analyzePerformance({ emailHTML, subjectLine });
      return handleServiceSuccess(result, 'Performance analysis completed');
    } catch (error) {
      return handleServiceError(error, 'analyzePerformance');
    }
  }

  async generateSubjectVariants(subjectLine: string, count: number = 3): Promise<ServiceResult<string[]>> {
    console.log('Generating email marketing optimized subject variants for:', subjectLine);
    
    try {
      const variants = await OpenAIEmailService.generateSubjectLines(
        `Original subject: ${subjectLine}. Generate variations optimized for email marketing.`,
        count + 2
      );
      
      const scoredVariants = variants.map(variant => ({
        text: variant,
        score: this.calculateSubjectLineScore(variant)
      })).sort((a, b) => b.score - a.score);
      
      const result = scoredVariants.slice(0, count).map(v => v.text);
      return handleServiceSuccess(result, 'Subject variants generated successfully');
    } catch (error) {
      console.error('Subject variant generation failed:', error);
      const fallbackResult = this.generateFallbackVariants(subjectLine, count);
      return handleServiceSuccess(fallbackResult, 'Subject variants generated (fallback mode)');
    }
  }

  private generateFallbackVariants(subjectLine: string, count: number): string[] {
    const variants = [];
    const original = subjectLine;
    
    // Create simple variations based on email marketing patterns
    if (original.length > 40) {
      variants.push(original.slice(0, 40) + '...');
    }
    
    if (!original.includes('?')) {
      variants.push(original.replace(/[.!]$/, '') + '?');
    }
    
    if (!/\d/.test(original)) {
      variants.push(`5 ways: ${original.toLowerCase()}`);
    }
    
    // Fill remaining with slight modifications
    while (variants.length < count) {
      const modifier = ['Quick tip:', 'Don\'t miss:', 'New:'][variants.length % 3];
      variants.push(`${modifier} ${original}`);
    }
    
    return variants.slice(0, count);
  }

  async generateContent(prompt: string, type: string): Promise<ServiceResult<string>> {
    console.log('Generating content:', { prompt, type });
    try {
      const result = await emailAIService.generateContent(prompt, type);
      return result;
    } catch (error) {
      return handleServiceError(error, 'generateContent');
    }
  }
}

export const DirectAIService = new DirectAIServiceManager();
