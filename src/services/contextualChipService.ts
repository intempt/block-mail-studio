
import { OpenAIEmailService } from './openAIEmailService';

export interface CampaignContext {
  campaignType: 'sms' | 'push' | 'marketing-email' | 'html-email';
  conversationHistory: string[];
  currentDepth: number;
}

export class ContextualChipService {
  private static readonly CAMPAIGN_PROMPTS = {
    'sms': 'SMS campaign with character limits and direct messaging',
    'push': 'push notification campaign for mobile engagement',
    'marketing-email': 'marketing email campaign for customer engagement',
    'html-email': 'HTML email campaign with rich formatting and design'
  };

  static async generateContextualChips(context: CampaignContext): Promise<string[]> {
    try {
      const campaignDescription = this.CAMPAIGN_PROMPTS[context.campaignType];
      const conversationSummary = context.conversationHistory.slice(-3).join(' ');
      
      const prompt = `You are helping create a ${campaignDescription}. 

Current conversation context: "${conversationSummary}"
Conversation depth: ${context.currentDepth}/4

Generate 5 specific, actionable follow-up questions or options that would help gather more details for this ${context.campaignType}. Make them progressively more specific as depth increases.

For depth 1-2: Ask about goals, audience, tone
For depth 3-4: Ask about specific content, timing, technical details

Return as JSON array of strings:
{"chips": ["chip 1", "chip 2", "chip 3", "chip 4", "chip 5"]}`;

      const response = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      return response.chips || this.getFallbackChips(context.campaignType, context.currentDepth);
    } catch (error) {
      console.error('Error generating contextual chips:', error);
      return this.getFallbackChips(context.campaignType, context.currentDepth);
    }
  }

  private static getFallbackChips(campaignType: string, depth: number): string[] {
    const fallbacks = {
      'sms': depth <= 2 ? 
        ['Promotional offer', 'Event reminder', 'Customer update', 'Urgent alert', 'Welcome message'] :
        ['Include emoji', 'Add link', 'Set timing', 'Target segment', 'Call-to-action'],
      'push': depth <= 2 ?
        ['App engagement', 'Breaking news', 'Personalized offer', 'Re-engagement', 'Location-based'] :
        ['Rich media', 'Action buttons', 'Deep link', 'Custom audience', 'A/B test'],
      'marketing-email': depth <= 2 ?
        ['Product launch', 'Newsletter', 'Promotional offer', 'Event invitation', 'Customer story'] :
        ['Subject line ideas', 'CTA optimization', 'Design template', 'Personalization', 'Send timing'],
      'html-email': depth <= 2 ?
        ['Rich design', 'Interactive elements', 'Brand showcase', 'Product catalog', 'Visual story'] :
        ['Layout structure', 'Color scheme', 'Typography', 'Mobile optimization', 'Image strategy']
    };
    
    return fallbacks[campaignType] || ['Continue', 'More details', 'Refine', 'Next step', 'Customize'];
  }

  static hasEnoughContext(context: CampaignContext): boolean {
    return context.conversationHistory.length >= 3 && context.currentDepth >= 3;
  }

  static canUseDoMode(campaignType: string): boolean {
    return ['marketing-email', 'html-email'].includes(campaignType);
  }
}
