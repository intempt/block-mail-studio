import { ApiKeyService } from './apiKeyService';

export interface EmailGenerationRequest {
  prompt: string;
  emailType: 'welcome' | 'promotional' | 'newsletter' | 'announcement';
  tone: 'professional' | 'casual' | 'friendly' | 'urgent';
}

export interface ConversationalRequest {
  userMessage: string;
  conversationContext?: string[];
  currentEmailContent: string;
}

export interface BrandVoiceAnalysis {
  emailHTML: string;
  subjectLine: string;
}

export interface PerformanceAnalysis {
  emailHTML: string;
  subjectLine: string;
}

export class OpenAIEmailService {
  private static readonly API_BASE_URL = 'https://api.openai.com/v1';
  private static readonly MODEL = 'gpt-4o-mini';

  private static async getValidatedKey(): Promise<string> {
    const key = await ApiKeyService.getOpenAIKey();
    if (!key || !key.startsWith('sk-')) {
      throw new Error('Invalid or missing OpenAI API key');
    }
    return key;
  }

  static async callOpenAI(prompt: string, temperature: number = 0.7, isJsonMode: boolean = false): Promise<any> {
    const apiKey = await this.getValidatedKey();

    const response = await fetch(`${this.API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert email marketing specialist with deep knowledge of email best practices, deliverability, engagement optimization, and conversion strategies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens: 2000,
        ...(isJsonMode && { response_format: { type: 'json_object' } })
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    if (isJsonMode) {
      try {
        return JSON.parse(data.choices[0].message.content);
      } catch (e) {
        return { error: 'Invalid JSON response from OpenAI' };
      }
    }
    
    return data.choices[0].message.content;
  }

  static async generateEmailContent(request: EmailGenerationRequest): Promise<any> {
    const prompt = `Generate a complete email for ${request.emailType} with ${request.tone} tone. 
    User request: ${request.prompt}
    
    Return JSON with: subject, preheader, bodyHTML, and summary.`;

    try {
      const result = await this.callOpenAI(prompt, 0.7, true);
      return result;
    } catch (error) {
      console.error('Email generation failed:', error);
      throw error;
    }
  }

  static async conversationalResponse(request: ConversationalRequest): Promise<string> {
    const contextPrompt = request.conversationContext?.length ? 
      `Previous conversation: ${request.conversationContext.join('\n')}` : '';
    
    const prompt = `${contextPrompt}
    
    Current email content: ${request.currentEmailContent}
    
    User message: ${request.userMessage}
    
    Provide a helpful response about email marketing and content creation.`;

    try {
      return await this.callOpenAI(prompt, 0.8);
    } catch (error) {
      console.error('Conversational response failed:', error);
      throw error;
    }
  }

  static async analyzeBrandVoice(analysis: BrandVoiceAnalysis): Promise<any> {
    const prompt = `Analyze this email for brand voice consistency and engagement potential:
    
    Subject: ${analysis.subjectLine}
    Content: ${analysis.emailHTML}
    
    Return JSON with: brandVoiceScore, engagementScore, toneConsistency, readabilityScore, performancePrediction (openRate, clickRate, conversionRate), and suggestions array.`;

    try {
      const result = await this.callOpenAI(prompt, 0.5, true);
      return result;
    } catch (error) {
      console.error('Brand voice analysis failed:', error);
      throw error;
    }
  }

  static async analyzePerformance(analysis: PerformanceAnalysis): Promise<any> {
    const prompt = `Analyze this email for technical performance and deliverability:
    
    Subject: ${analysis.subjectLine}
    Content: ${analysis.emailHTML}
    
    Return JSON with: overallScore, deliverabilityScore, mobileScore, spamScore, metrics, accessibilityIssues, and optimizationSuggestions.`;

    try {
      const result = await this.callOpenAI(prompt, 0.5, true);
      return result;
    } catch (error) {
      console.error('Performance analysis failed:', error);
      throw error;
    }
  }

  static async generateSubjectLines(emailContent: string, count: number = 5): Promise<string[]> {
    const prompt = `Generate ${count} email marketing optimized subject lines for this content:
    
    ${emailContent}
    
    Return JSON array of subject lines optimized for open rates and deliverability.`;

    try {
      const result = await this.callOpenAI(prompt, 0.8, true);
      return Array.isArray(result) ? result : result.subjectLines || [];
    } catch (error) {
      console.error('Subject line generation failed:', error);
      throw error;
    }
  }

  static async optimizeCopy(emailHTML: string, optimizationType: string): Promise<string> {
    const prompt = `Optimize this email content for ${optimizationType}:
    
    ${emailHTML}
    
    Return improved HTML that maintains structure but enhances ${optimizationType}.`;

    try {
      return await this.callOpenAI(prompt, 0.6);
    } catch (error) {
      console.error('Copy optimization failed:', error);
      throw error;
    }
  }
}
