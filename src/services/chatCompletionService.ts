
import { OpenAIEmailService } from './openAIEmailService';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatContext {
  area: 'messages' | 'journeys' | 'snippets';
  mode: 'ask' | 'do';
  conversationHistory: ConversationMessage[];
  currentTopic?: string;
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
}

export class ChatCompletionService {
  private static contexts: Map<string, ChatContext> = new Map();

  static initializeContext(sessionId: string, area: 'messages' | 'journeys' | 'snippets'): void {
    this.contexts.set(sessionId, {
      area,
      mode: 'ask',
      conversationHistory: [],
      currentTopic: undefined,
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
      userIntent: 'exploration'
    };

    context.mode = mode;

    // Add user message to history
    context.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

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

  private static async detectUserIntent(
    userMessage: string, 
    context: ChatContext
  ): Promise<'question' | 'action' | 'exploration'> {
    const intentPrompt = `
Analyze this user message and classify their intent:
- "question": They're asking for advice, guidance, or information
- "action": They want to create, build, or generate something specific
- "exploration": They're exploring ideas or not sure what they want

User message: "${userMessage}"
Context: ${context.area} area, ${context.conversationHistory.length} messages in conversation

Return only: question, action, or exploration`;

    try {
      const response = await OpenAIEmailService.callOpenAI(intentPrompt, 1, false);
      const intent = response.toLowerCase().trim();
      
      if (['question', 'action', 'exploration'].includes(intent)) {
        return intent as 'question' | 'action' | 'exploration';
      }
      
      return 'exploration';
    } catch (error) {
      console.error('Intent detection failed:', error);
      return 'exploration';
    }
  }

  private static async generateAskResponse(
    userMessage: string, 
    context: ChatContext
  ): Promise<ChatCompletionResponse> {
    const systemPrompt = this.getSystemPrompt(context.area, 'ask');
    const conversationContext = this.buildConversationContext(context);

    const prompt = `${systemPrompt}

Conversation context: ${conversationContext}

User message: "${userMessage}"

Provide helpful guidance and advice. Do NOT generate email content. Focus on strategic advice, best practices, and actionable insights for ${context.area}.

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

    const systemPrompt = this.getSystemPrompt(context.area, 'do');
    const conversationContext = this.buildConversationContext(context);

    // Check if we should generate an email
    const shouldGenerateEmail = await this.shouldGenerateEmail(userMessage, context);

    if (shouldGenerateEmail) {
      try {
        const emailData = await OpenAIEmailService.generateEmailContent({
          prompt: `Based on this conversation context: ${conversationContext}\n\nUser request: ${userMessage}`,
          emailType: 'promotional',
          tone: 'professional'
        });

        return {
          content: `Perfect! I've created an email based on our conversation. The email focuses on ${this.extractKeyTopic(userMessage)} and is ready for you to review and customize.`,
          intent: 'action',
          suggestedChips: ['Load in Editor', 'Refine Copy', 'Change Tone', 'Add More Sections'],
          shouldGenerateEmail: true,
          emailData
        };
      } catch (error) {
        console.error('Email generation failed:', error);
        return {
          content: 'I had trouble generating the email. Let me help you plan it instead. What specific type of email are you looking to create?',
          intent: 'question',
          suggestedChips: ['Welcome Email', 'Newsletter', 'Promotional', 'Announcement'],
          shouldGenerateEmail: false
        };
      }
    } else {
      const prompt = `${systemPrompt}

Conversation context: ${conversationContext}

User message: "${userMessage}"

The user is in DO mode but their request isn't ready for email generation yet. Help them refine their requirements and gather the information needed to create a great email.

Suggest 3-4 next steps or clarifying questions as comma-separated values after your response, prefixed with "CHIPS:"`;

      try {
        const response = await OpenAIEmailService.callOpenAI(prompt, 2, false);
        const [content, chipsSection] = response.split('CHIPS:');
        
        const suggestedChips = chipsSection 
          ? chipsSection.split(',').map(chip => chip.trim()).slice(0, 4)
          : this.getDefaultChips(context.area, 'do');

        return {
          content: content.trim(),
          intent: 'action',
          suggestedChips,
          shouldGenerateEmail: false
        };
      } catch (error) {
        console.error('Do response generation failed:', error);
        return {
          content: this.getFallbackResponse(context.area, 'do'),
          intent: 'action',
          suggestedChips: this.getDefaultChips(context.area, 'do'),
          shouldGenerateEmail: false
        };
      }
    }
  }

  private static async shouldGenerateEmail(userMessage: string, context: ChatContext): Promise<boolean> {
    const prompt = `
Analyze if this user message indicates they're ready for email generation:

User message: "${userMessage}"
Conversation length: ${context.conversationHistory.length} messages
Context: ${context.area} area

Return "true" if:
- They explicitly ask to create/generate/build an email
- They provide specific requirements for an email
- They seem ready to move from planning to creation
- The conversation has enough context for email generation

Return "false" if:
- They're still asking questions or exploring
- They need more information or clarification
- The request is too vague for email generation

Return only: true or false`;

    try {
      const response = await OpenAIEmailService.callOpenAI(prompt, 1, false);
      return response.toLowerCase().trim() === 'true';
    } catch (error) {
      console.error('Email generation check failed:', error);
      return false;
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

  private static extractKeyTopic(userMessage: string): string {
    const topics = ['welcome', 'newsletter', 'promotional', 'announcement', 'follow-up', 'cart abandonment'];
    const message = userMessage.toLowerCase();
    
    for (const topic of topics) {
      if (message.includes(topic)) return topic;
    }
    
    return 'marketing campaign';
  }

  private static getDefaultChips(area: string, mode: string): string[] {
    const chips = {
      messages: {
        ask: ['Email Strategy', 'Audience Segmentation', 'Campaign Planning', 'Best Practices'],
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
}
