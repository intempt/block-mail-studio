import { EmailBlock, TextBlock, ImageBlock, ButtonBlock, ColumnsBlock, SpacerBlock, DividerBlock } from '@/types/emailBlocks';
import { generateUniqueId } from '@/utils/emailUtils';

export interface ImportResult {
  blocks: EmailBlock[];
  errors: string[];
  warnings: string[];
}

export class HTMLImportService {
  static async importHTML(htmlContent: string): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const blocks: EmailBlock[] = [];

    try {
      // Create a temporary DOM element to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Check for parser errors
      const parserErrors = doc.querySelectorAll('parsererror');
      if (parserErrors.length > 0) {
        errors.push('HTML parsing failed. Please check your HTML syntax.');
        return { blocks: [], errors, warnings };
      }

      // Find the email body content
      const body = doc.body || doc.documentElement;
      const emailContainer = this.findEmailContainer(body);
      
      if (emailContainer) {
        this.parseElement(emailContainer, blocks, warnings);
      } else {
        // Fallback: parse the entire body
        this.parseElement(body, blocks, warnings);
      }

      if (blocks.length === 0) {
        warnings.push('No content blocks were found in the HTML.');
      }

    } catch (error) {
      errors.push(`Import failed: ${error.message}`);
    }

    return { blocks, errors, warnings };
  }

  private static findEmailContainer(body: Element): Element | null {
    // Look for common email container patterns
    const selectors = [
      '[role="main"]',
      '.email-container',
      '.email-content',
      '.container',
      'table[width="600"]',
      'table[width="100%"]',
      'center > table',
      'body > table',
      'body > div'
    ];

    for (const selector of selectors) {
      const element = body.querySelector(selector);
      if (element) return element;
    }

    return body;
  }

  private static parseElement(element: Element, blocks: EmailBlock[], warnings: string[]): void {
    const children = Array.from(element.children);

    for (const child of children) {
      const block = this.convertElementToBlock(child, warnings);
      if (block) {
        blocks.push(block);
      } else if (child.children.length > 0) {
        // Recursively parse nested elements
        this.parseElement(child, blocks, warnings);
      }
    }
  }

  private static convertElementToBlock(element: Element, warnings: string[]): EmailBlock | null {
    const tagName = element.tagName.toLowerCase();
    const computedStyles = this.extractStyles(element);

    switch (tagName) {
      case 'p':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'div':
        if (this.isTextContent(element)) {
          return this.createTextBlock(element, computedStyles);
        }
        break;

      case 'img':
        return this.createImageBlock(element, computedStyles);

      case 'a':
        if (this.isButtonLike(element)) {
          return this.createButtonBlock(element, computedStyles);
        } else if (this.isTextContent(element)) {
          return this.createTextBlock(element, computedStyles);
        }
        break;

      case 'table':
        if (this.isLayoutTable(element)) {
          return this.createColumnsBlock(element, computedStyles, warnings);
        }
        break;

      case 'hr':
        return this.createDividerBlock(element, computedStyles);

      case 'br':
        return this.createSpacerBlock();
    }

    // If element has significant content but doesn't match patterns, create text block
    if (this.hasSignificantContent(element)) {
      return this.createTextBlock(element, computedStyles);
    }

    return null;
  }

  private static isTextContent(element: Element): boolean {
    const textContent = element.textContent?.trim() || '';
    return textContent.length > 0 && !element.querySelector('img, table');
  }

  private static isButtonLike(element: Element): boolean {
    const style = element.getAttribute('style') || '';
    const className = element.className || '';
    
    return (
      style.includes('background-color') ||
      style.includes('padding') ||
      className.includes('button') ||
      className.includes('btn') ||
      element.getAttribute('role') === 'button'
    );
  }

  private static isLayoutTable(element: Element): boolean {
    const rows = element.querySelectorAll('tr');
    if (rows.length !== 1) return false;
    
    const cells = rows[0].querySelectorAll('td, th');
    return cells.length > 1;
  }

  private static hasSignificantContent(element: Element): boolean {
    const textContent = element.textContent?.trim() || '';
    const hasImportantElements = element.querySelector('img, a, button');
    return textContent.length > 10 || Boolean(hasImportantElements);
  }

  private static createTextBlock(element: Element, styles: any): TextBlock {
    const textStyle = this.getTextStyle(element.tagName.toLowerCase());
    
    return {
      id: generateUniqueId(),
      type: 'text',
      content: {
        html: element.innerHTML || element.textContent || '',
        textStyle
      },
      styling: {
        desktop: styles,
        tablet: styles,
        mobile: styles
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createImageBlock(element: Element, styles: any): ImageBlock {
    const img = element as HTMLImageElement;
    
    return {
      id: generateUniqueId(),
      type: 'image',
      content: {
        src: img.src || '',
        alt: img.alt || 'Imported image',
        alignment: 'center',
        width: img.width ? `${img.width}px` : '100%',
        height: img.height ? `${img.height}px` : 'auto'
      },
      styling: {
        desktop: styles,
        tablet: styles,
        mobile: styles
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createButtonBlock(element: Element, styles: any): ButtonBlock {
    const link = element.getAttribute('href') || '#';
    const text = element.textContent?.trim() || 'Button';
    
    return {
      id: generateUniqueId(),
      type: 'button',
      content: {
        text,
        link,
        style: 'solid',
        size: 'medium',
        alignment: 'center'
      },
      styling: {
        desktop: styles,
        tablet: styles,
        mobile: styles
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createColumnsBlock(element: Element, styles: any, warnings: string[]): ColumnsBlock {
    const row = element.querySelector('tr');
    const cells = row ? Array.from(row.querySelectorAll('td, th')) : [];
    
    const columns = cells.map((cell, index) => ({
      id: `col-${index}-${Date.now()}`,
      blocks: [],
      width: `${100 / cells.length}%`
    }));

    return {
      id: generateUniqueId(),
      type: 'columns',
      content: {
        columnCount: cells.length as 1 | 2 | 3 | 4,
        columnRatio: cells.length === 2 ? '50-50' : 'equal',
        columns,
        gap: '16px'
      },
      styling: {
        desktop: styles,
        tablet: styles,
        mobile: styles
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createDividerBlock(element: Element, styles: any): DividerBlock {
    return {
      id: generateUniqueId(),
      type: 'divider',
      content: {
        style: 'solid',
        thickness: '1px',
        color: '#e0e0e0',
        width: '100%',
        alignment: 'center'
      },
      styling: {
        desktop: styles,
        tablet: styles,
        mobile: styles
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createSpacerBlock(): SpacerBlock {
    return {
      id: generateUniqueId(),
      type: 'spacer',
      content: {
        height: '20px'
      },
      styling: {
        desktop: { width: '100%', height: 'auto' },
        tablet: { width: '100%', height: 'auto' },
        mobile: { width: '100%', height: 'auto' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static extractStyles(element: Element): any {
    const style = element.getAttribute('style') || '';
    const styles: any = {
      width: '100%',
      height: 'auto',
      backgroundColor: 'transparent',
      padding: '16px',
      margin: '0'
    };

    // Parse inline styles
    const styleDeclarations = style.split(';');
    for (const declaration of styleDeclarations) {
      const [property, value] = declaration.split(':').map(s => s.trim());
      if (property && value) {
        switch (property) {
          case 'background-color':
            styles.backgroundColor = value;
            break;
          case 'color':
            styles.textColor = value;
            break;
          case 'font-size':
            styles.fontSize = value;
            break;
          case 'font-weight':
            styles.fontWeight = value;
            break;
          case 'text-align':
            styles.textAlign = value;
            break;
          case 'padding':
            styles.padding = value;
            break;
          case 'margin':
            styles.margin = value;
            break;
        }
      }
    }

    return styles;
  }

  private static getTextStyle(tagName: string): 'normal' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6' | 'quote' | 'code' {
    switch (tagName) {
      case 'h1': return 'heading1';
      case 'h2': return 'heading2';
      case 'h3': return 'heading3';
      case 'h4': return 'heading4';
      case 'h5': return 'heading5';
      case 'h6': return 'heading6';
      case 'blockquote': return 'quote';
      case 'code': return 'code';
      default: return 'normal';
    }
  }
}
