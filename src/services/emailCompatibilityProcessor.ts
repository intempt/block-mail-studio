
interface GmailProcessingOptions {
  stripUnsupportedElements?: boolean;
  inlineStyles?: boolean;
  processImages?: boolean;
  darkModeSupport?: boolean;
}

export class EmailCompatibilityProcessor {
  static processEmailForGmail(
    emailHtml: string, 
    options: GmailProcessingOptions = {}
  ): string {
    let processedHtml = emailHtml;

    // Strip unsupported elements
    if (options.stripUnsupportedElements) {
      processedHtml = processedHtml
        .replace(/<script[^>]*>.*?<\/script>/gis, '')
        .replace(/<style[^>]*>.*?<\/style>/gis, '')
        .replace(/<link[^>]*>/gi, '');
    }

    // Process images
    if (options.processImages) {
      processedHtml = processedHtml.replace(
        /<img([^>]*)>/gi, 
        '<img$1 style="max-width: 100%; height: auto; display: block;">'
      );
    }

    // Add Gmail-specific styling
    processedHtml = `
      <div style="font-family: 'Roboto', Arial, sans-serif; font-size: 14px; line-height: 20px; color: #202124;">
        ${processedHtml}
      </div>
    `;

    return processedHtml;
  }
}
