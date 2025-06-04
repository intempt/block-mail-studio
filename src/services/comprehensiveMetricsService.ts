
export interface ComprehensiveEmailMetrics {
  // Content Analysis
  wordCount: number;
  characterCount: number;
  readTimeMinutes: number;
  paragraphCount: number;
  sentenceCount: number;
  
  // Media & Links
  imageCount: number;
  linkCount: number;
  ctaCount: number;
  videoCount: number;
  
  // Technical Metrics
  sizeKB: number;
  loadTimeEstimate: 'Fast' | 'Good' | 'Slow';
  htmlComplexity: number;
  cssInlineCount: number;
  
  // Mobile & Accessibility
  mobileScore: number;
  accessibilityScore: number;
  contrastRatio: number;
  altTextCoverage: number;
  
  // Deliverability Factors
  deliverabilityScore: number;
  spamScore: number;
  authenticationScore: number;
  reputationIndicators: number;
  
  // Subject Line Analysis
  subjectLineScore: number;
  subjectLineLength: number;
  subjectLineWordCount: number;
  
  // Engagement Predictions
  personalizationLevel: number;
  engagementPrediction: number;
  conversionPrediction: number;
  unsubscribeRisk: number;
}

export class ComprehensiveMetricsService {
  static calculateMetrics(emailHTML: string, subjectLine: string): ComprehensiveEmailMetrics {
    // Content Analysis
    const textContent = emailHTML.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = emailHTML.match(/<p[^>]*>.*?<\/p>/gi) || [];
    
    // Media & Link Analysis
    const images = emailHTML.match(/<img[^>]*>/gi) || [];
    const links = emailHTML.match(/<a[^>]*href[^>]*>/gi) || [];
    const buttons = emailHTML.match(/<button[^>]*>|<input[^>]*type=['"]submit['"][^>]*>|<a[^>]*class[^>]*btn[^>]*>/gi) || [];
    const videos = emailHTML.match(/<video[^>]*>|<iframe[^>]*youtube|<iframe[^>]*vimeo/gi) || [];
    
    // Technical Analysis
    const sizeKB = Math.round((new Blob([emailHTML]).size) / 1024 * 100) / 100;
    const htmlTags = emailHTML.match(/<[^>]*>/g) || [];
    const inlineStyles = emailHTML.match(/style=['"][^'"]*['"]/gi) || [];
    
    // Accessibility Analysis
    const imagesWithAlt = emailHTML.match(/<img[^>]*alt=['"][^'"]+['"]/gi) || [];
    const altTextCoverage = images.length > 0 ? (imagesWithAlt.length / images.length) * 100 : 100;
    
    // Subject Line Analysis
    const subjectWords = subjectLine.trim().split(/\s+/).filter(w => w.length > 0);
    const subjectScore = this.calculateSubjectLineScore(subjectLine);
    
    // Spam Indicators
    const spamWords = ['free', 'urgent', 'limited time', 'act now', 'click here', 'guaranteed', 'earn money', 'no cost'];
    const spamWordCount = spamWords.reduce((count, word) => {
      return count + (textContent.toLowerCase().match(new RegExp(word, 'g')) || []).length;
    }, 0);
    
    // Deliverability Factors
    const hasUnsubscribe = emailHTML.toLowerCase().includes('unsubscribe');
    const hasViewInBrowser = emailHTML.toLowerCase().includes('view') && emailHTML.toLowerCase().includes('browser');
    const hasValidStructure = emailHTML.includes('<html') && emailHTML.includes('<body');
    
    // Personalization Detection
    const personalizationTokens = emailHTML.match(/\{\{[^}]+\}\}|\[[^\]]+\]|%[^%]+%/g) || [];
    const hasDynamicContent = personalizationTokens.length > 0;
    
    return {
      // Content Analysis
      wordCount: words.length,
      characterCount: textContent.length,
      readTimeMinutes: Math.max(1, Math.ceil(words.length / 200)),
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      
      // Media & Links
      imageCount: images.length,
      linkCount: links.length,
      ctaCount: Math.max(buttons.length, links.length > 0 ? 1 : 0),
      videoCount: videos.length,
      
      // Technical Metrics
      sizeKB,
      loadTimeEstimate: sizeKB < 100 ? 'Fast' : sizeKB < 300 ? 'Good' : 'Slow',
      htmlComplexity: Math.min(100, (htmlTags.length / 50) * 100),
      cssInlineCount: inlineStyles.length,
      
      // Mobile & Accessibility
      mobileScore: this.calculateMobileScore(emailHTML),
      accessibilityScore: Math.round(altTextCoverage),
      contrastRatio: 4.5, // Default good ratio
      altTextCoverage: Math.round(altTextCoverage),
      
      // Deliverability Factors
      deliverabilityScore: this.calculateDeliverabilityScore(emailHTML, hasUnsubscribe, hasViewInBrowser, hasValidStructure, spamWordCount),
      spamScore: Math.min(50, spamWordCount * 5),
      authenticationScore: 85, // Default good score
      reputationIndicators: 90, // Default good score
      
      // Subject Line Analysis
      subjectLineScore: subjectScore,
      subjectLineLength: subjectLine.length,
      subjectLineWordCount: subjectWords.length,
      
      // Engagement Predictions
      personalizationLevel: hasDynamicContent ? 80 : 40,
      engagementPrediction: this.calculateEngagementPrediction(subjectScore, altTextCoverage, spamWordCount),
      conversionPrediction: this.calculateConversionPrediction(buttons.length, links.length),
      unsubscribeRisk: this.calculateUnsubscribeRisk(spamWordCount, words.length)
    };
  }

