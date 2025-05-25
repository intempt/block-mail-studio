
import { OpenAIEmailService } from './openAIEmailService';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface CampaignContext {
  type?: 'email' | 'sms' | 'push';
  purpose?: 'welcome' | 'newsletter' | 'promotional' | 'announcement' | 'followup';
  specific?: string;
  stage: 'type' | 'purpose' | 'specific' | 'generation';
}

interface ChatContext {
  area: 'messages' | 'journeys' | 'snippets';
  mode: 'ask' | 'do';
  conversationHistory: ConversationMessage[];
  campaign?: CampaignContext;
  userIntent?: 'question' | 'action' | 'exploration';
}

interface ChatCompletionResponse {
  content: string;
  intent: 'question' | 'action' | 'exploration';
  suggestedChips: string[];
  shouldGenerateEmail?: boolean;
  emailData?: {
    subject: string;
    html: string;
    previewText: string;
  };
  campaignContext?: CampaignContext;
}

export class ChatCompletionService {
  private static contexts: Map<string, ChatContext> = new Map();

  static initializeContext(sessionId: string, area: 'messages' | 'journeys' | 'snippets'): void {
    this.contexts.set(sessionId, {
      area,
      mode: 'ask',
      conversationHistory: [],
      campaign: area === 'messages' ? { stage: 'type' } : undefined,
      userIntent: 'exploration'
    });
  }

  static updateMode(sessionId: string, mode: 'ask' | 'do'): void {
    const context = this.contexts.get(sessionId);
    if (context) {
      context.mode = mode;
    }
  }

  static async processUserMessage(
    sessionId: string, 
    userMessage: string, 
    mode: 'ask' | 'do'
  ): Promise<ChatCompletionResponse> {
    const context = this.contexts.get(sessionId) || {
      area: 'messages',
      mode: 'ask',
      conversationHistory: [],
      campaign: { stage: 'type' },
      userIntent: 'exploration'
    };

    context.mode = mode;

    // Add user message to history
    context.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Update campaign context based on user input
    if (context.area === 'messages') {
      this.updateCampaignContext(userMessage, context);
    }

    // Detect user intent
    const intent = await this.detectUserIntent(userMessage, context);
    context.userIntent = intent;

    // Generate response based on mode and context
    let response: ChatCompletionResponse;

    if (mode === 'ask') {
      response = await this.generateAskResponse(userMessage, context);
    } else {
      response = await this.generateDoResponse(userMessage, context);
    }

    // Add AI response to history
    context.conversationHistory.push({
      role: 'assistant',
      content: response.content,
      timestamp: new Date()
    });

    // Update context
    this.contexts.set(sessionId, context);

    return response;
  }

  private static updateCampaignContext(userMessage: string, context: ChatContext): void {
    if (!context.campaign) return;

    const message = userMessage.toLowerCase();

    // Detect campaign type
    if (context.campaign.stage === 'type') {
      if (message.includes('email')) {
        context.campaign.type = 'email';
        context.campaign.stage = 'purpose';
      } else if (message.includes('sms')) {
        context.campaign.type = 'sms';
        context.campaign.stage = 'purpose';
      } else if (message.includes('push')) {
        context.campaign.type = 'push';
        context.campaign.stage = 'purpose';
      }
    }

    // Detect campaign purpose
    if (context.campaign.stage === 'purpose') {
      if (message.includes('welcome') || message.includes('onboard')) {
        context.campaign.purpose = 'welcome';
        context.campaign.stage = 'specific';
      } else if (message.includes('newsletter')) {
        context.campaign.purpose = 'newsletter';
        context.campaign.stage = 'specific';
      } else if (message.includes('promotional') || message.includes('sale') || message.includes('discount')) {
        context.campaign.purpose = 'promotional';
        context.campaign.stage = 'specific';
      } else if (message.includes('announcement') || message.includes('news')) {
        context.campaign.purpose = 'announcement';
        context.campaign.stage = 'specific';
      }
    }

    // Move to generation stage when user wants to create
    if (message.includes('create') || message.includes('generate') || message.includes('build') || message.includes('draft')) {
      context.campaign.stage = 'generation';
    }
  }

