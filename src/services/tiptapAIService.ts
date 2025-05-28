
import { OpenAIEmailService } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';
import { toast } from 'sonner';

export interface AIOperation {
  type: 'improve' | 'grammar' | 'professional' | 'casual' | 'shorten' | 'expand' | 'enhance' | 'optimize';
  label: string;
  description: string;
}

export interface EmailContext {
  blockType?: string;
  emailHTML?: string;
  subjectLine?: string;
  targetAudience?: string;
  brandVoice?: string;
}

export interface AIOperationResult {
  content: string;
  explanation?: string;
  confidence: number;
}

export const AI_OPERATIONS: AIOperation[] = [
  { type: 'improve', label: 'Improve Writing', description: 'Enhance clarity and engagement' },
  { type: 'grammar', label: 'Fix Grammar', description: 'Correct grammar and spelling errors' },
  { type: 'professional', label: 'Make Professional', description: 'Adopt a professional tone' },
  { type: 'casual', label: 'Make Casual', description: 'Use a more casual, friendly tone' },
  { type: 'shorten', label: 'Shorten Text', description: 'Make content more concise' },
  { type: 'expand', label: 'Expand Text', description: 'Add more detail and context' },
  { type: 'enhance', label: 'Enhance for Email', description: 'Optimize for email marketing' },
  { type: 'optimize', label: 'Optimize CTA', description: 'Improve call-to-action effectiveness' }
];

export class TipTapAIService {
  private static validateApiKey(): boolean {
    if (!ApiKeyService.validateKey()) {
      toast.error('OpenAI API key not configured properly');
      return false;
    }
    return true;
  }

  static async enhanceText(
    content: string, 
    operation: AIOperation['type'], 
    context: EmailContext = {}
  ): Promise<AIOperationResult> {
    if (!this.validateApiKey()) {
      throw new Error('OpenAI API key not available');
    }

    if (!content.trim()) {
      throw new Error('No content provided for AI operation');
    }

    try {
      toast.loading(`Applying ${operation} operation...`, { id: `ai-${operation}` });

      const prompt = this.buildPrompt(content, operation, context);
      const result = await OpenAIEmailService.callOpenAI(prompt, 2, false);
      
      toast.success(`${operation} operation completed`, { id: `ai-${operation}` });
      
      return {
        content: result.trim(),
        confidence: 0.9
      };
    } catch (error) {
      console.error(`AI operation ${operation} failed:`, error);
      toast.error(`Failed to apply ${operation} operation`, { id: `ai-${operation}` });
      throw error;
    }
  }

  static async streamTextImprovement(
    content: string,
    operation: AIOperation['type'],
    context: EmailContext = {},
    onChunk: (chunk: string) => void
  ): Promise<string> {
    if (!this.validateApiKey()) {
      throw new Error('OpenAI API key not available');
    }

    // For now, we'll use the regular API and simulate streaming
    // In a real implementation, you'd use OpenAI's streaming API
    try {
      const result = await this.enhanceText(content, operation, context);
      
      // Simulate streaming by sending chunks
      const words = result.content.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        onChunk(currentText);
        
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      return result.content;
    } catch (error) {
      console.error('Streaming AI operation failed:', error);
      throw error;
    }
  }

  static async optimizeForEmailBlock(
    blockType: string,
    content: string,
    context: EmailContext = {}
  ): Promise<AIOperationResult> {
    const enhancedContext = {
      ...context,
      blockType
    };

    let operation: AIOperation['type'] = 'enhance';
    
    // Choose operation based on block type
    switch (blockType) {
      case 'button':
        operation = 'optimize';
        break;
      case 'text':
      case 'heading':
        operation = 'improve';
        break;
      default:
        operation = 'enhance';
    }

    return this.enhanceText(content, operation, enhancedContext);
  }

  static async generateCTA(context: string): Promise<string[]> {
    if (!this.validateApiKey()) {
      throw new Error('OpenAI API key not available');
    }

    try {
      const prompt = `Generate 3 compelling call-to-action buttons for this email context:

EMAIL CONTEXT: ${context}

Requirements:
- Clear, action-oriented language
- Under 25 characters each
- Email marketing best practices
- Urgency and value proposition

Return only the CTA text, one per line, no quotes or formatting.`;

      const result = await OpenAIEmailService.callOpenAI(prompt, 2, false);
      return result.split('\n').filter((line: string) => line.trim()).slice(0, 3);
    } catch (error) {
      console.error('CTA generation failed:', error);
      throw error;
    }
  }

