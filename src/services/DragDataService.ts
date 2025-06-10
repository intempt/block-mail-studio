
export interface DragData {
  blockType?: string;
  blockId?: string;
  isReorder?: boolean;
  layoutData?: any;
  isLayout?: boolean;
  isSnippet?: boolean;
  snippetId?: string;
  source?: string;
}

export class DragDataService {
  static parse(dataString: string): DragData | null {
    if (!dataString) {
      console.warn('DragDataService: Empty data string');
      return null;
    }

    console.log('DragDataService: Parsing drag data:', dataString);

    try {
      const parsed = JSON.parse(dataString);
      console.log('DragDataService: Successfully parsed JSON:', parsed);
      return parsed;
    } catch (error) {
      console.log('DragDataService: Failed to parse as JSON, treating as block ID for reorder:', dataString);
      // Fallback: treat as block ID for reordering
      return {
        blockId: dataString,
        isReorder: true,
        source: 'fallback-reorder'
      };
    }
  }

  static create(data: DragData): string {
    const dataString = JSON.stringify(data);
    console.log('DragDataService: Created drag data:', dataString);
    return dataString;
  }

  static isNewBlockFromPalette(data: DragData): boolean {
    const isNewBlock = !!(data.blockType && !data.isReorder);
    console.log('DragDataService: Is new block from palette?', isNewBlock, data);
    return isNewBlock;
  }

  static isExistingBlockReorder(data: DragData): boolean {
    const isReorder = !!(data.blockId && data.isReorder);
    console.log('DragDataService: Is existing block reorder?', isReorder, data);
    return isReorder;
  }

  static isLayoutBlock(data: DragData): boolean {
    const isLayout = data.blockType === 'columns' || !!(data.layoutData);
    console.log('DragDataService: Is layout block?', isLayout, data);
    return isLayout;
  }

  static validate(data: DragData): boolean {
    if (!data) {
      console.warn('DragDataService: Invalid data - null or undefined');
      return false;
    }
    
    // Must have either blockType (new) or blockId (existing)
    const isValid = !!(data.blockType || data.blockId);
    console.log('DragDataService: Data validation result:', isValid, data);
    return isValid;
  }

  static getDragEffect(data: DragData): string {
    return data.isReorder ? 'move' : 'copy';
  }
}
