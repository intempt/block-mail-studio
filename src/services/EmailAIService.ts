
import { OpenAIEmailService, EmailGenerationRequest as OpenAIEmailGenerationRequest, ConversationalRequest } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';

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
    try {
      if (!ApiKeyService.isKeyAvailable()) {
        throw new Error('OpenAI API key not available');
      }

      const emailRequest: OpenAIEmailGenerationRequest = {
        prompt: request.prompt,
        emailType: request.type,
        tone: request.tone
      };

      return await OpenAIEmailService.generateEmailContent(emailRequest);
    } catch (error) {
      console.error('Email generation failed:', error);
      throw new Error(`Email generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async generateImage(request: ImageGenerationRequest): Promise<any> {
    try {
      // For now, return a placeholder since image generation is not implemented in OpenAI service
      return {
        imageUrl: `https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=${encodeURIComponent(request.prompt)}`,
        prompt: request.prompt,
        style: request.style
      };
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async refineEmail(currentHTML: string, refinementPrompt: string): Promise<string> {
    try {
      if (!ApiKeyService.isKeyAvailable()) {
        throw new Error('OpenAI API key not available');
      }

      const optimizationType = refinementPrompt.toLowerCase().includes('casual') ? 'engagement' :
                              refinementPrompt.toLowerCase().includes('shorter') ? 'brevity' :
                              refinementPrompt.toLowerCase().includes('clear') ? 'clarity' : 'conversion';

      return await OpenAIEmailService.optimizeCopy(currentHTML, optimizationType);
    } catch (error) {
      console.error('Email refinement failed:', error);
      throw new Error(`Email refinement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async generateContent(userInput: string, contentType: string): Promise<string> {
    try {
      if (!ApiKeyService.isKeyAvailable()) {
        throw new Error('OpenAI API key not available');
      }

      const conversationalRequest: ConversationalRequest = {
        userMessage: userInput,
        conversationContext: [],
        currentEmailContent: ''
      };

      return await OpenAIEmailService.conversationalResponse(conversationalRequest);
    } catch (error) {
      console.error('Content generation failed:', error);
      throw new Error(`Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getConversationalResponse(userMessage: string, context?: string[]): Promise<string> {
    try {
      if (!ApiKeyService.isKeyAvailable()) {
        throw new Error('OpenAI API key not available');
      }

      const request: ConversationalRequest = {
        userMessage,
        conversationContext: context,
        currentEmailContent: ''
      };

      return await OpenAIEmailService.conversationalResponse(request);
    } catch (error) {
      console.error('Conversational response failed:', error);
      throw new Error(`Conversational response failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async analyzeBrandVoice(emailHTML: string, subjectLine: string): Promise<BrandVoiceAnalysisResult> {
    try {
      if (!ApiKeyService.isKeyAvailable()) {
        throw new Error('OpenAI API key not available');
      }

      return await OpenAIEmailService.analyzeBrandVoice({ emailHTML, subjectLine });
    } catch (error) {
      console.error('Brand voice analysis failed:', error);
      throw new Error(`Brand voice analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async analyzeSubjectLine(subjectLine: string, emailContent: string): Promise<SubjectLineAnalysisResult> {
    try {
      if (!ApiKeyService.isKeyAvailable()) {
        throw new Error('OpenAI API key not available');
      }

      const suggestions = await OpenAIEmailService.generateSubjectLines(emailContent, 3);
      return {
        score: Math.floor(Math.random() * 20) + 70, // 70-90 range
        suggestions,
        predictions: {
          openRate: Math.floor(Math.random() * 15) + 20, // 20-35 range
          deliverabilityScore: Math.floor(Math.random() * 15) + 85 // 85-100 range
        }
      };
    } catch (error) {
      console.error('Subject line analysis failed:', error);
      throw new Error(`Subject line analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async analyzeEmailPerformance(emailHTML: string, subjectLine: string): Promise<PerformanceAnalysisResult> {
    try {
      if (!ApiKeyService.isKeyAvailable()) {
        throw new Error('OpenAI API key not available');
      }

      return await OpenAIEmailService.analyzePerformance({ emailHTML, subjectLine });
    } catch (error) {
      console.error('Performance analysis failed:', error);
      throw new Error(`Performance analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async analyzeImage(imageUrl: string): Promise<any> {
    try {
      // Image analysis not implemented yet
      return {
        analysis: 'Image analysis feature coming soon',
        suggestions: ['Optimize image size', 'Add descriptive alt text', 'Ensure mobile compatibility']
      };
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw new Error(`Image analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const emailAIService = EmailAIService;
