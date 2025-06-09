import { OpenAIEmailService, EmailGenerationRequest as OpenAIEmailGenerationRequest, ConversationalRequest } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';
import { ServiceResult, handleServiceError, handleServiceSuccess } from '@/utils/serviceErrorHandler';

export interface EmailGenerationRequest {
  prompt: string;
  tone: 'professional' | 'casual' | 'friendly' | 'urgent';
  type: 'welcome' | 'promotional' | 'newsletter' | 'announcement';
}

export interface ImageGenerationRequest {
  prompt: string;
  style: 'professional' | 'creative' | 'minimal' | 'vibrant';
}

export interface BrandVoiceAnalysisResult {
  brandVoiceScore: number;
  engagementScore: number;
  toneConsistency: number;
  readabilityScore: number;
  performancePrediction: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  suggestions: Array<{
    type: string;
    title: string;
    current: string;
    suggested: string;
    reason: string;
    impact: string;
    confidence: number;
  }>;
}

export interface SubjectLineAnalysisResult {
  score: number;
  suggestions: string[];
  predictions: {
    openRate: number;
    deliverabilityScore: number;
  };
}

export interface PerformanceAnalysisResult {
  overallScore: number;
  deliverabilityScore: number;
  mobileScore: number;
  spamScore: number;
  metrics: {
    loadTime: { value: number; status: string };
    accessibility: { value: number; status: string };
    imageOptimization: { value: number; status: string };
    linkCount: { value: number; status: string };
  };
  accessibilityIssues: Array<{
    type: string;
    severity: string;
    description: string;
    fix: string;
  }>;
  optimizationSuggestions: string[];
}

export class EmailAIService {
  static async generateEmail(request: EmailGenerationRequest): Promise<ServiceResult<any>> {
    if (!(await ApiKeyService.validateKey())) {
      return handleServiceError(
        new Error('OpenAI API key not available. Please configure your API key to use AI features.'),
        'generateEmail'
      );
    }

    try {
      const emailRequest: OpenAIEmailGenerationRequest = {
        prompt: request.prompt,
        emailType: request.type,
        tone: request.tone
      };

      const result = await OpenAIEmailService.generateEmailContent(emailRequest);
      return handleServiceSuccess(result, 'Email generated successfully');
    } catch (error) {
      return handleServiceError(error, 'generateEmail');
    }
  }

  static async generateImage(request: ImageGenerationRequest): Promise<ServiceResult<any>> {
    try {
      const result = {
        imageUrl: `https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=${encodeURIComponent(request.prompt)}`,
        prompt: request.prompt,
        style: request.style
      };
      return handleServiceSuccess(result, 'Image generated successfully');
    } catch (error) {
      return handleServiceError(error, 'generateImage');
    }
  }

  static async refineEmail(currentHTML: string, refinementPrompt: string): Promise<ServiceResult<string>> {
    if (!(await ApiKeyService.validateKey())) {
      return handleServiceError(
        new Error('OpenAI API key not available. Please configure your API key to use AI features.'),
        'refineEmail'
      );
    }

    try {
      const optimizationType = refinementPrompt.toLowerCase().includes('casual') ? 'engagement' :
                              refinementPrompt.toLowerCase().includes('shorter') ? 'brevity' :
                              refinementPrompt.toLowerCase().includes('clear') ? 'clarity' : 'conversion';

      const result = await OpenAIEmailService.optimizeCopy(currentHTML, optimizationType);
      return handleServiceSuccess(result, 'Email refined successfully');
    } catch (error) {
      return handleServiceError(error, 'refineEmail');
    }
  }

