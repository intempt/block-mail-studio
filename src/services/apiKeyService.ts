
// Centralized API Key Management with Working OpenAI Key
export class ApiKeyService {
  private static readonly API_KEY: string = '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';
  
  public static getOpenAIKey(): string {
    return this.API_KEY;
  }
  
  public static isKeyAvailable(): boolean {
    return this.API_KEY && this.API_KEY.length > 0 && this.API_KEY.startsWith('sk-');
  }
  
  public static getKeyStatus(): 'valid' | 'missing' | 'invalid' {
    if (!this.API_KEY) {
      return 'missing';
    }
    if (!this.API_KEY.startsWith('sk-')) {
      return 'invalid';
    }
    return 'valid';
  }

  public static validateKey(): boolean {
    return this.isKeyAvailable() && this.API_KEY.length > 20;
  }
}
