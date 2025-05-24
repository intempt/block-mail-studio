
import { OpenAIEmailService, EmailGenerationRequest, ConversationalRequest } from './openAIEmailService';
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

export class EmailAIService {
  static async generateEmail(request: EmailGenerationRequest): Promise<any> {
    if (!ApiKeyService.isKeyAvailable()) {
      throw new Error('AI not available');
    }

    try {
      const emailRequest = {
        prompt: request.prompt,
        emailType: request.type,
        tone: request.tone
      };

      return await OpenAIEmailService.generateEmailContent(emailRequest);
    } catch (error) {
      console.error('Email generation failed:', error);
      throw new Error('AI not available');
    }
  }

  static async generateImage(request: ImageGenerationRequest): Promise<any> {
    if (!ApiKeyService.isKeyAvailable()) {
      throw new Error('AI not available');
    }

    try {
      // For now, return a placeholder response since image generation would require DALL-E
      // This can be expanded to include actual image generation
      return {
        imageUrl: `https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=${encodeURIComponent(request.prompt)}`,
        prompt: request.prompt,
        style: request.style
      };
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error('AI not available');
    }
  }

  static async refineEmail(currentHTML: string, refinementPrompt: string): Promise<string> {
    if (!ApiKeyService.isKeyAvailable()) {
      throw new Error('AI not available');
    }

    try {
      const optimizationType = refinementPrompt.toLowerCase().includes('casual') ? 'engagement' :
                              refinementPrompt.toLowerCase().includes('shorter') ? 'brevity' :
                              refinementPrompt.toLowerCase().includes('clear') ? 'clarity' : 'conversion';

      return await OpenAIEmailService.optimizeCopy(currentHTML, optimizationType);
    } catch (error) {
      console.error('Email refinement failed:', error);
      throw new Error('AI not available');
    }
  }

  static async generateContent(userInput: string, contentType: string): Promise<string> {
    if (!ApiKeyService.isKeyAvailable()) {
      throw new Error('AI not available');
    }

    try {
      const conversationalRequest: ConversationalRequest = {
        userMessage: userInput,
        conversationContext: [],
        currentEmailContent: ''
      };

      return await OpenAIEmailService.conversationalResponse(conversationalRequest);
    } catch (error) {
      console.error('Content generation failed:', error);
      throw new Error('AI not available');
    }
  }

  static async getConversationalResponse(userMessage: string, context?: string[]): Promise<string> {
    if (!ApiKeyService.isKeyAvailable()) {
      throw new Error('AI not available');
    }

    try {
      const request: ConversationalRequest = {
        userMessage,
        conversationContext: context,
        currentEmailContent: ''
      };

      return await OpenAIEmailService.conversationalResponse(request);
    } catch (error) {
      console.error('Conversational response failed:', error);
      throw new Error('AI not available');
    }
  }
}

export const emailAIService = EmailAIService;
export type { EmailGenerationRequest, ImageGenerationRequest };
