
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

  static async callOpenAI(prompt: string, retries: number = 2, expectJSON: boolean = true): Promise<any> {
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
  "subject": "Compelling subject line under 50 characters for mobile optimization",
  "previewText": "Preview text under 90 characters optimized for Gmail/Outlook", 
  "html": "Complete HTML email with email-safe CSS and proper email client compatibility",
  "keyPoints": ["key point 1", "key point 2", "key point 3"]
}

Email Marketing Best Practices to Follow:
- Subject line: Under 50 chars, avoid spam triggers, create urgency/curiosity
- Email width: 600px max for email clients
- Use email-safe fonts: Arial, Helvetica, Georgia, Times New Roman
- Inline CSS for better email client support
- Alt text for all images
- Single column layout for mobile compatibility
- Touch-friendly buttons (44px+ height)
- Clear call-to-action above the fold

Requirements:
- Email type: ${request.emailType}
- Tone: ${request.tone}
- Prompt: ${request.prompt}
- Use div with class="email-block" for sections
- Include proper email DOCTYPE and meta tags
- Ensure CAN-SPAM compliance structure`;

    return await this.callOpenAI(prompt, 2, true);
  }

  static async generateSubjectLines(emailContent: string, count: number = 5): Promise<string[]> {
    const prompt = `Generate ${count} high-performing email subject lines following email marketing best practices:

EMAIL MARKETING BEST PRACTICES:
- Keep under 50 characters (mobile optimization)
- Avoid spam trigger words: "Free", "Act Now", "Limited Time", excessive punctuation
- Use personalization opportunities: [Name], location-based
- Create urgency without being pushy
- Ask questions to increase curiosity
- Use numbers and specifics when relevant
- A/B test different emotional approaches
- Consider preview text synergy

SUBJECT LINE PSYCHOLOGY:
- Curiosity: "The secret to..." "What happens when..."
- Urgency: "24 hours left" "Ending soon"
- Benefit-focused: "Save 30% on..." "Get instant access"
- Personal: "Your [item] is ready" "[Name], this is for you"
- Social proof: "Join 10,000+ others" "What everyone's talking about"

Return JSON format:
{
  "subjectLines": [
    "Subject line 1 (under 50 chars)",
    "Subject line 2 (different approach)",
    "Subject line 3 (alternative tone)"
  ]
}

Email content: ${emailContent.slice(0, 500)}...
Target: Professional email marketing standards with high open rates`;

    const response = await this.callOpenAI(prompt, 2, true);
    return response.subjectLines || [];
  }

  static async optimizeCopy(currentContent: string, optimizationType: 'engagement' | 'conversion' | 'clarity' | 'brevity'): Promise<string> {
    const prompt = `Optimize this email content for ${optimizationType} following email marketing best practices:

EMAIL OPTIMIZATION GUIDELINES:
- Scannable content with bullet points and short paragraphs
- Clear hierarchy with headings and subheadings
- Single, prominent call-to-action (CTA)
- Mobile-first writing (shorter sentences)
- Benefit-focused rather than feature-focused
- Personal and conversational tone
- Urgency without being spammy
- Social proof and testimonials when relevant
- Email-safe HTML structure

CONVERSION BEST PRACTICES:
- Above-the-fold value proposition
- Single clear CTA per email
- Reduce cognitive load
- Create sense of urgency
- Use action-oriented language
- Include social proof
- Mobile-optimized formatting

Return JSON:
{
  "optimizedHTML": "improved HTML content with email-safe styling and best practices applied"
}

Current content: ${currentContent}

Focus on ${optimizationType} while maintaining email client compatibility and CAN-SPAM compliance.`;

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
    const prompt = `Analyze this email for brand voice, engagement, and email marketing best practices:

ANALYSIS CRITERIA:
1. EMAIL MARKETING COMPLIANCE:
   - CAN-SPAM compliance (unsubscribe, sender info)
   - Subject line optimization (length, spam score)
   - Mobile responsiveness indicators
   - Email client compatibility

