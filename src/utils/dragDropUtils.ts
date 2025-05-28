
export interface DragData {
  blockType?: string;
  blockId?: string;
  isReorder?: boolean;
  layoutData?: any;
  isLayout?: boolean;
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
      return !!(dragData.blockType || dragData.layoutData || dragData.isLayout);
    case 'column':
      return !!dragData.blockType && dragData.blockType !== 'columns';
    case 'block':
      return !!dragData.isReorder;
    default:
      return false;
  }
};

export const getDropIndicatorStyle = (isActive: boolean, position: 'top' | 'bottom' | 'middle' = 'middle') => {
  if (!isActive) return {};
  
  const baseStyle = {
    transition: 'all 0.2s ease-in-out',
    borderRadius: '4px'
  };

  switch (position) {
    case 'top':
      return {
        ...baseStyle,
        borderTop: '3px solid #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      };
    case 'bottom':
      return {
        ...baseStyle,
        borderBottom: '3px solid #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      };
    default:
      return {
        ...baseStyle,
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)'
      };
  }
};
