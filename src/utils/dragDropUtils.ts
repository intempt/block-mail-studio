
export interface DragData {
  blockType: string;
  isReorder?: boolean;
  isLayout?: boolean;
  layoutData?: any;
  isSnippet?: boolean;
  snippetId?: string;
  blockId?: string;
}

export const createDragData = (data: DragData): string => {
  return JSON.stringify(data);
};

export const parseDragData = (dragString: string): DragData | null => {
  try {
    return JSON.parse(dragString);
  } catch (error) {
    console.error('Failed to parse drag data:', error);
    return null;
  }
};

export const getDragTypeColor = (type: string): string => {
  switch (type) {
    case 'block':
      return 'blue';
    case 'layout':
      return 'purple';
    case 'reorder':
      return 'green';
    default:
      return 'gray';
  }
};

export const getDragTypeMessage = (type: string): string => {
  switch (type) {
    case 'block':
      return 'Add this block to your email';
    case 'layout':
      return 'Layout blocks for structured content';
    case 'reorder':
      return 'Reorder this element';
    default:
      return 'Drag to interact';
  }
};

export const validateDragTarget = (element: HTMLElement, dragData: DragData): boolean => {
  // Basic validation for drag targets
  if (!element || !dragData) {
    return false;
  }
  
  return true;
};

export const handleDragStart = (e: DragEvent, data: DragData) => {
  const dragString = createDragData(data);
  e.dataTransfer?.setData('application/json', dragString);
  e.dataTransfer?.setData('text/plain', dragString);
};

export const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.dataTransfer!.dropEffect = 'copy';
};

export const handleDrop = (e: DragEvent): DragData | null => {
  e.preventDefault();
  const dragString = e.dataTransfer?.getData('application/json') || e.dataTransfer?.getData('text/plain');
  return dragString ? parseDragData(dragString) : null;
};
