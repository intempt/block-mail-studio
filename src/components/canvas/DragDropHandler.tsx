import React from 'react';
import { createDragData, parseDragData } from '@/utils/dragDropUtils';
import { EmailBlock } from '@/types/emailBlocks';

interface DragDropHandlerProps {
  blocks: EmailBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>;
  getDefaultContent: (blockType: string) => any;
  getDefaultStyles: (blockType: string) => any;
  dragOverIndex: number | null;
  setDragOverIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isDraggingOver: boolean;
  setIsDraggingOver: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDragDropHandler = ({
  blocks,
  setBlocks,
  getDefaultContent,
  getDefaultStyles,
  dragOverIndex,
  setDragOverIndex,
  isDraggingOver,
  setIsDraggingOver
}: DragDropHandlerProps) => {
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    setDragOverIndex(null);

    try {
      const data = parseDragData(e.dataTransfer.getData('application/json'));
      if (!data) return;
      
      console.log('Canvas drop data:', data);
      
      if (data.isLayout && data.layoutData) {
        console.log('Creating layout block with data:', data.layoutData);
        
        const columnCount = data.layoutData.columnCount || data.layoutData.columns || 2;
        const columnRatio = data.layoutData.columnRatio || data.layoutData.ratio || '50-50';
        const columnElements = data.layoutData.columnElements || [];

        const newBlock: EmailBlock = {
          id: `layout-${Date.now()}`,
          type: 'columns',
          content: {
            columnCount: columnCount as 1 | 2 | 3 | 4,
            columnRatio: columnRatio,
            columns: columnElements.length > 0 ? columnElements : Array.from({ length: columnCount }, (_, i) => ({
              id: `col-${i}-${Date.now()}`,
              blocks: [],
              width: `${100 / columnCount}%`
            })),
            gap: '16px'
          },
          styling: getDefaultStyles('columns'),
          position: { x: 0, y: 0 },
          displayOptions: {
            showOnDesktop: true,
            showOnTablet: true,
            showOnMobile: true
          }
        };
        
        const insertIndex = dragOverIndex !== null ? dragOverIndex : blocks.length;
        setBlocks(prev => {
          const newBlocks = [...prev];
          newBlocks.splice(insertIndex, 0, newBlock);
          return newBlocks;
        });
        console.log('Layout block added:', newBlock);
      } else if (data.blockType === 'columns' && data.layoutData) {
        const columnCount = data.layoutData.columnCount || data.layoutData.columns || 2;
        const columnRatio = data.layoutData.columnRatio || data.layoutData.ratio || '50-50';

        const newBlock: EmailBlock = {
          id: `layout-${Date.now()}`,
          type: 'columns',
          content: {
            columnCount: columnCount as 1 | 2 | 3 | 4,
            columnRatio: columnRatio,
            columns: Array.from({ length: columnCount }, (_, i) => ({
              id: `col-${i}-${Date.now()}`,
              blocks: [],
              width: `${100 / columnCount}%`
            })),
            gap: '16px'
          },
          styling: getDefaultStyles('columns'),
          position: { x: 0, y: 0 },
          displayOptions: {
            showOnDesktop: true,
            showOnTablet: true,
            showOnMobile: true
          }
        };
        
        const insertIndex = dragOverIndex !== null ? dragOverIndex : blocks.length;
        setBlocks(prev => {
          const newBlocks = [...prev];
          newBlocks.splice(insertIndex, 0, newBlock);
          return newBlocks;
        });
      } else if (data.blockType) {
        const newBlock: EmailBlock = {
          id: `block-${Date.now()}`,
          type: data.blockType as any,
          content: getDefaultContent(data.blockType),
          styling: getDefaultStyles(data.blockType),
          position: { x: 0, y: 0 },
          displayOptions: {
            showOnDesktop: true,
            showOnTablet: true,
            showOnMobile: true
          }
        };
        
        const insertIndex = dragOverIndex !== null ? dragOverIndex : blocks.length;
        setBlocks(prev => {
          const newBlocks = [...prev];
          newBlocks.splice(insertIndex, 0, newBlock);
          return newBlocks;
        });
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const blockElements = e.currentTarget.querySelectorAll('.email-block');
    
    let insertIndex = blocks.length;
    for (let i = 0; i < blockElements.length; i++) {
      const blockRect = blockElements[i].getBoundingClientRect();
      const blockY = blockRect.top - rect.top + blockRect.height / 2;
      if (y < blockY) {
        insertIndex = i;
        break;
      }
    }
    
    setDragOverIndex(insertIndex);
  };

  const handleCanvasDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
      setDragOverIndex(null);
    }
  };

  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    const dragData = createDragData({ blockId, isReorder: true });
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBlockDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = parseDragData(e.dataTransfer.getData('application/json'));
      if (!data) return;
      
      if (data.isReorder && data.blockId) {
        const sourceIndex = blocks.findIndex(b => b.id === data.blockId);
        if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
          setBlocks(prev => {
            const newBlocks = [...prev];
            const [movedBlock] = newBlocks.splice(sourceIndex, 1);
            const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
            newBlocks.splice(adjustedTargetIndex, 0, movedBlock);
            return newBlocks;
          });
        }
      }
    } catch (error) {
      console.error('Error handling block reorder:', error);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = parseDragData(e.dataTransfer.getData('application/json'));
      if (!data?.blockType) return;
      
      const newBlock: EmailBlock = {
        id: `block-${Date.now()}`,
        type: data.blockType as any,
        content: getDefaultContent(data.blockType),
        styling: getDefaultStyles(data.blockType),
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };
      
      setBlocks(prev => prev.map(block => {
        if (block.id === layoutBlockId && block.type === 'columns') {
          const updatedColumns = [...(block.content.columns || [])];
          if (updatedColumns[columnIndex]) {
            updatedColumns[columnIndex] = {
              ...updatedColumns[columnIndex],
              blocks: [...updatedColumns[columnIndex].blocks, newBlock]
            };
          }
          
          return {
            ...block,
            content: {
              ...block.content,
              columns: updatedColumns
            }
          };
        }
        return block;
      }));
      
      console.log('Block added to column:', newBlock);
    } catch (error) {
      console.error('Error handling column drop:', error);
    }
  };

  return {
    handleCanvasDrop,
    handleCanvasDragOver,
    handleCanvasDragLeave,
    handleBlockDragStart,
    handleBlockDrop,
    handleColumnDrop
  };
};
