
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

export class EmailAIService {
  private async callOpenAI(messages: any[]) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
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
      throw new Error('Failed to generate email content');
    }
  }

  async analyzeImage(imageUrl: string): Promise<string> {
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this image and describe how it could be used in an email marketing campaign. What emotions, products, or messages does it convey?'
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
      return 'Unable to analyze image';
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
}

export const emailAIService = new EmailAIService();
