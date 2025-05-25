
interface ChannelDetectionResult {
  channel: 'email' | 'sms' | 'push';
  format: 'html' | 'rich-text';
  confidence: number;
}

export class ChannelRouter {
  private static emailKeywords = [
    'email', 'newsletter', 'campaign', 'html', 'welcome email', 
    'promotional email', 'announcement', 'rich email', 'email blast'
  ];

  private static smsKeywords = [
    'sms', 'text', 'text message', 'mobile message', 'sms blast',
    'text campaign', 'quick message', 'alert', 'notification text'
  ];

  private static pushKeywords = [
    'push', 'push notification', 'mobile push', 'app notification',
    'browser notification', 'alert notification', 'instant notification'
  ];

  static async detectChannel(userInput: string): Promise<ChannelDetectionResult> {
    const input = userInput.toLowerCase();
    
    // Check for explicit channel mentions
    const emailScore = this.calculateScore(input, this.emailKeywords);
    const smsScore = this.calculateScore(input, this.smsKeywords);
    const pushScore = this.calculateScore(input, this.pushKeywords);

    let channel: 'email' | 'sms' | 'push';
    let format: 'html' | 'rich-text';
    let confidence: number;

    if (emailScore > smsScore && emailScore > pushScore) {
      channel = 'email';
      format = input.includes('html') || input.includes('rich') || input.includes('visual') ? 'html' : 'rich-text';
      confidence = emailScore;
    } else if (smsScore > pushScore) {
      channel = 'sms';
      format = 'rich-text';
      confidence = smsScore;
    } else if (pushScore > 0) {
      channel = 'push';
      format = 'rich-text';
      confidence = pushScore;
    } else {
      // Default to email if no clear channel detected
      channel = 'email';
      format = 'html';
      confidence = 0.5;
    }

    return { channel, format, confidence };
  }

  private static calculateScore(input: string, keywords: string[]): number {
    let score = 0;
    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        score += keyword.length / input.length;
      }
    }
    return Math.min(score, 1);
  }

  static getChannelCapabilities(channel: 'email' | 'sms' | 'push') {
    switch (channel) {
      case 'email':
        return {
          supportsHTML: true,
          supportsRichText: true,
          supportsImages: true,
          supportsButtons: true,
          characterLimit: null,
          visualBuilder: true
        };
      case 'sms':
        return {
          supportsHTML: false,
          supportsRichText: true,
          supportsImages: false,
          supportsButtons: false,
          characterLimit: 160,
          visualBuilder: false
        };
      case 'push':
        return {
          supportsHTML: false,
          supportsRichText: true,
          supportsImages: true,
          supportsButtons: true,
          characterLimit: 250,
          visualBuilder: false
        };
    }
  }
}
