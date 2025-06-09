
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
      let cleanResponse = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResponse = jsonMatch[0];
      }
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

  static async callOpenAI(prompt: string, retries: number = 2, expectJSON: boolean = true): Promise<any> {
    const requestId = `openai-${Date.now()}`;
    console.log(`[OPENAI-SERVICE] ${requestId} - callOpenAI() initiated`);
    console.log(`[OPENAI-SERVICE] ${requestId} - Parameters: retries=${retries}, expectJSON=${expectJSON}`);
    console.log(`[OPENAI-SERVICE] ${requestId} - Prompt length: ${prompt.length} characters`);

    console.log(`[OPENAI-SERVICE] ${requestId} - Getting API key...`);
    const apiKey = await ApiKeyService.getOpenAIKey();
    console.log(`[OPENAI-SERVICE] ${requestId} - API key retrieved (length: ${apiKey.length})`);

    console.log(`[OPENAI-SERVICE] ${requestId} - Validating API key...`);
    const isValid = await ApiKeyService.validateKey();
    console.log(`[OPENAI-SERVICE] ${requestId} - Key validation result: ${isValid}`);

    if (!isValid) {
      console.error(`[OPENAI-SERVICE] ${requestId} - API key validation failed`);
      throw new OpenAIServiceError('OpenAI API key not available or invalid');
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`[OPENAI-SERVICE] ${requestId} - API call attempt ${attempt + 1}/${retries + 1}`);
        console.log(`[OPENAI-SERVICE] ${requestId} - Making request to OpenAI API...`);
        
        const requestBody = {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: expectJSON 
                ? `You are an expert email marketing specialist analyzing real email content. Always return valid JSON without markdown formatting. Provide genuine analysis based on the actual content provided.`
                : `You are a helpful email marketing expert. Respond directly and helpfully based on the actual content.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: expectJSON ? 2000 : 800
        };

        console.log(`[OPENAI-SERVICE] ${requestId} - Request body prepared (model: ${requestBody.model})`);
        console.log(`[OPENAI-SERVICE] ${requestId} - Using API key: ${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log(`[OPENAI-SERVICE] ${requestId} - API response received`);
        console.log(`[OPENAI-SERVICE] ${requestId} - Response status: ${response.status} ${response.statusText}`);
        console.log(`[OPENAI-SERVICE] ${requestId} - Response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[OPENAI-SERVICE] ${requestId} - API error response:`, errorText);
          
          let errorMessage = `API error: ${response.status} ${response.statusText}`;
          
          if (response.status === 401) {
            console.error(`[OPENAI-SERVICE] ${requestId} - Authentication failed - invalid API key`);
            console.error(`[OPENAI-SERVICE] ${requestId} - Key used: ${apiKey.substring(0, 10)}...`);
            errorMessage = 'Invalid OpenAI API key';
          } else if (response.status === 429) {
            console.error(`[OPENAI-SERVICE] ${requestId} - Rate limit exceeded`);
            errorMessage = 'OpenAI rate limit exceeded';
          } else if (response.status >= 500) {
            console.error(`[OPENAI-SERVICE] ${requestId} - Server error`);
            errorMessage = 'OpenAI service temporarily unavailable';
          }
          
          throw new OpenAIServiceError(`${errorMessage} - ${errorText}`);
        }

        const data = await response.json();
        console.log(`[OPENAI-SERVICE] ${requestId} - Response data received successfully`);
        console.log(`[OPENAI-SERVICE] ${requestId} - Response structure:`, {
          hasChoices: !!data.choices,
          choicesLength: data.choices?.length,
          hasUsage: !!data.usage,
          model: data.model
        });
        
        this.validateAPIResponse(data);
        
        const content = data.choices[0].message.content;
        console.log(`[OPENAI-SERVICE] ${requestId} - Content extracted (length: ${content.length})`);
        
        if (expectJSON) {
          console.log(`[OPENAI-SERVICE] ${requestId} - Parsing JSON response...`);
          const parsed = this.extractJSONFromResponse(content);
          console.log(`[OPENAI-SERVICE] ${requestId} - JSON parsed successfully`);
          return parsed;
        } else {
          console.log(`[OPENAI-SERVICE] ${requestId} - Returning raw content`);
          return content;
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`[OPENAI-SERVICE] ${requestId} - Attempt ${attempt + 1} failed:`, {
          name: lastError.name,
          message: lastError.message,
          stack: lastError.stack
        });
        
        if (error instanceof OpenAIServiceError && 
            (error.message.includes('Invalid OpenAI API key') || 
             error.message.includes('API error: 4'))) {
          console.error(`[OPENAI-SERVICE] ${requestId} - Fatal error, not retrying`);
          throw error;
        }
        
        if (attempt < retries) {
          const waitTime = 1000 * (attempt + 1);
          console.log(`[OPENAI-SERVICE] ${requestId} - Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error(`[OPENAI-SERVICE] ${requestId} - All attempts failed`);
    throw lastError || new OpenAIServiceError('All API attempts failed');
  }

  static async generateEmailContent(request: EmailGenerationRequest): Promise<EmailGenerationResponse> {
    const prompt = `Generate a professional email with this structure based on the following requirements:

EMAIL CONTENT TO ANALYZE:
- Email type: ${request.emailType}
- Tone: ${request.tone}
- User prompt: ${request.prompt}
- Industry: ${request.industry || 'general'}
- Target audience: ${request.targetAudience || 'general'}

Return JSON structure:
{
  "subject": "Compelling subject line under 50 characters for mobile optimization",
  "previewText": "Preview text under 90 characters optimized for Gmail/Outlook", 
  "html": "Complete HTML email with email-safe CSS and proper email client compatibility",
  "keyPoints": ["key point 1", "key point 2", "key point 3"]
}

EMAIL MARKETING BEST PRACTICES TO FOLLOW:
- Subject line: Under 50 chars, avoid spam triggers, create urgency/curiosity
- Email width: 600px max for email clients
- Use email-safe fonts: Arial, Helvetica, Georgia, Times New Roman
- Inline CSS for better email client support
- Alt text for all images
- Single column layout for mobile compatibility
- Touch-friendly buttons (44px+ height)
- Clear call-to-action above the fold
- Use div with class="email-block" for sections
- Include proper email DOCTYPE and meta tags
- Ensure CAN-SPAM compliance structure`;

    return await this.callOpenAI(prompt, 2, true);
  }

  static async generateSubjectLines(emailContent: string, count: number = 5): Promise<string[]> {
    const prompt = `Analyze this REAL EMAIL CONTENT and generate ${count} high-performing subject lines:

FULL EMAIL CONTENT TO ANALYZE:
${emailContent}

Based on the actual content above, generate subject lines that:
- Reflect the actual email content and purpose
- Follow email marketing best practices
- Are under 50 characters for mobile optimization
- Avoid spam trigger words
- Create genuine curiosity based on the content
- Use personalization opportunities where relevant

Return JSON format:
{
  "subjectLines": [
    "Subject line 1 (under 50 chars, based on actual content)",
    "Subject line 2 (different approach for same content)",
    "Subject line 3 (alternative tone for same content)"
  ]
}`;

    const response = await this.callOpenAI(prompt, 2, true);
    return response.subjectLines || [];
  }

  static async optimizeCopy(currentContent: string, optimizationType: 'engagement' | 'conversion' | 'clarity' | 'brevity'): Promise<string> {
    const prompt = `Optimize this REAL EMAIL CONTENT for ${optimizationType}:

CURRENT EMAIL CONTENT:
${currentContent}

OPTIMIZATION REQUIREMENTS:
- Maintain the original message and intent
- Focus specifically on ${optimizationType} improvements
- Keep email client compatibility
- Maintain CAN-SPAM compliance
- Preserve existing structure while improving content

Return JSON:
{
  "optimizedHTML": "improved HTML content with email-safe styling and ${optimizationType} optimization applied"
}`;

    const response = await this.callOpenAI(prompt, 2, true);
    return response.optimizedHTML || response.html || currentContent;
  }

  static async conversationalResponse(request: ConversationalRequest): Promise<string> {
    const prompt = `Answer this email marketing question based on the provided context:

QUESTION: "${request.userMessage}"
CONTEXT: ${request.conversationContext?.join(' ') || 'None'}
CURRENT EMAIL: ${request.currentEmailContent?.slice(0, 500) || 'None'}

Provide a helpful, specific response about email marketing. Be actionable and direct.`;

    return await this.callOpenAI(prompt, 2, false);
  }

  static async analyzeBrandVoice(request: OpenAIEmailAnalysisRequest): Promise<BrandVoiceAnalysis> {
    const prompt = `Analyze this COMPLETE EMAIL for brand voice and engagement potential:

SUBJECT LINE: "${request.subjectLine}"

FULL EMAIL CONTENT:
${request.emailHTML}

Provide comprehensive analysis based on the actual content above:

ANALYSIS CRITERIA:
1. Brand voice consistency and tone
2. Engagement factors and hooks
3. Email marketing best practices compliance
4. Mobile optimization indicators
5. Call-to-action effectiveness
6. Content scanability and structure
7. Personalization opportunities
8. Deliverability factors

Return JSON with genuine analysis based on the actual content:
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
      "type": "subject",
      "title": "Specific improvement based on actual subject",
      "current": "Actual current text from the email",
      "suggested": "Specific improvement suggestion",
      "reason": "Why this change would help based on content analysis",
      "impact": "high",
      "confidence": 90
    }
  ]
}`;

    return await this.callOpenAI(prompt, 2, true);
  }

  static async analyzePerformance(request: OpenAIEmailAnalysisRequest): Promise<PerformanceAnalysis> {
    const prompt = `Analyze this COMPLETE EMAIL for technical performance and compliance:

SUBJECT LINE: "${request.subjectLine}"

FULL EMAIL HTML CONTENT:
${request.emailHTML}

Provide detailed technical analysis based on the actual email content above:

PERFORMANCE ANALYSIS AREAS:
1. Email client compatibility (Outlook, Gmail, Apple Mail)
2. Mobile responsiveness and optimization
3. Deliverability factors and spam risk
4. Accessibility compliance (WCAG guidelines)
5. Loading performance and image optimization
6. HTML structure and email-safe practices
7. CAN-SPAM compliance check
8. Dark mode compatibility

Return JSON with real analysis based on the actual content:
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
  "accessibilityIssues": [
    {
      "type": "Specific issue found in the actual content",
      "severity": "medium", 
      "description": "Actual issue description based on content analysis",
      "fix": "Specific fix for the identified issue"
    }
  ],
  "optimizationSuggestions": [
    "Specific suggestion based on actual email analysis",
    "Another actionable improvement for this email",
    "Technical optimization based on content review"
  ]
}`;

    return await this.callOpenAI(prompt, 2, true);
  }
}
