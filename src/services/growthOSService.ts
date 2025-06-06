import { OpenAIEmailService } from './openAIEmailService';

export interface MarketingContext {
  goals: string[];
  targetAudience?: string;
  campaignType?: string;
  conversionObjectives?: string[];
  customerJourneyStage?: string;
  previousInteractions: string[];
  currentTopic?: string;
  topicDepth?: number;
}

export interface GrowthOSChip {
  id: string;
  label: string;
  type: 'exploration' | 'building' | 'optimization';
  context: string;
  topic?: string;
}

export class GrowthOSService {
  private static marketingContext: MarketingContext = {
    goals: [],
    previousInteractions: []
  };

  static getGrowthOSWelcome(context: 'messages' | 'journeys' | 'snippets'): string {
    const welcomeMessages = {
      messages: "Hi! I'm GrowthOS, your AI email marketing specialist. I help you create high-converting email campaigns, segment audiences, and optimize messaging for maximum engagement. What email marketing challenge are we solving today?",
      journeys: "Hi! I'm GrowthOS, your AI customer journey architect. I design automated flows that guide customers from awareness to advocacy, optimizing every touchpoint for maximum lifetime value. What customer journey are we building?",
      snippets: "Hi! I'm GrowthOS, your AI content optimization expert. I craft compelling copy, subject lines, and CTAs that drive action and conversions. What content needs optimization today?"
    };
    return welcomeMessages[context];
  }

  static async generateContextSpecificChips(
    userMessage: string, 
    context: 'messages' | 'journeys' | 'snippets',
    conversationDepth: number,
    currentTopic?: string
  ): Promise<GrowthOSChip[]> {
    try {
      const contextPrompts = {
        messages: this.getMessagesPrompt(userMessage, conversationDepth, currentTopic),
        journeys: this.getJourneysPrompt(userMessage, conversationDepth, currentTopic),
        snippets: this.getSnippetsPrompt(userMessage, conversationDepth, currentTopic)
      };

      const response = await OpenAIEmailService.callOpenAI(contextPrompts[context], 2, true);
      return response.chips || this.getContextSpecificFallbacks(context, conversationDepth, currentTopic);
    } catch (error) {
      console.error('Error generating context-specific chips:', error);
      return this.getContextSpecificFallbacks(context, conversationDepth, currentTopic);
    }
  }

  private static getMessagesPrompt(userMessage: string, depth: number, currentTopic?: string): string {
    if (depth === 0) {
      return `You are GrowthOS, an AI email marketing specialist. Generate 4 starter chips for email marketing tasks.

Focus on specific email marketing challenges:
- Campaign creation and strategy
- Audience segmentation and targeting  
- Email automation and sequences
- Performance optimization and A/B testing

Each chip should be a specific email marketing task a user might want to accomplish.

Return as JSON:
{
  "chips": [
    {
      "id": "chip-1",
      "label": "Create welcome email sequence",
      "type": "exploration",
      "context": "New subscriber onboarding optimization",
      "topic": "welcome-series"
    }
  ]
}`;
    }

    const stage = depth <= 2 ? 'exploration' : depth <= 5 ? 'building' : 'optimization';
    
    return `You are GrowthOS, an AI email marketing specialist. Based on this conversation:

User message: "${userMessage}"
Current topic: ${currentTopic || 'general email marketing'}
Conversation depth: ${depth}
Stage: ${stage}

Generate 4 follow-up chips that dive deeper into the current topic. For ${currentTopic || 'email marketing'}:

If exploration stage: Ask clarifying questions about goals, audience, timing
If building stage: Suggest specific tactics, templates, automation setup
If optimization stage: Focus on testing, metrics, scaling strategies

Return as JSON with chips that progress the ${currentTopic || 'email marketing'} conversation.

{
  "chips": [
    {
      "id": "chip-1",
      "label": "Specific next step for ${currentTopic || 'email marketing'}",
      "type": "${stage}",
      "context": "Why this helps with ${currentTopic || 'email marketing'}",
      "topic": "${currentTopic || 'email-marketing'}"
    }
  ]
}`;
  }

