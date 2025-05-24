const OPENAI_API_KEY = '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';

export interface EmailGenerationRequest {
  prompt: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent';
  type?: 'welcome' | 'promotional' | 'newsletter' | 'announcement';
  images?: string[];
}

export interface EmailGenerationResponse {
  subject: string;
  html: string;
  previewText: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  style?: 'professional' | 'creative' | 'minimal' | 'vibrant';
  size?: '256x256' | '512x512' | '1024x1024';
}

export interface ImageGenerationResponse {
  imageUrl: string;
  prompt: string;
}

export interface PerformanceAnalysisResult {
  overallScore: number | null;
  deliverabilityScore: number | null;
  accessibilityScore: number | null;
  mobileScore: number | null;
  spamScore: number | null;
  metrics: {
    emailSize: { value: number | null; status: 'good' | 'warning' | 'poor' | 'unavailable'; recommendation?: string };
    imageCount: { value: number | null; status: 'good' | 'warning' | 'poor' | 'unavailable'; recommendation?: string };
    loadTime: { value: number | null; status: 'good' | 'warning' | 'poor' | 'unavailable'; recommendation?: string };
    linkCount: { value: number | null; status: 'good' | 'warning' | 'poor' | 'unavailable'; recommendation?: string };
  };
  accessibilityIssues: Array<{
    type: 'contrast' | 'alt-text' | 'font-size' | 'structure';
    severity: 'high' | 'medium' | 'low';
    element: string;
    description: string;
    fix: string;
  }>;
  optimizationSuggestions: string[];
}

export interface BrandVoiceAnalysisResult {
  brandVoiceScore: number | null;
  engagementScore: number | null;
  toneConsistency: number | null;
  readabilityScore: number | null;
  performancePrediction: {
    openRate: number | null;
    clickRate: number | null;
    conversionRate: number | null;
  };
  suggestions: Array<{
    type: 'subject' | 'copy' | 'cta' | 'tone';
    title: string;
    current: string;
    suggested: string;
    reason: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
  }>;
}

export interface SubjectLineAnalysisResult {
  score: number | null;
  length: number;
  spamRisk: 'low' | 'medium' | 'high' | 'unknown';
  emotionalImpact: number | null;
  urgencyLevel: number | null;
  personalizedElements: string[];
  recommendations: string[];
  abTestSuggestions: string[];
  benchmarkComparison: {
    industry: string;
    averageOpenRate: number | null;
    predictedOpenRate: number | null;
  };
}

