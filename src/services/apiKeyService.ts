
import { supabase } from "@/integrations/supabase/client";

// Centralized API Key Management using Supabase Secrets
export class ApiKeyService {
  private static cachedKey: string | null = null;
  
  public static async getOpenAIKey(): Promise<string> {
    const sessionId = `session-${Date.now()}`;
    console.log(`[API-KEY-SERVICE] ${sessionId} - getOpenAIKey() called`);
    
    if (this.cachedKey) {
      console.log(`[API-KEY-SERVICE] ${sessionId} - Using cached key (length: ${this.cachedKey.length})`);
      return this.cachedKey;
    }

    try {
      console.log(`[API-KEY-SERVICE] ${sessionId} - Calling Supabase edge function 'get-openai-key'`);
      
      // Get the OpenAI key from Supabase Edge Function that accesses secrets
      const { data, error } = await supabase.functions.invoke('get-openai-key');
      
      console.log(`[API-KEY-SERVICE] ${sessionId} - Edge function response received`);
      console.log(`[API-KEY-SERVICE] ${sessionId} - Response data:`, data ? 'Present' : 'Null');
      console.log(`[API-KEY-SERVICE] ${sessionId} - Response error:`, error ? error.message : 'None');
      
      if (error) {
        console.error(`[API-KEY-SERVICE] ${sessionId} - Supabase function error:`, {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Failed to get OpenAI key: ${error.message}`);
      }
      
      if (data?.key) {
        console.log(`[API-KEY-SERVICE] ${sessionId} - Key received from edge function`);
        console.log(`[API-KEY-SERVICE] ${sessionId} - Key length: ${data.key.length}`);
        console.log(`[API-KEY-SERVICE] ${sessionId} - Key prefix: ${data.key.substring(0, 7)}...`);
        console.log(`[API-KEY-SERVICE] ${sessionId} - Key format valid: ${data.key.startsWith('sk-')}`);
        
        this.cachedKey = data.key;
        console.log(`[API-KEY-SERVICE] ${sessionId} - Key cached successfully`);
        return data.key;
      }
      
      console.error(`[API-KEY-SERVICE] ${sessionId} - No key found in response data:`, data);
      throw new Error('OpenAI key not found in response');
    } catch (error) {
      console.error(`[API-KEY-SERVICE] ${sessionId} - Error in getOpenAIKey:`, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw new Error('OpenAI API key not available');
    }
  }
  
  public static async isKeyAvailable(): Promise<boolean> {
    const sessionId = `session-${Date.now()}`;
    console.log(`[API-KEY-SERVICE] ${sessionId} - isKeyAvailable() called`);
    
    try {
      const key = await this.getOpenAIKey();
      const isValid = key && key.length > 0 && key.startsWith('sk-');
      console.log(`[API-KEY-SERVICE] ${sessionId} - Key availability check result: ${isValid}`);
      console.log(`[API-KEY-SERVICE] ${sessionId} - Key details: length=${key?.length}, hasPrefix=${key?.startsWith('sk-')}`);
      return isValid;
    } catch (error) {
      console.error(`[API-KEY-SERVICE] ${sessionId} - Error checking key availability:`, error.message);
      return false;
    }
  }
  
  public static async getKeyStatus(): Promise<'valid' | 'missing' | 'invalid'> {
    const sessionId = `session-${Date.now()}`;
    console.log(`[API-KEY-SERVICE] ${sessionId} - getKeyStatus() called`);
    
    try {
      const key = await this.getOpenAIKey();
      console.log(`[API-KEY-SERVICE] ${sessionId} - Key retrieved for status check`);
      
      if (!key) {
        console.log(`[API-KEY-SERVICE] ${sessionId} - Status: missing (no key)`);
        return 'missing';
      }
      if (!key.startsWith('sk-')) {
        console.log(`[API-KEY-SERVICE] ${sessionId} - Status: invalid (wrong prefix)`);
        return 'invalid';
      }
      console.log(`[API-KEY-SERVICE] ${sessionId} - Status: valid`);
      return 'valid';
    } catch (error) {
      console.error(`[API-KEY-SERVICE] ${sessionId} - Error getting key status:`, error.message);
      return 'missing';
    }
  }

  public static async validateKey(): Promise<boolean> {
    const sessionId = `session-${Date.now()}`;
    console.log(`[API-KEY-SERVICE] ${sessionId} - validateKey() called`);
    
    try {
      const isAvailable = await this.isKeyAvailable();
      console.log(`[API-KEY-SERVICE] ${sessionId} - Key availability: ${isAvailable}`);
      
      if (!isAvailable) {
        console.log(`[API-KEY-SERVICE] ${sessionId} - Validation failed: key not available`);
        return false;
      }
      
      const key = await this.getOpenAIKey();
      const isValidLength = key.length > 20;
      console.log(`[API-KEY-SERVICE] ${sessionId} - Key length validation: ${isValidLength} (length: ${key.length})`);
      console.log(`[API-KEY-SERVICE] ${sessionId} - Final validation result: ${isValidLength}`);
      return isValidLength;
    } catch (error) {
      console.error(`[API-KEY-SERVICE] ${sessionId} - Error validating key:`, error.message);
      return false;
    }
  }

  // Clear cached key (useful for testing or key rotation)
  public static clearCache(): void {
    const sessionId = `session-${Date.now()}`;
    console.log(`[API-KEY-SERVICE] ${sessionId} - clearCache() called`);
    this.cachedKey = null;
    console.log(`[API-KEY-SERVICE] ${sessionId} - Cache cleared`);
  }
}