  private static async detectUserIntent(
    userMessage: string, 
    context: ChatContext
  ): Promise<'question' | 'action' | 'exploration'> {
    const message = userMessage.toLowerCase();
    
    // Quick intent detection for campaign building
    if (message.includes('create') || message.includes('generate') || message.includes('build') || message.includes('draft')) {
      return 'action';
    }
    
    if (message.includes('how') || message.includes('what') || message.includes('why') || message.includes('best practice')) {
      return 'question';
    }

    return 'exploration';
  }

  private static async generateAskResponse(
    userMessage: string, 
    context: ChatContext
  ): Promise<ChatCompletionResponse> {
    if (context.area === 'messages' && context.campaign) {
      return this.generateCampaignAskResponse(userMessage, context);
    }

    const systemPrompt = this.getSystemPrompt(context.area, 'ask');
    const conversationContext = this.buildConversationContext(context);

    const prompt = `${systemPrompt}

Conversation context: ${conversationContext}

User message: "${userMessage}"

Provide helpful guidance and advice. Focus on strategic advice, best practices, and actionable insights for ${context.area}.

Also suggest 3-4 relevant follow-up topics or questions as comma-separated values after your response, prefixed with "CHIPS:"`;

    try {
      const response = await OpenAIEmailService.callOpenAI(prompt, 2, false);
      const [content, chipsSection] = response.split('CHIPS:');
      
      const suggestedChips = chipsSection 
        ? chipsSection.split(',').map(chip => chip.trim()).slice(0, 4)
        : this.getDefaultChips(context.area, 'ask');

      return {
        content: content.trim(),
        intent: context.userIntent || 'exploration',
        suggestedChips,
        shouldGenerateEmail: false
      };
    } catch (error) {
      console.error('Ask response generation failed:', error);
      return {
        content: this.getFallbackResponse(context.area, 'ask'),
        intent: 'exploration',
        suggestedChips: this.getDefaultChips(context.area, 'ask'),
        shouldGenerateEmail: false
      };
    }
  }

  private static async generateCampaignAskResponse(
    userMessage: string,
    context: ChatContext
  ): Promise<ChatCompletionResponse> {
    const campaign = context.campaign!;
    
    const systemPrompt = `You are GrowthOS, an expert email marketing campaign strategist. You help users build specific email campaigns step by step.

Current campaign context:
- Stage: ${campaign.stage}
- Type: ${campaign.type || 'not selected'}
- Purpose: ${campaign.purpose || 'not selected'}
- Mode: Ask (provide guidance and best practices)

Guide the user through the campaign building process progressively.`;

    const conversationContext = this.buildConversationContext(context);
    
    const prompt = `${systemPrompt}

Conversation: ${conversationContext}
User message: "${userMessage}"

Provide campaign-specific guidance. Suggest 3-4 next steps as chips after your response, prefixed with "CHIPS:"`;

    try {
      const response = await OpenAIEmailService.callOpenAI(prompt, 2, false);
      const [content, chipsSection] = response.split('CHIPS:');
      
      const suggestedChips = chipsSection 
        ? chipsSection.split(',').map(chip => chip.trim()).slice(0, 4)
        : this.getCampaignChips(campaign);

      return {
        content: content.trim(),
        intent: context.userIntent || 'exploration',
        suggestedChips,
        shouldGenerateEmail: false,
        campaignContext: campaign
      };
    } catch (error) {
      console.error('Campaign ask response failed:', error);
      return {
        content: 'Let me help you plan your campaign. What type of campaign are you looking to create?',
        intent: 'exploration',
        suggestedChips: this.getCampaignChips(campaign),
        shouldGenerateEmail: false,
        campaignContext: campaign
      };
    }
  }

