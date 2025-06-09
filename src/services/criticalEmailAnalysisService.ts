import { ApiKeyService } from './apiKeyService';

export interface CriticalSuggestion {
  id: string;
  title: string;
  reason: string;
  category: 'subject' | 'deliverability' | 'cta' | 'mobile' | 'compliance' | 'accessibility' | 'structure' | 'personalization' | 'tone' | 'content' | 'compatibility';
  type: 'subject' | 'cta' | 'compliance' | 'accessibility' | 'structure' | 'personalization' | 'tone' | 'copy' | 'compatibility';
  current: string;
  suggested: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  autoFixable: boolean;
  priority: number;
  businessImpact?: string;
}

export class CriticalEmailAnalysisService {
  static async analyzeCriticalIssues(htmlContent: string, subjectLine: string): Promise<CriticalSuggestion[]> {
    const suggestions: CriticalSuggestion[] = [];
    
    // Add subject line analysis
    if (subjectLine) {
      const subjectSuggestions = await this.analyzeSubjectLine(subjectLine);
      suggestions.push(...subjectSuggestions);
    }
    
    // Add content analysis
    if (htmlContent) {
      const contentSuggestions = await this.analyzeEmailContent(htmlContent);
      suggestions.push(...contentSuggestions);
    }
    
    return suggestions.sort((a, b) => {
      // Sort by severity first
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      
      // Then by confidence (higher confidence first)
      return b.confidence - a.confidence;
    });
  }
  
  private static async analyzeSubjectLine(subjectLine: string): Promise<CriticalSuggestion[]> {
    const suggestions: CriticalSuggestion[] = [];
    
    // Check for ALL CAPS
    if (subjectLine === subjectLine.toUpperCase() && subjectLine.length > 10) {
      suggestions.push({
        id: 'subject-caps-1',
        title: 'Avoid ALL CAPS in subject line',
        reason: 'Using all capital letters in subject lines can trigger spam filters and appears like shouting to recipients.',
        category: 'subject',
        type: 'subject',
        current: subjectLine,
        suggested: subjectLine.charAt(0).toUpperCase() + subjectLine.slice(1).toLowerCase(),
        severity: 'high',
        impact: 'high',
        confidence: 95,
        autoFixable: true,
        priority: 1,
        businessImpact: 'May improve deliverability and open rates'
      });
    }
    
    // Check for excessive punctuation
    if ((subjectLine.match(/!/g) || []).length > 1 || (subjectLine.match(/\?/g) || []).length > 1) {
      suggestions.push({
        id: 'subject-punct-1',
        title: 'Excessive punctuation detected',
        reason: 'Multiple exclamation or question marks can trigger spam filters.',
        category: 'subject',
        type: 'subject',
        current: subjectLine,
        suggested: subjectLine.replace(/!{2,}/g, '!').replace(/\?{2,}/g, '?'),
        severity: 'medium',
        impact: 'medium',
        confidence: 90,
        autoFixable: true,
        priority: 2,
        businessImpact: 'May improve deliverability'
      });
    }
    
    // Check for spam trigger words
    const spamTriggerWords = ['free', 'guarantee', 'no risk', 'winner', 'cash', 'prize', 'urgent'];
    const lowerSubject = subjectLine.toLowerCase();
    const foundTriggerWords = spamTriggerWords.filter(word => lowerSubject.includes(word));
    
    if (foundTriggerWords.length > 0) {
      suggestions.push({
        id: 'subject-spam-1',
        title: 'Potential spam trigger words',
        reason: `Subject contains words that may trigger spam filters: ${foundTriggerWords.join(', ')}`,
        category: 'subject',
        type: 'subject',
        current: subjectLine,
        suggested: 'Consider rephrasing without spam trigger words',
        severity: 'high',
        impact: 'high',
        confidence: 85,
        autoFixable: false,
        priority: 1,
        businessImpact: 'May significantly improve deliverability'
      });
    }
    
    // Check subject line length
    if (subjectLine.length > 60) {
      suggestions.push({
        id: 'subject-length-1',
        title: 'Subject line too long',
        reason: 'Subject lines over 60 characters may be truncated in some email clients.',
        category: 'subject',
        type: 'subject',
        current: subjectLine,
        suggested: subjectLine.substring(0, 57) + '...',
        severity: 'medium',
        impact: 'medium',
        confidence: 80,
        autoFixable: true,
        priority: 3,
        businessImpact: 'May improve open rates on mobile devices'
      });
    }
    
    return suggestions;
  }
  
