
import { supabase } from "@/integrations/supabase/client";

// Centralized API Key Management using Supabase Secrets
export class ApiKeyService {
  private static cachedKey: string | null = null;
  private static cacheTimestamp: number = 0;
  private static CACHE_DURATION = 300000; // 5 minutes
  
  public static async getOpenAIKey(): Promise<string> {
    // Check if cache is still valid
    if (this.cachedKey && (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cachedKey;
    }

    try {
      // Get the OpenAI key from Supabase Edge Function that accesses secrets
      const { data, error } = await supabase.functions.invoke('get-openai-key');
      
      if (error) {
        throw new Error(`Failed to get OpenAI key: ${error.message}`);
      }
      
      if (data?.key) {
        this.cachedKey = data.key;
        this.cacheTimestamp = Date.now();
        return data.key;
      }
      
      throw new Error('OpenAI key not found in response');
    } catch (error) {
      console.error('Error getting OpenAI key:', error);
      throw new Error('OpenAI API key not available');
    }
  }
  
  public static async isKeyAvailable(): Promise<boolean> {
    try {
      const key = await this.getOpenAIKey();
      return key && key.length > 0 && key.startsWith('sk-');
    } catch {
      return false;
    }
  }
  
  public static async getKeyStatus(): Promise<'valid' | 'missing' | 'invalid'> {
    try {
      const key = await this.getOpenAIKey();
      if (!key) {
        return 'missing';
      }
      if (!key.startsWith('sk-')) {
        return 'invalid';
      }
      return 'valid';
    } catch {
      return 'missing';
    }
  }

  public static async validateKey(): Promise<boolean> {
    try {
      const isAvailable = await this.isKeyAvailable();
      if (!isAvailable) return false;
      
      const key = await this.getOpenAIKey();
      return key.length > 20;
    } catch {
      return false;
    }
  }

  // Force refresh of cached key - call this when user updates their key
  public static forceRefresh(): void {
    this.cachedKey = null;
    this.cacheTimestamp = 0;
    console.log('OpenAI API key cache forcefully cleared');
  }

  // Clear cached key (useful for testing or key rotation)
  public static clearCache(): void {
    this.cachedKey = null;
    this.cacheTimestamp = 0;
    console.log('OpenAI API key cache cleared');
  }

  // Get cache status for debugging
  public static getCacheStatus(): { cached: boolean; age: number } {
    return {
      cached: !!this.cachedKey,
      age: this.cacheTimestamp ? Date.now() - this.cacheTimestamp : 0
    };
  }
}
