
import mjml2html from 'mjml';
import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';

interface MJMLCompilationResult {
  html: string;
  errors: any[];
}

class MJMLService {
  private compilationCache = new Map<string, string>();

  /**
   * Compiles MJML to HTML with caching
   */
  public compileToHTML(mjmlContent: string): MJMLCompilationResult {
    const cacheKey = this.generateCacheKey(mjmlContent);
    
    if (this.compilationCache.has(cacheKey)) {
      return {
        html: this.compilationCache.get(cacheKey)!,
        errors: []
      };
    }

    try {
      const result = mjml2html(mjmlContent, {
        keepComments: false,
        beautify: true,
        minify: false
      });

      if (result.errors.length === 0) {
        this.compilationCache.set(cacheKey, result.html);
      }

      return {
        html: result.html,
        errors: result.errors
      };
    } catch (error) {
      console.error('MJML compilation error:', error);
      return {
        html: '',
        errors: [error]
      };
    }
  }

  /**
   * Converts email blocks to MJML structure
   */
  public renderBlockToMJML(block: EmailBlock): string {
    switch (block.type) {
      case 'text':
        return `<mj-text padding="10px 0" font-size="16px" line-height="1.5" color="#333333">${block.content.html || ''}</mj-text>`;
      
      case 'button':
        return `<mj-button href="${block.content.link || '#'}" background-color="#007bff" color="white" border-radius="6px" padding="10px 0" font-size="16px">${block.content.text || 'Button'}</mj-button>`;
      
      case 'image':
        return `<mj-image src="${block.content.src || 'https://via.placeholder.com/400x200?text=Image'}" alt="${block.content.alt || ''}" padding="10px 0" />`;
      
      case 'spacer':
        return `<mj-spacer height="${block.content.height || '20px'}" />`;
      
      case 'divider':
        return `<mj-divider border-width="${block.content.thickness || '1px'}" border-style="${block.content.style || 'solid'}" border-color="${block.content.color || '#ddd'}" padding="10px 0" />`;
      
      case 'columns':
        return this.renderColumnsToMJML(block as ColumnsBlock);
      
      default:
        return '';
    }
  }

  /**
   * Converts column blocks to MJML section structure
   */
  public renderColumnsToMJML(block: ColumnsBlock): string {
    const getColumnWidths = (ratio: string) => {
      const ratioMap: Record<string, string[]> = {
        '100': ['100%'],
        '50-50': ['50%', '50%'],
        '33-67': ['33%', '67%'],
        '67-33': ['67%', '33%'],
        '25-75': ['25%', '75%'],
        '75-25': ['75%', '25%'],
        '33-33-33': ['33.33%', '33.33%', '33.33%'],
        '25-50-25': ['25%', '50%', '25%'],
        '25-25-50': ['25%', '25%', '50%'],
        '50-25-25': ['50%', '25%', '25%'],
        '25-25-25-25': ['25%', '25%', '25%', '25%']
      };
      return ratioMap[ratio] || ['100%'];
    };

    const columnWidths = getColumnWidths(block.content.columnRatio);
    
    const columnsHTML = block.content.columns.map((column, index) => {
      const columnBlocks = column.blocks.map(b => this.renderBlockToMJML(b)).join('');
      return `
        <mj-column width="${columnWidths[index]}" padding="0 8px">
          ${columnBlocks}
        </mj-column>
      `;
    }).join('');

    return `
      <mj-section padding="10px 0">
        ${columnsHTML}
      </mj-section>
    `;
  }

  /**
   * Creates complete MJML template with proper structure
   */
  public createMJMLTemplate(content: string, subject?: string): string {
    return `
      <mjml>
        <mj-head>
          <mj-title>${subject || 'Email Template'}</mj-title>
          <mj-preview>${subject || 'Email Template'}</mj-preview>
          <mj-attributes>
            <mj-all font-family="Arial, sans-serif" />
            <mj-text font-size="16px" color="#333333" line-height="1.5" />
            <mj-button font-size="16px" />
          </mj-attributes>
          <mj-style inline="inline">
            .email-container { max-width: 600px; margin: 0 auto; }
          </mj-style>
        </mj-head>
        <mj-body background-color="#f8fafc">
          <mj-section background-color="#ffffff" padding="0">
            <mj-column>
              <mj-wrapper css-class="email-container">
                ${content}
              </mj-wrapper>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;
  }

  /**
   * Optimizes MJML by removing unnecessary whitespace
   */
  public optimizeMJML(mjmlContent: string): string {
    return mjmlContent
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  /**
   * Validates MJML structure
   */
  public validateMJML(mjmlContent: string): { isValid: boolean; errors: any[] } {
    try {
      const result = mjml2html(mjmlContent, { validationLevel: 'strict' });
      return {
        isValid: result.errors.length === 0,
        errors: result.errors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error]
      };
    }
  }

  private generateCacheKey(content: string): string {
    return btoa(content).substring(0, 32);
  }

  public clearCache(): void {
    this.compilationCache.clear();
  }
}

export const mjmlService = new MJMLService();
