
import { OpenAIEmailService } from './openAIEmailService';

export class ConversationalChipService {
  static async generateContextualChips(conversationHistory: string[], lastMessage: string): Promise<string[]> {
    try {
      const conversationSummary = conversationHistory.slice(-4).join(' ');
      
      const prompt = `Based on this conversation about creating a message:

Recent conversation: "${conversationSummary}"
Latest: "${lastMessage}"

Generate 5 natural follow-up questions or suggestions that would help gather more details about what they want to create. Make them conversational and specific to their needs.

Return as JSON array of strings:
{"suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]}`;

      const response = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      return response.suggestions || this.getFallbackChips(conversationHistory.length);
    } catch (error) {
      console.error('Error generating contextual chips:', error);
      return this.getFallbackChips(conversationHistory.length);
    }
  }

  private static getFallbackChips(conversationDepth: number): string[] {
    if (conversationDepth <= 2) {
      return [
        'What\'s the main goal?',
        'Who\'s the audience?',
        'What tone should it have?',
        'Any specific requirements?',
        'When do you need it?'
      ];
    } else {
      return [
        'Add more details',
        'Change the approach',
        'Make it more specific',
        'Ready to create',
        'Start over'
      ];
    }
  }

  static hasEnoughContext(conversationHistory: string[]): boolean {
    return conversationHistory.length >= 3;
  }

  static canCreateEmail(conversationHistory: string[]): boolean {
    const conversation = conversationHistory.join(' ').toLowerCase();
    return (conversation.includes('email') || conversation.includes('rich')) && 
           this.hasEnoughContext(conversationHistory);
  }
}
