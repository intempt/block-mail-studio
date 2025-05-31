
import { EmailBlock } from '@/types/emailBlocks';
import { ImportResult } from './EmailImportService';
import { generateUniqueId } from '@/utils/blockUtils';

export class HTMLParser {
  private blocks: EmailBlock[] = [];
  private errors: string[] = [];
  private warnings: string[] = [];
  private subject?: string;

  parse(htmlContent: string): ImportResult {
    this.blocks = [];
    this.errors = [];
    this.warnings = [];
    this.subject = undefined;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Extract subject from title if present
      const titleElement = doc.querySelector('title');
      if (titleElement) {
        this.subject = titleElement.textContent?.trim();
      }

      // Find the main content area (usually body or a main table/div)
      const body = doc.body || doc.documentElement;
      this.parseBodyContent(body);

      return {
        blocks: this.blocks,
        subject: this.subject,
        errors: this.errors,
        warnings: this.warnings
      };
    } catch (error) {
      this.errors.push(error instanceof Error ? error.message : 'Unknown parsing error');
      return {
        blocks: [],
        errors: this.errors,
        warnings: this.warnings
      };
    }
  }

  private parseBodyContent(element: Element) {
    const children = Array.from(element.children);
    
    for (const child of children) {
      this.parseElement(child);
    }
  }

  private parseElement(element: Element) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'table':
        this.parseTable(element);
        break;
      case 'div':
        this.parseDiv(element);
        break;
      case 'p':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        this.parseTextElement(element);
        break;
      case 'img':
        this.parseImageElement(element);
        break;
      case 'a':
        this.parseButtonOrLink(element);
        break;
      case 'hr':
        this.parseDividerElement(element);
        break;
      default:
        // For unknown elements, try to parse their children
        if (element.children.length > 0) {
          this.parseBodyContent(element);
        } else if (element.textContent?.trim()) {
          this.parseTextElement(element);
        }
    }
  }

  private parseTable(table: Element) {
    const rows = Array.from(table.querySelectorAll('tr'));
    
    for (const row of rows) {
      const cells = Array.from(row.querySelectorAll('td, th'));
      
      if (cells.length === 1) {
        // Single column - parse cell content
        this.parseCellContent(cells[0]);
      } else if (cells.length > 1) {
        // Multi-column layout
        this.createColumnLayout(cells);
      }
    }
  }

  private parseDiv(div: Element) {
    // Check if this div contains multiple child divs that could be columns
    const childDivs = Array.from(div.children).filter(child => 
      child.tagName.toLowerCase() === 'div' && 
      this.getComputedStyle(child, 'display')?.includes('inline') || 
      this.getComputedStyle(child, 'float') === 'left'
    );

    if (childDivs.length > 1) {
      this.createColumnLayout(childDivs);
    } else {
      // Regular div - parse content
      this.parseBodyContent(div);
    }
  }

  private createColumnLayout(cells: Element[]) {
    const columnElements = cells.map(cell => ({
      id: generateUniqueId(),
      blocks: this.parseCellBlocks(cell),
      width: `${100 / cells.length}%`
    }));

    const columnRatio = Array(cells.length).fill(`${Math.round(100 / cells.length)}`).join('-');

    const layoutBlock: EmailBlock = {
      id: generateUniqueId(),
      type: 'columns',
      content: {
        columnCount: Math.min(cells.length, 4) as 1 | 2 | 3 | 4,
        columnRatio,
        columns: columnElements,
        gap: '16px'
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

    this.blocks.push(layoutBlock);
  }

  private parseCellContent(cell: Element) {
    this.parseBodyContent(cell);
  }

  private parseCellBlocks(cell: Element): EmailBlock[] {
    const originalBlocks = this.blocks.length;
    this.parseBodyContent(cell);
    const newBlocks = this.blocks.slice(originalBlocks);
    this.blocks = this.blocks.slice(0, originalBlocks); // Remove from main array
    return newBlocks;
  }

  private parseTextElement(element: Element) {
    const content = element.innerHTML || element.textContent || '';
    if (!content.trim()) return;

    const styles = this.extractStyles(element);
    const tag = element.tagName.toLowerCase() as 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    const block: EmailBlock = {
      id: generateUniqueId(),
      type: 'text',
      content: { text: content, tag: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) ? tag : 'p' },
      styling: {
        desktop: { ...styles, width: '100%', height: 'auto' },
        tablet: { ...styles, width: '100%', height: 'auto' },
        mobile: { ...styles, width: '100%', height: 'auto' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    this.blocks.push(block);
  }

  private parseImageElement(element: Element) {
    const src = element.getAttribute('src') || '';
    const alt = element.getAttribute('alt') || '';
    const styles = this.extractStyles(element);

    const block: EmailBlock = {
      id: generateUniqueId(),
      type: 'image',
      content: { src, alt },
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

    this.blocks.push(block);
  }

  private parseButtonOrLink(element: Element) {
    const href = element.getAttribute('href') || '#';
    const text = element.textContent || 'Link';
    const styles = this.extractStyles(element);

    // Determine if this looks like a button based on styling
    const isButton = this.looksLikeButton(element, styles);

    const block: EmailBlock = {
      id: generateUniqueId(),
      type: isButton ? 'button' : 'text',
      content: isButton ? { text, url: href } : { text: `<a href="${href}">${text}</a>`, tag: 'p' },
      styling: {
        desktop: { ...styles, width: 'auto', height: 'auto' },
        tablet: { ...styles, width: 'auto', height: 'auto' },
        mobile: { ...styles, width: 'auto', height: 'auto' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    this.blocks.push(block);
  }

  private parseDividerElement(element: Element) {
    const styles = this.extractStyles(element);

    const block: EmailBlock = {
      id: generateUniqueId(),
      type: 'divider',
      content: {},
      styling: {
        desktop: { ...styles, width: '100%', height: 'auto' },
        tablet: { ...styles, width: '100%', height: 'auto' },
        mobile: { ...styles, width: '100%', height: 'auto' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };

    this.blocks.push(block);
  }

  private extractStyles(element: Element): Record<string, string> {
    const styles: Record<string, string> = {};
    const style = element.getAttribute('style');
    
    if (style) {
      const declarations = style.split(';');
      for (const declaration of declarations) {
        const [property, value] = declaration.split(':').map(s => s.trim());
        if (property && value) {
          // Convert CSS properties to our styling format
          switch (property) {
            case 'color':
              styles.color = value;
              break;
            case 'font-size':
              styles.fontSize = value;
              break;
            case 'text-align':
              styles.textAlign = value;
              break;
            case 'background-color':
              styles.backgroundColor = value;
              break;
            case 'width':
              styles.width = value;
              break;
            case 'height':
              styles.height = value;
              break;
            case 'border-color':
              styles.borderColor = value;
              break;
            case 'border-width':
              styles.borderWidth = value;
              break;
          }
        }
      }
    }

    return styles;
  }

  private looksLikeButton(element: Element, styles: Record<string, string>): boolean {
    // Check if element has button-like styling
    const hasBackground = styles.backgroundColor && styles.backgroundColor !== 'transparent';
    const hasPadding = element.getAttribute('style')?.includes('padding');
    const hasButtonText = /button|btn|cta|click/i.test(element.className || '');
    
    return !!(hasBackground || hasPadding || hasButtonText);
  }

  private getComputedStyle(element: Element, property: string): string | null {
    // Simple fallback for style detection
    const style = element.getAttribute('style');
    if (!style) return null;
    
    const match = style.match(new RegExp(`${property}:\\s*([^;]+)`));
    return match ? match[1].trim() : null;
  }
}
