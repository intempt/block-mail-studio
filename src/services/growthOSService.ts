
import { OpenAIEmailService } from './openAIEmailService';

export interface MarketingContext {
  goals: string[];
  targetAudience?: string;
  campaignType?: string;
  conversionObjectives?: string[];
  customerJourneyStage?: string;
  previousInteractions: string[];
}

export interface GrowthOSChip {
  id: string;
  label: string;
  type: 'exploration' | 'building' | 'optimization';
  context: string;
}

export class GrowthOSService {
  private static marketingContext: MarketingContext = {
    goals: [],
    previousInteractions: []
  };

  static getGrowthOSWelcome(context: 'messages' | 'journeys' | 'snippets'): string {
    const welcomeMessages = {
      messages: "Hi! I'm GrowthOS, your AI growth marketing specialist from Intempt. I help teams analyze user behavior, launch experiments, personalize experiences, and automate outreach. What customer growth challenge are we tackling today?",
      journeys: "Hi! I'm GrowthOS, your AI growth marketing specialist from Intempt. I excel at designing customer journeys that maximize lifetime value and conversion rates. What customer experience challenge shall we solve together?",
      snippets: "Hi! I'm GrowthOS, your AI growth marketing specialist from Intempt. I help optimize content for maximum engagement and conversion. What marketing content needs growth optimization today?"
    };
    return welcomeMessages[context];
  }

  static async generateMarketingChips(
    userMessage: string, 
    context: 'messages' | 'journeys' | 'snippets',
    conversationDepth: number
  ): Promise<GrowthOSChip[]> {
    try {
      const contextPrompts = {
        messages: 'campaign creation and conversion optimization',
        journeys: 'customer journey mapping and lifecycle optimization',
        snippets: 'content optimization and A/B testing strategies'
      };

      const stagePrompts = {
        exploration: 'discovery and goal setting',
        building: 'strategy development and implementation',
        optimization: 'testing, refinement, and scaling'
      };

      const currentStage = conversationDepth <= 2 ? 'exploration' : 
                          conversationDepth <= 5 ? 'building' : 'optimization';

      const prompt = `You are GrowthOS, an AI growth marketing specialist from Intempt. Based on this ${contextPrompts[context]} conversation:

User message: "${userMessage}"
Marketing context: ${JSON.stringify(this.marketingContext)}
Conversation depth: ${conversationDepth}
Current stage: ${currentStage} (${stagePrompts[currentStage]})

Generate 4 intelligent follow-up chips that guide the user toward specific growth marketing outcomes. Focus on:

For exploration stage: Understanding customer segments, conversion goals, growth metrics
For building stage: Campaign strategy, content creation, automation setup  
For optimization stage: A/B testing, performance analysis, scaling strategies

Each chip should be a specific, actionable next step in their growth marketing journey.

Return as JSON:
{
  "chips": [
    {
      "id": "chip-1",
      "label": "Specific actionable suggestion",
      "type": "${currentStage}",
      "context": "Brief explanation of why this helps growth"
    }
  ]
}`;

      const response = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      return response.chips || this.getFallbackMarketingChips(context, currentStage);
    } catch (error) {
      console.error('Error generating marketing chips:', error);
      const currentStage = conversationDepth <= 2 ? 'exploration' : 
                          conversationDepth <= 5 ? 'building' : 'optimization';
      return this.getFallbackMarketingChips(context, currentStage);
    }
  }

