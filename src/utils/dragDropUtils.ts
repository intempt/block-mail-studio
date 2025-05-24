
export interface DragData {
  blockType?: string;
  blockId?: string;
  isReorder?: boolean;
  layoutData?: any;
}

export const createDragData = (data: DragData): string => {
  return JSON.stringify(data);
};

export const parseDragData = (dataString: string): DragData | null => {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    console.error('Error parsing drag data:', error);
    return null;
  }
};

export const getDragEffect = (data: DragData): string => {
  if (data.isReorder) {
    return 'move';
  }
  return 'copy';
};

export const isValidDropTarget = (
  dragData: DragData, 
  targetType: 'canvas' | 'column' | 'block'
): boolean => {
  switch (targetType) {
    case 'canvas':
      return !!(dragData.blockType || dragData.layoutData);
    case 'column':
      return !!dragData.blockType && dragData.blockType !== 'columns';
    case 'block':
      return !!dragData.isReorder;
    default:
      return false;
  }
};
