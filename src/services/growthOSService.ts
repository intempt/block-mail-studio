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
      messages: "Hi! I'm GrowthOS, your AI growth marketing specialist. I help teams create high-converting campaigns that drive real business results. What kind of customer growth challenge are we tackling today?",
      journeys: "Hi! I'm GrowthOS, your AI growth marketing specialist. I excel at designing customer journeys that maximize lifetime value and conversion rates. What customer experience challenge shall we solve together?",
      snippets: "Hi! I'm GrowthOS, your AI growth marketing specialist. I help optimize content for maximum engagement and conversion. What marketing content needs growth optimization today?"
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

      const prompt = `You are GrowthOS, an AI growth marketing specialist. Based on this ${contextPrompts[context]} conversation:

User message: "${userMessage}"
Marketing context: ${JSON.stringify(this.marketingContext)}
Conversation depth: ${conversationDepth}
Current stage: ${currentStage} (${stagePrompts[currentStage]})

Generate 5 intelligent follow-up chips that guide the user toward specific growth marketing outcomes. Focus on:

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
          { id: 'customer-pain-points', label: 'Identify customer pain points', type: 'exploration' as const, context: 'Message-market fit optimization' }
        ],
        building: [
          { id: 'campaign-strategy', label: 'Design multi-touch campaign sequence', type: 'building' as const, context: 'Systematic customer nurturing' },
          { id: 'content-frameworks', label: 'Create conversion-focused content', type: 'building' as const, context: 'Engagement and persuasion optimization' },
          { id: 'automation-triggers', label: 'Set up behavioral automation', type: 'building' as const, context: 'Scalable growth systems' }
        ],
        optimization: [
          { id: 'ab-test-setup', label: 'Launch A/B testing experiments', type: 'optimization' as const, context: 'Data-driven performance improvement' },
          { id: 'performance-analysis', label: 'Analyze conversion metrics', type: 'optimization' as const, context: 'Growth bottleneck identification' },
          { id: 'scaling-strategy', label: 'Scale winning campaigns', type: 'optimization' as const, context: 'Revenue acceleration' }
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
      return "I'm here to help you optimize your growth marketing strategy. Could you tell me more about your specific goals or challenges?";
    }
  }

  static resetContext(): void {
    this.marketingContext = {
      goals: [],
      previousInteractions: []
    };
  }
}