  private static getJourneysPrompt(userMessage: string, depth: number, currentTopic?: string): string {
    if (depth === 0) {
      return `You are GrowthOS, an AI customer journey architect. Generate 4 starter chips for customer journey tasks.

Focus on specific journey design challenges:
- Customer onboarding and activation
- Retention and engagement flows
- Lifecycle stage optimization
- Cross-channel journey orchestration

Each chip should be a specific customer journey a user might want to build.

Return as JSON:
{
  "chips": [
    {
      "id": "chip-1", 
      "label": "Design onboarding journey for SaaS users",
      "type": "exploration",
      "context": "Improve user activation and time-to-value",
      "topic": "saas-onboarding"
    }
  ]
}`;
    }

    const stage = depth <= 2 ? 'exploration' : depth <= 5 ? 'building' : 'optimization';
    
    return `You are GrowthOS, an AI customer journey architect. Based on this conversation:

User message: "${userMessage}"
Current topic: ${currentTopic || 'customer journey'}
Conversation depth: ${depth}
Stage: ${stage}

Generate 4 follow-up chips that advance the ${currentTopic || 'customer journey'} design. For ${currentTopic || 'customer journeys'}:

If exploration stage: Map touchpoints, define objectives, identify pain points
If building stage: Create flow logic, set triggers, design content for each stage  
If optimization stage: Analyze performance, test variations, scale successful paths

Return as JSON with chips that develop the ${currentTopic || 'customer journey'} further.

{
  "chips": [
    {
      "id": "chip-1",
      "label": "Next step for ${currentTopic || 'customer journey'}",
      "type": "${stage}",
      "context": "How this improves ${currentTopic || 'customer journey'}",
      "topic": "${currentTopic || 'customer-journey'}"
    }
  ]
}`;
  }

  private static getSnippetsPrompt(userMessage: string, depth: number, currentTopic?: string): string {
    if (depth === 0) {
      return `You are GrowthOS, an AI content optimization expert. Generate 4 starter chips for content optimization tasks.

Focus on specific content creation challenges:
- Email subject lines and copy
- Call-to-action optimization
- Personalization and dynamic content
- A/B testing variations

Each chip should be a specific content optimization task.

Return as JSON:
{
  "chips": [
    {
      "id": "chip-1",
      "label": "Write high-converting subject lines",
      "type": "exploration", 
      "context": "Improve email open rates and engagement",
      "topic": "subject-lines"
    }
  ]
}`;
    }

    const stage = depth <= 2 ? 'exploration' : depth <= 5 ? 'building' : 'optimization';
    
    return `You are GrowthOS, an AI content optimization expert. Based on this conversation:

User message: "${userMessage}"
Current topic: ${currentTopic || 'content optimization'}
Conversation depth: ${depth}
Stage: ${stage}

Generate 4 follow-up chips that enhance the ${currentTopic || 'content optimization'} work. For ${currentTopic || 'content'}:

If exploration stage: Understand audience, goals, brand voice, competitive landscape
If building stage: Create variations, optimize for conversion, implement personalization
If optimization stage: Test performance, analyze metrics, scale winning content

Return as JSON with chips that refine the ${currentTopic || 'content optimization'} approach.

{
  "chips": [
    {
      "id": "chip-1",
      "label": "Advance ${currentTopic || 'content optimization'}",
      "type": "${stage}",
      "context": "Why this improves ${currentTopic || 'content'}",
      "topic": "${currentTopic || 'content-optimization'}"
    }
  ]
}`;
  }

  private static getContextSpecificFallbacks(
    context: 'messages' | 'journeys' | 'snippets',
    depth: number,
    currentTopic?: string
  ): GrowthOSChip[] {
    if (depth === 0) {
      return this.getStarterFallbacks(context);
    }
    
    return this.getTopicFallbacks(context, currentTopic);
  }

  private static getStarterFallbacks(context: 'messages' | 'journeys' | 'snippets'): GrowthOSChip[] {
    const fallbacks = {
      messages: [
        { id: 'welcome-series', label: 'Create welcome email sequence', type: 'exploration' as const, context: 'New subscriber onboarding', topic: 'welcome-series' },
        { id: 'segment-audience', label: 'Segment audience for personalized campaigns', type: 'exploration' as const, context: 'Targeted messaging strategy', topic: 'audience-segmentation' },
        { id: 'cart-abandonment', label: 'Build cart abandonment email flow', type: 'exploration' as const, context: 'Recover lost sales automatically', topic: 'cart-recovery' },
        { id: 'newsletter-optimize', label: 'Optimize newsletter engagement', type: 'exploration' as const, context: 'Improve open and click rates', topic: 'newsletter-optimization' }
      ],
      journeys: [
        { id: 'saas-onboarding', label: 'Design SaaS user onboarding journey', type: 'exploration' as const, context: 'Improve activation and retention', topic: 'saas-onboarding' },
        { id: 'ecommerce-lifecycle', label: 'Map ecommerce customer lifecycle', type: 'exploration' as const, context: 'First purchase to loyalty program', topic: 'ecommerce-lifecycle' },
        { id: 'trial-conversion', label: 'Create trial-to-paid conversion flow', type: 'exploration' as const, context: 'Maximize subscription conversions', topic: 'trial-conversion' },
        { id: 'reactivation-journey', label: 'Build customer reactivation journey', type: 'exploration' as const, context: 'Win back churned customers', topic: 'customer-reactivation' }
      ],
      snippets: [
        { id: 'subject-lines', label: 'Write high-converting subject lines', type: 'exploration' as const, context: 'Boost email open rates', topic: 'subject-lines' },
        { id: 'cta-optimization', label: 'Optimize call-to-action copy', type: 'exploration' as const, context: 'Increase click-through rates', topic: 'cta-optimization' },
        { id: 'personalization-tokens', label: 'Create personalization templates', type: 'exploration' as const, context: 'Dynamic content for segments', topic: 'personalization' },
        { id: 'ab-test-copy', label: 'Generate A/B test variations', type: 'exploration' as const, context: 'Data-driven copy optimization', topic: 'ab-testing' }
      ]
    };
    
    return fallbacks[context];
  }

