
export interface OpenAIEmailAnalysisRequest {
  emailHTML: string;
  subjectLine: string;
  apiKey: string;
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
  private static async callOpenAI(prompt: string, apiKey: string): Promise<any> {
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
              content: 'You are an expert email marketing analyst. Analyze the provided email content and return only valid JSON without any markdown formatting or code blocks.'
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

      // Parse JSON response
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  static async analyzeBrandVoice(request: OpenAIEmailAnalysisRequest): Promise<BrandVoiceAnalysis> {
    const prompt = `
Analyze this email for brand voice and engagement potential:

Subject Line: "${request.subjectLine}"
Email HTML Content: ${request.emailHTML}

Provide analysis in this exact JSON format:
{
  "brandVoiceScore": <number 0-100>,
  "engagementScore": <number 0-100>,
  "toneConsistency": <number 0-100>,
  "readabilityScore": <number 0-100>,
  "performancePrediction": {
    "openRate": <number>,
    "clickRate": <number>,
    "conversionRate": <number>
  },
  "suggestions": [
    {
      "type": "copy|cta|tone",
      "title": "Brief title",
      "current": "Current text",
      "suggested": "Improved text",
      "reason": "Why this improves performance",
      "impact": "high|medium|low",
      "confidence": <number 0-100>
    }
  ]
}

Focus on brand voice consistency, engagement optimization, and conversion potential.`;

    return await this.callOpenAI(prompt, request.apiKey);
  }

  static async analyzePerformance(request: OpenAIEmailAnalysisRequest): Promise<PerformanceAnalysis> {
    const prompt = `
Analyze this email for technical performance and deliverability:

Subject Line: "${request.subjectLine}"
Email HTML Content: ${request.emailHTML}

Provide analysis in this exact JSON format:
{
  "overallScore": <number 0-100>,
  "deliverabilityScore": <number 0-100>,
  "mobileScore": <number 0-100>,
  "spamScore": <number 0-100>,
  "metrics": {
    "loadTime": {"value": <number>, "status": "good|warning|poor"},
    "accessibility": {"value": <number>, "status": "good|warning|poor"},
    "imageOptimization": {"value": <number>, "status": "good|warning|poor"},
    "linkCount": {"value": <number>, "status": "good|warning|poor"}
  },
  "accessibilityIssues": [
    {
      "type": "Issue type",
      "severity": "high|medium|low",
      "description": "Description of the issue",
      "fix": "How to fix it"
    }
  ],
  "optimizationSuggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Focus on deliverability, mobile optimization, accessibility, and technical performance.`;

    return await this.callOpenAI(prompt, request.apiKey);
  }
}
