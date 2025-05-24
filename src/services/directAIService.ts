
import { emailAIService, BrandVoiceAnalysisResult, SubjectLineAnalysisResult, PerformanceAnalysisResult } from './EmailAIService';

class DirectAIServiceManager {
  async analyzeSubjectLine(
    subjectLine: string, 
    emailContent: string = ''
  ): Promise<SubjectLineAnalysisResult> {
    console.log('Direct subject line analysis for:', subjectLine);
    return emailAIService.analyzeSubjectLine(subjectLine, emailContent);
  }

  async analyzeBrandVoice(
    emailHTML: string, 
    subjectLine: string = ''
  ): Promise<BrandVoiceAnalysisResult> {
    console.log('Direct brand voice analysis');
    return emailAIService.analyzeBrandVoice(emailHTML, subjectLine);
  }

  async analyzePerformance(
    emailHTML: string, 
    subjectLine: string = ''
  ): Promise<PerformanceAnalysisResult> {
    console.log('Direct performance analysis');
    return emailAIService.analyzeEmailPerformance(emailHTML, subjectLine);
  }

  async generateSubjectVariants(subjectLine: string, count: number = 3): Promise<string[]> {
    console.log('Generating subject variants for:', subjectLine);
    const variants = [];
    for (let i = 0; i < count; i++) {
      const variant = await emailAIService.generateContent(
        `Create a variant of this subject line that has similar meaning but different wording: "${subjectLine}"`,
        'general'
      );
      variants.push(variant.trim().replace(/^["']|["']$/g, ''));
    }
    return variants;
  }

  async generateContent(prompt: string, type: string): Promise<string> {
    console.log('Direct content generation:', type);
    return emailAIService.generateContent(prompt, 'general');
  }
}

export const directAIService = new DirectAIServiceManager();