  private static getTopicFallbacks(context: 'messages' | 'journeys' | 'snippets', topic?: string): GrowthOSChip[] {
    if (!topic) return this.getStarterFallbacks(context);
    
    const topicFallbacks = {
      'welcome-series': [
        { id: 'welcome-timing', label: 'Define welcome email timing', type: 'building' as const, context: 'Optimal send schedule', topic: 'welcome-series' },
        { id: 'welcome-content', label: 'Create welcome email content', type: 'building' as const, context: 'Engaging first impression', topic: 'welcome-series' },
        { id: 'welcome-goals', label: 'Set welcome series goals', type: 'building' as const, context: 'Measurable success metrics', topic: 'welcome-series' },
        { id: 'welcome-testing', label: 'Test welcome email performance', type: 'optimization' as const, context: 'Improve engagement rates', topic: 'welcome-series' }
      ],
      'subject-lines': [
        { id: 'subject-urgency', label: 'Add urgency to subject lines', type: 'building' as const, context: 'Create fear of missing out', topic: 'subject-lines' },
        { id: 'subject-personalization', label: 'Personalize subject lines', type: 'building' as const, context: 'Increase relevance and opens', topic: 'subject-lines' },
        { id: 'subject-length', label: 'Optimize subject line length', type: 'building' as const, context: 'Mobile-friendly display', topic: 'subject-lines' },
        { id: 'subject-testing', label: 'A/B test subject variations', type: 'optimization' as const, context: 'Data-driven optimization', topic: 'subject-lines' }
      ],
      'saas-onboarding': [
        { id: 'onboarding-stages', label: 'Define onboarding stages', type: 'building' as const, context: 'Clear user progression path', topic: 'saas-onboarding' },
        { id: 'onboarding-triggers', label: 'Set behavioral triggers', type: 'building' as const, context: 'Responsive journey flow', topic: 'saas-onboarding' },
        { id: 'onboarding-content', label: 'Create stage-specific content', type: 'building' as const, context: 'Relevant user guidance', topic: 'saas-onboarding' },
        { id: 'onboarding-metrics', label: 'Track onboarding success', type: 'optimization' as const, context: 'Measure activation rates', topic: 'saas-onboarding' }
      ]
    };
    
    return topicFallbacks[topic] || this.getStarterFallbacks(context);
  }

  static updateMarketingContext(userMessage: string, chipContext?: string, topic?: string): void {
    this.marketingContext.previousInteractions.push(userMessage);
    
    if (topic) {
      this.marketingContext.currentTopic = topic;
      this.marketingContext.topicDepth = (this.marketingContext.topicDepth || 0) + 1;
    }
    
    const message = userMessage.toLowerCase();
    
    if (message.includes('conversion') || message.includes('sales')) {
      if (!this.marketingContext.conversionObjectives) this.marketingContext.conversionObjectives = [];
      this.marketingContext.conversionObjectives.push('conversion optimization');
    }
    
    if (message.includes('customer') || message.includes('audience')) {
      this.marketingContext.targetAudience = userMessage;
    }
    
    if (chipContext) {
      this.marketingContext.goals.push(chipContext);
    }
    
    if (this.marketingContext.previousInteractions.length > 10) {
      this.marketingContext.previousInteractions = this.marketingContext.previousInteractions.slice(-5);
    }
  }

