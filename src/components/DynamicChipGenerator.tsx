
import { emailAIService } from '@/services/EmailAIService';

interface ChipGenerationContext {
  channel: 'email' | 'sms' | 'push';
  userInput: string;
  conversationHistory?: any[];
}

export class DynamicChipGenerator {
  private static emailChips = [
    'HTML Email', 'Rich Text', 'Welcome Series', 'Product Launch', 
    'Newsletter', 'Promotional', 'Announcement', 'Follow-up',
    'Professional Tone', 'Casual Tone', 'Urgent', 'Friendly'
  ];

  private static smsChips = [
    'Quick Alert', 'Promotional SMS', 'Reminder', 'Confirmation',
    'Short & Sweet', 'Call-to-Action', 'Time-Sensitive', 'Personal'
  ];

  private static pushChips = [
    'Breaking News', 'App Update', 'Engagement', 'Retention',
    'Rich Media', 'Action Button', 'Deep Link', 'Personalized'
  ];

  static async generateContextualChips(userInput: string, channel: 'email' | 'sms' | 'push'): Promise<string[]> {
    try {
      // Use AI to generate contextual chips based on user input
      const prompt = `Based on this user request: "${userInput}" for ${channel} messaging, generate 5 relevant action chips that would help them specify their needs better. Return as comma-separated values.`;
      
      const aiResponse = await emailAIService.generateContent(prompt, 'chips');
      const generatedChips = aiResponse.split(',').map(chip => chip.trim()).slice(0, 5);
      
      // Combine AI-generated chips with predefined ones
      const baseChips = this.getBaseChips(channel);
      const contextualChips = [...generatedChips, ...baseChips.slice(0, 3)];
      
      return [...new Set(contextualChips)].slice(0, 6);
    } catch (error) {
      console.error('Error generating contextual chips:', error);
      return this.getBaseChips(channel).slice(0, 6);
    }
  }

  static async generateFromConversation(userMessage: string, conversationHistory: any[]): Promise<string[]> {
    try {
      const recentMessages = conversationHistory.slice(-3).map(m => m.content).join(' ');
      const prompt = `Based on this conversation context: "${recentMessages}" and latest message: "${userMessage}", generate 4 helpful next-step chips. Return as comma-separated values.`;
      
      const aiResponse = await emailAIService.generateContent(prompt, 'chips');
      const chips = aiResponse.split(',').map(chip => chip.trim()).slice(0, 4);
      
      return chips.length > 0 ? chips : ['Continue', 'Refine', 'Start Over', 'Get Examples'];
    } catch (error) {
      console.error('Error generating conversation chips:', error);
      return ['Continue', 'Refine', 'Start Over', 'Get Examples'];
    }
  }

  private static getBaseChips(channel: 'email' | 'sms' | 'push'): string[] {
    switch (channel) {
      case 'email':
        return this.emailChips;
      case 'sms':
        return this.smsChips;
      case 'push':
        return this.pushChips;
      default:
        return [];
    }
  }

  static async generateInitialChips(): Promise<string[]> {
    return [
      'Email Campaign',
      'SMS Blast', 
      'Push Notification',
      'Welcome Series',
      'Product Launch',
      'Newsletter'
    ];
  }
}
