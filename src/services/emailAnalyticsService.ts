
interface EmailAnalytics {
  sizeKB: number;
  imageCount: number;
  imageSizeKB: number;
  linkCount: number;
  htmlComplexity: number;
  mobileScore: number;
  deliverabilityScore: number;
  readabilityScore: number;
  performancePrediction: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
}

export class EmailAnalyticsService {
  static analyzeEmail(htmlContent: string, subjectLine: string): EmailAnalytics {
    console.log('Analyzing email content:', htmlContent.length, 'chars');
    
    // Calculate email size
    const sizeKB = Math.round((new Blob([htmlContent]).size) / 1024 * 100) / 100;
    
    // Count images
    const imageMatches = htmlContent.match(/<img[^>]*>/gi) || [];
    const imageCount = imageMatches.length;
    
    // Estimate image sizes (simplified)
    let imageSizeKB = 0;
    imageMatches.forEach(img => {
      const srcMatch = img.match(/src=['"]([^'"]*)['"]/i);
      if (srcMatch && srcMatch[1]) {
        // Estimate based on typical image sizes
        imageSizeKB += 50; // Average 50KB per image
      }
    });
    
    // Count links
    const linkMatches = htmlContent.match(/<a[^>]*href[^>]*>/gi) || [];
    const linkCount = linkMatches.length;
    
    // Calculate HTML complexity
    const tagCount = (htmlContent.match(/<[^>]*>/g) || []).length;
    const htmlComplexity = Math.min(100, Math.round((tagCount / 100) * 100));
    
    // Mobile optimization score
    const hasMobileStyles = htmlContent.includes('@media') || htmlContent.includes('mobile');
    const hasResponsiveImages = htmlContent.includes('max-width: 100%') || htmlContent.includes('width: 100%');
    let mobileScore = 60;
    if (hasMobileStyles) mobileScore += 20;
    if (hasResponsiveImages) mobileScore += 20;
    
    // Deliverability score based on content analysis
    let deliverabilityScore = 85;
    const spamWords = ['free', 'urgent', 'limited time', 'act now', 'click here'];
    const lowerContent = htmlContent.toLowerCase() + subjectLine.toLowerCase();
    spamWords.forEach(word => {
      if (lowerContent.includes(word)) deliverabilityScore -= 5;
    });
    
    // Image to text ratio
    const textLength = htmlContent.replace(/<[^>]*>/g, '').length;
    if (imageCount > 0 && textLength < imageCount * 100) {
      deliverabilityScore -= 10; // Too many images relative to text
    }
    
    // Readability score
    const sentences = textLength / 100; // Rough sentence count
    let readabilityScore = 80;
    if (sentences > 20) readabilityScore -= 10; // Too long
    if (sentences < 5) readabilityScore -= 15; // Too short
    
    // Performance prediction based on content analysis
    let openRate = 25.5; // Industry average
    let clickRate = 3.2;
    let conversionRate = 2.1;
    
    // Subject line impact
    if (subjectLine.length > 5 && subjectLine.length < 50) openRate += 2;
    if (subjectLine.includes('?') || subjectLine.includes('!')) openRate += 1;
    
    // Content impact
    if (linkCount > 0 && linkCount < 5) clickRate += 1;
    if (imageCount > 0 && imageCount < 3) clickRate += 0.5;
    
    // Mobile optimization impact
    if (mobileScore > 80) {
      openRate += 1.5;
      clickRate += 0.8;
    }
    
    return {
      sizeKB,
      imageCount,
      imageSizeKB,
      linkCount,
      htmlComplexity,
      mobileScore: Math.min(100, mobileScore),
      deliverabilityScore: Math.max(0, Math.min(100, deliverabilityScore)),
      readabilityScore: Math.min(100, readabilityScore),
      performancePrediction: {
        openRate: Math.round(openRate * 10) / 10,
        clickRate: Math.round(clickRate * 10) / 10,
        conversionRate: Math.round(conversionRate * 10) / 10
      }
    };
  }
}
