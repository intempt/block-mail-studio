
import { EmailBlock, TextContent, ImageContent, ButtonContent, SpacerContent, DividerContent } from '@/types/emailBlocks';
import { generateUniqueId } from '@/utils/blockUtils';

export interface ImportResult {
  blocks: EmailBlock[];
  subject?: string;
  globalStyles?: any;
  errors: string[];
  warnings: string[];
}

export class HTMLImportService {
  static async importHTML(htmlContent: string): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const blocks: EmailBlock[] = [];
    let titleElement: HTMLElement | null = null;

    try {
      // Create a temporary DOM element to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;

      // Extract subject from title tag if present
      titleElement = tempDiv.querySelector('title');

      // Find the main content area (body or main container)
      const bodyElement = tempDiv.querySelector('body') || tempDiv;
      
      // Parse elements and convert to blocks
      const parsedBlocks = this.parseElements(bodyElement.children);
      blocks.push(...parsedBlocks);

      if (blocks.length === 0) {
        warnings.push('No recognizable email content found');
      }

    } catch (error: any) {
      errors.push(`Failed to parse HTML: ${error.message}`);
    }

    return {
      blocks,
      subject: titleElement?.textContent || undefined,
      errors,
      warnings
    };
  }

  private static parseElements(elements: HTMLCollection): EmailBlock[] {
    const blocks: EmailBlock[] = [];

    Array.from(elements).forEach((element) => {
      const block = this.elementToBlock(element as HTMLElement);
      if (block) {
        blocks.push(block);
      }
    });

    return blocks;
  }

  private static elementToBlock(element: HTMLElement): EmailBlock | null {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'p':
      case 'div':
        if (element.textContent?.trim()) {
          return this.createTextBlock(element);
        }
        break;

      case 'img':
        return this.createImageBlock(element as HTMLImageElement);

      case 'a':
        if (element.querySelector('img')) {
          // Image link - treat as image block
          const img = element.querySelector('img') as HTMLImageElement;
          return this.createImageBlock(img, element.getAttribute('href') || undefined);
        } else if (element.textContent?.trim()) {
          // Button-like link
          return this.createButtonBlock(element as HTMLAnchorElement);
        }
        break;

      case 'button':
        return this.createButtonBlock(element);

      case 'hr':
        return this.createDividerBlock(element);

      case 'br':
        return this.createSpacerBlock('20px');

      case 'table':
        // Handle tables as HTML blocks for now
        return this.createHtmlBlock(element);

      default:
        // Check if element has nested content
        if (element.children.length > 0) {
          // Recursively parse nested elements
          const nestedBlocks = this.parseElements(element.children);
          return nestedBlocks[0] || null; // Return first nested block
        }
        break;
    }

    return null;
  }

  private static createTextBlock(element: HTMLElement): EmailBlock {
    const textContent: TextContent = {
      html: element.innerHTML,
      textStyle: this.getTextStyle(element.tagName.toLowerCase()),
      placeholder: 'Edit text...'
    };

    const styles = window.getComputedStyle(element);

    return {
      id: generateUniqueId(),
      type: 'text',
      content: textContent,
      styling: {
        desktop: {
          width: '100%',
          height: 'auto',
          fontSize: styles.fontSize || '14px',
          fontFamily: styles.fontFamily || 'Arial, sans-serif',
          textColor: styles.color || '#333333',
          textAlign: styles.textAlign || 'left',
          fontWeight: styles.fontWeight || '400',
          lineHeight: styles.lineHeight || '1.6',
          padding: '10px 25px',
          backgroundColor: styles.backgroundColor || 'transparent'
        },
        tablet: {
          width: '100%',
          height: 'auto',
          fontSize: styles.fontSize || '14px',
          fontFamily: styles.fontFamily || 'Arial, sans-serif',
          textColor: styles.color || '#333333',
          textAlign: styles.textAlign || 'left',
          fontWeight: styles.fontWeight || '400',
          lineHeight: styles.lineHeight || '1.6',
          padding: '10px 25px',
          backgroundColor: styles.backgroundColor || 'transparent'
        },
        mobile: {
          width: '100%',
          height: 'auto',
          fontSize: styles.fontSize || '14px',
          fontFamily: styles.fontFamily || 'Arial, sans-serif',
          textColor: styles.color || '#333333',
          textAlign: styles.textAlign || 'left',
          fontWeight: styles.fontWeight || '400',
          lineHeight: styles.lineHeight || '1.6',
          padding: '10px 25px',
          backgroundColor: styles.backgroundColor || 'transparent'
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

  private static createImageBlock(img: HTMLImageElement, link?: string): EmailBlock {
    const imageContent: ImageContent = {
      src: img.src || 'https://via.placeholder.com/400x200?text=Image',
      alt: img.alt || 'Image',
      alignment: this.getAlignment(img.style.textAlign || 'center'),
      width: img.width ? `${img.width}px` : '100%',
      height: img.height ? `${img.height}px` : undefined,
      link: link
    };

    return {
      id: generateUniqueId(),
      type: 'image',
      content: imageContent,
      styling: {
        desktop: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
        },
        tablet: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
        },
        mobile: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
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

  private static createButtonBlock(element: HTMLElement): EmailBlock {
    const href = element.getAttribute('href') || '#';
    const text = element.textContent?.trim() || 'Button';
    
    const buttonContent: ButtonContent = {
      text: text,
      link: href,
      style: 'solid',
      size: 'medium',
      alignment: 'center'
    };

    return {
      id: generateUniqueId(),
      type: 'button',
      content: buttonContent,
      styling: {
        desktop: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
        },
        tablet: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
        },
        mobile: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
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

  private static createSpacerBlock(height: string): EmailBlock {
    const spacerContent: SpacerContent = {
      height: height
    };

    return {
      id: generateUniqueId(),
      type: 'spacer',
      content: spacerContent,
      styling: {
        desktop: { width: '100%', height: height },
        tablet: { width: '100%', height: height },
        mobile: { width: '100%', height: height }
      },
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      }
    };
  }

  private static createDividerBlock(element: HTMLElement): EmailBlock {
    const dividerContent: DividerContent = {
      style: 'solid',
      thickness: '1px',
      color: '#e0e0e0',
      width: '100%',
      alignment: 'center'
    };

    return {
      id: generateUniqueId(),
      type: 'divider',
      content: dividerContent,
      styling: {
        desktop: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
        },
        tablet: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
        },
        mobile: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
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

  private static createHtmlBlock(element: HTMLElement): EmailBlock {
    return {
      id: generateUniqueId(),
      type: 'html',
      content: {
        html: element.outerHTML
      },
      styling: {
        desktop: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
        },
        tablet: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
        },
        mobile: {
          width: '100%',
          height: 'auto',
          padding: '10px 25px',
          backgroundColor: 'transparent'
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

  private static getTextStyle(tagName: string): TextContent['textStyle'] {
    switch (tagName) {
      case 'h1': return 'heading1';
      case 'h2': return 'heading2';
      case 'h3': return 'heading3';
      case 'h4': return 'heading4';
      case 'h5': return 'heading5';
      case 'h6': return 'heading6';
      default: return 'normal';
    }
  }

  private static getAlignment(align: string): 'left' | 'center' | 'right' {
    switch (align) {
      case 'center': return 'center';
      case 'right': return 'right';
      default: return 'left';
    }
  }
}
