
import { EmailProviderCompatibility } from './EmailProviderCompatibility';
import { CriticalSuggestion } from './criticalEmailAnalysisService';

interface ProviderCompatibilityMetrics {
  outlook: number;
  gmail: number;
  appleMail: number;
  yahooMail: number;
  thunderbird: number;
  overall: number;
}

interface ProviderIssueWithFix {
  provider: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  autoFixable: boolean;
  fixCode?: string;
}

export class EmailProviderCompatibilityEnhanced {
  static getCompatibilityMetrics(htmlContent: string, subjectLine: string): ProviderCompatibilityMetrics {
    const analysis = EmailProviderCompatibility.analyzeCompatibility(htmlContent, subjectLine);
    
    const providerScores = analysis.providers.reduce((acc, provider) => {
      switch (provider.name) {
        case 'Microsoft Outlook':
          acc.outlook = provider.score;
          break;
        case 'Gmail':
          acc.gmail = provider.score;
          break;
        case 'Apple Mail':
          acc.appleMail = provider.score;
          break;
        case 'Yahoo Mail':
          acc.yahooMail = provider.score;
          break;
        case 'Thunderbird':
          acc.thunderbird = provider.score;
          break;
      }
      return acc;
    }, { outlook: 0, gmail: 0, appleMail: 0, yahooMail: 0, thunderbird: 0 } as Omit<ProviderCompatibilityMetrics, 'overall'>);

    return {
      ...providerScores,
      overall: analysis.overallCompatibility
    };
  }

  static getCompatibilitySuggestions(htmlContent: string, subjectLine: string): CriticalSuggestion[] {
    const analysis = EmailProviderCompatibility.analyzeCompatibility(htmlContent, subjectLine);
    const suggestions: CriticalSuggestion[] = [];

    analysis.providers.forEach((provider, providerIndex) => {
      provider.issues.forEach((issue, issueIndex) => {
        const autoFixInfo = this.getAutoFixInfo(issue.type, htmlContent);
        
        suggestions.push({
          id: `provider-${providerIndex}-${issueIndex}`,
          title: `${provider.name}: ${issue.type}`,
          reason: issue.description,
          category: 'compatibility',
          type: 'compatibility',
          current: autoFixInfo.current || '',
          suggested: autoFixInfo.suggested || '',
          severity: issue.severity,
          impact: issue.severity,
          confidence: this.getConfidenceScore(issue.type),
          autoFixable: autoFixInfo.autoFixable,
          priority: issue.severity === 'high' ? 1 : issue.severity === 'medium' ? 2 : 3,
          businessImpact: `${provider.name} compatibility: ${issue.recommendation}`
        });
      });
    });

    return suggestions.sort((a, b) => a.priority - b.priority);
  }

  private static getAutoFixInfo(issueType: string, htmlContent: string): {
    autoFixable: boolean;
    current?: string;
    suggested?: string;
  } {
    switch (issueType) {
      case 'Background Images':
        if (htmlContent.includes('background-image') && !htmlContent.includes('<!--[if mso]>')) {
          return {
            autoFixable: true,
            current: 'background-image without VML fallback',
            suggested: 'background-image with VML fallback for Outlook'
          };
        }
        break;
      
      case 'Modern CSS':
        const modernCssMatch = htmlContent.match(/(box-shadow|border-radius):[^;]+;/);
        if (modernCssMatch) {
          return {
            autoFixable: true,
            current: modernCssMatch[0],
            suggested: '/* Modern CSS removed for Outlook compatibility */'
          };
        }
        break;
      
      case 'Style Tags':
        const styleMatch = htmlContent.match(/<style[^>]*>.*?<\/style>/s);
        if (styleMatch && !styleMatch[0].includes('data-embed')) {
          return {
            autoFixable: true,
            current: styleMatch[0],
            suggested: styleMatch[0].replace('<style', '<style data-embed')
          };
        }
        break;
      
      case 'Layout Structure':
        if (!htmlContent.includes('<table') && htmlContent.includes('<div')) {
          return {
            autoFixable: false, // Complex transformation
            current: 'Div-based layout',
            suggested: 'Table-based layout recommended'
          };
        }
        break;
    }

    return { autoFixable: false };
  }

  private static getConfidenceScore(issueType: string): number {
    const confidenceMap: Record<string, number> = {
      'Background Images': 95,
      'Modern CSS': 90,
      'Style Tags': 85,
      'Layout Structure': 75,
      'Image-to-Text Ratio': 70,
      'Mobile Optimization': 80,
      'Dark Mode': 60,
      'Retina Images': 65,
      'Font Compatibility': 85,
      'Advanced CSS': 80,
      'HTML5 Elements': 70
    };

    return confidenceMap[issueType] || 75;
  }

  static getMetricColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
}
