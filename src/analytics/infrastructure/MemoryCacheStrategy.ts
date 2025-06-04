
import { CacheStrategy, AnalysisResult } from '../core/interfaces';

export class MemoryCacheStrategy implements CacheStrategy {
  private cache = new Map<string, { result: AnalysisResult; expiresAt: number }>();
  private stats = { hits: 0, misses: 0 };

  async get(key: string): Promise<AnalysisResult | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.result;
  }

  async set(key: string, result: AnalysisResult, ttlMs: number = 300000): Promise<void> {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { result, expiresAt });

    // Basic cleanup - remove expired entries when cache gets large
    if (this.cache.size > 100) {
      const now = Date.now();
      for (const [k, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(k);
        }
      }
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  async getStats(): Promise<{ hits: number; misses: number; size: number }> {
    return {
      ...this.stats,
      size: this.cache.size
    };
  }
}
