
import { EmailBlock, TextBlock, ImageBlock, ButtonBlock, ColumnsBlock, SpacerBlock, DividerBlock, SocialBlock, VideoBlock } from '@/types/emailBlocks';
import { generateUniqueId } from '@/utils/emailUtils';
import { ImportResult } from './HTMLImportService';

export class MJMLImportService {
  static async importMJML(mjmlContent: string): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const blocks: EmailBlock[] = [];

    try {
      // Parse MJML as XML
      const parser = new DOMParser();
      const doc = parser.parseFromString(mjmlContent, 'application/xml');
      
      // Check for parser errors
      const parserErrors = doc.querySelectorAll('parsererror');
      if (parserErrors.length > 0) {
        errors.push('MJML parsing failed. Please check your MJML syntax.');
        return { blocks: [], errors, warnings };
      }

      // Find the mj-body element
      const mjBody = doc.querySelector('mj-body');
      if (!mjBody) {
        errors.push('No mj-body element found in MJML.');
        return { blocks: [], errors, warnings };
      }

      // Parse MJML elements
      this.parseMJMLElements(mjBody, blocks, warnings);

      if (blocks.length === 0) {
        warnings.push('No content blocks were found in the MJML.');
      }

    } catch (error) {
      errors.push(`MJML import failed: ${error.message}`);
    }

