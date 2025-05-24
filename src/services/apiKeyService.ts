
// Centralized API Key Management
export class ApiKeyService {
  private static readonly API_KEY = 'sk-proj-your-actual-api-key-here'; // Replace with your actual key
  
  public static getOpenAIKey(): string {
    return this.API_KEY;
  }
  
  public static isKeyAvailable(): boolean {
    return this.API_KEY && this.API_KEY.startsWith('sk-');
  }
}
