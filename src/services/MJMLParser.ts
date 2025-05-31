
import { EmailBlock } from '@/types/emailBlocks';
import { ImportResult } from './EmailImportService';
import { generateUniqueId } from '@/utils/blockUtils';

export class MJMLParser {
  private blocks: EmailBlock[] = [];
  private errors: string[] = [];
  private warnings: string[] = [];
  private subject?: string;

  parse(mjmlContent: string): ImportResult {
    this.blocks = [];
    this.errors = [];
    this.warnings = [];
    this.subject = undefined;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(mjmlContent, 'text/xml');
      
      if (doc.documentElement.nodeName === 'parsererror') {
        throw new Error('Invalid MJML syntax');
      }

      // Extract subject from mj-title if present
      const titleElement = doc.querySelector('mj-title');
      if (titleElement) {
        this.subject = titleElement.textContent?.trim();
      }

      // Parse mj-body content
      const body = doc.querySelector('mj-body');
      if (!body) {
        throw new Error('No mj-body found in MJML');
      }

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

  private parseBodyContent(body: Element) {
    const children = Array.from(body.children);
    
    for (const child of children) {
      switch (child.nodeName) {
        case 'mj-section':
          this.parseSection(child);
          break;
        case 'mj-text':
          this.parseTextBlock(child);
          break;
        case 'mj-image':
          this.parseImageBlock(child);
          break;
        case 'mj-button':
          this.parseButtonBlock(child);
          break;
        case 'mj-spacer':
          this.parseSpacerBlock(child);
          break;
        case 'mj-divider':
          this.parseDividerBlock(child);
          break;
        default:
          this.warnings.push(`Unsupported MJML element: ${child.nodeName}`);
      }
    }
  }

  private parseSection(section: Element) {
    const columns = Array.from(section.children).filter(child => child.nodeName === 'mj-column');
    
    if (columns.length === 1) {
      // Single column - parse children directly
      this.parseColumnContent(columns[0]);
    } else if (columns.length > 1) {
      // Multi-column layout
      const columnRatio = this.calculateColumnRatio(columns);
      const columnElements = columns.map(col => ({
        id: generateUniqueId(),
        blocks: this.parseColumnBlocks(col),
        width: `${100 / columns.length}%`
      }));

      const layoutBlock: EmailBlock = {
        id: generateUniqueId(),
        type: 'columns',
        content: {
          columnCount: columns.length as 1 | 2 | 3 | 4,
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
  }

  private parseColumnContent(column: Element) {
    const children = Array.from(column.children);
    
    for (const child of children) {
      switch (child.nodeName) {
        case 'mj-text':
          this.parseTextBlock(child);
          break;
        case 'mj-image':
          this.parseImageBlock(child);
          break;
        case 'mj-button':
          this.parseButtonBlock(child);
          break;
        case 'mj-spacer':
          this.parseSpacerBlock(child);
          break;
        case 'mj-divider':
          this.parseDividerBlock(child);
          break;
        default:
          this.warnings.push(`Unsupported column element: ${child.nodeName}`);
      }
    }
  }

  private parseColumnBlocks(column: Element): EmailBlock[] {
    const columnBlocks: EmailBlock[] = [];
    const children = Array.from(column.children);
    
    for (const child of children) {
      const block = this.parseElementToBlock(child);
      if (block) {
        columnBlocks.push(block);
      }
    }
    
    return columnBlocks;
  }

  private parseElementToBlock(element: Element): EmailBlock | null {
    switch (element.nodeName) {
      case 'mj-text':
        return this.createTextBlock(element);
      case 'mj-image':
        return this.createImageBlock(element);
      case 'mj-button':
        return this.createButtonBlock(element);
      case 'mj-spacer':
        return this.createSpacerBlock(element);
      case 'mj-divider':
        return this.createDividerBlock(element);
      default:
        this.warnings.push(`Unsupported element: ${element.nodeName}`);
        return null;
    }
  }

  private parseTextBlock(element: Element) {
    const block = this.createTextBlock(element);
    this.blocks.push(block);
  }

  private createTextBlock(element: Element): EmailBlock {
    const content = element.innerHTML || element.textContent || '';
    const fontSize = element.getAttribute('font-size') || '14px';
    const color = element.getAttribute('color') || '#000000';
    const align = element.getAttribute('align') || 'left';

    return {
      id: generateUniqueId(),
      type: 'text',
      content: { text: content, tag: 'p' },
      styling: {
        desktop: { 
          fontSize,
          color,
          textAlign: align,
          width: '100%',
          height: 'auto'
        },
        tablet: { 
          fontSize,
          color,
          textAlign: align,
          width: '100%',
          height: 'auto'
        },
        mobile: { 
          fontSize,
          color,
          textAlign: align,
          width: '100%',
          height: 'auto'
        }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private parseImageBlock(element: Element) {
    const block = this.createImageBlock(element);
    this.blocks.push(block);
  }

  private createImageBlock(element: Element): EmailBlock {
    const src = element.getAttribute('src') || '';
    const alt = element.getAttribute('alt') || '';
    const width = element.getAttribute('width') || 'auto';
    const height = element.getAttribute('height') || 'auto';

    return {
      id: generateUniqueId(),
      type: 'image',
      content: { src, alt },
      styling: {
        desktop: { width, height },
        tablet: { width, height },
        mobile: { width, height }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private parseButtonBlock(element: Element) {
    const block = this.createButtonBlock(element);
    this.blocks.push(block);
  }

  private createButtonBlock(element: Element): EmailBlock {
    const text = element.textContent || 'Button';
    const href = element.getAttribute('href') || '#';
    const backgroundColor = element.getAttribute('background-color') || '#007bff';
    const color = element.getAttribute('color') || '#ffffff';

    return {
      id: generateUniqueId(),
      type: 'button',
      content: { text, url: href },
      styling: {
        desktop: { 
          backgroundColor,
          color,
          width: 'auto',
          height: 'auto'
        },
        tablet: { 
          backgroundColor,
          color,
          width: 'auto',
          height: 'auto'
        },
        mobile: { 
          backgroundColor,
          color,
          width: 'auto',
          height: 'auto'
        }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private parseSpacerBlock(element: Element) {
    const block = this.createSpacerBlock(element);
    this.blocks.push(block);
  }

  private createSpacerBlock(element: Element): EmailBlock {
    const height = element.getAttribute('height') || '20px';

    return {
      id: generateUniqueId(),
      type: 'spacer',
      content: { height },
      styling: {
        desktop: { height, width: '100%' },
        tablet: { height, width: '100%' },
        mobile: { height, width: '100%' }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private parseDividerBlock(element: Element) {
    const block = this.createDividerBlock(element);
    this.blocks.push(block);
  }

  private createDividerBlock(element: Element): EmailBlock {
    const borderColor = element.getAttribute('border-color') || '#cccccc';
    const borderWidth = element.getAttribute('border-width') || '1px';

    return {
      id: generateUniqueId(),
      type: 'divider',
      content: {},
      styling: {
        desktop: { 
          borderColor,
          borderWidth,
          width: '100%',
          height: 'auto'
        },
        tablet: { 
          borderColor,
          borderWidth,
          width: '100%',
          height: 'auto'
        },
        mobile: { 
          borderColor,
          borderWidth,
          width: '100%',
          height: 'auto'
        }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private calculateColumnRatio(columns: Element[]): string {
    const count = columns.length;
    const equal = `${100 / count}`.split('.')[0];
    return Array(count).fill(equal).join('-');
  }
}
