
import { OpenAIEmailService } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';

export interface EmailStructureAnalysis {
  emailType: 'welcome' | 'promotional' | 'newsletter' | 'announcement';
  suggestedLayout: 'single-column' | 'two-column' | 'hero-content' | 'newsletter-grid';
  content: Array<{
    type: 'text' | 'image' | 'button' | 'divider' | 'spacer';
    content: string;
    position: number;
    styling?: Record<string, string>;
  }>;
  layoutSuggestions: {
    headerNeeded: boolean;
    footerNeeded: boolean;
    ctaPlacement: 'top' | 'middle' | 'bottom' | 'multiple';
    imageAlignment: 'left' | 'center' | 'right';
  };
}

export class EmailContentAnalyzer {
  static async analyzeEmailContent(
    subject: string,
    htmlContent: string,
    emailType?: string
  ): Promise<EmailStructureAnalysis> {
    if (!ApiKeyService.isKeyAvailable()) {
      throw new Error('OpenAI API key not available');
    }

    const prompt = `Analyze this email content and provide a structured breakdown for conversion to email blocks. Return JSON:

{
  "emailType": "welcome|promotional|newsletter|announcement",
  "suggestedLayout": "single-column|two-column|hero-content|newsletter-grid",
  "content": [
    {
      "type": "text|image|button|divider|spacer",
      "content": "extracted content or description",
      "position": 0,
      "styling": {"key": "value"}
    }
  ],
  "layoutSuggestions": {
    "headerNeeded": true,
    "footerNeeded": true,
    "ctaPlacement": "top|middle|bottom|multiple",
    "imageAlignment": "left|center|right"
  }
}

Email Subject: ${subject}
Email Type Hint: ${emailType || 'auto-detect'}
HTML Content: ${htmlContent.slice(0, 2000)}...

Analyze the content structure, identify key components (headings, paragraphs, CTAs, images), and suggest the best block-based layout for an email builder.`;

    try {
      const response = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      return response as EmailStructureAnalysis;
    } catch (error) {
      console.error('Content analysis failed:', error);
      throw error;
    }
  }

  static async suggestLayoutOptimizations(
    currentBlocks: any[],
    emailType: string
  ): Promise<Array<{
    suggestion: string;
    reason: string;
    confidence: number;
  }>> {
    if (!ApiKeyService.isKeyAvailable()) {
      return [];
    }

    const prompt = `Analyze this email block structure and suggest improvements. Return JSON:

{
  "suggestions": [
    {
      "suggestion": "specific improvement suggestion",
      "reason": "why this improvement helps",
      "confidence": 85
    }
  ]
}

Email Type: ${emailType}
Current Blocks: ${JSON.stringify(currentBlocks.map(b => ({ type: b.type, position: b.position })))}

Focus on email best practices, mobile responsiveness, and engagement optimization.`;

    try {
      const response = await OpenAIEmailService.callOpenAI(prompt, 1, true);
      return response.suggestions || [];
    } catch (error) {
      console.error('Layout optimization failed:', error);
      return [];
    }
  }
}
