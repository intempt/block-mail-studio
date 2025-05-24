
import { EmailBlock } from '@/types/emailBlocks';
import { createBlock } from '@/utils/enhancedBlockFactory';
import { EmailStructureAnalysis } from './EmailContentAnalyzer';

export interface BlockGenerationResult {
  blocks: EmailBlock[];
  layoutConfig: {
    type: string;
    columns?: number;
    sections: Array<{
      name: string;
      blocks: EmailBlock[];
    }>;
  };
  suggestions: string[];
}

export class AIBlockGenerator {
  static generateBlocksFromAnalysis(analysis: EmailStructureAnalysis, originalHtml: string): BlockGenerationResult {
    const blocks: EmailBlock[] = [];
    const suggestions: string[] = [];

    // Generate blocks based on analysis
    analysis.contentBlocks.forEach((blockInfo, index) => {
      try {
        let block: EmailBlock;

        switch (blockInfo.type) {
          case 'text':
            block = createBlock('text');
            block.content.html = blockInfo.content || '<p>Add your text here...</p>';
            if (blockInfo.styling) {
              Object.assign(block.styling.desktop, blockInfo.styling);
            }
            break;

          case 'image':
            block = createBlock('image');
            // Extract image src from content if it's an img tag
            const imgMatch = blockInfo.content.match(/src="([^"]+)"/);
            if (imgMatch) {
              block.content.src = imgMatch[1];
            }
            block.content.alignment = analysis.layoutSuggestions.imageAlignment;
            break;

          case 'button':
            block = createBlock('button');
            // Extract button text and link
            const textMatch = blockInfo.content.match(/>([^<]+)</);
            const linkMatch = blockInfo.content.match(/href="([^"]+)"/);
            if (textMatch) block.content.text = textMatch[1];
            if (linkMatch) block.content.link = linkMatch[1];
            break;

          case 'divider':
            block = createBlock('divider');
            break;

          case 'spacer':
            block = createBlock('spacer');
            break;

          default:
            block = createBlock('text');
            block.content.html = blockInfo.content;
        }

        block.position.y = blockInfo.position * 100;
        blocks.push(block);
      } catch (error) {
        console.error('Error creating block:', error);
        // Fallback to text block
        const fallbackBlock = createBlock('text');
        fallbackBlock.content.html = blockInfo.content || '<p>Content block</p>';
        blocks.push(fallbackBlock);
      }
    });

    // Create layout configuration
    const layoutConfig = this.createLayoutConfig(analysis, blocks);

    // Generate suggestions
    if (analysis.layoutSuggestions.headerNeeded) {
      suggestions.push('Consider adding a header section with your logo');
    }
    if (analysis.layoutSuggestions.footerNeeded) {
      suggestions.push('Add a footer with contact information and unsubscribe link');
    }
    if (analysis.layoutSuggestions.ctaPlacement === 'multiple') {
      suggestions.push('Multiple call-to-action buttons detected - consider primary/secondary hierarchy');
    }

    return {
      blocks,
      layoutConfig,
      suggestions
    };
  }

  private static createLayoutConfig(analysis: EmailStructureAnalysis, blocks: EmailBlock[]) {
    let layoutType = 'single-column';
    let columns = 1;

    switch (analysis.suggestedLayout) {
      case 'two-column':
        layoutType = 'columns';
        columns = 2;
        break;
      case 'hero-content':
        layoutType = 'hero-sections';
        break;
      case 'newsletter-grid':
        layoutType = 'columns';
        columns = 2;
        break;
    }

    return {
      type: layoutType,
      columns,
      sections: [
        {
          name: 'Main Content',
          blocks
        }
      ]
    };
  }

  static createColumnsLayout(blocks: EmailBlock[], ratio: string = '50-50'): EmailBlock {
    const columnsBlock = createBlock('columns');
    
    columnsBlock.content = {
      columnCount: 2,
      columnRatio: ratio,
      columns: [
        {
          id: `col-1-${Date.now()}`,
          blocks: blocks.slice(0, Math.ceil(blocks.length / 2)),
          width: '50%'
        },
        {
          id: `col-2-${Date.now()}`,
          blocks: blocks.slice(Math.ceil(blocks.length / 2)),
          width: '50%'
        }
      ],
      gap: '16px'
    };

    return columnsBlock;
  }

  static extractContentFromHtml(html: string): Array<{ type: string; content: string }> {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const extractedContent: Array<{ type: string; content: string }> = [];

    // Extract headings
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      extractedContent.push({
        type: 'text',
        content: `<${heading.tagName.toLowerCase()}>${heading.textContent}</${heading.tagName.toLowerCase()}>`
      });
    });

    // Extract paragraphs
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      extractedContent.push({
        type: 'text',
        content: p.outerHTML
      });
    });

    // Extract images
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      extractedContent.push({
        type: 'image',
        content: img.outerHTML
      });
    });

    // Extract buttons/links
    const buttons = tempDiv.querySelectorAll('a[href], button');
    buttons.forEach(btn => {
      extractedContent.push({
        type: 'button',
        content: btn.outerHTML
      });
    });

    return extractedContent;
  }
}
