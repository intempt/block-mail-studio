
import { EmailBlock } from '@/types/emailBlocks';
import { generateUniqueId } from '@/utils/idGenerator';
import { DragData } from './DragDataService';

export interface BlockCreationContext {
  getDefaultContent: (blockType: string) => any;
  getDefaultStyles: (blockType: string) => any;
}

export class BlockFactoryService {
  private context: BlockCreationContext;

  constructor(context: BlockCreationContext) {
    this.context = context;
  }

  createFromDragData(dragData: DragData): EmailBlock | null {
    if (!dragData || !dragData.blockType) {
      console.warn('BlockFactoryService: No blockType in drag data:', dragData);
      return null;
    }

    // Validate block type
    const validBlockTypes = [
      'text', 'button', 'image', 'spacer', 'divider', 'html', 'video', 
      'social', 'table', 'columns', 'code', 'menu', 'split', 'product', 
      'header-link-bar', 'drop-shadow', 'review-quote', 'content', 'productfeed'
    ];

    if (!validBlockTypes.includes(dragData.blockType)) {
      console.error('BlockFactoryService: Invalid block type:', dragData.blockType);
      return null;
    }

    try {
      console.log('BlockFactoryService: Creating block of type:', dragData.blockType);
      
      const baseBlock: EmailBlock = {
        id: generateUniqueId('block'),
        type: dragData.blockType as EmailBlock['type'], // Proper type casting
        content: this.getCompleteDefaultContent(dragData.blockType),
        styling: this.getCompleteDefaultStyles(dragData.blockType),
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        },
        isStarred: false
      };

      // Handle layout-specific data for columns
      if (dragData.layoutData && dragData.blockType === 'columns') {
        console.log('BlockFactoryService: Adding layout data for columns:', dragData.layoutData);
        const columnCount = dragData.layoutData.columnCount || 2;
        const columnRatio = dragData.layoutData.columnRatio || '50-50';
        
        const columns = Array.from({ length: columnCount }, (_, index) => ({
          id: generateUniqueId(`column-${index}`),
          blocks: []
        }));

        baseBlock.content = {
          ...baseBlock.content,
          columnRatio,
          columns,
          gap: '16px'
        };
      }

      console.log('BlockFactoryService: Successfully created block:', baseBlock.id, baseBlock.type);
      return baseBlock;
    } catch (error) {
      console.error('BlockFactoryService: Error creating block from drag data:', error, dragData);
      return null;
    }
  }

  private getCompleteDefaultContent(blockType: string) {
    const baseContent = this.context.getDefaultContent(blockType);
    
    const defaultContentMap = {
      text: {
        html: '<p>Enter your text here...</p>',
        textStyle: 'normal',
        ...baseContent
      },
      image: {
        src: '',
        alt: 'Image description',
        width: '100%',
        height: 'auto',
        alignment: 'center',
        ...baseContent
      },
      button: {
        text: 'Click Here',
        url: '#',
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        borderRadius: '4px',
        padding: '12px 24px',
        alignment: 'center',
        ...baseContent
      },
      divider: {
        style: 'solid',
        color: '#e5e7eb',
        thickness: '1px',
        width: '100%',
        ...baseContent
      },
      spacer: {
        height: '20px',
        ...baseContent
      },
      social: {
        platforms: [],
        alignment: 'center',
        iconSize: 'medium',
        ...baseContent
      },
      video: {
        src: '',
        thumbnail: '',
        width: '100%',
        height: 'auto',
        alignment: 'center',
        ...baseContent
      },
      html: {
        content: '<p>Custom HTML content</p>',
        ...baseContent
      },
      table: {
        rows: 2,
        columns: 2,
        data: [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']],
        ...baseContent
      },
      content: {
        html: '<p>Dynamic content placeholder</p>',
        contentType: 'text',
        ...baseContent
      },
      productfeed: {
        products: [],
        layout: 'grid',
        itemsPerRow: 2,
        ...baseContent
      },
      columns: {
        columnRatio: '50-50',
        columns: [],
        gap: '16px',
        ...baseContent
      }
    };
    
    return defaultContentMap[blockType as keyof typeof defaultContentMap] || baseContent;
  }

  private getCompleteDefaultStyles(blockType: string) {
    const baseStyles = this.context.getDefaultStyles(blockType);
    
    return {
      desktop: {
        width: '100%',
        height: 'auto',
        margin: '0',
        padding: '0',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0',
        ...baseStyles?.desktop
      },
      tablet: {
        width: '100%',
        height: 'auto',
        margin: '0',
        padding: '0',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0',
        ...baseStyles?.tablet
      },
      mobile: {
        width: '100%',
        height: 'auto',
        margin: '0',
        padding: '0',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0',
        ...baseStyles?.mobile
      }
    };
  }
}
