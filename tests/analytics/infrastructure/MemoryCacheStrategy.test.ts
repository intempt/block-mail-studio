
import { MemoryCacheStrategy } from '../../../src/analytics/infrastructure/MemoryCacheStrategy';
import { AnalysisResult } from '../../../src/analytics/core/interfaces';

describe('MemoryCacheStrategy', () => {
  let cache: MemoryCacheStrategy;

  beforeEach(() => {
    cache = new MemoryCacheStrategy();
  });

  const createMockAnalysisResult = (id: string): AnalysisResult => ({
    id,
    timestamp: new Date(),
    content: {
      html: '<p>Test content</p>',
      subjectLine: 'Test Subject'
    },
    metrics: {
      sizeKB: 1.5,
      wordCount: 10,
      characterCount: 50,
      imageCount: 0,
      linkCount: 1,
      ctaCount: 1,
      subjectLineLength: 12,
      previewTextLength: 20
    },
    scores: {
      overallScore: 85,
      deliverabilityScore: 90,
      spamScore: 10,
      mobileScore: 88,
      accessibilityScore: 75
    },
    prediction: {
      openRate: 28.5,
      clickRate: 4.2,
      conversionRate: 2.8,
      confidence: 0.85
    },
    suggestions: [],
    metadata: {
      analysisMethod: 'heuristic',
      processingTimeMs: 100,
      version: '1.0.0'
    }
  });

  describe('basic cache operations', () => {
    it('should store and retrieve analysis results', async () => {
      const key = 'test-key';
      const result = createMockAnalysisResult('test-1');

      await cache.set(key, result);
      const retrieved = await cache.get(key);

      expect(retrieved).toEqual(result);
      expect(retrieved?.id).toBe('test-1');
    });

    it('should return null for non-existent keys', async () => {
      const retrieved = await cache.get('non-existent-key');
      expect(retrieved).toBeNull();
    });

    it('should overwrite existing entries', async () => {
      const key = 'test-key';
      const result1 = createMockAnalysisResult('test-1');
      const result2 = createMockAnalysisResult('test-2');

      await cache.set(key, result1);
      await cache.set(key, result2);
      
      const retrieved = await cache.get(key);
      expect(retrieved?.id).toBe('test-2');
    });
  });

  describe('TTL and expiration', () => {
    it('should respect TTL and expire old entries', async () => {
      const key = 'test-key';
      const result = createMockAnalysisResult('test-1');
      const shortTTL = 100; // 100ms

      await cache.set(key, result, shortTTL);
      
      // Should be available immediately
      let retrieved = await cache.get(key);
      expect(retrieved).toEqual(result);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be expired
      retrieved = await cache.get(key);
      expect(retrieved).toBeNull();
    });

    it('should use default TTL when not specified', async () => {
      const key = 'test-key';
      const result = createMockAnalysisResult('test-1');

      await cache.set(key, result);
      const retrieved = await cache.get(key);

      expect(retrieved).toEqual(result);
    });

    it('should handle multiple entries with different TTLs', async () => {
      const result1 = createMockAnalysisResult('test-1');
      const result2 = createMockAnalysisResult('test-2');
      const shortTTL = 100;
      const longTTL = 5000;

      await cache.set('key1', result1, shortTTL);
      await cache.set('key2', result2, longTTL);

      // Wait for short TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toEqual(result2);
    });
  });

  describe('cache statistics', () => {
    it('should return cache statistics accurately', async () => {
      const result1 = createMockAnalysisResult('test-1');
      const result2 = createMockAnalysisResult('test-2');

      // Initial stats
      let stats = await cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.size).toBe(0);

      // Add entries and check hits/misses
      await cache.set('key1', result1);
      await cache.set('key2', result2);

      // Cache miss
      await cache.get('non-existent');
      
      // Cache hits
      await cache.get('key1');
      await cache.get('key2');
      await cache.get('key1'); // Another hit

      stats = await cache.getStats();
      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(1);
      expect(stats.size).toBe(2);
    });

    it('should track cache hits and misses', async () => {
      const result = createMockAnalysisResult('test-1');
      await cache.set('existing-key', result);

      // Generate hits and misses
      await cache.get('existing-key'); // hit
      await cache.get('non-existent-1'); // miss
      await cache.get('existing-key'); // hit
      await cache.get('non-existent-2'); // miss
      await cache.get('existing-key'); // hit

      const stats = await cache.getStats();
      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(2);
    });

    it('should count expired entries as misses', async () => {
      const result = createMockAnalysisResult('test-1');
      const shortTTL = 50;

      await cache.set('test-key', result, shortTTL);
      
      // Hit before expiration
      await cache.get('test-key');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Miss after expiration
      await cache.get('test-key');

      const stats = await cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });
  });

  describe('cache cleanup', () => {
    it('should clear all cached entries', async () => {
      const result1 = createMockAnalysisResult('test-1');
      const result2 = createMockAnalysisResult('test-2');

      await cache.set('key1', result1);
      await cache.set('key2', result2);

      let stats = await cache.getStats();
      expect(stats.size).toBe(2);

      await cache.clear();

      stats = await cache.getStats();
      expect(stats.size).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);

      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBeNull();
    });

    it('should perform automatic cleanup when cache is full', async () => {
      // Fill cache beyond the cleanup threshold (100 entries)
      const promises = [];
      for (let i = 0; i < 105; i++) {
        const result = createMockAnalysisResult(`test-${i}`);
        promises.push(cache.set(`key-${i}`, result, 50)); // Short TTL for some entries
      }
      await Promise.all(promises);

      // Wait for some entries to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      // Add one more entry to trigger cleanup
      const newResult = createMockAnalysisResult('trigger-cleanup');
      await cache.set('cleanup-trigger', newResult);

      const stats = await cache.getStats();
      expect(stats.size).toBeLessThan(105); // Some entries should have been cleaned up
    });

    it('should remove only expired entries during cleanup', async () => {
      const expiredResult = createMockAnalysisResult('expired');
      const validResult = createMockAnalysisResult('valid');

      await cache.set('expired-key', expiredResult, 50); // Short TTL
      await cache.set('valid-key', validResult, 5000); // Long TTL

      // Wait for first entry to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trigger cleanup by filling cache
      for (let i = 0; i < 101; i++) {
        const result = createMockAnalysisResult(`bulk-${i}`);
        await cache.set(`bulk-key-${i}`, result);
      }

      // Expired entry should be gone, valid entry should remain
      expect(await cache.get('expired-key')).toBeNull();
      expect(await cache.get('valid-key')).toEqual(validResult);
    });
  });

  describe('concurrent operations', () => {
    it('should handle concurrent cache operations', async () => {
      const concurrentOperations = [];
      
      // Concurrent sets
      for (let i = 0; i < 50; i++) {
        const result = createMockAnalysisResult(`concurrent-${i}`);
        concurrentOperations.push(cache.set(`key-${i}`, result));
      }

      // Concurrent gets
      for (let i = 0; i < 25; i++) {
        concurrentOperations.push(cache.get(`key-${i}`));
      }

      await Promise.all(concurrentOperations);

      const stats = await cache.getStats();
      expect(stats.size).toBe(50);
      expect(stats.hits + stats.misses).toBeGreaterThan(0);
    });

    it('should maintain consistency during concurrent access', async () => {
      const result = createMockAnalysisResult('consistency-test');
      const key = 'consistency-key';

      // Set initial value
      await cache.set(key, result);

      // Concurrent reads
      const readPromises = Array(20).fill(0).map(() => cache.get(key));
      const results = await Promise.all(readPromises);

      // All reads should return the same result
      results.forEach(r => {
        expect(r).toEqual(result);
      });
    });
  });

  describe('memory management', () => {
    it('should handle large cache entries', async () => {
      const largeResult = createMockAnalysisResult('large-test');
      // Simulate large content
      largeResult.content.html = 'x'.repeat(100000);

      await cache.set('large-key', largeResult);
      const retrieved = await cache.get('large-key');

      expect(retrieved?.content.html).toHaveLength(100000);
    });

    it('should maintain performance with many entries', async () => {
      const startTime = Date.now();

      // Add many entries
      for (let i = 0; i < 1000; i++) {
        const result = createMockAnalysisResult(`perf-test-${i}`);
        await cache.set(`perf-key-${i}`, result);
      }

      const setTime = Date.now() - startTime;

      // Test retrieval performance
      const retrievalStart = Date.now();
      for (let i = 0; i < 100; i++) {
        await cache.get(`perf-key-${i}`);
      }
      const retrievalTime = Date.now() - retrievalStart;

      expect(setTime).toBeLessThan(5000); // 5 seconds for 1000 sets
      expect(retrievalTime).toBeLessThan(100); // 100ms for 100 gets
    });
  });

  describe('error handling', () => {
    it('should handle malformed cache keys gracefully', async () => {
      const result = createMockAnalysisResult('test');
      const weirdKeys = ['', null as any, undefined as any, 123 as any];

      for (const key of weirdKeys) {
        await expect(cache.set(key, result)).resolves.not.toThrow();
        await expect(cache.get(key)).resolves.toBeDefined();
      }
    });

    it('should handle null/undefined values gracefully', async () => {
      await expect(cache.set('null-test', null as any)).resolves.not.toThrow();
      await expect(cache.set('undefined-test', undefined as any)).resolves.not.toThrow();
    });
  });
});