export class EmailAIService {
  private async callOpenAI(messages: any[], options: any = {}) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          temperature: 0.3,
          max_tokens: 3000,
          ...options
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  async analyzeEmailPerformance(emailHTML: string): Promise<PerformanceAnalysisResult> {
    const systemPrompt = `You are an expert email marketing analyst with deep knowledge of email deliverability, accessibility standards (WCAG 2.1), spam filtering, and industry best practices. 

    Analyze the provided email HTML and return a comprehensive performance analysis. Consider:
    - Email deliverability factors (sender reputation, content quality, technical setup)
    - Accessibility compliance (WCAG 2.1 AA standards)
    - Mobile optimization and responsive design
    - Spam score assessment using industry-standard criteria
    - Technical performance metrics
    - Security and privacy compliance

    Return your analysis as a JSON object following this exact structure:
    {
      "overallScore": number (0-100),
      "deliverabilityScore": number (0-100),
      "accessibilityScore": number (0-100),
      "mobileScore": number (0-100),
      "spamScore": number (0-100, lower is better),
      "metrics": {
        "emailSize": {"value": number, "status": "good|warning|poor", "recommendation": "string"},
        "imageCount": {"value": number, "status": "good|warning|poor", "recommendation": "string"},
        "loadTime": {"value": number, "status": "good|warning|poor", "recommendation": "string"},
        "linkCount": {"value": number, "status": "good|warning|poor", "recommendation": "string"}
      },
      "accessibilityIssues": [
        {"type": "contrast|alt-text|font-size|structure", "severity": "high|medium|low", "element": "string", "description": "string", "fix": "string"}
      ],
      "optimizationSuggestions": ["string"]
    }`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this email HTML for performance:\n\n${emailHTML}` }
    ];

    try {
      const response = await this.callOpenAI(messages);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing email performance:', error);
      // Return proper fallback with null values
      return {
        overallScore: null,
        deliverabilityScore: null,
        accessibilityScore: null,
        mobileScore: null,
        spamScore: null,
        metrics: {
          emailSize: { value: null, status: 'unavailable', recommendation: 'Analysis unavailable' },
          imageCount: { value: null, status: 'unavailable', recommendation: 'Analysis unavailable' },
          loadTime: { value: null, status: 'unavailable', recommendation: 'Analysis unavailable' },
          linkCount: { value: null, status: 'unavailable', recommendation: 'Analysis unavailable' }
        },
        accessibilityIssues: [],
        optimizationSuggestions: ['AI analysis is currently unavailable. Please check your connection and try again.']
      };
    }
  }

  async analyzeBrandVoice(emailHTML: string, subjectLine?: string, brandGuidelines?: string): Promise<BrandVoiceAnalysisResult> {
    const systemPrompt = `You are an expert brand voice analyst and email marketing strategist with deep knowledge of psychology, engagement optimization, and conversion best practices.

    Analyze the provided email content for brand voice consistency, engagement potential, and optimization opportunities. Consider:
    - Tone and voice consistency throughout the email
    - Emotional resonance and psychological triggers
    - Call-to-action effectiveness and placement
    - Content flow and readability
    - Personalization opportunities
    - Industry best practices for engagement and conversion
    - A/B testing opportunities

    Return your analysis as a JSON object following this exact structure:
    {
      "brandVoiceScore": number (0-100),
      "engagementScore": number (0-100),
      "toneConsistency": number (0-100),
      "readabilityScore": number (0-100),
      "performancePrediction": {
        "openRate": number,
        "clickRate": number,
        "conversionRate": number
      },
      "suggestions": [
        {
          "type": "subject|copy|cta|tone",
          "title": "string",
          "current": "string",
          "suggested": "string",
          "reason": "string",
          "impact": "high|medium|low",
          "confidence": number (0-100)
        }
      ]
    }`;

    const content = `Email HTML: ${emailHTML}${subjectLine ? `\n\nSubject Line: ${subjectLine}` : ''}${brandGuidelines ? `\n\nBrand Guidelines: ${brandGuidelines}` : ''}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content }
    ];

    try {
      const response = await this.callOpenAI(messages);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing brand voice:', error);
      // Return proper fallback with null values
      return {
        brandVoiceScore: null,
        engagementScore: null,
        toneConsistency: null,
        readabilityScore: null,
        performancePrediction: {
          openRate: null,
          clickRate: null,
          conversionRate: null
        },
        suggestions: []
      };
    }
  }

  async analyzeSubjectLine(subjectLine: string, emailContent?: string, industry?: string): Promise<SubjectLineAnalysisResult> {
    const systemPrompt = `You are an expert email marketing specialist with deep knowledge of subject line optimization, spam filtering, and industry benchmarks.

    Analyze the provided subject line for effectiveness, spam risk, emotional impact, and optimization opportunities. Consider:
    - Length optimization for different email clients
    - Spam trigger words and phrases
    - Emotional psychology and urgency
    - Personalization opportunities
    - Industry-specific best practices
    - A/B testing variations
    - Predicted performance metrics

    Return your analysis as a JSON object following this exact structure:
    {
      "score": number (0-100),
      "length": number,
      "spamRisk": "low|medium|high",
      "emotionalImpact": number (0-100),
      "urgencyLevel": number (0-100),
      "personalizedElements": ["string"],
      "recommendations": ["string"],
      "abTestSuggestions": ["string"],
      "benchmarkComparison": {
        "industry": "string",
        "averageOpenRate": number,
        "predictedOpenRate": number
      }
    }`;

    const content = `Subject Line: "${subjectLine}"${emailContent ? `\n\nEmail Content Context: ${emailContent.substring(0, 500)}...` : ''}${industry ? `\n\nIndustry: ${industry}` : ''}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content }
    ];

    try {
      const response = await this.callOpenAI(messages);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing subject line:', error);
      // Return proper fallback with null values
      return {
        score: null,
        length: subjectLine.length,
        spamRisk: 'unknown',
        emotionalImpact: null,
        urgencyLevel: null,
        personalizedElements: [],
        recommendations: ['AI analysis is currently unavailable. Please check your connection and try again.'],
        abTestSuggestions: [],
        benchmarkComparison: {
          industry: industry || 'Unknown',
          averageOpenRate: null,
          predictedOpenRate: null
        }
      };
    }
  }

  async generateEmail(request: EmailGenerationRequest): Promise<EmailGenerationResponse> {
    const systemPrompt = `You are an expert email marketing copywriter. Generate professional HTML email content that is responsive and follows email best practices. 

Guidelines:
- Use inline CSS styles for email compatibility
- Include proper email-safe fonts (Arial, sans-serif)
- Make content responsive with max-width: 600px
- Include proper email structure with containers
- Generate compelling subject lines
- Create engaging preview text
- Use appropriate tone: ${request.tone || 'professional'}
- Email type: ${request.type || 'general'}

Return your response as a JSON object with:
{
  "subject": "Email subject line",
  "html": "Complete HTML email content with inline styles",
  "previewText": "Preview text for email clients"
}`;

    const userPrompt = `Create an email based on this request: ${request.prompt}

${request.images && request.images.length > 0 ? 
  `Consider these uploaded images in the email design and content.` : ''}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    try {
      const response = await this.callOpenAI(messages);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating email:', error);
      return {
        subject: 'Your Email Subject',
        html: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #333; margin-bottom: 20px;">Generated Email Content</h1>
          <p style="line-height: 1.6; color: #666;">I encountered an issue generating your email. Please try again or check your API configuration.</p>
          <p style="line-height: 1.6; color: #666;">Original request: ${request.prompt}</p>
        </div>`,
        previewText: 'Error generating email content'
      };
    }
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `${request.prompt}. Style: ${request.style || 'professional'}. High quality, suitable for email marketing.`,
          n: 1,
          size: request.size || '1024x1024',
          quality: 'standard'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI Images API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        imageUrl: data.data[0].url,
        prompt: request.prompt
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image. Please try again.');
    }
  }

  async analyzeImage(imageUrl: string): Promise<string> {
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this image and describe how it could be used in an email marketing campaign. What emotions, products, or messages does it convey? Keep it concise.'
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ];

    try {
      return await this.callOpenAI(messages);
    } catch (error) {
      console.error('Error analyzing image:', error);
      return 'Professional image suitable for email marketing campaigns.';
    }
  }

  async refineEmail(currentHtml: string, refinementPrompt: string): Promise<string> {
    const systemPrompt = `You are an email marketing expert. The user will provide current email HTML and a refinement request. 
    Modify the HTML according to their request while maintaining email compatibility and responsive design.
    Return only the updated HTML content with inline styles.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Current email HTML:\n${currentHtml}\n\nRefinement request: ${refinementPrompt}` }
    ];

    try {
      return await this.callOpenAI(messages);
    } catch (error) {
      console.error('Error refining email:', error);
      throw new Error('Failed to refine email content');
    }
  }

  async generateContent(prompt: string, type: 'subject' | 'copy' | 'cta' | 'general' = 'general'): Promise<string> {
    const systemPrompts = {
      subject: 'Generate compelling email subject lines that increase open rates. Be concise and engaging.',
      copy: 'Write persuasive email copy that converts. Focus on benefits and clear value proposition.',
      cta: 'Create powerful call-to-action text that drives clicks. Be action-oriented and urgent.',
      general: 'Provide helpful email marketing content based on the user request.'
    };

    const messages = [
      { role: 'system', content: systemPrompts[type] },
      { role: 'user', content: prompt }
    ];

    try {
      return await this.callOpenAI(messages);
    } catch (error) {
      console.error('Error generating content:', error);
      return 'Unable to generate content at this time. Please try again.';
    }
  }
}

export const emailAIService = new EmailAIService();