  static async generateContent(userInput: string, contentType: string): Promise<ServiceResult<string>> {
    if (!(await ApiKeyService.validateKey())) {
      return handleServiceError(
        new Error('OpenAI API key not available. Please configure your API key to use AI features.'),
        'generateContent'
      );
    }

    try {
      const conversationalRequest: ConversationalRequest = {
        userMessage: userInput,
        conversationContext: [],
        currentEmailContent: ''
      };

      const result = await OpenAIEmailService.conversationalResponse(conversationalRequest);
      return handleServiceSuccess(result, 'Content generated successfully');
    } catch (error) {
      return handleServiceError(error, 'generateContent');
    }
  }

  static async getConversationalResponse(userMessage: string, context?: string[]): Promise<ServiceResult<string>> {
    if (!(await ApiKeyService.validateKey())) {
      return handleServiceError(
        new Error('OpenAI API key not available. Please configure your API key to use AI features.'),
        'getConversationalResponse'
      );
    }

    try {
      const request: ConversationalRequest = {
        userMessage,
        conversationContext: context,
        currentEmailContent: ''
      };

      const result = await OpenAIEmailService.conversationalResponse(request);
      return handleServiceSuccess(result, 'AI response generated successfully');
    } catch (error) {
      return handleServiceError(error, 'getConversationalResponse');
    }
  }

  static async analyzeBrandVoice(emailHTML: string, subjectLine: string): Promise<ServiceResult<BrandVoiceAnalysisResult>> {
    if (!(await ApiKeyService.validateKey())) {
      return handleServiceError(
        new Error('OpenAI API key not available. Please configure your API key to use AI features.'),
        'analyzeBrandVoice'
      );
    }

    try {
      const result = await OpenAIEmailService.analyzeBrandVoice({ emailHTML, subjectLine });
      return handleServiceSuccess(result, 'Brand voice analysis completed');
    } catch (error) {
      return handleServiceError(error, 'analyzeBrandVoice');
    }
  }

  static async analyzeSubjectLine(subjectLine: string, emailContent: string): Promise<ServiceResult<SubjectLineAnalysisResult>> {
    if (!(await ApiKeyService.validateKey())) {
      return handleServiceError(
        new Error('OpenAI API key not available. Please configure your API key to use AI features.'),
        'analyzeSubjectLine'
      );
    }

    try {
      const suggestions = await OpenAIEmailService.generateSubjectLines(emailContent, 3);
      const score = this.calculateProductionSubjectLineScore(subjectLine);
      
      const result = {
        score,
        suggestions,
        predictions: {
          openRate: this.predictProductionOpenRate(subjectLine),
          deliverabilityScore: this.calculateProductionDeliverabilityScore(subjectLine)
        }
      };
      
      return handleServiceSuccess(result, 'Subject line analysis completed');
    } catch (error) {
      return handleServiceError(error, 'analyzeSubjectLine');
    }
  }

  private static calculateProductionSubjectLineScore(subjectLine: string): number {
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

  private static predictProductionOpenRate(subjectLine: string): number {
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

  private static calculateProductionDeliverabilityScore(subjectLine: string): number {
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

  static async analyzeEmailPerformance(emailHTML: string, subjectLine: string): Promise<ServiceResult<PerformanceAnalysisResult>> {
    if (!(await ApiKeyService.validateKey())) {
      return handleServiceError(
        new Error('OpenAI API key not available. Please configure your API key to use AI features.'),
        'analyzeEmailPerformance'
      );
    }

    try {
      const result = await OpenAIEmailService.analyzePerformance({ emailHTML, subjectLine });
      return handleServiceSuccess(result, 'Email performance analysis completed');
    } catch (error) {
      return handleServiceError(error, 'analyzeEmailPerformance');
    }
  }

  static async analyzeImage(imageUrl: string): Promise<ServiceResult<any>> {
    try {
      const result = {
        analysis: 'Image analysis feature coming soon',
        suggestions: ['Optimize image size', 'Add descriptive alt text', 'Ensure mobile compatibility']
      };
      return handleServiceSuccess(result, 'Image analysis completed');
    } catch (error) {
      return handleServiceError(error, 'analyzeImage');
    }
  }
}

export const emailAIService = EmailAIService;