  private static async generateDoResponse(
    userMessage: string, 
    context: ChatContext
  ): Promise<ChatCompletionResponse> {
    if (context.area !== 'messages') {
      return {
        content: `Do mode is coming soon for ${context.area}. Use Ask mode for expert guidance and strategic advice.`,
        intent: 'exploration',
        suggestedChips: this.getDefaultChips(context.area, 'ask'),
        shouldGenerateEmail: false
      };
    }

    // Check if we should generate an email based on campaign context
    const shouldGenerate = context.campaign?.stage === 'generation' || 
                          context.campaign?.type && context.campaign?.purpose ||
                          await this.shouldGenerateEmail(userMessage, context);

    if (shouldGenerate && context.campaign?.type === 'email') {
      try {
        const campaignPrompt = this.buildCampaignPrompt(context.campaign, userMessage);
        
        const emailData = await OpenAIEmailService.generateEmailContent({
          prompt: campaignPrompt,
          emailType: context.campaign.purpose || 'promotional',
          tone: 'professional'
        });

        return {
          content: `Perfect! I've created your ${context.campaign.purpose || 'email'} campaign. The email is ready for you to review and customize in the editor.`,
          intent: 'action',
          suggestedChips: ['Load in Editor', 'Refine Copy', 'Change Tone', 'Add More Sections'],
          shouldGenerateEmail: true,
          emailData,
          campaignContext: context.campaign
        };
      } catch (error) {
        console.error('Email generation failed:', error);
        return {
          content: 'I had trouble generating the email. Let me help you refine the campaign details first. What specific aspects would you like to focus on?',
          intent: 'question',
          suggestedChips: ['Subject Line Ideas', 'Content Structure', 'Call-to-Action', 'Personalization'],
          shouldGenerateEmail: false,
          campaignContext: context.campaign
        };
      }
    } else {
      // Guide user to provide more campaign details
      const prompt = `You are GrowthOS helping build an email campaign in DO mode.

Campaign context: ${JSON.stringify(context.campaign)}
Conversation: ${this.buildConversationContext(context)}
User message: "${userMessage}"

The user wants to create but needs more specific campaign details. Guide them to provide the information needed for email generation.

Suggest 3-4 clarifying questions or next steps as chips after your response, prefixed with "CHIPS:"`;

      try {
        const response = await OpenAIEmailService.callOpenAI(prompt, 2, false);
        const [content, chipsSection] = response.split('CHIPS:');
        
        const suggestedChips = chipsSection 
          ? chipsSection.split(',').map(chip => chip.trim()).slice(0, 4)
          : this.getCampaignChips(context.campaign!);

        return {
          content: content.trim(),
          intent: 'action',
          suggestedChips,
          shouldGenerateEmail: false,
          campaignContext: context.campaign
        };
      } catch (error) {
        console.error('Do response generation failed:', error);
        return {
          content: 'Let\'s build your campaign step by step. What type of email campaign would you like to create?',
          intent: 'action',
          suggestedChips: this.getCampaignChips(context.campaign!),
          shouldGenerateEmail: false,
          campaignContext: context.campaign
        };
      }
    }
  }

  private static buildCampaignPrompt(campaign: CampaignContext, userMessage: string): string {
    let prompt = `Create a ${campaign.type} campaign`;
    
    if (campaign.purpose) {
      prompt += ` for ${campaign.purpose}`;
    }
    
    if (campaign.specific) {
      prompt += ` focusing on ${campaign.specific}`;
    }
    
    prompt += `. User request: ${userMessage}`;
    
    return prompt;
  }