  private static async analyzeEmailContent(htmlContent: string): Promise<CriticalSuggestion[]> {
    const suggestions: CriticalSuggestion[] = [];
    
    // Check image alt text
    const imgTags = htmlContent.match(/<img[^>]*>/g) || [];
    const missingAltText = imgTags.filter(img => !img.includes('alt=') || img.includes('alt=""'));
    
    if (missingAltText.length > 0) {
      suggestions.push({
        id: 'accessibility-alt-1',
        title: 'Missing image alt text',
        reason: `${missingAltText.length} images are missing alt text, which is important for accessibility and when images are blocked.`,
        category: 'accessibility',
        type: 'accessibility',
        current: missingAltText[0],
        suggested: missingAltText[0].replace(/<img/, '<img alt="Descriptive text here"'),
        severity: 'medium',
        impact: 'medium',
        confidence: 95,
        autoFixable: false,
        priority: 2,
        businessImpact: 'Improves accessibility and user experience when images are blocked'
      });
    }
    
    // Check for mobile responsiveness
    if (!htmlContent.includes('@media') && !htmlContent.includes('max-width')) {
      suggestions.push({
        id: 'mobile-responsive-1',
        title: 'Not mobile responsive',
        reason: 'No responsive design elements detected. Email may not display well on mobile devices.',
        category: 'mobile',
        type: 'structure',
        current: '<style>/* Your current CSS */</style>',
        suggested: '<style>\n@media (max-width: 600px) {\n  .mobile-responsive {\n    width: 100% !important;\n    display: block !important;\n  }\n}\n</style>',
        severity: 'high',
        impact: 'high',
        confidence: 85,
        autoFixable: false,
        priority: 1,
        businessImpact: 'Over 60% of emails are opened on mobile devices'
      });
    }
    
    // Check for large images
    if (htmlContent.includes('width="600"') || htmlContent.includes('width="700"') || htmlContent.includes('width="800"')) {
      suggestions.push({
        id: 'mobile-image-size-1',
        title: 'Images too large for mobile',
        reason: 'Large fixed-width images may cause horizontal scrolling on mobile devices.',
        category: 'mobile',
        type: 'structure',
        current: 'width="600"',
        suggested: 'width="100%" style="max-width: 600px;"',
        severity: 'medium',
        impact: 'medium',
        confidence: 90,
        autoFixable: true,
        priority: 2,
        businessImpact: 'Improves mobile user experience'
      });
    }
    
    // Check for CTA visibility
    const buttonCount = (htmlContent.match(/<button|<a[^>]*class="[^"]*button/g) || []).length;
    if (buttonCount === 0) {
      suggestions.push({
        id: 'cta-missing-1',
        title: 'No clear call-to-action',
        reason: 'No buttons or clear CTAs detected in the email.',
        category: 'cta',
        type: 'cta',
        current: '',
        suggested: '<a href="#" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Click Here</a>',
        severity: 'high',
        impact: 'high',
        confidence: 80,
        autoFixable: false,
        priority: 1,
        businessImpact: 'CTAs significantly increase conversion rates'
      });
    }
    
    // Check for unsubscribe link
    if (!htmlContent.toLowerCase().includes('unsubscribe')) {
      suggestions.push({
        id: 'compliance-unsub-1',
        title: 'Missing unsubscribe link',
        reason: 'No unsubscribe link detected. This is required for CAN-SPAM compliance.',
        category: 'compliance',
        type: 'compliance',
        current: '',
        suggested: '<p style="font-size: 12px; color: #666;">To unsubscribe from these emails, <a href="#">click here</a>.</p>',
        severity: 'critical',
        impact: 'critical',
        confidence: 95,
        autoFixable: false,
        priority: 0,
        businessImpact: 'Legal requirement in most countries'
      });
    }
    
    return suggestions;
  }
}