  static async suggestSubjectLines(emailContent: string): Promise<string[]> {
    if (!this.validateApiKey()) {
      throw new Error('OpenAI API key not available');
    }

    try {
      return await OpenAIEmailService.generateSubjectLines(emailContent, 5);
    } catch (error) {
      console.error('Subject line generation failed:', error);
      throw error;
    }
  }

  private static buildPrompt(
    content: string,
    operation: AIOperation['type'],
    context: EmailContext
  ): string {
    const baseContext = context.blockType ? `Block Type: ${context.blockType}\n` : '';
    const emailContext = context.emailHTML ? `Email Context: ${context.emailHTML.slice(0, 200)}...\n` : '';
    const audienceContext = context.targetAudience ? `Target Audience: ${context.targetAudience}\n` : '';
    
    let operationInstructions = '';
    
    switch (operation) {
      case 'improve':
        operationInstructions = `Improve this text for clarity, engagement, and effectiveness. Make it more compelling while maintaining the original meaning. Focus on:
- Clear, concise language
- Stronger word choices
- Better flow and readability
- Email marketing best practices`;
        break;
        
      case 'grammar':
        operationInstructions = `Fix all grammar, spelling, and punctuation errors in this text. Also improve:
- Sentence structure
- Word usage
- Clarity and readability
- Professional tone`;
        break;
        
      case 'professional':
        operationInstructions = `Rewrite this text in a professional, business-appropriate tone. Ensure:
- Formal language and structure
- Professional vocabulary
- Clear, direct communication
- Appropriate for business emails`;
        break;
        
      case 'casual':
        operationInstructions = `Rewrite this text in a casual, friendly tone. Make it:
- Conversational and approachable
- Warm and personable
- Easy to read and relate to
- Still professional but approachable`;
        break;
        
      case 'shorten':
        operationInstructions = `Make this text more concise while preserving all key information. Focus on:
- Removing unnecessary words
- Combining sentences where appropriate
- Maintaining clarity and impact
- Keeping essential details`;
        break;
        
      case 'expand':
        operationInstructions = `Expand this text with relevant details and context. Add:
- Supporting information
- Benefits and value propositions
- Compelling details
- Better explanations while maintaining focus`;
        break;
        
      case 'enhance':
        operationInstructions = `Optimize this text specifically for email marketing. Improve:
- Email conversion potential
- Engagement and readability
- Call-to-action effectiveness
- Mobile-friendly formatting`;
        break;
        
      case 'optimize':
        operationInstructions = `Optimize this text as a compelling call-to-action. Make it:
- Action-oriented and urgent
- Clear about the benefit
- Concise and powerful
- Likely to drive clicks and conversions`;
        break;
        
      default:
        operationInstructions = 'Improve this text for clarity and effectiveness.';
    }

    return `${baseContext}${emailContext}${audienceContext}

OPERATION: ${operationInstructions}

ORIGINAL TEXT:
${content}

REQUIREMENTS:
- Maintain the original intent and key information
- Return only the improved text, no explanations
- Keep the same general length unless specifically asked to shorten/expand
- Ensure the result works well in email clients
- Make it engaging and professional

IMPROVED TEXT:`;
  }

  static async analyzeTextContext(content: string, emailHTML?: string): Promise<{
    suggestedOperations: AIOperation['type'][];
    reasoning: string;
  }> {
    if (!this.validateApiKey()) {
      throw new Error('OpenAI API key not available');
    }

    try {
      const prompt = `Analyze this text and suggest the most beneficial AI operations:

TEXT TO ANALYZE: ${content}
EMAIL CONTEXT: ${emailHTML?.slice(0, 300) || 'None'}

Available operations: improve, grammar, professional, casual, shorten, expand, enhance, optimize

Return a JSON object with:
{
  "suggestedOperations": ["operation1", "operation2"],
  "reasoning": "Brief explanation of why these operations would help"
}`;

      const result = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      return {
        suggestedOperations: result.suggestedOperations || ['improve'],
        reasoning: result.reasoning || 'General text improvement recommended'
      };
    } catch (error) {
      console.error('Text analysis failed:', error);
      return {
        suggestedOperations: ['improve'],
        reasoning: 'Default improvement suggested'
      };
    }
  }
}
