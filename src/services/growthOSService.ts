
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

  static async getContextSpecificResponse(
    userMessage: string,
    context: 'messages' | 'journeys' | 'snippets'
  ): Promise<string> {
    const contextDescriptions = {
      messages: 'email marketing specialist focusing on campaigns, automation, and conversion optimization',
      journeys: 'customer journey architect designing automated flows and lifecycle optimization',
      snippets: 'content optimization expert crafting high-converting copy and CTAs'
    };

    const contextInstructions = {
      messages: 'Provide specific email marketing advice. Focus on campaigns, segmentation, automation, and measurable results.',
      journeys: 'Design customer journey solutions. Focus on touchpoint mapping, automation triggers, and lifecycle optimization.',
      snippets: 'Create and optimize content. Focus on copywriting, personalization, A/B testing, and conversion optimization.'
    };

    const prompt = `You are GrowthOS, an AI ${contextDescriptions[context]}.

${contextInstructions[context]}

User message: "${userMessage}"
Current topic: ${this.marketingContext.currentTopic || 'general'}
Marketing context: ${JSON.stringify(this.marketingContext)}

Respond with:
1. Specific, actionable insights for ${context}
2. Clear next steps
3. Growth-focused recommendations
4. Context-relevant expertise

Keep responses conversational but expert-level. Focus on ${context}-specific outcomes.`;

    try {
      return await OpenAIEmailService.conversationalResponse({
        userMessage: prompt,
        conversationContext: this.marketingContext.previousInteractions.slice(-3),
        currentEmailContent: ''
      });
    } catch (error) {
      console.error('GrowthOS response error:', error);
      const fallbackResponses = {
        messages: "I'm here to help you create high-converting email campaigns. What specific email marketing challenge are you facing?",
        journeys: "I'm ready to design customer journeys that maximize engagement and lifetime value. What customer experience are we optimizing?",
        snippets: "I can help you craft compelling copy that drives action. What content needs optimization for better performance?"
      };
      return fallbackResponses[context];
    }
  }

  static resetContext(): void {
    this.marketingContext = {
      goals: [],
      previousInteractions: []
    };
  }

  // Legacy method for backward compatibility
  static async generateMarketingChips(userMessage: string, context: 'messages' | 'journeys' | 'snippets', conversationDepth: number): Promise<GrowthOSChip[]> {
    return this.generateContextSpecificChips(userMessage, context, conversationDepth, this.marketingContext.currentTopic);
  }

  // Legacy method for backward compatibility  
  static async getGrowthOSResponse(userMessage: string, context: 'messages' | 'journeys' | 'snippets'): Promise<string> {
    return this.getContextSpecificResponse(userMessage, context);
  }
}