  private static getCampaignChips(campaign: CampaignContext): string[] {
    switch (campaign.stage) {
      case 'type':
        return ['📧 Email Campaign', '📱 SMS Campaign', '🔔 Push Notification', '📝 Rich Text Email'];
      
      case 'purpose':
        if (campaign.type === 'email') {
          return ['Welcome Series', 'Newsletter', 'Promotional Email', 'Product Announcement'];
        }
        return ['Welcome Message', 'Promotional', 'Alert', 'Reminder'];
      
      case 'specific':
        if (campaign.purpose === 'welcome') {
          return ['Onboarding Email 1', 'Account Setup Guide', 'Welcome + First Steps', 'Feature Introduction'];
        }
        if (campaign.purpose === 'newsletter') {
          return ['Monthly Update', 'Weekly Digest', 'Industry News', 'Product Updates'];
        }
        if (campaign.purpose === 'promotional') {
          return ['Limited Time Sale', 'New Product Launch', 'Seasonal Promotion', 'Exclusive Discount'];
        }
        return ['Generate Email', 'Add Details', 'Set Tone', 'Choose Template'];
      
      case 'generation':
        return ['Generate Email', 'Refine Details', 'Change Approach', 'Start Over'];
      
      default:
        return ['📧 Email Campaign', '📱 SMS Campaign', '🔔 Push Notification', '📝 Rich Text Email'];
    }
  }

  private static async shouldGenerateEmail(userMessage: string, context: ChatContext): Promise<boolean> {
    const message = userMessage.toLowerCase();
    const hasContent = context.conversationHistory.length >= 3;
    const hasType = context.campaign?.type;
    const hasPurpose = context.campaign?.purpose;
    const isCreateRequest = message.includes('create') || message.includes('generate') || message.includes('build') || message.includes('draft');
    
    return hasContent && hasType && hasPurpose && isCreateRequest;
  }

  private static getSystemPrompt(area: 'messages' | 'journeys' | 'snippets', mode: 'ask' | 'do'): string {
    const basePrompt = "You are GrowthOS, an expert marketing assistant focused on growth and optimization.";
    
    const areaExpertise = {
      messages: "You specialize in email marketing, campaign strategy, audience segmentation, deliverability, and email automation.",
      journeys: "You specialize in customer journey mapping, touchpoint optimization, lifecycle automation, and conversion flow design.",
      snippets: "You specialize in copywriting, content optimization, A/B testing, personalization, and conversion-focused messaging."
    };

    const modeInstruction = mode === 'ask' 
      ? "Provide strategic advice, best practices, and actionable insights. Focus on guidance and education."
      : "Help users create and build specific assets. Guide them from concept to creation.";

    return `${basePrompt} ${areaExpertise[area]} ${modeInstruction}

Be conversational, helpful, and growth-focused. Provide specific, actionable advice based on marketing best practices.`;
  }

  private static buildConversationContext(context: ChatContext): string {
    const recentMessages = context.conversationHistory.slice(-6);
    return recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  }

  private static getDefaultChips(area: string, mode: string): string[] {
    const chips = {
      messages: {
        ask: ['📧 Email Campaign', '📱 SMS Campaign', '🔔 Push Notification', '📝 Rich Text Email'],
        do: ['Create Welcome Email', 'Build Newsletter', 'Design Promotion', 'Generate Campaign']
      },
      journeys: {
        ask: ['Journey Mapping', 'Touchpoint Strategy', 'Automation Planning', 'Flow Optimization'],
        do: ['Map Customer Journey', 'Design Onboarding', 'Build Automation', 'Create Workflow']
      },
      snippets: {
        ask: ['Copy Optimization', 'A/B Testing', 'Personalization', 'Conversion Tips'],
        do: ['Write Subject Lines', 'Create CTAs', 'Generate Copy', 'Build Templates']
      }
    };

    return chips[area]?.[mode] || ['Continue', 'Tell me more', 'Get examples', 'Start over'];
  }

  private static getFallbackResponse(area: string, mode: string): string {
    if (mode === 'ask') {
      return `I'm here to help with your ${area} strategy. What specific challenge can I help you solve?`;
    } else {
      return `Let's create something for your ${area}. What would you like to build?`;
    }
  }

  static clearContext(sessionId: string): void {
    this.contexts.delete(sessionId);
  }

  static getConversationHistory(sessionId: string): ConversationMessage[] {
    return this.contexts.get(sessionId)?.conversationHistory || [];
  }

  static getCampaignContext(sessionId: string): CampaignContext | undefined {
    return this.contexts.get(sessionId)?.campaign;
  }
}
