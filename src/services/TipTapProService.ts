
import { TiptapProConfig } from '@tiptap/pro';

export class TipTapProService {
  private static readonly APP_ID = 'ok0nxde9';
  private static readonly JWT_SECRET = 'gBvEtKvCecICFL6INuyG0ENoyhbccAIhyqP1aaYScXDBxhjpqvyZwWdwjQaPi8Uh';

  public static getConfig(): TiptapProConfig {
    return {
      appId: this.APP_ID,
      token: this.JWT_SECRET,
    };
  }

  public static async generateContent(prompt: string, tone: string = 'professional'): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      // Using TipTap Pro's AI service with the proper configuration
      const response = await fetch('https://api.tiptap.dev/v1/ai/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.JWT_SECRET}`,
          'X-App-Id': this.APP_ID,
        },
        body: JSON.stringify({
          prompt,
          tone,
          maxTokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`TipTap Pro API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, data: result.content || result.text };
    } catch (error) {
      console.error('TipTap Pro API error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  public static async refineEmail(content: string, instruction: string): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      const prompt = `${instruction}\n\nOriginal content: ${content}`;
      return await this.generateContent(prompt, 'professional');
    } catch (error) {
      console.error('Email refinement error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Refinement failed' };
    }
  }
}
