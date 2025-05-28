
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