  private static calculateSubjectLineScore(subject: string): number {
    const length = subject.length;
    const words = subject.split(/\s+/).length;
    
    let score = 50; // Base score
    
    // Optimal length (30-50 characters)
    if (length >= 30 && length <= 50) {
      score += 30;
    } else if (length >= 20 && length < 30) {
      score += 20;
    } else if (length > 50 && length <= 70) {
      score += 10;
    }
    
    // Word count (4-8 words optimal)
    if (words >= 4 && words <= 8) {
      score += 20;
    } else if (words >= 2 && words < 4) {
      score += 10;
    }
    
    // Avoid spam words
    const spamWords = ['free', 'urgent', 'act now', 'limited time'];
    const hasSpamWords = spamWords.some(word => subject.toLowerCase().includes(word));
    if (!hasSpamWords) {
      score += 10;
    } else {
      score -= 20;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateMobileScore(html: string): number {
    let score = 60; // Base score
    
    // Check for viewport meta tag
    if (html.includes('viewport')) score += 15;
    
    // Check for responsive images
    if (html.includes('max-width: 100%') || html.includes('width: 100%')) score += 10;
    
    // Check for media queries
    if (html.includes('@media')) score += 15;
    
    // Penalize fixed widths
    const fixedWidths = html.match(/width:\s*\d+px/gi) || [];
    score -= Math.min(20, fixedWidths.length * 2);
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateDeliverabilityScore(
    html: string, 
    hasUnsubscribe: boolean, 
    hasViewInBrowser: boolean, 
    hasValidStructure: boolean, 
    spamWordCount: number
  ): number {
    let score = 70; // Base score
    
    if (hasUnsubscribe) score += 10;
    if (hasViewInBrowser) score += 5;
    if (hasValidStructure) score += 10;
    
    // Penalize spam words
    score -= spamWordCount * 5;
    
    // Check for proper email headers
    if (html.includes('DOCTYPE')) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateEngagementPrediction(subjectScore: number, accessibilityScore: number, spamWordCount: number): number {
    const baseRate = 25; // Industry average open rate
    
    let prediction = baseRate;
    
    // Subject line impact
    prediction += (subjectScore - 50) * 0.3;
    
    // Accessibility impact
    prediction += (accessibilityScore - 70) * 0.1;
    
    // Spam penalty
    prediction -= spamWordCount * 2;
    
    return Math.max(5, Math.min(50, Math.round(prediction * 10) / 10));
  }

  private static calculateConversionPrediction(buttonCount: number, linkCount: number): number {
    const baseRate = 2; // Industry average
    
    let prediction = baseRate;
    
    // CTA impact
    if (buttonCount > 0) prediction += buttonCount * 0.5;
    if (linkCount > 0 && linkCount <= 3) prediction += 0.5;
    
    // Too many CTAs penalty
    if (buttonCount > 3) prediction -= 0.5;
    if (linkCount > 5) prediction -= 0.3;
    
    return Math.max(0.5, Math.min(10, Math.round(prediction * 10) / 10));
  }

  private static calculateUnsubscribeRisk(spamWordCount: number, wordCount: number): number {
    let risk = 5; // Base risk percentage
    
    // Spam words increase risk
    risk += spamWordCount * 2;
    
    // Very short or very long emails increase risk
    if (wordCount < 50) risk += 3;
    if (wordCount > 1000) risk += 2;
    
    return Math.max(1, Math.min(25, risk));
  }

  static getMetricStatus(value: number, thresholds: { good: number; warning: number }): 'good' | 'warning' | 'poor' {
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.warning) return 'warning';
    return 'poor';
  }

  static getMetricColor(value: number, type: 'score' | 'count' | 'size' | 'time'): string {
    switch (type) {
      case 'score':
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-yellow-600';
        return 'text-red-600';
      case 'count':
        return 'text-blue-600';
      case 'size':
        if (value < 100) return 'text-green-600';
        if (value < 300) return 'text-yellow-600';
        return 'text-red-600';
      case 'time':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  }
}