  private static getFallbackMarketingChips(
    context: string, 
    stage: string
  ): GrowthOSChip[] {
    const fallbacks = {
      messages: {
        exploration: [
          { id: 'target-personas', label: 'Define your ideal customer personas', type: 'exploration' as const, context: 'Foundation for high-converting campaigns' },
          { id: 'conversion-goals', label: 'Set specific conversion objectives', type: 'exploration' as const, context: 'Measurable growth targets' },
          { id: 'customer-pain-points', label: 'Identify customer pain points', type: 'exploration' as const, context: 'Message-market fit optimization' },
          { id: 'audience-segmentation', label: 'Segment your target audience', type: 'exploration' as const, context: 'Personalized marketing approach' }
        ],
        building: [
          { id: 'campaign-strategy', label: 'Design multi-touch campaign sequence', type: 'building' as const, context: 'Systematic customer nurturing' },
          { id: 'content-frameworks', label: 'Create conversion-focused content', type: 'building' as const, context: 'Engagement and persuasion optimization' },
          { id: 'automation-triggers', label: 'Set up behavioral automation', type: 'building' as const, context: 'Scalable growth systems' },
          { id: 'email-sequences', label: 'Build email nurture sequences', type: 'building' as const, context: 'Automated relationship building' }
        ],
        optimization: [
          { id: 'ab-test-setup', label: 'Launch A/B testing experiments', type: 'optimization' as const, context: 'Data-driven performance improvement' },
          { id: 'performance-analysis', label: 'Analyze conversion metrics', type: 'optimization' as const, context: 'Growth bottleneck identification' },
          { id: 'scaling-strategy', label: 'Scale winning campaigns', type: 'optimization' as const, context: 'Revenue acceleration' },
          { id: 'funnel-optimization', label: 'Optimize conversion funnels', type: 'optimization' as const, context: 'Maximize customer acquisition' }
        ]
      },
      journeys: {
        exploration: [
          { id: 'journey-mapping', label: 'Map current customer journey', type: 'exploration' as const, context: 'Understanding customer touchpoints' },
          { id: 'lifecycle-stages', label: 'Define customer lifecycle stages', type: 'exploration' as const, context: 'Structured growth approach' },
          { id: 'touchpoint-analysis', label: 'Analyze key touchpoints', type: 'exploration' as const, context: 'Identify optimization opportunities' },
          { id: 'user-behavior', label: 'Study user behavior patterns', type: 'exploration' as const, context: 'Data-driven journey design' }
        ],
        building: [
          { id: 'onboarding-flow', label: 'Design onboarding automation', type: 'building' as const, context: 'Smooth customer activation' },
          { id: 'retention-sequences', label: 'Build retention workflows', type: 'building' as const, context: 'Reduce churn and increase LTV' },
          { id: 'trigger-logic', label: 'Set up behavioral triggers', type: 'building' as const, context: 'Responsive journey automation' },
          { id: 'cross-channel', label: 'Create cross-channel experiences', type: 'building' as const, context: 'Unified customer experience' }
        ],
        optimization: [
          { id: 'journey-testing', label: 'Test journey variations', type: 'optimization' as const, context: 'Optimize customer flow' },
          { id: 'engagement-metrics', label: 'Track engagement metrics', type: 'optimization' as const, context: 'Measure journey effectiveness' },
          { id: 'personalization', label: 'Add personalization layers', type: 'optimization' as const, context: 'Increase relevance and conversion' },
          { id: 'journey-scaling', label: 'Scale successful journeys', type: 'optimization' as const, context: 'Expand winning experiences' }
        ]
      },
      snippets: {
        exploration: [
          { id: 'content-audit', label: 'Audit existing content performance', type: 'exploration' as const, context: 'Baseline content effectiveness' },
          { id: 'message-themes', label: 'Identify top-performing themes', type: 'exploration' as const, context: 'Content strategy foundation' },
          { id: 'audience-voice', label: 'Define audience voice preferences', type: 'exploration' as const, context: 'Resonant messaging approach' },
          { id: 'competitor-analysis', label: 'Analyze competitor messaging', type: 'exploration' as const, context: 'Market positioning insights' }
        ],
        building: [
          { id: 'template-library', label: 'Build reusable templates', type: 'building' as const, context: 'Scalable content creation' },
          { id: 'copy-variations', label: 'Create copy variations', type: 'building' as const, context: 'Testing and optimization ready' },
          { id: 'cta-optimization', label: 'Optimize call-to-actions', type: 'building' as const, context: 'Drive specific user actions' },
          { id: 'subject-lines', label: 'Craft compelling subject lines', type: 'building' as const, context: 'Improve open rates' }
        ],
        optimization: [
          { id: 'content-testing', label: 'Run content A/B tests', type: 'optimization' as const, context: 'Data-driven content improvement' },
          { id: 'performance-tracking', label: 'Track content metrics', type: 'optimization' as const, context: 'Measure content effectiveness' },
          { id: 'content-automation', label: 'Automate content delivery', type: 'optimization' as const, context: 'Scale content distribution' },
          { id: 'dynamic-content', label: 'Implement dynamic content', type: 'optimization' as const, context: 'Personalized messaging at scale' }
        ]
      }
    };
    
    return fallbacks[context]?.[stage] || fallbacks.messages.exploration;
  }

  static updateMarketingContext(userMessage: string, chipContext?: string): void {
    this.marketingContext.previousInteractions.push(userMessage);
    
    // Extract marketing insights from user message
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
    
    // Keep context manageable
    if (this.marketingContext.previousInteractions.length > 10) {
      this.marketingContext.previousInteractions = this.marketingContext.previousInteractions.slice(-5);
    }
  }

  static async getGrowthOSResponse(
    userMessage: string,
    context: 'messages' | 'journeys' | 'snippets'
  ): Promise<string> {
    const contextDescription = {
      messages: 'campaign creation and customer acquisition',
      journeys: 'customer lifecycle optimization and retention',
      snippets: 'content performance and conversion optimization'
    };

    const prompt = `You are GrowthOS, an AI growth marketing specialist from Intempt. You help teams analyze user behavior, launch experiments, personalize experiences, and automate outreach.

Context: ${contextDescription[context]}
User message: "${userMessage}"
Marketing context: ${JSON.stringify(this.marketingContext)}

Respond as a growth marketing expert with:
1. Clear, actionable insights
2. Specific next steps
3. Growth-focused recommendations
4. Data-driven approach

Keep responses conversational but expert-level. Focus on measurable growth outcomes.`;

    try {
      return await OpenAIEmailService.conversationalResponse({
        userMessage: prompt,
        conversationContext: this.marketingContext.previousInteractions.slice(-3),
        currentEmailContent: ''
      });
    } catch (error) {
      console.error('GrowthOS response error:', error);
      const fallbackResponses = {
        messages: "I'm here to help you optimize your email marketing strategy. Could you tell me more about your specific campaign goals or challenges?",
        journeys: "I'm ready to help you design customer journeys that maximize engagement and conversion. What's your current customer experience challenge?",
        snippets: "I can help you create and optimize content that drives results. What type of messaging are you looking to improve?"
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
}
