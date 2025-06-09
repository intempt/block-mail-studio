import { OpenAIEmailService } from './openAIEmailService';
import { ApiKeyService } from './apiKeyService';

export interface CriticalSuggestion {
  id: string;
  category: 'subject' | 'deliverability' | 'cta' | 'mobile' | 'compliance' | 'accessibility' | 'structure' | 'personalization' | 'tone';
  type: 'subject' | 'copy' | 'cta' | 'tone' | 'compliance' | 'accessibility' | 'structure' | 'personalization';
  title: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  autoFixable: boolean;
  priority: number;
  businessImpact: string;
  applied?: boolean;
}

export class CriticalEmailAnalysisService {
  private static cache = new Map<string, { data: CriticalSuggestion[]; timestamp: number }>();
  private static CACHE_DURATION = 300000; // 5 minutes

  private static async validateKeyBeforeCall(): Promise<void> {
    const isValid = await ApiKeyService.validateKey();
    if (!isValid) {
      throw new Error('OpenAI API key is not available or invalid. Please refresh your API key.');
    }
  }

  static async analyzeCriticalIssues(emailHTML: string, subjectLine: string): Promise<CriticalSuggestion[]> {
    if (!emailHTML.trim()) {
      return [];
    }

    // Validate API key before proceeding
    await this.validateKeyBeforeCall();

    const cacheKey = `critical-${emailHTML}-${subjectLine}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Critical analysis: Using cached result');
      return cached.data;
    }

    try {
      console.log('Critical analysis: Calling OpenAI for comprehensive issue detection');
      
      const prompt = `Analyze this COMPLETE EMAIL for critical marketing mistakes and provide actionable suggestions:

SUBJECT LINE: "${subjectLine}"

FULL EMAIL CONTENT:
${emailHTML}

Analyze for these TOP EMAIL MARKETING MISTAKES:
1. Subject Line Issues (length, spam triggers, engagement hooks)
2. Deliverability Threats (spam words, excessive caps, poor sender reputation signals)
3. Call-to-Action Problems (weak CTAs, too many/few, poor placement)
4. Mobile Optimization Failures (width issues, font sizes, touch targets)
5. Compliance Violations (missing unsubscribe, CAN-SPAM issues)
6. Accessibility Issues (missing alt text, poor contrast, screen reader issues)
7. Content Structure Problems (poor hierarchy, wall of text, no scanability)
8. Personalization Missed Opportunities (generic content, no segmentation)
9. Tone/Voice Inconsistencies (professional vs casual mismatches)

For EACH identified issue, provide specific suggestions with:
- Exact current problematic text/element
- Specific suggested improvement
- Business impact explanation with metrics
- Priority level based on impact severity

Return JSON array of suggestions:
{
  "suggestions": [
    {
      "category": "subject",
      "type": "subject", 
      "title": "Subject line too long for mobile",
      "current": "Actual current subject line text",
      "suggested": "Specific improved version under 50 chars",
      "reason": "Detailed explanation of why this is problematic",
      "impact": "critical",
      "confidence": 92,
      "severity": "high",
      "autoFixable": true,
      "priority": 1,
      "businessImpact": "Could increase open rates by 15-25% on mobile devices"
    }
  ]
}

Focus on REAL issues found in the actual content. Only suggest improvements for problems that actually exist.`;

      const result = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      
      const suggestions: CriticalSuggestion[] = (result.suggestions || []).map((suggestion: any, index: number) => ({
        id: `critical-${Date.now()}-${index}`,
        category: suggestion.category || 'structure',
        type: suggestion.type || suggestion.category || 'copy',
        title: suggestion.title || 'Improvement suggestion',
        current: suggestion.current || '',
        suggested: suggestion.suggested || '',
        reason: suggestion.reason || '',
        impact: suggestion.impact || 'medium',
        confidence: suggestion.confidence || 75,
        severity: suggestion.severity || suggestion.impact || 'medium',
        autoFixable: suggestion.autoFixable || false,
        priority: suggestion.priority || index + 1,
        businessImpact: suggestion.businessImpact || 'May improve email performance',
        applied: false
      }));

      // Sort by priority and severity
      suggestions.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity];
        }
        return a.priority - b.priority;
      });

      // Cache the result
      this.cache.set(cacheKey, { data: suggestions, timestamp: Date.now() });
      
      return suggestions;
      
    } catch (error) {
      console.error('Critical analysis error:', error);
      throw error; // Let the component handle the error inline
    }
  }

  static clearCache(): void {
    this.cache.clear();
    console.log('Critical analysis cache cleared');
  }

  static forceRefreshApiKey(): void {
    ApiKeyService.forceRefresh();
    console.log('API key cache refreshed for CriticalEmailAnalysisService');
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }

  static getCategoryIcon(category: string): string {
    switch (category) {
      case 'subject': return 'Target';
      case 'deliverability': return 'Shield';
      case 'cta': return 'Zap';
      case 'mobile': return 'Smartphone';
      case 'compliance': return 'FileCheck';
      case 'accessibility': return 'Eye';
      case 'structure': return 'Layout';
      case 'personalization': return 'User';
      case 'tone': return 'Brain';
      default: return 'Lightbulb';
    }
  }
}
