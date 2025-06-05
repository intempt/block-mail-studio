import { EmailAIService } from './EmailAIService';
import { ServiceResult, handleServiceError, handleServiceSuccess } from '@/utils/serviceErrorHandler';

export interface EmailContext {
  subjectLine?: string;
  recipientData?: Record<string, any>;
  campaignType?: string;
  brandGuidelines?: string;
  blockType?: string;
  emailHTML?: string;
  targetAudience?: string;
}

export interface ContentGenerationRequest {
  prompt: string;
  context?: EmailContext;
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent';
  length?: 'short' | 'medium' | 'long';
}

export interface ContentOptimizationRequest {
  content: string;
  optimizationType: 'engagement' | 'clarity' | 'brevity' | 'conversion';
  context?: EmailContext;
}

export class TipTapAIService {
  static async generateContent(request: ContentGenerationRequest): Promise<ServiceResult<string>> {
    try {
      const result = await EmailAIService.generateContent(
        request.prompt,
        request.tone || 'professional'
      );
      return result;
    } catch (error) {
      return handleServiceError(error, 'generateContent');
    }
  }

  static async optimizeContent(request: ContentOptimizationRequest): Promise<ServiceResult<string>> {
    try {
      const result = await EmailAIService.refineEmail(
        request.content,
        `Optimize for ${request.optimizationType}`
      );
      return result;
    } catch (error) {
      return handleServiceError(error, 'optimizeContent');
    }
  }

  static async improveReadability(content: string): Promise<ServiceResult<string>> {
    try {
      const result = await EmailAIService.refineEmail(
        content,
        'Improve readability and clarity while maintaining the original meaning'
      );
      return result;
    } catch (error) {
      return handleServiceError(error, 'improveReadability');
    }
  }

  static async expandContent(content: string, direction: string): Promise<ServiceResult<string>> {
    try {
      const result = await EmailAIService.refineEmail(
        content,
        `Expand this content with more details about ${direction}`
      );
      return result;
    } catch (error) {
      return handleServiceError(error, 'expandContent');
    }
  }

  static async createVariations(content: string, count: number = 3): Promise<ServiceResult<string[]>> {
    try {
      const variations: string[] = [];
      
      for (let i = 0; i < count; i++) {
        const variationResult = await EmailAIService.refineEmail(
          content,
          `Create a variation of this content with a different approach (variation ${i + 1})`
        );
        
        if (variationResult.success) {
          variations.push(variationResult.data);
        }
      }
      
      if (variations.length > 0) {
        return handleServiceSuccess(variations, `Generated ${variations.length} content variations`);
      } else {
        return handleServiceError(new Error('Failed to generate any variations'), 'createVariations');
      }
    } catch (error) {
      return handleServiceError(error, 'createVariations');
    }
  }

  static async getPersonalizationSuggestions(content: string, recipientData?: Record<string, any>): Promise<ServiceResult<string[]>> {
    try {
      const suggestions = [
        'Add recipient\'s name in the greeting',
        'Reference their company or industry',
        'Include location-specific information',
        'Mention their past interactions or purchases'
      ];
      
      return handleServiceSuccess(suggestions, 'Personalization suggestions generated');
    } catch (error) {
      return handleServiceError(error, 'getPersonalizationSuggestions');
    }
  }
}

export const tiptapAIService = TipTapAIService;