  static async getAskModeResponse(
    userMessage: string,
    context: 'messages' | 'journeys' | 'snippets'
  ): Promise<string> {
    const askPrompts = {
      messages: `You are GrowthOS, an AI email marketing specialist providing expert guidance. The user is asking for advice, not requesting you to build anything.

User question: "${userMessage}"
Context: Email marketing guidance
Current topic: ${this.marketingContext.currentTopic || 'general email marketing'}

Provide helpful, strategic advice about email marketing. Focus on:
- Campaign strategy and planning
- Audience segmentation techniques
- Email automation best practices
- Performance optimization tips
- Industry insights and trends

Respond as a knowledgeable consultant would - give actionable guidance without building anything.`,

      journeys: `You are GrowthOS, an AI customer journey architect providing expert guidance. The user is asking for advice, not requesting you to build anything.

User question: "${userMessage}"
Context: Customer journey design guidance
Current topic: ${this.marketingContext.currentTopic || 'general customer journeys'}

Provide helpful, strategic advice about customer journey design. Focus on:
- Journey mapping methodologies
- Touchpoint identification and optimization
- Automation trigger strategies
- Customer lifecycle stages
- Cross-channel orchestration

Respond as a journey design expert would - give actionable guidance without building anything.`,

      snippets: `You are GrowthOS, an AI content optimization expert providing expert guidance. The user is asking for advice, not requesting you to build anything.

User question: "${userMessage}"
Context: Content optimization guidance
Current topic: ${this.marketingContext.currentTopic || 'general content optimization'}

Provide helpful, strategic advice about content optimization. Focus on:
- Copywriting best practices
- Subject line optimization strategies
- CTA design and placement
- Personalization techniques
- A/B testing methodologies

Respond as a content optimization expert would - give actionable guidance without building anything.`
    };

    try {
      return await OpenAIEmailService.conversationalResponse({
        userMessage: askPrompts[context],
        conversationContext: this.marketingContext.previousInteractions.slice(-3),
        currentEmailContent: ''
      });
    } catch (error) {
      console.error('Ask mode response error:', error);
      const fallbackResponses = {
        messages: "I'm here to provide email marketing guidance. What specific aspect of email campaigns would you like strategic advice on?",
        journeys: "I'm ready to share customer journey insights. What part of the customer experience design process needs expert guidance?",
        snippets: "I can provide content optimization expertise. What specific copywriting or content challenge would you like strategic advice on?"
      };
      return fallbackResponses[context];
    }
  }

  static async getDoModeResponse(
    userMessage: string,
    context: 'messages' | 'journeys' | 'snippets'
  ): Promise<{ content: string; emailData?: any }> {
    if (context !== 'messages') {
      return {
        content: `Do mode is currently only available for email creation in Messages. For ${context}, I can provide expert guidance and strategic advice using Ask mode. Would you like me to help you plan your ${context === 'journeys' ? 'customer journey' : 'content optimization'} strategy instead?`
      };
    }

    // Only generate emails in Messages context with Do mode
    try {
      const emailGenerationPrompt = `Create a professional email based on this request: ${userMessage}

Current topic context: ${this.marketingContext.currentTopic || 'email marketing'}
User goals: ${this.marketingContext.goals.join(', ') || 'email creation'}

Generate an email with proper email-block structure for the email builder.`;

      const emailResponse = await OpenAIEmailService.generateEmailContent({
        prompt: emailGenerationPrompt,
        emailType: 'promotional',
        tone: 'professional'
      });

      return {
        content: `Perfect! I've created a ${this.marketingContext.currentTopic || 'professional'} email based on your request. You can load it into the email builder to customize the design and content further.`,
        emailData: emailResponse
      };
    } catch (error) {
      console.error('Do mode email generation error:', error);
      return {
        content: "I had trouble generating the email. Let me help you plan the email strategy first, then we can create it together."
      };
    }
  }

  static resetContext(): void {
    this.marketingContext = {
      goals: [],
      previousInteractions: []
    };
  }

  // Legacy methods for backward compatibility
  static async generateMarketingChips(userMessage: string, context: 'messages' | 'journeys' | 'snippets', conversationDepth: number): Promise<GrowthOSChip[]> {
    return this.generateContextSpecificChips(userMessage, context, conversationDepth, this.marketingContext.currentTopic);
  }

  static async getGrowthOSResponse(userMessage: string, context: 'messages' | 'journeys' | 'snippets'): Promise<string> {
    return this.getAskModeResponse(userMessage, context);
  }

  static async getContextSpecificResponse(userMessage: string, context: 'messages' | 'journeys' | 'snippets'): Promise<string> {
    return this.getAskModeResponse(userMessage, context);
  }
}
