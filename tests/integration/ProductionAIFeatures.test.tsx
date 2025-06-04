
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailAIService } from '../../src/services/EmailAIService';
import { directAIService } from '../../src/services/directAIService';
import { EmailAnalyticsService } from '../../src/analytics/services/EmailAnalyticsService';
import { EnhancedEmailSubjectLine } from '../../src/components/EnhancedEmailSubjectLine';

// Mock dependencies
vi.mock('../../src/services/apiKeyService', () => ({
  ApiKeyService: {
    validateKey: () => true
  }
}));

vi.mock('../../src/services/openAIEmailService');

describe('Production AI Features Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Three AI Features Working Together', () => {
    it('should provide consistent analysis across all AI features', async () => {
      const emailContent = {
        html: '<div><h1>Welcome!</h1><p>Thank you for joining us.</p><a href="#">Get Started</a></div>',
        subjectLine: 'Welcome to Our Service',
        previewText: 'Thank you for joining us'
      };

      // 1. Email Analytics
      const analyticsService = new EmailAnalyticsService();
      const analyticsResult = await analyticsService.analyze(emailContent);

      // 2. Email Suggestions (Performance Analysis)
      const performanceResult = await EmailAIService.analyzeEmailPerformance(
        emailContent.html, 
        emailContent.subjectLine
      );

      // 3. Subject Line AI
      const subjectResult = await EmailAIService.analyzeSubjectLine(
        emailContent.subjectLine, 
        emailContent.html
      );

      // Verify all features provide production-grade analysis
      expect(analyticsResult.scores?.overallScore).toBeGreaterThan(0);
      expect(performanceResult.overallScore).toBeGreaterThan(0);
      expect(subjectResult.score).toBeGreaterThan(0);

      // Verify consistency in scoring approach
      expect(analyticsResult.scores?.deliverabilityScore).toBeGreaterThan(60);
      expect(performanceResult.deliverabilityScore).toBeGreaterThan(60);
      expect(subjectResult.predictions.deliverabilityScore).toBeGreaterThan(60);
    });

    it('should handle the same content consistently across services', async () => {
      const testSubject = 'Newsletter Update - March 2024';
      const testContent = '<p>Monthly updates and insights</p>';

      // Test both services with identical input
      const emailAIResult = await EmailAIService.analyzeSubjectLine(testSubject, testContent);
      const directAIResult = await directAIService.analyzeSubjectLine(testSubject, testContent);

      // Should use similar algorithms (within reasonable variance)
      expect(Math.abs(emailAIResult.score - directAIResult.score)).toBeLessThan(15);
      
      // Both should detect this as a good subject line
      expect(emailAIResult.score).toBeGreaterThan(60);
      expect(directAIResult.score).toBeGreaterThan(60);
    });
  });

  describe('UI Component Integration', () => {
    it('should render subject line component with production AI analysis', async () => {
      const mockOnChange = vi.fn();
      const mockOnAnalysisComplete = vi.fn();

      render(
        <EnhancedEmailSubjectLine
          value="Test Subject Line"
          onChange={mockOnChange}
          emailContent="<p>Test content</p>"
          onAnalysisComplete={mockOnAnalysisComplete}
        />
      );

      // Verify the component renders with production features
      expect(screen.getByText('Email Subject Line')).toBeInTheDocument();
      expect(screen.getByText('Email Marketing')).toBeInTheDocument();

      // Wait for auto-analysis to complete
      await waitFor(() => {
        expect(mockOnAnalysisComplete).toHaveBeenCalled();
      }, { timeout: 2000 });

      const analysisCall = mockOnAnalysisComplete.mock.calls[0][0];
      expect(analysisCall.score).toBeGreaterThan(0);
      expect(analysisCall.predictions.openRate).toBeGreaterThan(0);
    });
  });

  describe('Performance and Reliability', () => {
    it('should complete all AI analyses within performance requirements', async () => {
      const emailContent = {
        html: '<div><h1>Performance Test</h1><p>Testing all AI features together</p></div>',
        subjectLine: 'Performance Test Email',
        previewText: 'Testing performance'
      };

      const startTime = Date.now();

      // Run all three AI features simultaneously
      const [analyticsResult, performanceResult, subjectResult] = await Promise.all([
        new EmailAnalyticsService().analyze(emailContent),
        EmailAIService.analyzeEmailPerformance(emailContent.html, emailContent.subjectLine),
        EmailAIService.analyzeSubjectLine(emailContent.subjectLine, emailContent.html)
      ]);

      const totalTime = Date.now() - startTime;

      // Verify all completed successfully
      expect(analyticsResult.scores).toBeDefined();
      expect(performanceResult.overallScore).toBeDefined();
      expect(subjectResult.score).toBeDefined();

      // Verify performance requirements
      expect(totalTime).toBeLessThan(3000); // All three should complete within 3 seconds
    });

    it('should handle error scenarios gracefully', async () => {
      // Test with edge case content
      const problematicContent = {
        html: '',
        subjectLine: '',
        previewText: ''
      };

      // All should handle empty content gracefully
      const analyticsResult = await new EmailAnalyticsService().analyze(problematicContent);
      const performanceResult = await EmailAIService.analyzeEmailPerformance('', '');
      const subjectResult = await EmailAIService.analyzeSubjectLine('', '');

      expect(analyticsResult).toBeDefined();
      expect(performanceResult).toBeDefined();
      expect(subjectResult).toBeDefined();
    });
  });

  describe('Production Quality Validation', () => {
    it('should demonstrate no random/mock behavior in production features', async () => {
      const testSubject = 'Consistent Analysis Test';
      const testContent = '<p>Testing consistency</p>';

      // Run the same analysis multiple times
      const results = await Promise.all([
        EmailAIService.analyzeSubjectLine(testSubject, testContent),
        EmailAIService.analyzeSubjectLine(testSubject, testContent),
        EmailAIService.analyzeSubjectLine(testSubject, testContent)
      ]);

      // All results should be identical (proving no randomness)
      expect(results[0].score).toBe(results[1].score);
      expect(results[1].score).toBe(results[2].score);
      expect(results[0].predictions.openRate).toBe(results[1].predictions.openRate);
      expect(results[1].predictions.openRate).toBe(results[2].predictions.openRate);
    });

    it('should provide actionable, production-grade insights', async () => {
      const spamySubject = 'FREE URGENT ACT NOW LIMITED TIME!!!';
      const goodSubject = 'Your monthly newsletter is here';

      const spamyResult = await EmailAIService.analyzeSubjectLine(spamySubject, '');
      const goodResult = await EmailAIService.analyzeSubjectLine(goodSubject, '');

      // Spamy subject should score lower
      expect(spamyResult.score).toBeLessThan(goodResult.score);
      expect(spamyResult.predictions.deliverabilityScore).toBeLessThan(
        goodResult.predictions.deliverabilityScore
      );

      // Both should provide suggestions
      expect(spamyResult.suggestions.length).toBeGreaterThan(0);
      expect(goodResult.suggestions.length).toBeGreaterThan(0);
    });
  });
});
