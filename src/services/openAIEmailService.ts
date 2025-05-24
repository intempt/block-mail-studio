
import { ApiKeyService } from './apiKeyService';

export interface OpenAIEmailAnalysisRequest {
  emailHTML: string;
  subjectLine: string;
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

export class OpenAIEmailService {
  private static async callOpenAI(prompt: string): Promise<any> {
    const apiKey = ApiKeyService.getOpenAIKey();
    
    if (!apiKey || !ApiKeyService.isKeyAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    try {
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
              content: `You are an expert email marketing analyst with deep knowledge of:
              - Email deliverability best practices
              - Brand voice and tone analysis
              - Conversion optimization
              - Mobile email design
              - Accessibility standards
              - Anti-spam regulations
              
              Always return valid JSON without markdown formatting or code blocks.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  static async analyzeBrandVoice(request: OpenAIEmailAnalysisRequest): Promise<BrandVoiceAnalysis> {
    const prompt = `
MASTER PROMPT: COMPREHENSIVE EMAIL BRAND VOICE & ENGAGEMENT ANALYSIS

Analyze this complete email for brand voice, engagement potential, and conversion optimization:

SUBJECT LINE: "${request.subjectLine}"
EMAIL HTML CONTENT: ${request.emailHTML}

ANALYSIS REQUIREMENTS:
1. Brand Voice Consistency (0-100): Evaluate tone, language style, personality alignment
2. Engagement Score (0-100): Assess content quality, emotional appeal, value proposition
3. Tone Consistency (0-100): Check for consistent voice throughout the email
4. Readability Score (0-100): Analyze sentence structure, word choice, clarity

5. Performance Predictions:
   - Open Rate: Based on subject line and sender reputation factors
   - Click Rate: Based on content quality, CTAs, and layout
   - Conversion Rate: Based on offer clarity, urgency, and persuasion

6. Actionable Suggestions:
   - Focus on high-impact improvements
   - Provide specific before/after examples
   - Include confidence scores for each suggestion
   - Cover: copy improvements, CTA optimization, tone adjustments

Return this exact JSON structure:
{
  "brandVoiceScore": <number 0-100>,
  "engagementScore": <number 0-100>,
  "toneConsistency": <number 0-100>,
  "readabilityScore": <number 0-100>,
  "performancePrediction": {
    "openRate": <number percentage>,
    "clickRate": <number percentage>,
    "conversionRate": <number percentage>
  },
  "suggestions": [
    {
      "type": "copy|cta|tone|structure",
      "title": "Brief improvement title",
      "current": "Current text/element",
      "suggested": "Improved version",
      "reason": "Detailed explanation of why this improves performance",
      "impact": "high|medium|low",
      "confidence": <number 0-100>
    }
  ]
}

Focus on email marketing best practices, conversion psychology, and brand consistency.`;

    return await this.callOpenAI(prompt);
  }

  static async analyzePerformance(request: OpenAIEmailAnalysisRequest): Promise<PerformanceAnalysis> {
    const prompt = `
MASTER PROMPT: COMPREHENSIVE EMAIL PERFORMANCE & TECHNICAL ANALYSIS

Analyze this complete email for technical performance, deliverability, and optimization:

SUBJECT LINE: "${request.subjectLine}"
EMAIL HTML CONTENT: ${request.emailHTML}

TECHNICAL ANALYSIS REQUIREMENTS:
1. Overall Performance Score (0-100): Comprehensive email quality assessment
2. Deliverability Score (0-100): Spam filters, sender reputation, content flags
3. Mobile Optimization Score (0-100): Responsive design, mobile UX, touch targets
4. Spam Risk Score (0-100): Content analysis for spam triggers, suspicious elements

5. Technical Metrics:
   - Load Time: Estimated based on content size, images, external resources
   - Accessibility: WCAG compliance, alt text, color contrast, screen reader compatibility
   - Image Optimization: File sizes, formats, compression
   - Link Analysis: Count, quality, broken links potential

6. Accessibility Issues:
   - Identify specific WCAG violations
   - Provide severity ratings
   - Include fix recommendations

7. Optimization Suggestions:
   - Technical improvements for better performance
   - Deliverability enhancements
   - Mobile UX improvements
   - Accessibility fixes

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "deliverabilityScore": <number 0-100>,
  "mobileScore": <number 0-100>,
  "spamScore": <number 0-100>,
  "metrics": {
    "loadTime": {"value": <number seconds>, "status": "good|warning|poor"},
    "accessibility": {"value": <number 0-100>, "status": "good|warning|poor"},
    "imageOptimization": {"value": <number 0-100>, "status": "good|warning|poor"},
    "linkCount": {"value": <number>, "status": "good|warning|poor"}
  },
  "accessibilityIssues": [
    {
      "type": "Issue category",
      "severity": "high|medium|low",
      "description": "Clear description of the issue",
      "fix": "Specific steps to fix the issue"
    }
  ],
  "optimizationSuggestions": [
    "Specific, actionable optimization recommendations"
  ]
}

Apply email marketing technical best practices, deliverability standards, and accessibility guidelines.`;

    return await this.callOpenAI(prompt);
  }
}
