
interface ProviderCompatibility {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
  supportedFeatures: string[];
  limitations: string[];
}

interface EmailCompatibilityResult {
  overallCompatibility: number;
  providers: ProviderCompatibility[];
  recommendations: string[];
}

export class EmailProviderCompatibility {
  static analyzeCompatibility(htmlContent: string, subjectLine: string): EmailCompatibilityResult {
    const providers = [
      this.analyzeOutlook(htmlContent),
      this.analyzeGmail(htmlContent),
      this.analyzeAppleMail(htmlContent),
      this.analyzeYahooMail(htmlContent),
      this.analyzeThunderbird(htmlContent)
    ];

    const overallCompatibility = Math.round(
      providers.reduce((sum, provider) => sum + provider.score, 0) / providers.length
    );

    const recommendations = this.generateRecommendations(providers);

    return {
      overallCompatibility,
      providers,
      recommendations
    };
  }

  private static analyzeOutlook(html: string): ProviderCompatibility {
    const issues = [];
    let score = 100;

    // Check for background images without VML fallback
    if (html.includes('background-image') && !html.includes('<!--[if mso]>')) {
      issues.push({
        type: 'Background Images',
        severity: 'high' as const,
        description: 'Background images without VML fallback will not display in Outlook',
        recommendation: 'Add VML fallback code for Outlook compatibility'
      });
      score -= 20;
    }

    // Check for CSS that Outlook doesn't support
    if (html.includes('box-shadow') || html.includes('border-radius')) {
      issues.push({
        type: 'Modern CSS',
        severity: 'medium' as const,
        description: 'Box shadows and border radius are not supported in Outlook',
        recommendation: 'Use table-based borders and avoid modern CSS properties'
      });
      score -= 10;
    }

    // Check for proper table structure
    if (!html.includes('<table') && html.includes('<div')) {
      issues.push({
        type: 'Layout Structure',
        severity: 'high' as const,
        description: 'Div-based layouts may not render correctly in Outlook',
        recommendation: 'Use table-based layouts for better Outlook compatibility'
      });
      score -= 15;
    }

    return {
      name: 'Microsoft Outlook',
      score: Math.max(0, score),
      status: this.getStatusFromScore(score),
      issues,
      supportedFeatures: ['Tables', 'Basic CSS', 'Images', 'Links'],
      limitations: ['Background images', 'Advanced CSS', 'Flexbox', 'Grid']
    };
  }

  private static analyzeGmail(html: string): ProviderCompatibility {
    const issues = [];
    let score = 100;

    // Check for style tags without data-embed
    if (html.includes('<style>') && !html.includes('data-embed')) {
      issues.push({
        type: 'Style Tags',
        severity: 'high' as const,
        description: 'Gmail strips <style> tags unless they have data-embed attribute',
        recommendation: 'Use inline styles or add data-embed attribute to style tags'
      });
      score -= 20;
    }

    // Check for blocked images
    const imageCount = (html.match(/<img/g) || []).length;
    const textLength = html.replace(/<[^>]*>/g, '').length;
    if (imageCount > 0 && textLength < imageCount * 50) {
      issues.push({
        type: 'Image-to-Text Ratio',
        severity: 'medium' as const,
        description: 'Gmail may block images if there\'s too little text content',
        recommendation: 'Balance images with sufficient text content'
      });
      score -= 10;
    }

    // Check for mobile responsiveness
    if (!html.includes('@media') && !html.includes('max-width: 100%')) {
      issues.push({
        type: 'Mobile Optimization',
        severity: 'medium' as const,
        description: 'Email may not display well on mobile Gmail app',
        recommendation: 'Add responsive CSS and mobile-friendly styles'
      });
      score -= 15;
    }

    return {
      name: 'Gmail',
      score: Math.max(0, score),
      status: this.getStatusFromScore(score),
      issues,
      supportedFeatures: ['Inline CSS', 'Responsive design', 'Images', 'Basic animations'],
      limitations: ['Style tags', 'External CSS', 'JavaScript', 'Form elements']
    };
  }

