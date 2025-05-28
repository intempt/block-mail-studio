
import { OpenAIEmailService } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';
import { toast } from 'sonner';

export interface ComprehensiveEmailAnalysis {
  // Performance metrics
  overallScore: number;
  deliverabilityScore: number;
  mobileScore: number;
  spamScore: number;
  
  // Brand voice metrics
  brandVoiceScore: number;
  engagementScore: number;
  toneConsistency: number;
  readabilityScore: number;
  
  // Performance predictions
  performancePrediction: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  
  // Content metrics
  contentMetrics: {
    wordCount: number;
    characterCount: number;
    linkCount: number;
    imageCount: number;
    estimatedReadTime: string;
    sizeKB: number;
  };
  
  // AI suggestions
  suggestions: Array<{
    id: string;
    type: 'subject' | 'copy' | 'cta' | 'tone' | 'design' | 'accessibility' | 'performance';
    title: string;
    description: string;
    current: string;
    suggested: string;
    reason: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
    category?: string;
  }>;
  
  // Accessibility issues
  accessibilityIssues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    fix: string;
  }>;
  
  // Design insights
  designInsights: Array<{
    id: string;
    category: 'layout' | 'typography' | 'color' | 'mobile' | 'accessibility';
    title: string;
    description: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  // Performance metrics breakdown
  metrics: {
    loadTime: { value: number; status: string };
    accessibility: { value: number; status: string };
    imageOptimization: { value: number; status: string };
    linkCount: { value: number; status: string };
  };
  
  // Optimization suggestions
  optimizationSuggestions: string[];
  
  // Analysis metadata
  analysisTimestamp: Date;
  variant: 'quick' | 'comprehensive' | 'focused';
  apiCost: number;
}

export interface AnalysisRequest {
  emailHTML: string;
  subjectLine: string;
  variant?: 'quick' | 'comprehensive' | 'focused';
  focusArea?: 'accessibility' | 'performance' | 'brand' | 'engagement';
}

class MasterEmailAnalysisServiceClass {
  private cache = new Map<string, ComprehensiveEmailAnalysis>();
  private isAnalyzing = false;

  private getCacheKey(request: AnalysisRequest): string {
    return `${request.emailHTML.length}-${request.subjectLine}-${request.variant || 'comprehensive'}`;
  }

  private calculateContentMetrics(emailHTML: string): ComprehensiveEmailAnalysis['contentMetrics'] {
    const textContent = emailHTML.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const links = (emailHTML.match(/<a\s+[^>]*href/gi) || []).length;
    const images = (emailHTML.match(/<img\s+[^>]*src/gi) || []).length;
    const sizeKB = Math.round((emailHTML.length * 2) / 1024 * 100) / 100; // Rough estimate
    
    return {
      wordCount: words.length,
      characterCount: textContent.length,
      linkCount: links,
      imageCount: images,
      estimatedReadTime: `${Math.ceil(words.length / 200)} min`,
      sizeKB
    };
  }

  private buildComprehensivePrompt(request: AnalysisRequest): string {
    const { emailHTML, subjectLine, variant = 'comprehensive' } = request;
    
    return `Analyze this complete email for comprehensive insights across all areas. Return detailed JSON analysis:

SUBJECT LINE: "${subjectLine}"

FULL EMAIL HTML CONTENT:
${emailHTML}

ANALYSIS REQUIREMENTS for ${variant} analysis:
1. Performance & Deliverability Analysis
2. Brand Voice & Engagement Assessment  
3. Design & Accessibility Review
4. Content Optimization Opportunities
5. Predictive Performance Metrics
6. Actionable Improvement Suggestions

Return comprehensive JSON structure:
{
  "overallScore": 85,
  "deliverabilityScore": 91,
  "mobileScore": 88,
  "spamScore": 12,
  "brandVoiceScore": 87,
  "engagementScore": 82,
  "toneConsistency": 89,
  "readabilityScore": 85,
  "performancePrediction": {
    "openRate": 24.5,
    "clickRate": 7.8,
    "conversionRate": 2.9
  },
  "suggestions": [
    {
      "id": "subj-001",
      "type": "subject",
      "title": "Specific improvement based on actual subject",
      "description": "Detailed explanation of the issue found",
      "current": "Actual current text from the email",
      "suggested": "Specific improvement suggestion",
      "reason": "Why this change would help based on content analysis",
      "impact": "high",
      "confidence": 92,
      "category": "engagement"
    }
  ],
  "accessibilityIssues": [
    {
      "type": "Missing Alt Text",
      "severity": "medium",
      "description": "Specific accessibility issue found in content",
      "fix": "Actionable fix for this specific issue"
    }
  ],
  "designInsights": [
    {
      "id": "design-001",
      "category": "mobile",
      "title": "Mobile Optimization Opportunity",
      "description": "Specific design insight based on actual content",
      "suggestion": "Actionable design improvement",
      "priority": "high"
    }
  ],
  "metrics": {
    "loadTime": {"value": 1.2, "status": "good"},
    "accessibility": {"value": 88, "status": "good"},
    "imageOptimization": {"value": 92, "status": "good"},
    "linkCount": {"value": 3, "status": "good"}
  },
  "optimizationSuggestions": [
    "Specific optimization based on actual email analysis",
    "Another actionable improvement for this email"
  ]
}

Focus on providing genuine, actionable insights based on the actual email content provided.`;
  }

