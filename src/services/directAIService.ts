
import { emailAIService, BrandVoiceAnalysisResult, SubjectLineAnalysisResult, PerformanceAnalysisResult } from './EmailAIService';
import { OpenAIEmailService } from './openAIEmailService';

class DirectAIServiceManager {
  async analyzeSubjectLine(
    subjectLine: string, 
    emailContent: string = ''
  ): Promise<SubjectLineAnalysisResult> {
    console.log('Direct subject line analysis for:', subjectLine);
    
    try {
      // Use enhanced subject line analysis
      const suggestions = await OpenAIEmailService.generateSubjectLines(emailContent || subjectLine, 5);
      
      // Calculate email marketing score based on best practices
      const score = this.calculateSubjectLineScore(subjectLine);
      
      return {
        score,
        suggestions: suggestions.slice(0, 3), // Return top 3 suggestions
        predictions: {
          openRate: this.predictOpenRate(subjectLine),
          deliverabilityScore: this.calculateDeliverabilityScore(subjectLine)
        }
      };
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
  ): Promise<BrandVoiceAnalysisResult> {
    console.log('Direct brand voice analysis with email marketing expertise');
    return OpenAIEmailService.analyzeBrandVoice({ emailHTML, subjectLine });
  }

  async analyzePerformance(
    emailHTML: string, 
    subjectLine: string = ''
  ): Promise<PerformanceAnalysisResult> {
    console.log('Direct performance analysis with email standards');
    return OpenAIEmailService.analyzePerformance({ emailHTML, subjectLine });
  }

  async generateSubjectVariants(subjectLine: string, count: number = 3): Promise<string[]> {
    console.log('Generating email marketing optimized subject variants for:', subjectLine);
    
    try {
      // Use enhanced subject line generation with email marketing best practices
      const variants = await OpenAIEmailService.generateSubjectLines(
        `Original subject: ${subjectLine}. Generate variations optimized for email marketing.`,
        count + 2 // Generate extra to filter best ones
      );
      
      // Filter and score variants, return best ones
      const scoredVariants = variants.map(variant => ({
        text: variant,
        score: this.calculateSubjectLineScore(variant)
      })).sort((a, b) => b.score - a.score);
      
      return scoredVariants.slice(0, count).map(v => v.text);
    } catch (error) {
      console.error('Subject variant generation failed:', error);
      // Fallback to simple variations
      return this.generateFallbackVariants(subjectLine, count);
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

  async generateContent(prompt: string, type: string): Promise<string> {
    console.log('Direct content generation with email marketing focus:', type);
    return emailAIService.generateContent(prompt, 'email-marketing');
  }
}

export const directAIService = new DirectAIServiceManager();
