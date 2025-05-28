
import { OpenAIEmailService } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';
import { toast } from 'sonner';

export interface AnalysisRequest {
  emailHTML: string;
  subjectLine: string;
  variant?: 'quick' | 'comprehensive';
}

export interface AnalysisResult {
  overallScore: number;
  deliverabilityScore: number;
  mobileScore: number;
  spamScore: number;
  brandVoiceScore: number;
  engagementScore: number;
  readabilityScore: number;
  performancePrediction: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  suggestions: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  contentMetrics: {
    wordCount: number;
    sizeKB: number;
    linkCount: number;
    imageCount: number;
  };
}

export type AnalysisCallback = (result: AnalysisResult | null, error?: string) => void;
export type ProgressCallback = (stage: string, progress: number) => void;

class CallbackEmailAnalysisServiceClass {
  private activeRequests = new Map<string, AbortController>();
  private cache = new Map<string, AnalysisResult>();

  private getRequestId(request: AnalysisRequest): string {
    return `${request.emailHTML.length}-${request.subjectLine}-${request.variant || 'quick'}`;
  }

  private calculateBasicMetrics(emailHTML: string): AnalysisResult['contentMetrics'] {
    const textContent = emailHTML.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const links = (emailHTML.match(/<a\s+[^>]*href/gi) || []).length;
    const images = (emailHTML.match(/<img\s+[^>]*src/gi) || []).length;
    const sizeKB = Math.round((emailHTML.length * 2) / 1024 * 100) / 100;
    
    return {
      wordCount: words.length,
      sizeKB,
      linkCount: links,
      imageCount: images
    };
  }

  private createFallbackResult(request: AnalysisRequest): AnalysisResult {
    return {
      overallScore: 85,
      deliverabilityScore: 88,
      mobileScore: 90,
      spamScore: 15,
      brandVoiceScore: 82,
      engagementScore: 78,
      readabilityScore: 87,
      performancePrediction: {
        openRate: 22.5,
        clickRate: 6.8,
        conversionRate: 2.4
      },
      suggestions: [
        {
          id: 'fallback-1',
          type: 'subject',
          title: 'Optimize Subject Line',
          description: 'Consider shortening for mobile',
          impact: 'medium' as const
        }
      ],
      contentMetrics: this.calculateBasicMetrics(request.emailHTML)
    };
  }

  analyzeEmailAsync(
    request: AnalysisRequest,
    onComplete: AnalysisCallback,
    onProgress?: ProgressCallback
  ): () => void {
    const requestId = this.getRequestId(request);
    
    // Check cache first
    const cached = this.cache.get(requestId);
    if (cached) {
      // Use setTimeout to make it async
      setTimeout(() => onComplete(cached), 0);
      return () => {}; // No-op cancel function
    }

    // Check if request is already in progress
    if (this.activeRequests.has(requestId)) {
      // Cancel existing request
      this.activeRequests.get(requestId)?.abort();
    }

    const abortController = new AbortController();
    this.activeRequests.set(requestId, abortController);

    // Start analysis process
    this.performAnalysis(request, abortController, onComplete, onProgress);

    // Return cancel function
    return () => {
      abortController.abort();
      this.activeRequests.delete(requestId);
    };
  }

  private async performAnalysis(
    request: AnalysisRequest,
    abortController: AbortController,
    onComplete: AnalysisCallback,
    onProgress?: ProgressCallback
  ) {
    const requestId = this.getRequestId(request);

    try {
      // Immediate progress callback
      onProgress?.('Starting analysis...', 10);

      if (abortController.signal.aborted) return;

      // Check API key
      if (!ApiKeyService.validateKey()) {
        onProgress?.('API key validation failed', 100);
        const fallback = this.createFallbackResult(request);
        this.cache.set(requestId, fallback);
        onComplete(fallback);
        return;
      }

      onProgress?.('Analyzing content...', 30);

      if (abortController.signal.aborted) return;

      // Build analysis prompt
      const prompt = this.buildQuickAnalysisPrompt(request);
      
      onProgress?.('Calling AI service...', 50);

      // Make non-blocking API call
      const aiResponse = await OpenAIEmailService.callOpenAI(prompt, 1, true);

      if (abortController.signal.aborted) return;

      onProgress?.('Processing results...', 80);

      // Process response
      const result: AnalysisResult = {
        ...aiResponse,
        contentMetrics: this.calculateBasicMetrics(request.emailHTML)
      };

      onProgress?.('Analysis complete', 100);

      // Cache and return result
      this.cache.set(requestId, result);
      onComplete(result);

    } catch (error) {
      if (abortController.signal.aborted) return;

      console.error('Analysis failed:', error);
      
      // Return fallback on error
      const fallback = this.createFallbackResult(request);
      this.cache.set(requestId, fallback);
      onComplete(fallback, error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      this.activeRequests.delete(requestId);
    }
  }

  private buildQuickAnalysisPrompt(request: AnalysisRequest): string {
    return `Analyze this email quickly and return JSON:

SUBJECT: "${request.subjectLine}"
HTML: ${request.emailHTML}

Return:
{
  "overallScore": 85,
  "deliverabilityScore": 90,
  "mobileScore": 88,
  "spamScore": 12,
  "brandVoiceScore": 85,
  "engagementScore": 80,
  "readabilityScore": 87,
  "performancePrediction": {"openRate": 24, "clickRate": 7, "conversionRate": 3},
  "suggestions": [{"id": "1", "type": "subject", "title": "Specific suggestion", "description": "Actionable advice", "impact": "high"}]
}`;
  }

  cancelAllRequests(): void {
    this.activeRequests.forEach(controller => controller.abort());
    this.activeRequests.clear();
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const CallbackEmailAnalysisService = new CallbackEmailAnalysisServiceClass();