  async analyzeEmail(request: AnalysisRequest): Promise<ComprehensiveEmailAnalysis> {
    const cacheKey = this.getCacheKey(request);
    
    // Return cached result if available and recent
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.analysisTimestamp.getTime() < 300000) { // 5 minutes
      return cached;
    }

    if (this.isAnalyzing) {
      throw new Error('Analysis already in progress');
    }

    this.isAnalyzing = true;
    
    try {
      if (!ApiKeyService.validateKey()) {
        toast.error('OpenAI API key not configured');
        throw new Error('OpenAI API key not available');
      }

      toast.loading('Running comprehensive AI analysis...', { id: 'master-analysis' });

      const prompt = this.buildComprehensivePrompt(request);
      const aiResponse = await OpenAIEmailService.callOpenAI(prompt, 2, true);

      // Calculate content metrics locally
      const contentMetrics = this.calculateContentMetrics(request.emailHTML);

      // Combine AI response with calculated metrics
      const analysis: ComprehensiveEmailAnalysis = {
        ...aiResponse,
        contentMetrics,
        analysisTimestamp: new Date(),
        variant: request.variant || 'comprehensive',
        apiCost: 0.02 // Estimated cost per comprehensive analysis
      };

      // Cache the result
      this.cache.set(cacheKey, analysis);

      toast.success('AI analysis completed', { id: 'master-analysis' });
      return analysis;

    } catch (error) {
      console.error('Master analysis failed:', error);
      toast.error('Analysis failed', { id: 'master-analysis' });
      
      // Return fallback analysis with calculated metrics
      const fallbackAnalysis: ComprehensiveEmailAnalysis = {
        overallScore: 85,
        deliverabilityScore: 88,
        mobileScore: 90,
        spamScore: 15,
        brandVoiceScore: 82,
        engagementScore: 78,
        toneConsistency: 85,
        readabilityScore: 87,
        performancePrediction: {
          openRate: 22.5,
          clickRate: 6.8,
          conversionRate: 2.4
        },
        contentMetrics: this.calculateContentMetrics(request.emailHTML),
        suggestions: [
          {
            id: 'fallback-001',
            type: 'subject',
            title: 'Optimize Subject Line Length',
            description: 'Subject line could be optimized for mobile display',
            current: request.subjectLine,
            suggested: 'Consider shortening to under 50 characters',
            reason: 'Mobile email clients truncate longer subject lines',
            impact: 'medium',
            confidence: 75,
            category: 'mobile'
          }
        ],
        accessibilityIssues: [
          {
            type: 'General Review',
            severity: 'low',
            description: 'Consider reviewing for accessibility best practices',
            fix: 'Add alt text to images and ensure proper contrast ratios'
          }
        ],
        designInsights: [
          {
            id: 'fallback-design-001',
            category: 'mobile',
            title: 'Mobile Optimization',
            description: 'Email appears mobile-friendly',
            suggestion: 'Consider testing on various devices',
            priority: 'low'
          }
        ],
        metrics: {
          loadTime: { value: 1.1, status: 'good' },
          accessibility: { value: 85, status: 'good' },
          imageOptimization: { value: 90, status: 'good' },
          linkCount: { value: this.calculateContentMetrics(request.emailHTML).linkCount, status: 'good' }
        },
        optimizationSuggestions: [
          'Review email on multiple devices',
          'Consider A/B testing subject lines',
          'Optimize images for faster loading'
        ],
        analysisTimestamp: new Date(),
        variant: request.variant || 'comprehensive',
        apiCost: 0
      };

      this.cache.set(cacheKey, fallbackAnalysis);
      return fallbackAnalysis;
      
    } finally {
      this.isAnalyzing = false;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCachedAnalysis(request: AnalysisRequest): ComprehensiveEmailAnalysis | null {
    const cacheKey = this.getCacheKey(request);
    return this.cache.get(cacheKey) || null;
  }

  isAnalysisInProgress(): boolean {
    return this.isAnalyzing;
  }
}

export const MasterEmailAnalysisService = new MasterEmailAnalysisServiceClass();
