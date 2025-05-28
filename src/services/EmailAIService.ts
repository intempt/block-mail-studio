
import { OpenAIEmailService, EmailGenerationRequest as OpenAIEmailGenerationRequest, ConversationalRequest } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';
import { toast } from 'sonner';

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
  static async generateEmail(request: EmailGenerationRequest): Promise<any> {
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured properly');
      throw new Error('OpenAI API key not available. Please configure your API key to use AI features.');
    }

    try {
      const emailRequest: OpenAIEmailGenerationRequest = {
        prompt: request.prompt,
        emailType: request.type,
        tone: request.tone
      };

      const result = await OpenAIEmailService.generateEmailContent(emailRequest);
      return result;
    } catch (error) {
      console.error('Email generation failed:', error);
      toast.error('Failed to generate email');
      throw error;
    }
  }

  static async generateImage(request: ImageGenerationRequest): Promise<any> {
    // Image generation placeholder - not implemented with OpenAI DALL-E yet
    return {
      imageUrl: `https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=${encodeURIComponent(request.prompt)}`,
      prompt: request.prompt,
      style: request.style
    };
  }

  static async refineEmail(currentHTML: string, refinementPrompt: string): Promise<string> {
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured properly');
      throw new Error('OpenAI API key not available. Please configure your API key to use AI features.');
    }

    try {
      const optimizationType = refinementPrompt.toLowerCase().includes('casual') ? 'engagement' :
                              refinementPrompt.toLowerCase().includes('shorter') ? 'brevity' :
                              refinementPrompt.toLowerCase().includes('clear') ? 'clarity' : 'conversion';

      const result = await OpenAIEmailService.optimizeCopy(currentHTML, optimizationType);
      return result;
    } catch (error) {
      console.error('Email refinement failed:', error);
      toast.error('Failed to refine email');
      throw error;
    }
  }

  static async generateContent(userInput: string, contentType: string): Promise<string> {
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured properly');
      throw new Error('OpenAI API key not available. Please configure your API key to use AI features.');
    }

    try {
      const conversationalRequest: ConversationalRequest = {
        userMessage: userInput,
        conversationContext: [],
        currentEmailContent: ''
      };

      const result = await OpenAIEmailService.conversationalResponse(conversationalRequest);
      return result;
    } catch (error) {
      console.error('Content generation failed:', error);
      toast.error('Failed to generate content');
      throw error;
    }
  }

  static async getConversationalResponse(userMessage: string, context?: string[]): Promise<string> {
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured properly');
      throw new Error('OpenAI API key not available. Please configure your API key to use AI features.');
    }

    try {
      const request: ConversationalRequest = {
        userMessage,
        conversationContext: context,
        currentEmailContent: ''
      };

      const result = await OpenAIEmailService.conversationalResponse(request);
      return result;
    } catch (error) {
      console.error('Conversational response failed:', error);
      toast.error('Failed to get AI response');
      throw error;
    }
  }

  static async analyzeBrandVoice(emailHTML: string, subjectLine: string): Promise<BrandVoiceAnalysisResult> {
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured properly');
      throw new Error('OpenAI API key not available. Please configure your API key to use AI features.');
    }

    try {
      const result = await OpenAIEmailService.analyzeBrandVoice({ emailHTML, subjectLine });
      return result;
    } catch (error) {
      console.error('Brand voice analysis failed:', error);
      toast.error('Failed to analyze brand voice');
      throw error;
    }
  }

  static async analyzeSubjectLine(subjectLine: string, emailContent: string): Promise<SubjectLineAnalysisResult> {
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured properly');
      throw new Error('OpenAI API key not available. Please configure your API key to use AI features.');
    }

    try {
      const suggestions = await OpenAIEmailService.generateSubjectLines(emailContent, 3);
      return {
        score: Math.floor(Math.random() * 20) + 70, // This should be enhanced to use real AI scoring
        suggestions,
        predictions: {
          openRate: Math.floor(Math.random() * 15) + 20,
          deliverabilityScore: Math.floor(Math.random() * 15) + 85
        }
      };
    } catch (error) {
      console.error('Subject line analysis failed:', error);
      toast.error('Failed to analyze subject line');
      throw error;
    }
  }

  static async analyzeEmailPerformance(emailHTML: string, subjectLine: string): Promise<PerformanceAnalysisResult> {
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured properly');
      throw new Error('OpenAI API key not available. Please configure your API key to use AI features.');
    }

    try {
      const result = await OpenAIEmailService.analyzePerformance({ emailHTML, subjectLine });
      return result;
    } catch (error) {
      console.error('Email performance analysis failed:', error);
      toast.error('Failed to analyze email performance');
      throw error;
    }
  }

  static async analyzeImage(imageUrl: string): Promise<any> {
    return {
      analysis: 'Image analysis feature coming soon',
      suggestions: ['Optimize image size', 'Add descriptive alt text', 'Ensure mobile compatibility']
    };
  }
}

export const emailAIService = EmailAIService;
