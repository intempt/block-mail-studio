
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
      return null;
    }

    try {
      return JSON.parse(dataString);
    } catch (error) {
      // Fallback: treat as block ID for reordering
      return {
        blockId: dataString,
        isReorder: true
      };
    }
  }

  static create(data: DragData): string {
    return JSON.stringify(data);
  }

  static isNewBlockFromPalette(data: DragData): boolean {
    return !!(data.blockType && !data.isReorder);
  }

  static isExistingBlockReorder(data: DragData): boolean {
    return !!(data.blockId && data.isReorder);
  }

  static isLayoutBlock(data: DragData): boolean {
    return data.blockType === 'columns' || !!(data.layoutData);
  }

  static validate(data: DragData): boolean {
    if (!data) return false;
    
    // Must have either blockType (new) or blockId (existing)
    return !!(data.blockType || data.blockId);
  }

  static getDragEffect(data: DragData): string {
    return data.isReorder ? 'move' : 'copy';
  }
}
