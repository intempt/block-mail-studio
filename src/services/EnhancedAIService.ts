
import { emailAIService, BrandVoiceAnalysisResult, SubjectLineAnalysisResult, PerformanceAnalysisResult } from './EmailAIService';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class EnhancedAIServiceManager {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private analysisQueue = new Map<string, Promise<any>>();

  private getCacheKey(operation: string, content: string): string {
    return `${operation}-${btoa(content).slice(0, 20)}`;
  }

  private isValidCache<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.expiresIn;
  }

  private async getOrSetCache<T>(
    key: string,
    operation: () => Promise<T>,
    expiresIn: number = this.CACHE_DURATION
  ): Promise<T> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && this.isValidCache(cached)) {
      console.log(`Cache hit for ${key}`);
      return cached.data;
    }

    // Check if operation is already in progress
    if (this.analysisQueue.has(key)) {
      console.log(`Analysis in progress for ${key}`);
      return this.analysisQueue.get(key)!;
    }

    // Start new operation
    const promise = operation();
    this.analysisQueue.set(key, promise);

    try {
      const result = await promise;
      
      // Cache the result
      this.cache.set(key, {
        data: result,
        timestamp: Date.now(),
        expiresIn
      });

      console.log(`Cached result for ${key}`);
      return result;
    } finally {
      this.analysisQueue.delete(key);
    }
  }

  async analyzeSubjectLineEnhanced(
    subjectLine: string, 
    emailContent?: string
  ): Promise<SubjectLineAnalysisResult> {
    const key = this.getCacheKey('subject', subjectLine + (emailContent || ''));
    
    return this.getOrSetCache(key, async () => {
      return emailAIService.analyzeSubjectLine(subjectLine, emailContent);
    });
  }

  async analyzeBrandVoiceEnhanced(
    emailHTML: string, 
    subjectLine?: string
  ): Promise<BrandVoiceAnalysisResult> {
    const key = this.getCacheKey('brand', emailHTML + (subjectLine || ''));
    
    return this.getOrSetCache(key, async () => {
      return emailAIService.analyzeBrandVoice(emailHTML, subjectLine);
    });
  }

  async analyzePerformanceEnhanced(emailHTML: string): Promise<PerformanceAnalysisResult> {
    const key = this.getCacheKey('performance', emailHTML);
    
    return this.getOrSetCache(key, async () => {
      return emailAIService.analyzeEmailPerformance(emailHTML);
    });
  }

  async generateSubjectVariants(subjectLine: string, count: number = 3): Promise<string[]> {
    const key = this.getCacheKey('variants', subjectLine);
    
    return this.getOrSetCache(key, async () => {
      const variants = [];
      for (let i = 0; i < count; i++) {
        const variant = await emailAIService.generateContent(
          `Create a variant of this subject line that has similar meaning but different wording: "${subjectLine}"`,
          'subject'
        );
        variants.push(variant.trim().replace(/^["']|["']$/g, ''));
      }
      return variants;
    });
  }

  clearCache(): void {
    this.cache.clear();
    console.log('AI service cache cleared');
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export const enhancedAIService = new EnhancedAIServiceManager();
