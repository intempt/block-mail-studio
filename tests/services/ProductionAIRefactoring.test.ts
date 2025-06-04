
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmailAIService } from '../../src/services/EmailAIService';
import { directAIService } from '../../src/services/directAIService';
import { ApiKeyService } from '../../src/services/apiKeyService';

// Mock external dependencies
vi.mock('../../src/services/apiKeyService');
vi.mock('../../src/services/openAIEmailService');
vi.mock('sonner');

describe('Production AI Refactoring Tests', () => {
  beforeEach(() => {
    vi.mocked(ApiKeyService.validateKey).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Phase 1: Legacy Random Scoring Fixed', () => {
    it('should use production-grade scoring instead of random values', async () => {
      const subjectLine = 'Welcome to Our Service - Get Started Today!';
      const emailContent = '<p>Welcome email content</p>';

      const result = await EmailAIService.analyzeSubjectLine(subjectLine, emailContent);

      // Verify score is calculated, not random
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
      
      // Run multiple times to ensure consistency (not random)
      const result2 = await EmailAIService.analyzeSubjectLine(subjectLine, emailContent);
      expect(result.score).toBe(result2.score);
      expect(result.predictions.openRate).toBe(result2.predictions.openRate);
      expect(result.predictions.deliverabilityScore).toBe(result2.predictions.deliverabilityScore);
    });

    it('should apply email marketing best practices scoring', async () => {
      const optimalSubject = 'Your Order is Ready - Track Shipment';
      const spamySubject = 'FREE URGENT ACT NOW LIMITED TIME!!!';

      const optimalResult = await EmailAIService.analyzeSubjectLine(optimalSubject, '');
      const spamyResult = await EmailAIService.analyzeSubjectLine(spamySubject, '');

      expect(optimalResult.score).toBeGreaterThan(spamyResult.score);
      expect(optimalResult.predictions.deliverabilityScore).toBeGreaterThan(
        spamyResult.predictions.deliverabilityScore
      );
    });

    it('should calculate mobile optimization factors', async () => {
      const mobileOptimal = 'Quick Update for You'; // 20 chars - good for mobile
      const tooLong = 'This is a very long subject line that will definitely be truncated on mobile devices'; // 90 chars

      const mobileResult = await EmailAIService.analyzeSubjectLine(mobileOptimal, '');
      const longResult = await EmailAIService.analyzeSubjectLine(tooLong, '');

      expect(mobileResult.score).toBeGreaterThan(longResult.score);
    });
  });

  describe('Phase 2: Service Layer Standardization', () => {
    it('should provide consistent analysis quality between services', async () => {
      const subjectLine = 'Newsletter Update - March 2024';
      const emailContent = '<p>Newsletter content</p>';

      const emailAIResult = await EmailAIService.analyzeSubjectLine(subjectLine, emailContent);
      const directAIResult = await directAIService.analyzeSubjectLine(subjectLine, emailContent);

      // Both should use similar scoring algorithms
      expect(Math.abs(emailAIResult.score - directAIResult.score)).toBeLessThan(10);
      expect(emailAIResult.predictions.openRate).toBeGreaterThan(0);
      expect(directAIResult.predictions.openRate).toBeGreaterThan(0);
    });

    it('should maintain backward compatibility', async () => {
      const result = await EmailAIService.analyzeSubjectLine('Test Subject', 'Test Content');

      // Verify response structure matches expected interface
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('suggestions');
      expect(result).toHaveProperty('predictions');
      expect(result.predictions).toHaveProperty('openRate');
      expect(result.predictions).toHaveProperty('deliverabilityScore');
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('Phase 3: Component Integration Verification', () => {
    it('should handle edge cases gracefully', async () => {
      // Empty subject line
      const emptyResult = await EmailAIService.analyzeSubjectLine('', '');
      expect(emptyResult.score).toBeDefined();
      expect(emptyResult.predictions.openRate).toBeDefined();

      // Very long subject line
      const longSubject = 'A'.repeat(200);
      const longResult = await EmailAIService.analyzeSubjectLine(longSubject, '');
      expect(longResult.score).toBeLessThan(70); // Should be penalized
    });

    it('should provide actionable suggestions', async () => {
      const result = await EmailAIService.analyzeSubjectLine('Test Subject', 'Test Content');
      
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Phase 4: Production Quality Assurance', () => {
    it('should handle API failures gracefully', async () => {
      vi.mocked(ApiKeyService.validateKey).mockReturnValue(false);

      await expect(
        EmailAIService.analyzeSubjectLine('Test', 'Test')
      ).rejects.toThrow('OpenAI API key not available');
    });

    it('should perform analysis within acceptable time limits', async () => {
      const startTime = Date.now();
      await EmailAIService.analyzeSubjectLine('Performance Test Subject', 'Content');
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should provide consistent spam detection', async () => {
      const spamSubjects = [
        'FREE MONEY ACT NOW!!!',
        'URGENT: Claim your prize immediately',
        'Limited time offer - FREE GIFT'
      ];

      for (const subject of spamSubjects) {
        const result = await EmailAIService.analyzeSubjectLine(subject, '');
        expect(result.predictions.deliverabilityScore).toBeLessThan(80);
        expect(result.score).toBeLessThan(70);
      }
    });

    it('should reward email marketing best practices', async () => {
      const goodSubjects = [
        'Your order confirmation #12345',
        'Monthly newsletter - March insights',
        'Welcome to our community!'
      ];

      for (const subject of goodSubjects) {
        const result = await EmailAIService.analyzeSubjectLine(subject, '');
        expect(result.predictions.deliverabilityScore).toBeGreaterThan(80);
        expect(result.score).toBeGreaterThan(60);
      }
    });
  });

  describe('Integration with Email Analytics', () => {
    it('should work seamlessly with other AI features', async () => {
      // Test that subject line analysis integrates with performance analysis
      const emailHTML = '<p>Test email content</p>';
      const subjectLine = 'Test Subject Line';

      const subjectAnalysis = await EmailAIService.analyzeSubjectLine(subjectLine, emailHTML);
      const performanceAnalysis = await EmailAIService.analyzeEmailPerformance(emailHTML, subjectLine);

      expect(subjectAnalysis.score).toBeDefined();
      expect(performanceAnalysis.overallScore).toBeDefined();
      
      // Both should be production-grade (not random/mock)
      expect(typeof subjectAnalysis.score).toBe('number');
      expect(typeof performanceAnalysis.overallScore).toBe('number');
    });
  });
});
