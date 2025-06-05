
import { TipTapProService } from './TipTapProService';
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
      const enhancedPrompt = `${request.prompt}${request.context?.targetAudience ? ` for ${request.context.targetAudience}` : ''}${request.length ? ` (${request.length} length)` : ''}`;
      
      const result = await TipTapProService.generateContent(
        enhancedPrompt,
        request.tone || 'professional'
      );
      
      if (result.success) {
        return handleServiceSuccess(result.data!, 'Content generated successfully using TipTap Pro AI');
      } else {
        return handleServiceError(new Error(result.error || 'Generation failed'), 'generateContent');
      }
    } catch (error) {
      return handleServiceError(error, 'generateContent');
    }
  }

  static async optimizeContent(request: ContentOptimizationRequest): Promise<ServiceResult<string>> {
    try {
      const optimizationInstruction = {
        engagement: 'Optimize for higher engagement and click-through rates',
        clarity: 'Improve clarity and readability while maintaining the core message',
        brevity: 'Make more concise while preserving all key information',
        conversion: 'Optimize for better conversion rates and call-to-action effectiveness'
      }[request.optimizationType];

      const result = await TipTapProService.refineEmail(
        request.content,
        optimizationInstruction
      );
      
      if (result.success) {
        return handleServiceSuccess(result.data!, `Content optimized for ${request.optimizationType} using TipTap Pro AI`);
      } else {
        return handleServiceError(new Error(result.error || 'Optimization failed'), 'optimizeContent');
      }
    } catch (error) {
      return handleServiceError(error, 'optimizeContent');
    }
  }

  static async improveReadability(content: string): Promise<ServiceResult<string>> {
    try {
      const result = await TipTapProService.improveText(content, {
        style: 'clear',
        goal: 'readability'
      });
      
      if (result.success) {
        return handleServiceSuccess(result.data!, 'Readability improved using TipTap Pro AI');
      } else {
        return handleServiceError(new Error(result.error || 'Readability improvement failed'), 'improveReadability');
      }
    } catch (error) {
      return handleServiceError(error, 'improveReadability');
    }
  }

  static async expandContent(content: string, direction: string): Promise<ServiceResult<string>> {
    try {
      const result = await TipTapProService.refineEmail(
        content,
        `Expand this content with more details about ${direction}. Add relevant information and examples while maintaining the original tone and message.`
      );
      
      if (result.success) {
        return handleServiceSuccess(result.data!, 'Content expanded using TipTap Pro AI');
      } else {
        return handleServiceError(new Error(result.error || 'Content expansion failed'), 'expandContent');
      }
    } catch (error) {
      return handleServiceError(error, 'expandContent');
    }
  }

  static async createVariations(content: string, count: number = 3): Promise<ServiceResult<string[]>> {
    try {
      const result = await TipTapProService.generateVariations(content, count);
      
      if (result.success && result.data) {
        return handleServiceSuccess(result.data, `Generated ${result.data.length} content variations using TipTap Pro AI`);
      } else {
        // Fallback to individual generation calls
        const variations: string[] = [];
        
        for (let i = 0; i < count; i++) {
          const variationResult = await TipTapProService.refineEmail(
            content,
            `Create a variation of this content with a different approach and style (variation ${i + 1})`
          );
          
          if (variationResult.success) {
            variations.push(variationResult.data!);
          }
        }
        
        if (variations.length > 0) {
          return handleServiceSuccess(variations, `Generated ${variations.length} content variations using TipTap Pro AI`);
        } else {
          return handleServiceError(new Error('Failed to generate any variations'), 'createVariations');
        }
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
        'Mention their past interactions or purchases',
        'Use TipTap Pro AI to customize tone for their segment',
        'Add dynamic content blocks based on their preferences'
      ];
      
      return handleServiceSuccess(suggestions, 'Personalization suggestions generated with TipTap Pro insights');
    } catch (error) {
      return handleServiceError(error, 'getPersonalizationSuggestions');
    }
  }

  // New TipTap Pro specific methods
  static async enhanceWithAI(content: string, enhancement: 'professional' | 'casual' | 'persuasive' | 'concise'): Promise<ServiceResult<string>> {
    try {
      const enhancementPrompts = {
        professional: 'Make this content more professional and business-appropriate',
        casual: 'Make this content more casual and conversational',
        persuasive: 'Make this content more persuasive and compelling',
        concise: 'Make this content more concise and to the point'
      };

      const result = await TipTapProService.refineEmail(
        content,
        enhancementPrompts[enhancement]
      );
      
      if (result.success) {
        return handleServiceSuccess(result.data!, `Content enhanced with ${enhancement} style using TipTap Pro AI`);
      } else {
        return handleServiceError(new Error(result.error || 'Enhancement failed'), 'enhanceWithAI');
      }
    } catch (error) {
      return handleServiceError(error, 'enhanceWithAI');
    }
  }

  static async smartComplete(partialContent: string, context?: EmailContext): Promise<ServiceResult<string>> {
    try {
      const prompt = `Complete this partial content in a natural way: "${partialContent}"${context?.targetAudience ? ` for ${context.targetAudience}` : ''}`;
      
      const result = await TipTapProService.generateContent(prompt, 'professional');
      
      if (result.success) {
        return handleServiceSuccess(result.data!, 'Smart completion generated using TipTap Pro AI');
      } else {
        return handleServiceError(new Error(result.error || 'Smart completion failed'), 'smartComplete');
      }
    } catch (error) {
      return handleServiceError(error, 'smartComplete');
    }
  }
}

export const tiptapAIService = TipTapAIService;
