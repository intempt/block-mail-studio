
import { ApiKeyService } from './apiKeyService';

export interface OpenAIEmailAnalysisRequest {
  emailHTML: string;
  subjectLine: string;
}

export interface EmailGenerationRequest {
  prompt: string;
  emailType: 'welcome' | 'promotional' | 'newsletter' | 'announcement' | 'followup';
  tone: 'professional' | 'casual' | 'friendly' | 'urgent';
  industry?: string;
  targetAudience?: string;
}

export interface EmailGenerationResponse {
  subject: string;
  previewText: string;
  html: string;
  keyPoints: string[];
}

export interface ConversationalRequest {
  userMessage: string;
  conversationContext?: string[];
  currentEmailContent?: string;
}

export interface BrandVoiceAnalysis {
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

export interface PerformanceAnalysis {
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

class OpenAIServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OpenAIServiceError';
  }
}

export class OpenAIEmailService {
  private static extractJSONFromResponse(response: string): any {
    try {
      // Remove markdown code blocks if present
      let cleanResponse = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Try to find JSON within the response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResponse = jsonMatch[0];
      }
      
      // Parse and validate JSON
      const parsed = JSON.parse(cleanResponse);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
      
      throw new Error('Invalid JSON structure');
    } catch (error) {
      console.error('JSON parsing failed:', error);
      throw new OpenAIServiceError('Failed to parse AI response');
    }
  }

  private static validateAPIResponse(data: any): void {
    if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new OpenAIServiceError('Invalid API response structure');
    }
    
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new OpenAIServiceError('No content in API response');
    }
  }

  private static async callOpenAI(prompt: string, retries: number = 2, expectJSON: boolean = true): Promise<any> {
    const apiKey = ApiKeyService.getOpenAIKey();

    if (!ApiKeyService.isKeyAvailable()) {
      throw new OpenAIServiceError('OpenAI API key not available. Please configure your API key in the settings.');
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`OpenAI API call attempt ${attempt + 1}/${retries + 1}`);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: expectJSON 
                  ? `You are an expert email marketing specialist. Always return valid JSON without markdown formatting or code blocks. Be concise and practical.`
                  : `You are a helpful email marketing expert. Respond directly and helpfully.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: expectJSON ? 1500 : 500
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `API error: ${response.status} ${response.statusText}`;
          
          if (response.status === 401) {
            errorMessage = 'Invalid OpenAI API key. Please check your API key configuration.';
          } else if (response.status === 429) {
            errorMessage = 'OpenAI API rate limit exceeded. Please try again in a moment.';
          } else if (response.status >= 500) {
            errorMessage = 'OpenAI service is temporarily unavailable. Please try again later.';
          }
          
          throw new OpenAIServiceError(`${errorMessage} - ${errorText}`);
        }

        const data = await response.json();
        this.validateAPIResponse(data);
        
        const content = data.choices[0].message.content;
        
        if (expectJSON) {
          return this.extractJSONFromResponse(content);
        } else {
          return content;
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`OpenAI API attempt ${attempt + 1} failed:`, lastError);
        
        // Don't retry on authentication or client errors
        if (error instanceof OpenAIServiceError && 
            (error.message.includes('Invalid OpenAI API key') || 
             error.message.includes('API error: 4'))) {
          throw error;
        }
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || new OpenAIServiceError('All API attempts failed');
  }

  static async generateEmailContent(request: EmailGenerationRequest): Promise<EmailGenerationResponse> {
    const prompt = `Generate a professional email with this structure:
{
  "subject": "Compelling subject line under 50 characters",
  "previewText": "Preview text under 90 characters", 
  "html": "Complete HTML email with email-block classes",
  "keyPoints": ["key point 1", "key point 2", "key point 3"]
}

Requirements:
- Email type: ${request.emailType}
- Tone: ${request.tone}
- Prompt: ${request.prompt}
- Use div with class="email-block" for sections
- Include inline styles for email compatibility`;

    return await this.callOpenAI(prompt, 2, true);
  }

  static async generateSubjectLines(emailContent: string, count: number = 5): Promise<string[]> {
    const prompt = `Generate ${count} subject lines for this email. Return JSON:
{
  "subjectLines": ["Subject 1", "Subject 2", "Subject 3"]
}

Email content: ${emailContent.slice(0, 500)}...`;

    const response = await this.callOpenAI(prompt, 2, true);
    return response.subjectLines || [];
  }

  static async optimizeCopy(currentContent: string, optimizationType: 'engagement' | 'conversion' | 'clarity' | 'brevity'): Promise<string> {
    const prompt = `Optimize this email content for ${optimizationType}. Return JSON:
{
  "optimizedHTML": "improved HTML content here"
}

Current content: ${currentContent}

Focus on ${optimizationType} while maintaining email-safe HTML structure.`;

    const response = await this.callOpenAI(prompt, 2, true);
    return response.optimizedHTML || response.html || currentContent;
  }

  static async conversationalResponse(request: ConversationalRequest): Promise<string> {
    const prompt = `Respond helpfully to this email marketing question: "${request.userMessage}"
    
Context: ${request.conversationContext?.join(' ') || 'None'}
Current email: ${request.currentEmailContent?.slice(0, 200) || 'None'}

Provide a helpful and direct response about email marketing. Be concise and actionable.`;

    try {
      return await this.callOpenAI(prompt, 2, false);
    } catch (error) {
      console.error('Conversational response failed:', error);
      throw error;
    }
  }

  static async analyzeBrandVoice(request: OpenAIEmailAnalysisRequest): Promise<BrandVoiceAnalysis> {
    const prompt = `Analyze this email for brand voice and engagement. Return JSON:
{
  "brandVoiceScore": 85,
  "engagementScore": 78,
  "toneConsistency": 92,
  "readabilityScore": 88,
  "performancePrediction": {
    "openRate": 25,
    "clickRate": 8,
    "conversionRate": 3
  },
  "suggestions": [
    {
      "type": "copy",
      "title": "Improve call-to-action",
      "current": "Click here",
      "suggested": "Get started today",
      "reason": "More specific and action-oriented",
      "impact": "medium",
      "confidence": 85
    }
  ]
}

Subject: ${request.subjectLine}
Content: ${request.emailHTML.slice(0, 1000)}...`;

    return await this.callOpenAI(prompt, 2, true);
  }

  static async analyzePerformance(request: OpenAIEmailAnalysisRequest): Promise<PerformanceAnalysis> {
    const prompt = `Analyze email performance and technical aspects. Return JSON:
{
  "overallScore": 87,
  "deliverabilityScore": 91,
  "mobileScore": 85,
  "spamScore": 15,
  "metrics": {
    "loadTime": {"value": 1.2, "status": "good"},
    "accessibility": {"value": 88, "status": "good"},
    "imageOptimization": {"value": 92, "status": "good"},
    "linkCount": {"value": 3, "status": "good"}
  },
  "accessibilityIssues": [],
  "optimizationSuggestions": ["Optimize images", "Add alt text"]
}

Subject: ${request.subjectLine}
Content: ${request.emailHTML.slice(0, 1000)}...`;

    return await this.callOpenAI(prompt, 2, true);
  }
}
