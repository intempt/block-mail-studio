
export interface GmailCompatibilityOptions {
  stripUnsupportedElements: boolean;
  inlineStyles: boolean;
  processImages: boolean;
  darkModeSupport: boolean;
}

export class EmailCompatibilityProcessor {
  private static readonly GMAIL_UNSUPPORTED_ELEMENTS = [
    'script', 'iframe', 'object', 'embed', 'form', 'input', 'select', 'textarea', 'button'
  ];

  private static readonly GMAIL_UNSUPPORTED_CSS = [
    'position: fixed', 'position: absolute', 'float', 'margin', 'z-index'
  ];

  static processEmailForGmail(html: string, options: GmailCompatibilityOptions = {
    stripUnsupportedElements: true,
    inlineStyles: true,
    processImages: true,
    darkModeSupport: true
  }): string {
    let processedHtml = html;

    if (options.stripUnsupportedElements) {
      processedHtml = this.stripUnsupportedElements(processedHtml);
    }

    if (options.inlineStyles) {
      processedHtml = this.inlineStyles(processedHtml);
    }

    if (options.processImages) {
      processedHtml = this.processImages(processedHtml);
    }

    if (options.darkModeSupport) {
      processedHtml = this.addDarkModeSupport(processedHtml);
    }

    return processedHtml;
  }

  private static stripUnsupportedElements(html: string): string {
    let processed = html;
    
    this.GMAIL_UNSUPPORTED_ELEMENTS.forEach(element => {
      const regex = new RegExp(`<${element}[^>]*>.*?<\/${element}>`, 'gi');
      processed = processed.replace(regex, '');
      
      // Also remove self-closing tags
      const selfClosingRegex = new RegExp(`<${element}[^>]*\/?>`, 'gi');
      processed = processed.replace(selfClosingRegex, '');
    });

    return processed;
  }

  private static inlineStyles(html: string): string {
    // Convert common CSS classes to inline styles for Gmail compatibility
    return html
      .replace(/class="text-center"/g, 'style="text-align: center;"')
      .replace(/class="text-left"/g, 'style="text-align: left;"')
      .replace(/class="text-right"/g, 'style="text-align: right;"')
      .replace(/class="font-bold"/g, 'style="font-weight: bold;"')
      .replace(/class="font-normal"/g, 'style="font-weight: normal;"')
      .replace(/class="italic"/g, 'style="font-style: italic;"')
      .replace(/class="underline"/g, 'style="text-decoration: underline;"');
  }

  private static processImages(html: string): string {
    // Add Gmail-compatible image attributes
    return html.replace(/<img([^>]*)>/gi, (match, attributes) => {
      if (!attributes.includes('style=')) {
        attributes += ' style="display: block; max-width: 100%; height: auto;"';
      }
      if (!attributes.includes('alt=')) {
        attributes += ' alt=""';
      }
      return `<img${attributes}>`;
    });
  }

  private static addDarkModeSupport(html: string): string {
    // Add Gmail dark mode meta tags and styles
    const darkModeStyles = `
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        @media (prefers-color-scheme: dark) {
          .dark-mode-text { color: #ffffff !important; }
          .dark-mode-bg { background-color: #1f1f1f !important; }
        }
      </style>
    `;
    
    return html.replace(/<head>/i, `<head>${darkModeStyles}`);
  }

  static getGmailPreviewSize(device: 'desktop' | 'mobile'): { width: number; height: number } {
    return device === 'desktop' 
      ? { width: 640, height: 480 }
      : { width: 375, height: 667 };
  }
}
