
interface ChatContext {
  emailType: string;
  currentSubject: string;
  emailContent: string;
  userGoals: string[];
  conversationHistory: Array<{
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>;
  uploadedImages: string[];
  mode: 'chat' | 'agentic';
  channelType?: 'email' | 'sms' | 'push';
  messageFormat?: 'html' | 'rich-text';
  conversationFlow?: {
    stage: 'initial' | 'channel-selected' | 'mode-selected' | 'building' | 'complete';
    selectedChips: string[];
    requirements: Record<string, any>;
  };
}

export class ChatContextService {
  private static context: ChatContext = {
    emailType: 'unknown',
    currentSubject: '',
    emailContent: '',
    userGoals: [],
    conversationHistory: [],
    uploadedImages: [],
    mode: 'agentic',
    conversationFlow: {
      stage: 'initial',
      selectedChips: [],
      requirements: {}
    }
  };

  static updateContext(updates: Partial<ChatContext>): void {
    this.context = { ...this.context, ...updates };
  }

  static getContext(): ChatContext {
    return { ...this.context };
  }

  static addToHistory(role: 'user' | 'ai', content: string): void {
    this.context.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    });

    // Keep only last 20 messages to prevent context overflow
    if (this.context.conversationHistory.length > 20) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-20);
    }
  }

  static setMode(mode: 'chat' | 'agentic'): void {
    this.context.mode = mode;
  }

  static getMode(): 'chat' | 'agentic' {
    return this.context.mode;
  }

  static setChannelType(channelType: 'email' | 'sms' | 'push'): void {
    this.context.channelType = channelType;
  }

  static getChannelType(): 'email' | 'sms' | 'push' | undefined {
    return this.context.channelType;
  }

  static updateConversationFlow(updates: Partial<ChatContext['conversationFlow']>): void {
    this.context.conversationFlow = {
      ...this.context.conversationFlow,
      ...updates
    };
  }

  static addSelectedChip(chip: string): void {
    if (!this.context.conversationFlow?.selectedChips.includes(chip)) {
      this.context.conversationFlow?.selectedChips.push(chip);
    }
  }

  static clearContext(): void {
    this.context = {
      emailType: 'unknown',
      currentSubject: '',
      emailContent: '',
      userGoals: [],
      conversationHistory: [],
      uploadedImages: [],
      mode: 'chat',
      conversationFlow: {
        stage: 'initial',
        selectedChips: [],
        requirements: {}
      }
    };
  }

  static getRecentContext(messageCount: number = 5): string {
    const recent = this.context.conversationHistory.slice(-messageCount);
    return recent.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  }

  static buildContextPrompt(): string {
    const ctx = this.getContext();
    
    return `
Current Context:
- Channel Type: ${ctx.channelType || 'Not selected'}
- Message Format: ${ctx.messageFormat || 'Not specified'}
- Email Type: ${ctx.emailType}
- Subject: ${ctx.currentSubject || 'Not set'}
- Mode: ${ctx.mode}
- Conversation Stage: ${ctx.conversationFlow?.stage || 'initial'}
- Selected Chips: ${ctx.conversationFlow?.selectedChips.join(', ') || 'None'}
- User Goals: ${ctx.userGoals.join(', ') || 'None specified'}
- Recent Conversation: ${this.getRecentContext(3)}
- Images Available: ${ctx.uploadedImages.length}

Current Email Content Preview: ${ctx.emailContent.slice(0, 200)}...
    `.trim();
  }

  // New method for agentic workflow
  static setInitialTask(task: string, taskType: 'ask' | 'mail'): void {
    this.context.emailType = taskType === 'mail' ? 'email-creation' : 'general';
    this.context.userGoals = [task];
    this.context.mode = 'agentic';
    this.addToHistory('user', task);
    this.updateConversationFlow({ stage: 'initial' });
  }

  // Method to track email creation progress
  static updateEmailProgress(emailHTML: string, subject: string): void {
    this.context.emailContent = emailHTML;
    this.context.currentSubject = subject;
  }

  // Method to track conversation progress
  static advanceConversationStage(stage: ChatContext['conversationFlow']['stage']): void {
    this.updateConversationFlow({ stage });
  }
}