    return { blocks, errors, warnings };
  }

  private static parseMJMLElements(element: Element, blocks: EmailBlock[], warnings: string[]): void {
    const children = Array.from(element.children);

    for (const child of children) {
      const block = this.convertMJMLElementToBlock(child, warnings);
      if (block) {
        if (Array.isArray(block)) {
          blocks.push(...block);
        } else {
          blocks.push(block);
        }
      }
    }
  }

  private static convertMJMLElementToBlock(element: Element, warnings: string[]): EmailBlock | EmailBlock[] | null {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'mj-text':
        return this.createTextBlockFromMJML(element);
      
      case 'mj-image':
        return this.createImageBlockFromMJML(element);
      
      case 'mj-button':
        return this.createButtonBlockFromMJML(element);
      
      case 'mj-section':
        return this.createSectionFromMJML(element, warnings);
      
      case 'mj-column':
        // Columns are handled by sections
        return null;
      
      case 'mj-spacer':
        return this.createSpacerBlockFromMJML(element);
      
      case 'mj-divider':
        return this.createDividerBlockFromMJML(element);
      
      case 'mj-social':
        return this.createSocialBlockFromMJML(element);
      
      case 'mj-hero':
        return this.createHeroBlockFromMJML(element);
      
      case 'mj-raw':
        return this.createTextBlockFromMJMLRaw(element);
      
      default:
        if (element.children.length > 0) {
          const childBlocks: EmailBlock[] = [];
          this.parseMJMLElements(element, childBlocks, warnings);
          return childBlocks;
        }
        return null;
    }
  }

  private static createTextBlockFromMJML(element: Element): TextBlock {
    const content = element.innerHTML || element.textContent || '';
    const attributes = this.extractMJMLAttributes(element);
    
    return {
      id: generateUniqueId(),
      type: 'text',
      content: {
        html: content,
        textStyle: 'normal'
      },
      styling: {
        desktop: this.convertMJMLAttributesToStyles(attributes),
        tablet: this.convertMJMLAttributesToStyles(attributes),
        mobile: this.convertMJMLAttributesToStyles(attributes)
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createImageBlockFromMJML(element: Element): ImageBlock {
    const attributes = this.extractMJMLAttributes(element);
    
    return {
      id: generateUniqueId(),
      type: 'image',
      content: {
        src: attributes.src || '',
        alt: attributes.alt || 'MJML Image',
        alignment: attributes.align || 'center',
        width: attributes.width || '100%',
        height: attributes.height || 'auto',
        link: attributes.href
      },
      styling: {
        desktop: this.convertMJMLAttributesToStyles(attributes),
        tablet: this.convertMJMLAttributesToStyles(attributes),
        mobile: this.convertMJMLAttributesToStyles(attributes)
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createButtonBlockFromMJML(element: Element): ButtonBlock {
    const attributes = this.extractMJMLAttributes(element);
    const text = element.textContent?.trim() || 'Button';
    
    return {
      id: generateUniqueId(),
      type: 'button',
      content: {
        text,
        link: attributes.href || '#',
        style: 'solid',
        size: 'medium',
        alignment: attributes.align || 'center',
        backgroundColor: attributes['background-color'],
        color: attributes.color,
        borderRadius: attributes['border-radius']
      },
      styling: {
        desktop: this.convertMJMLAttributesToStyles(attributes),
        tablet: this.convertMJMLAttributesToStyles(attributes),
        mobile: this.convertMJMLAttributesToStyles(attributes)
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createSectionFromMJML(element: Element, warnings: string[]): ColumnsBlock | EmailBlock[] {
    const columns = Array.from(element.querySelectorAll('mj-column'));
    
    if (columns.length === 0) {
      // Section without columns, parse direct content
      const blocks: EmailBlock[] = [];
      this.parseMJMLElements(element, blocks, warnings);
      return blocks;
    }

    if (columns.length === 1) {
      // Single column section, return content blocks directly
      const blocks: EmailBlock[] = [];
      this.parseMJMLElements(columns[0], blocks, warnings);
      return blocks;
    }

    // Multi-column section, create columns block
    const attributes = this.extractMJMLAttributes(element);
    const columnElements = columns.map((column, index) => {
      const columnBlocks: EmailBlock[] = [];
      this.parseMJMLElements(column, columnBlocks, warnings);
      
      return {
        id: `col-${index}-${Date.now()}`,
        blocks: columnBlocks,
        width: `${100 / columns.length}%`
      };
    });

    return {
      id: generateUniqueId(),
      type: 'columns',
      content: {
        columnCount: columns.length as 1 | 2 | 3 | 4,
        columnRatio: columns.length === 2 ? '50-50' : 'equal',
        columns: columnElements,
        gap: '16px'
      },
      styling: {
        desktop: this.convertMJMLAttributesToStyles(attributes),
        tablet: this.convertMJMLAttributesToStyles(attributes),
        mobile: this.convertMJMLAttributesToStyles(attributes)
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createSpacerBlockFromMJML(element: Element): SpacerBlock {
    const attributes = this.extractMJMLAttributes(element);
    
    return {
      id: generateUniqueId(),
      type: 'spacer',
      content: {
        height: attributes.height || '40px'
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

  private static createDividerBlockFromMJML(element: Element): DividerBlock {
    const attributes = this.extractMJMLAttributes(element);
    
    return {
      id: generateUniqueId(),
      type: 'divider',
      content: {
        style: attributes['border-style'] || 'solid',
        thickness: attributes['border-width'] || '1px',
        color: attributes['border-color'] || '#e0e0e0',
        width: attributes.width || '100%',
        alignment: attributes.align || 'center'
      },
      styling: {
        desktop: this.convertMJMLAttributesToStyles(attributes),
        tablet: this.convertMJMLAttributesToStyles(attributes),
        mobile: this.convertMJMLAttributesToStyles(attributes)
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createSocialBlockFromMJML(element: Element): SocialBlock {
    const socialElements = Array.from(element.querySelectorAll('mj-social-element'));
    const attributes = this.extractMJMLAttributes(element);
    
    const platforms = socialElements.map(el => {
      const elAttrs = this.extractMJMLAttributes(el);
      return {
        name: elAttrs.name || 'social',
        url: elAttrs.href || '#',
        icon: elAttrs.src || '',
        iconStyle: 'color' as const,
        showLabel: false
      };
    });

    return {
      id: generateUniqueId(),
      type: 'social',
      content: {
        platforms,
        layout: attributes.mode === 'vertical' ? 'vertical' : 'horizontal',
        iconSize: attributes['icon-size'] || '32px',
        spacing: '8px',
        alignment: attributes.align || 'center'
      },
      styling: {
        desktop: this.convertMJMLAttributesToStyles(attributes),
        tablet: this.convertMJMLAttributesToStyles(attributes),
        mobile: this.convertMJMLAttributesToStyles(attributes)
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createHeroBlockFromMJML(element: Element): EmailBlock[] {
    // Convert mj-hero to a combination of image and text blocks
    const attributes = this.extractMJMLAttributes(element);
    const blocks: EmailBlock[] = [];

    // Create background image if present
    if (attributes['background-url']) {
      blocks.push({
        id: generateUniqueId(),
        type: 'image',
        content: {
          src: attributes['background-url'],
          alt: 'Hero background',
          alignment: 'center',
          width: '100%',
          height: attributes['background-height'] || '400px'
        },
        styling: {
          desktop: this.convertMJMLAttributesToStyles(attributes),
          tablet: this.convertMJMLAttributesToStyles(attributes),
          mobile: this.convertMJMLAttributesToStyles(attributes)
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      });
    }

    // Add hero content as text block
    const content = element.innerHTML || '';
    if (content.trim()) {
      blocks.push({
        id: generateUniqueId(),
        type: 'text',
        content: {
          html: content,
          textStyle: 'heading1'
        },
        styling: {
          desktop: this.convertMJMLAttributesToStyles(attributes),
          tablet: this.convertMJMLAttributesToStyles(attributes),
          mobile: this.convertMJMLAttributesToStyles(attributes)
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      });
    }

    return blocks;
  }

  private static createTextBlockFromMJMLRaw(element: Element): TextBlock {
    return {
      id: generateUniqueId(),
      type: 'text',
      content: {
        html: element.innerHTML || '',
        textStyle: 'normal'
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

  private static extractMJMLAttributes(element: Element): { [key: string]: string } {
    const attributes: { [key: string]: string } = {};
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }
    
    return attributes;
  }

  private static convertMJMLAttributesToStyles(attributes: { [key: string]: string }): any {
    const styles: any = {
      width: '100%',
      height: 'auto',
      backgroundColor: 'transparent',
      padding: '16px',
      margin: '0'
    };

    // Map MJML attributes to styles
    if (attributes['background-color']) styles.backgroundColor = attributes['background-color'];
    if (attributes.color) styles.textColor = attributes.color;
    if (attributes['font-size']) styles.fontSize = attributes['font-size'];
    if (attributes['font-weight']) styles.fontWeight = attributes['font-weight'];
    if (attributes.align) styles.textAlign = attributes.align;
    if (attributes.padding) styles.padding = attributes.padding;
    if (attributes.margin) styles.margin = attributes.margin;
    if (attributes.width) styles.width = attributes.width;
    if (attributes.height) styles.height = attributes.height;

    return styles;
  }
}
