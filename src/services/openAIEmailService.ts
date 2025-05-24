
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

export class OpenAIEmailService {
  private static async callOpenAI(prompt: string): Promise<any> {
    const apiKey = ApiKeyService.getOpenAIKey();
    
    if (!ApiKeyService.isKeyAvailable()) {
      throw new Error('OpenAI API key not configured properly');
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
              content: `You are an expert email marketing specialist with deep knowledge of:
              - Email deliverability best practices
              - Brand voice and tone analysis
              - Conversion optimization
              - Mobile email design
              - Accessibility standards
              - Anti-spam regulations
              - Email block-based design systems
              
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

  static async generateEmailContent(request: EmailGenerationRequest): Promise<EmailGenerationResponse> {
    const prompt = `
MASTER PROMPT: GUIDED EMAIL CONTENT GENERATION

Generate a complete, professional email based on these specifications:

EMAIL TYPE: ${request.emailType}
TONE: ${request.tone}
USER PROMPT: "${request.prompt}"
${request.industry ? `INDUSTRY: ${request.industry}` : ''}
${request.targetAudience ? `TARGET AUDIENCE: ${request.targetAudience}` : ''}

REQUIREMENTS:
1. Create email content using HTML blocks structure compatible with email builders
2. Generate compelling subject line optimized for open rates
3. Create preview text that complements the subject line
4. Use proper email-safe HTML with inline styles
5. Include clear call-to-action elements
6. Ensure mobile-responsive design
7. Follow email accessibility best practices

HTML STRUCTURE REQUIREMENTS:
- Use div elements with class="email-block" for each section
- Include specific block types: header-block, paragraph-block, button-block, image-block
- Apply inline styles for email client compatibility
- Use font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Ensure proper spacing with padding and margins
- Include hover states for interactive elements

CONTENT GUIDELINES:
- ${request.emailType === 'welcome' ? 'Focus on warm greeting, setting expectations, and next steps' : ''}
- ${request.emailType === 'promotional' ? 'Emphasize value proposition, urgency, and clear benefits' : ''}
- ${request.emailType === 'newsletter' ? 'Provide valuable content, updates, and engagement opportunities' : ''}
- ${request.emailType === 'announcement' ? 'Communicate news clearly with context and implications' : ''}
- ${request.tone === 'professional' ? 'Use formal language, clear structure, and authoritative tone' : ''}
- ${request.tone === 'casual' ? 'Use conversational language, personal touches, and relaxed tone' : ''}
- ${request.tone === 'friendly' ? 'Use warm language, empathy, and approachable tone' : ''}
- ${request.tone === 'urgent' ? 'Use action-oriented language, time sensitivity, and direct calls-to-action' : ''}

Return this exact JSON structure:
{
  "subject": "Compelling subject line (under 50 characters)",
  "previewText": "Preview text that complements subject (under 90 characters)",
  "html": "Complete HTML email content with proper block structure",
  "keyPoints": ["Key message 1", "Key message 2", "Key message 3"]
}

Focus on conversion-optimized, professional email marketing best practices.`;

    return await this.callOpenAI(prompt);
  }

  static async generateSubjectLines(emailContent: string, count: number = 5): Promise<string[]> {
    const prompt = `
MASTER PROMPT: SUBJECT LINE OPTIMIZATION

Generate ${count} compelling subject lines for this email content:

EMAIL CONTENT: ${emailContent}

REQUIREMENTS:
1. Each subject line should be under 50 characters
2. Focus on open rate optimization
3. Include variety: urgency, curiosity, benefit-driven, personalized
4. Avoid spam trigger words
5. Test different emotional approaches
6. Consider mobile truncation at 30 characters

OPTIMIZATION TECHNIQUES:
- Use numbers and specific details
- Create curiosity gaps
- Include emotional triggers
- Add urgency when appropriate
- Personalization opportunities
- A/B testing variations

Return JSON array of subject lines:
{
  "subjectLines": ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"]
}`;

    const response = await this.callOpenAI(prompt);
    return response.subjectLines;
  }

  static async optimizeCopy(currentContent: string, optimizationType: 'engagement' | 'conversion' | 'clarity' | 'brevity'): Promise<string> {
    const prompt = `
MASTER PROMPT: EMAIL COPY OPTIMIZATION

Optimize this email content for ${optimizationType}:

CURRENT CONTENT: ${currentContent}

OPTIMIZATION FOCUS: ${optimizationType}
${optimizationType === 'engagement' ? '- Increase reader engagement and time spent reading\n- Add emotional hooks and storytelling elements\n- Improve content flow and readability' : ''}
${optimizationType === 'conversion' ? '- Maximize conversion rates and click-through rates\n- Strengthen call-to-action elements\n- Remove friction and objections' : ''}
${optimizationType === 'clarity' ? '- Improve message clarity and comprehension\n- Simplify complex concepts\n- Enhance information hierarchy' : ''}
${optimizationType === 'brevity' ? '- Reduce content length while maintaining impact\n- Remove unnecessary words and phrases\n- Tighten messaging focus' : ''}

REQUIREMENTS:
1. Maintain the original HTML structure and classes
2. Preserve all block-level elements and styling
3. Keep the core message and value proposition
4. Ensure email-safe HTML compatibility
5. Maintain professional tone and brand voice

Return optimized HTML content that can directly replace the original.`;

    return await this.callOpenAI(prompt);
  }

  static async generateBrandGuidelines(brandDescription: string): Promise<any> {
    const prompt = `
MASTER PROMPT: BRAND VOICE & STYLE GUIDELINES

Create comprehensive brand guidelines for email marketing based on this description:

BRAND DESCRIPTION: "${brandDescription}"

GENERATE:
1. Brand voice characteristics
2. Tone variations for different email types
3. Language preferences and restrictions
4. Visual style recommendations
5. Content themes and topics
6. Call-to-action styles
7. Email signature guidelines

Return detailed brand guidelines in JSON format:
{
  "voiceCharacteristics": ["characteristic1", "characteristic2"],
  "toneVariations": {
    "welcome": "tone description",
    "promotional": "tone description",
    "newsletter": "tone description"
  },
  "languagePreferences": {
    "preferred": ["word1", "phrase1"],
    "avoid": ["word2", "phrase2"]
  },
  "visualStyle": {
    "colors": ["#color1", "#color2"],
    "fonts": ["font1", "font2"],
    "spacing": "guideline"
  },
  "contentThemes": ["theme1", "theme2"],
  "ctaStyles": ["style1", "style2"]
}`;

    return await this.callOpenAI(prompt);
  }

  static async generateImagePrompts(emailContext: string, imageType: 'header' | 'product' | 'lifestyle' | 'icon'): Promise<string[]> {
    const prompt = `
MASTER PROMPT: EMAIL IMAGE PROMPT GENERATION

Generate 3 detailed image prompts for ${imageType} images based on this email context:

EMAIL CONTEXT: ${emailContext}
IMAGE TYPE: ${imageType}

REQUIREMENTS:
- Professional, high-quality imagery suitable for email marketing
- Consistent with email tone and message
- Optimized for small email display sizes
- Brand-appropriate styling
- ${imageType === 'header' ? 'Banner-style, engaging, attention-grabbing' : ''}
- ${imageType === 'product' ? 'Clean product photography, well-lit, detailed' : ''}
- ${imageType === 'lifestyle' ? 'People using product, emotional connection, aspirational' : ''}
- ${imageType === 'icon' ? 'Simple, clear, symbolic representation' : ''}

Return JSON with detailed prompts:
{
  "imagePrompts": [
    "Detailed prompt 1 with style, composition, and mood",
    "Detailed prompt 2 with style, composition, and mood", 
    "Detailed prompt 3 with style, composition, and mood"
  ]
}`;

    const response = await this.callOpenAI(prompt);
    return response.imagePrompts;
  }

  static async generateABTestVariants(originalEmail: string, testType: 'subject' | 'cta' | 'content' | 'layout'): Promise<any> {
    const prompt = `
MASTER PROMPT: A/B TEST VARIANT GENERATION

Create A/B test variants for this email focusing on ${testType} optimization:

ORIGINAL EMAIL: ${originalEmail}
TEST FOCUS: ${testType}

GENERATE:
1. Control version (original)
2. Variant A with specific hypothesis
3. Variant B with different approach
4. Success metrics to measure
5. Test duration recommendations

${testType === 'subject' ? 'Focus on different subject line approaches: urgency vs curiosity, long vs short, personalized vs generic' : ''}
${testType === 'cta' ? 'Focus on call-to-action variations: button text, colors, placement, size' : ''}
${testType === 'content' ? 'Focus on content structure: length, tone, value proposition presentation' : ''}
${testType === 'layout' ? 'Focus on visual hierarchy: image placement, text layout, button positioning' : ''}

Return comprehensive A/B test plan:
{
  "testHypothesis": "Clear hypothesis statement",
  "control": "Original version description",
  "variantA": {
    "description": "Variant description",
    "changes": ["change1", "change2"],
    "content": "Modified content/HTML"
  },
  "variantB": {
    "description": "Variant description", 
    "changes": ["change1", "change2"],
    "content": "Modified content/HTML"
  },
  "successMetrics": ["metric1", "metric2"],
  "testDuration": "Recommended duration",
  "sampleSize": "Required sample size"
}`;

    return await this.callOpenAI(prompt);
  }

  static async conversationalResponse(request: ConversationalRequest): Promise<string> {
    const contextString = request.conversationContext?.join('\n') || '';
    
    const prompt = `
MASTER PROMPT: CONVERSATIONAL EMAIL ASSISTANT

Respond to this user message as an expert email marketing assistant:

USER MESSAGE: "${request.userMessage}"

CONVERSATION CONTEXT: ${contextString}

CURRENT EMAIL CONTENT: ${request.currentEmailContent || 'No current email content'}

RESPONSE GUIDELINES:
1. Be helpful, knowledgeable, and professional
2. Provide actionable advice specific to email marketing
3. Reference current email content when relevant
4. Suggest concrete next steps
5. Ask clarifying questions when needed
6. Focus on email best practices and optimization

CAPABILITIES YOU CAN OFFER:
- Generate complete email content
- Optimize existing content
- Create subject lines
- Suggest A/B test ideas
- Provide brand voice guidance
- Generate image prompts
- Analyze email performance potential
- Create email sequences

Respond naturally and conversationally while being informative and helpful.`;

    return await this.callOpenAI(prompt);
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
