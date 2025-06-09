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

Also suggest 3-4 relevant follow-up topics or questions as comma-separated values after your response, prefixed with "CHIPS:"

Important: Phrase chips as natural user responses without emojis. Examples:
- "I want to create an email campaign"
- "Help me improve my open rates"
- "Show me how to write better subject lines"`;

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

Provide campaign-specific guidance. Suggest 3-4 next steps as chips after your response, prefixed with "CHIPS:"

Important: Phrase chips as natural user responses without emojis. Examples:
- "Let's create a welcome email"
- "I want to build a promotional campaign"
- "Help me set up the email content"`;

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
    if (context.area === 'messages') {
      // Enhanced logic to determine when to generate email
      const shouldGenerate = this.shouldGenerateEmailNow(userMessage, context);

      if (shouldGenerate && context.campaign?.type === 'email') {
        try {
          const campaignPrompt = this.buildCampaignPrompt(context.campaign, userMessage);
          
          const emailData = await OpenAIEmailService.generateEmailContent({
            prompt: campaignPrompt,
            emailType: context.campaign.purpose || 'promotional',
            tone: 'professional'
          });

          // Ensure proper structure for email data with correct email-block classes
          const formattedEmailData = {
            subject: emailData.subject || 'Your Campaign Email',
            html: this.wrapEmailWithBlocks(emailData.html || ''),
            previewText: emailData.previewText || 'Email preview text'
          };

          return {
            content: `**Perfect! I've created your ${context.campaign.purpose || 'email'} campaign.**

The email is ready for you to review and customize in the editor. Click the lightning bolt below to load it.`,
            intent: 'action',
            suggestedChips: ['Load it in the editor', 'Let me refine the copy', 'Change the tone to be more casual', 'Add more sections to this email'],
            shouldGenerateEmail: true,
            emailData: formattedEmailData,
            campaignContext: context.campaign
          };
        } catch (error) {
          console.error('Email generation failed:', error);
          return {
            content: 'I had trouble generating the email. Let me help you refine the campaign details first. What specific aspects would you like to focus on?',
            intent: 'question',
            suggestedChips: ['Help me write subject line ideas', 'Show me content structure options', 'I want to focus on the call-to-action', 'Let me add personalization'],
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

Suggest 3-4 clarifying questions or next steps as chips after your response, prefixed with "CHIPS:"

Important: Phrase chips as natural user responses without emojis.`;

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

    // Handle Do mode for Journeys and Snippets
    if (context.area === 'journeys') {
      try {
        const prompt = `You are GrowthOS helping create customer journeys and automation flows in DO mode.

Context: ${context.area}
User message: "${userMessage}"

Create actionable journey content, maps, automation sequences, or touchpoint designs based on the user's request.

Suggest 3-4 relevant next steps as chips after your response, prefixed with "CHIPS:"

Important: Phrase chips as natural user responses without emojis.`;

        const response = await OpenAIEmailService.callOpenAI(prompt, 2, false);
        const [content, chipsSection] = response.split('CHIPS:');
        
        const suggestedChips = chipsSection 
          ? chipsSection.split(',').map(chip => chip.trim()).slice(0, 4)
          : ['Create another journey map', 'Add automation triggers', 'Design touchpoint sequences', 'Optimize conversion flows'];

        return {
          content: content.trim(),
          intent: 'action',
          suggestedChips,
          shouldGenerateEmail: false
        };
      } catch (error) {
        console.error('Journeys do response failed:', error);
        return {
          content: 'Let me help you create customer journey assets. What specific journey or automation flow would you like to build?',
          intent: 'action',
          suggestedChips: ['Create a customer onboarding journey', 'Design a retention automation', 'Map the purchase journey', 'Build a re-engagement sequence'],
          shouldGenerateEmail: false
        };
      }
    }

    if (context.area === 'snippets') {
      try {
        const prompt = `You are GrowthOS helping create content snippets and optimization assets in DO mode.

Context: ${context.area}
User message: "${userMessage}"

Create specific content snippets, subject lines, CTAs, or optimization content based on the user's request.

Suggest 3-4 relevant next steps as chips after your response, prefixed with "CHIPS:"

Important: Phrase chips as natural user responses without emojis.`;

        const response = await OpenAIEmailService.callOpenAI(prompt, 2, false);
        const [content, chipsSection] = response.split('CHIPS:');
        
        const suggestedChips = chipsSection 
          ? chipsSection.split(',').map(chip => chip.trim()).slice(0, 4)
          : ['Create more variations', 'Generate subject line alternatives', 'Write compelling CTAs', 'Add personalization tokens'];

        return {
          content: content.trim(),
          intent: 'action',
          suggestedChips,
          shouldGenerateEmail: false
        };
      } catch (error) {
        console.error('Snippets do response failed:', error);
        return {
          content: 'Let me help you create content snippets and optimize your messaging. What specific content would you like me to generate?',
          intent: 'action',
          suggestedChips: ['Write compelling subject lines', 'Create call-to-action buttons', 'Generate email content snippets', 'Build personalization templates'],
          shouldGenerateEmail: false
        };
      }
    }

    return {
      content: 'Do mode is ready! What would you like me to create for you?',
      intent: 'action',
      suggestedChips: this.getDefaultChips(context.area, 'do'),
      shouldGenerateEmail: false
    };
  }

  private static shouldGenerateEmailNow(userMessage: string, context: ChatContext): boolean {
    const message = userMessage.toLowerCase();
    const hasType = context.campaign?.type === 'email';
    const hasPurpose = !!context.campaign?.purpose;
    const hasConversationContext = context.conversationHistory.length >= 2;
    const isCreateRequest = message.includes('create') || message.includes('generate') || message.includes('build') || message.includes('draft') || message.includes('make');
    const isGenerationStage = context.campaign?.stage === 'generation';
    
    // More lenient generation logic - if they have type and are asking to create something
    return hasType && (hasPurpose || hasConversationContext) && (isCreateRequest || isGenerationStage);
  }

  private static wrapEmailWithBlocks(html: string): string {
    // If HTML already has email-block structure, return as is
    if (html.includes('email-block')) {
      return html;
    }

    // Wrap basic HTML with proper email block structure
    return `<div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div class="email-block paragraph-block" style="padding: 24px;">
        ${html}
      </div>
    </div>`;
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
        return ['I want to create an email campaign', 'Help me build an SMS campaign', 'I need push notifications', 'Let me design a rich text email'];
      
      case 'purpose':
        if (campaign.type === 'email') {
          return ['I want to create a welcome series', 'Help me build a newsletter', 'I need a promotional email', 'Let me announce a new product'];
        }
        return ['I want a welcome message', 'Help me create a promotional message', 'I need an alert message', 'Let me send a reminder'];
      
      case 'specific':
        if (campaign.purpose === 'welcome') {
          return ['Create the first onboarding email', 'Help me with account setup guidance', 'I want a welcome plus first steps email', 'Let me introduce key features'];
        }
        if (campaign.purpose === 'newsletter') {
          return ['Create a monthly update', 'Help me build a weekly digest', 'I want to share industry news', 'Let me announce product updates'];
        }
        if (campaign.purpose === 'promotional') {
          return ['Create a limited time sale email', 'Help me launch a new product', 'I want a seasonal promotion', 'Let me offer an exclusive discount'];
        }
        return ['Generate the email now', 'Let me add more details', 'Help me set the tone', 'I want to choose a template'];
      
      case 'generation':
        return ['Generate the email now', 'Let me refine the details', 'I want to change the approach', 'Help me start over'];
      
      default:
        return ['I want to create an email campaign', 'Help me build an SMS campaign', 'I need push notifications', 'Let me design a rich text email'];
    }
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
        ask: ['I want to create an email campaign', 'Help me build an SMS campaign', 'I need push notifications', 'Let me design a rich text email'],
        do: ['Create a welcome email for me', 'Help me build a newsletter', 'I want to design a promotion', 'Let me generate a campaign']
      },
      journeys: {
        ask: ['Help me with journey mapping', 'I need a touchpoint strategy', 'Show me automation planning', 'Let me optimize my flow'],
        do: ['Map my customer journey', 'Design an onboarding flow', 'Help me build automation', 'Let me create a workflow']
      },
      snippets: {
        ask: ['Help me optimize copy', 'I want to plan A/B testing', 'Show me personalization tips', 'Let me improve conversions'],
        do: ['Write subject lines for me', 'Help me create CTAs', 'Let me generate copy', 'I want to build templates']
      }
    };

    return chips[area]?.[mode] || ['Let me continue', 'Tell me more', 'Show me examples', 'Help me start over'];
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
