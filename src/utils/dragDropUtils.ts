
export interface DragData {
  blockType?: string;
  blockId?: string;
  isReorder?: boolean;
  layoutData?: any;
  isLayout?: boolean;
  isSnippet?: boolean;
  snippetId?: string;
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

export const getDragTypeColor = (data: DragData): string => {
  if (data.isReorder) return 'orange';
  if (data.isLayout || data.blockType === 'columns') return 'purple';
  return 'blue';
};

export const getDragTypeMessage = (data: DragData): string => {
  if (data.isReorder) return 'Move block here';
  if (data.isLayout || data.blockType === 'columns') return 'Drop layout here';
  return 'Drop block here';
};

export const getDropIndicatorStyle = (
  isActive: boolean, 
  position: 'top' | 'bottom' | 'middle' = 'middle',
  dragType: 'block' | 'layout' | 'reorder' = 'block'
) => {
  if (!isActive) return {};
  
  const colorMap = {
    block: '#3b82f6',    // blue
    layout: '#8b5cf6',   // purple
    reorder: '#f59e0b'   // orange
  };
  
  const color = colorMap[dragType];
  
  const baseStyle = {
    transition: 'all 0.3s ease-in-out',
    borderRadius: '8px',
    animation: 'pulse 2s infinite'
  };

  switch (position) {
    case 'top':
      return {
        ...baseStyle,
        borderTop: `4px solid ${color}`,
        backgroundColor: `${color}20`,
        boxShadow: `0 -4px 12px ${color}40`
      };
    case 'bottom':
      return {
        ...baseStyle,
        borderBottom: `4px solid ${color}`,
        backgroundColor: `${color}20`,
        boxShadow: `0 4px 12px ${color}40`
      };
    default:
      return {
        ...baseStyle,
        border: `3px dashed ${color}`,
        backgroundColor: `${color}15`,
        boxShadow: `0 0 20px ${color}30`
      };
  }
};

export const getCanvasDropZoneStyle = (
  isActive: boolean,
  dragType: 'block' | 'layout' | 'reorder' = 'block'
) => {
  if (!isActive) return {};
  
  const colorMap = {
    block: '#3b82f6',
    layout: '#8b5cf6', 
    reorder: '#f59e0b'
  };
  
  const color = colorMap[dragType];
  
  return {
    backgroundColor: `${color}08`,
    border: `2px dashed ${color}`,
    borderRadius: '12px',
    boxShadow: `inset 0 0 30px ${color}20`,
    transition: 'all 0.3s ease-in-out'
  };
};