2. ENGAGEMENT FACTORS:
   - Clear value proposition
   - Call-to-action effectiveness
   - Content scanability
   - Personal vs promotional balance
   - Social proof inclusion

3. TECHNICAL EMAIL BEST PRACTICES:
   - Image-to-text ratio (recommend 80/20 rule)
   - Email width (600px standard)
   - Touch-friendly design elements
   - Alt text for accessibility
   - Email-safe CSS usage

4. DELIVERABILITY FACTORS:
   - Spam trigger word analysis
   - Text-to-HTML ratio
   - Link quantity and quality
   - Authentication setup indicators

Return JSON:
{
  "brandVoiceScore": 85,
  "engagementScore": 78,
  "toneConsistency": 92,
  "readabilityScore": 88,
  "deliverabilityScore": 91,
  "mobileOptimizationScore": 85,
  "performancePrediction": {
    "openRate": 25,
    "clickRate": 8,
    "conversionRate": 3
  },
  "suggestions": [
    {
      "type": "subject",
      "title": "Optimize subject line for mobile",
      "current": "Your current subject line text",
      "suggested": "Shortened mobile-optimized version",
      "reason": "Current subject line exceeds 50 characters and may be truncated on mobile",
      "impact": "high",
      "confidence": 90
    },
    {
      "type": "cta", 
      "title": "Strengthen call-to-action",
      "current": "Click here",
      "suggested": "Get Your Free Guide Now",
      "reason": "More specific and action-oriented CTA increases click-through rates",
      "impact": "medium",
      "confidence": 85
    }
  ]
}

Subject: ${request.subjectLine}
Content: ${request.emailHTML.slice(0, 1500)}...`;

    return await this.callOpenAI(prompt, 2, true);
  }

  static async analyzePerformance(request: OpenAIEmailAnalysisRequest): Promise<PerformanceAnalysis> {
    const prompt = `Analyze email performance and technical compliance with email marketing standards:

EMAIL PERFORMANCE ANALYSIS:
1. DELIVERABILITY ASSESSMENT:
   - Spam score analysis
   - Authentication requirements
   - Content-to-image ratio
   - Link analysis and reputation

2. MOBILE OPTIMIZATION:
   - Responsive design indicators
   - Touch-friendly elements
   - Font size appropriateness
   - Single-column layout compliance

3. ACCESSIBILITY COMPLIANCE:
   - Alt text coverage
   - Color contrast ratios
   - Screen reader compatibility
   - Semantic HTML structure

4. EMAIL CLIENT COMPATIBILITY:
   - Outlook compatibility
   - Gmail rendering
   - Apple Mail support
   - Dark mode readiness

Return JSON:
{
  "overallScore": 87,
  "deliverabilityScore": 91,
  "mobileScore": 85,
  "accessibilityScore": 78,
  "spamScore": 15,
  "emailClientCompatibility": 89,
  "metrics": {
    "loadTime": {"value": 1.2, "status": "good"},
    "accessibility": {"value": 88, "status": "good"}, 
    "imageOptimization": {"value": 92, "status": "good"},
    "linkCount": {"value": 3, "status": "good"},
    "textToImageRatio": {"value": 80, "status": "excellent"}
  },
  "accessibilityIssues": [
    {
      "type": "alt-text",
      "severity": "medium", 
      "description": "2 images missing alt text",
      "fix": "Add descriptive alt text for all images"
    }
  ],
  "optimizationSuggestions": [
    "Add unsubscribe link in footer for CAN-SPAM compliance",
    "Optimize images for faster loading",
    "Test email in Outlook for better compatibility",
    "Add preheader text for better preview"
  ]
}

Subject: ${request.subjectLine}
Content: ${request.emailHTML.slice(0, 1500)}...`;

    return await this.callOpenAI(prompt, 2, true);
  }
}
