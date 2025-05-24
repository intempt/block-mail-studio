
// Centralized API Key Management
export class ApiKeyService {
  private static readonly API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; // Replace with your actual OpenAI API key
  
  public static getOpenAIKey(): string {
    return this.API_KEY;
  }
  
  public static isKeyAvailable(): boolean {
    return this.API_KEY && typeof this.API_KEY === 'string' && this.API_KEY.startsWith('sk-') && this.API_KEY !== 'YOUR_OPENAI_API_KEY_HERE';
  }
  
  public static getKeyStatus(): 'valid' | 'missing' | 'invalid' {
    if (!this.API_KEY || this.API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
      return 'missing';
    }
    if (typeof this.API_KEY !== 'string' || !this.API_KEY.startsWith('sk-')) {
      return 'invalid';
    }
    return 'valid';
  }
}