  private static analyzeAppleMail(html: string): ProviderCompatibility {
    const issues = [];
    let score = 100;

    // Check for dark mode support
    if (!html.includes('@media (prefers-color-scheme: dark)')) {
      issues.push({
        type: 'Dark Mode',
        severity: 'low' as const,
        description: 'No dark mode support detected',
        recommendation: 'Add dark mode CSS for better user experience'
      });
      score -= 5;
    }

    // Check for retina images
    if (html.includes('<img') && !html.includes('srcset')) {
      issues.push({
        type: 'Retina Images',
        severity: 'low' as const,
        description: 'Images may appear blurry on high-resolution displays',
        recommendation: 'Use srcset or high-resolution images for retina displays'
      });
      score -= 5;
    }

    return {
      name: 'Apple Mail',
      score: Math.max(0, score),
      status: this.getStatusFromScore(score),
      issues,
      supportedFeatures: ['Advanced CSS', 'Animations', 'Dark mode', 'Retina images'],
      limitations: ['Form elements', 'JavaScript', 'External fonts (limited)']
    };
  }

  private static analyzeYahooMail(html: string): ProviderCompatibility {
    const issues = [];
    let score = 100;

    // Check for web-safe fonts
    const hasWebSafeFonts = html.includes('Arial') || html.includes('Helvetica') || html.includes('Georgia');
    if (!hasWebSafeFonts && html.includes('font-family')) {
      issues.push({
        type: 'Font Compatibility',
        severity: 'medium' as const,
        description: 'Custom fonts may not render correctly in Yahoo Mail',
        recommendation: 'Use web-safe fonts with fallbacks'
      });
      score -= 10;
    }

    // Check for complex CSS
    if (html.includes('transform') || html.includes('animation')) {
      issues.push({
        type: 'Advanced CSS',
        severity: 'medium' as const,
        description: 'Advanced CSS properties may not be supported',
        recommendation: 'Keep CSS simple and use basic styling properties'
      });
      score -= 10;
    }

    return {
      name: 'Yahoo Mail',
      score: Math.max(0, score),
      status: this.getStatusFromScore(score),
      issues,
      supportedFeatures: ['Basic CSS', 'Tables', 'Images', 'Web-safe fonts'],
      limitations: ['Advanced CSS', 'Custom fonts', 'Complex layouts']
    };
  }

  private static analyzeThunderbird(html: string): ProviderCompatibility {
    const issues = [];
    let score = 95; // Generally good compatibility

    // Check for modern HTML5 elements
    if (html.includes('<section>') || html.includes('<article>') || html.includes('<header>')) {
      issues.push({
        type: 'HTML5 Elements',
        severity: 'low' as const,
        description: 'Some HTML5 semantic elements may not be fully supported',
        recommendation: 'Use standard div and table elements for better compatibility'
      });
      score -= 5;
    }

    return {
      name: 'Thunderbird',
      score: Math.max(0, score),
      status: this.getStatusFromScore(score),
      issues,
      supportedFeatures: ['Standard HTML', 'CSS', 'Images', 'Tables'],
      limitations: ['Some HTML5 elements', 'Advanced CSS features']
    };
  }

  private static getStatusFromScore(score: number): 'excellent' | 'good' | 'warning' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'warning';
    return 'poor';
  }

  private static generateRecommendations(providers: ProviderCompatibility[]): string[] {
    const recommendations = [];
    
    // Collect high-priority issues
    const highIssues = providers.flatMap(p => p.issues.filter(i => i.severity === 'high'));
    const mediumIssues = providers.flatMap(p => p.issues.filter(i => i.severity === 'medium'));

    if (highIssues.length > 0) {
      recommendations.push('Address critical compatibility issues first for major email clients');
    }

    if (mediumIssues.length > 0) {
      recommendations.push('Improve styling and layout for better cross-client rendering');
    }

    // Provider-specific recommendations
    const outlookProvider = providers.find(p => p.name === 'Microsoft Outlook');
    if (outlookProvider && outlookProvider.score < 80) {
      recommendations.push('Use table-based layouts and VML fallbacks for Outlook compatibility');
    }

    const gmailProvider = providers.find(p => p.name === 'Gmail');
    if (gmailProvider && gmailProvider.score < 80) {
      recommendations.push('Use inline styles and optimize image-to-text ratio for Gmail');
    }

    return recommendations;
  }
}
