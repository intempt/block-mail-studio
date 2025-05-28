
import { MJMLService } from './MJMLService';

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    line: number;
    message: string;
    tagName: string;
    severity: 'error' | 'warning';
  }>;
  warnings: string[];
}

export class MJMLValidator {
  static validate(mjmlContent: string): ValidationResult {
    const result = MJMLService.compile(mjmlContent);
    const warnings: string[] = [];

    // Check for email best practices
    this.checkEmailBestPractices(mjmlContent, warnings);

    return {
      isValid: result.errors.length === 0,
      errors: result.errors.map(error => ({
        ...error,
        severity: 'error' as const
      })),
      warnings
    };
  }

  private static checkEmailBestPractices(mjmlContent: string, warnings: string[]): void {
    // Check for missing alt tags
    if (mjmlContent.includes('<mj-image') && !mjmlContent.includes('alt=')) {
      warnings.push('Images should include alt text for accessibility');
    }

    // Check for large images
    const imageMatches = mjmlContent.match(/src="[^"]*"/g);
    if (imageMatches) {
      warnings.push('Verify image file sizes are under 1MB for better deliverability');
    }

    // Check for video elements (not email-safe)
    if (mjmlContent.includes('<video') || mjmlContent.includes('<iframe')) {
      warnings.push('Videos and iframes are not supported in most email clients. Use linked thumbnails instead.');
    }

    // Check for external fonts
    if (mjmlContent.includes('font-family') && mjmlContent.includes('Google Fonts')) {
      warnings.push('External fonts may not render in all email clients. Consider web-safe fallbacks.');
    }

    // Check for dark mode compatibility
    if (!mjmlContent.includes('mj-style') || !mjmlContent.includes('@media (prefers-color-scheme: dark)')) {
      warnings.push('Consider adding dark mode support for better user experience');
    }
  }

  static validateEmailCompatibility(html: string): {
    outlook: boolean;
    gmail: boolean;
    appleMail: boolean;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let outlookCompatible = true;
    let gmailCompatible = true;
    let appleMailCompatible = true;

    // Check for Outlook-specific issues
    if (html.includes('background-image') && !html.includes('<!--[if mso]>')) {
      outlookCompatible = false;
      recommendations.push('Background images need VML fallbacks for Outlook');
    }

    // Check for Gmail-specific issues
    if (html.includes('<style>') && !html.includes('data-embed')) {
      gmailCompatible = false;
      recommendations.push('Gmail strips <style> tags. Use inline styles or data-embed attribute');
    }

    // Check for general compatibility
    if (html.includes('position: absolute') || html.includes('position: fixed')) {
      outlookCompatible = false;
      gmailCompatible = false;
      recommendations.push('Absolute/fixed positioning is not supported in email clients');
    }

    return {
      outlook: outlookCompatible,
      gmail: gmailCompatible,
      appleMail: appleMailCompatible,
      recommendations
    };
  }
}
