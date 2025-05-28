
import { EmailBlock } from '@/types/emailBlocks';
import { MJMLBlockFactory } from './MJMLBlockFactory';
import { MJMLService } from './MJMLService';

export interface EmailTemplate {
  subject: string;
  preheader?: string;
  blocks: EmailBlock[];
  globalStyles?: string;
  settings?: {
    width: string;
    backgroundColor: string;
    fontFamily: string;
  };
}

export class MJMLTemplateGenerator {
  static generateMJML(template: EmailTemplate): string {
    const { blocks, globalStyles, settings } = template;
    
    const bodyContent = this.generateBodyContent(blocks);
    const customStyles = this.generateCustomStyles(globalStyles, settings);
    
    return MJMLService.wrapInTemplate(bodyContent, customStyles);
  }

  static generateHTML(template: EmailTemplate): { html: string; errors: any[] } {
    const mjmlContent = this.generateMJML(template);
    const result = MJMLService.compile(mjmlContent);
    
    return {
      html: result.html,
      errors: result.errors
    };
  }

  private static generateBodyContent(blocks: EmailBlock[]): string {
    if (blocks.length === 0) {
      return `
        <mj-section>
          <mj-column>
            <mj-text align="center" color="#666666">
              <h2>Your email content will appear here</h2>
              <p>Start building your email by adding blocks from the toolbar.</p>
            </mj-text>
          </mj-column>
        </mj-section>
      `;
    }

    // Group non-column blocks into sections
    const sections: string[] = [];
    let currentSectionBlocks: EmailBlock[] = [];

    blocks.forEach(block => {
      if (block.type === 'columns') {
        // If we have pending blocks, wrap them in a section first
        if (currentSectionBlocks.length > 0) {
          sections.push(this.wrapBlocksInSection(currentSectionBlocks));
          currentSectionBlocks = [];
        }
        // Add the columns block directly (it's already a section)
        sections.push(MJMLBlockFactory.blockToMJML(block));
      } else {
        currentSectionBlocks.push(block);
      }
    });

    // Handle any remaining blocks
    if (currentSectionBlocks.length > 0) {
      sections.push(this.wrapBlocksInSection(currentSectionBlocks));
    }

    return sections.join('\n');
  }

  private static wrapBlocksInSection(blocks: EmailBlock[]): string {
    const blocksMJML = blocks.map(block => 
      MJMLBlockFactory.blockToMJML(block)
    ).join('');

    return `
      <mj-section>
        <mj-column>
          ${blocksMJML}
        </mj-column>
      </mj-section>
    `;
  }

  private static generateCustomStyles(globalStyles?: string, settings?: any): string {
    const defaultStyles = `
      .email-container {
        max-width: ${settings?.width || '600px'};
        margin: 0 auto;
      }
      
      @media only screen and (max-width: 480px) {
        .email-container {
          width: 100% !important;
        }
      }
    `;

    return globalStyles ? `${defaultStyles}\n${globalStyles}` : defaultStyles;
  }
}
