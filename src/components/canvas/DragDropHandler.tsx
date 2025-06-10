import { useState, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';

import { generateUniqueId } from '@/utils/idGenerator';

interface UseDragDropHandlerProps {
  blocks: EmailBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>;
  getDefaultContent: (blockType: string) => any;
  getDefaultStyles: (blockType: string) => any;
  dragOverIndex: number | null;
  setDragOverIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isDraggingOver: boolean;
  setIsDraggingOver: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDragType: React.Dispatch<React.SetStateAction<'block' | 'layout' | 'reorder' | null>>;
}

export const useDragDropHandler = ({
  blocks,
  setBlocks,
  getDefaultContent,
  getDefaultStyles,
  dragOverIndex,
  setDragOverIndex,
  isDraggingOver,
  setIsDraggingOver,
  setCurrentDragType
}: UseDragDropHandlerProps) => {
  const handleDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    e.stopPropagation();
    const blockType = (e.target as HTMLElement).dataset.blockType;
    setCurrentDragType(blockType === 'columns' ? 'layout' : 'block');
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.effectAllowed = 'move';
  }, [setCurrentDragType]);

  const handleBlockDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    e.stopPropagation();
    setCurrentDragType('reorder');
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.effectAllowed = 'move';
  }, [setCurrentDragType]);

  const handleCanvasDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
    setDragOverIndex(null);
  }, [setIsDraggingOver, setDragOverIndex]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);

    const target = e.target as HTMLElement;
    const canvas = target.closest('.email-canvas');

    if (canvas) {
      const children = Array.from(canvas.querySelectorAll('[data-testid^="email-block-"]'));
      
      if (children.length === 0) {
        setDragOverIndex(0);
        return;
      }

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const rect = child.getBoundingClientRect();
        const mouseY = e.clientY;
        
        if (mouseY >= rect.top && mouseY <= rect.bottom) {
          setDragOverIndex(i);
          return;
        } else if (mouseY < rect.top) {
          setDragOverIndex(i);
          return;
        }
      }
      setDragOverIndex(children.length);
    }
  }, [setDragOverIndex, setIsDraggingOver]);

  const handleCanvasDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setDragOverIndex(null);
  }, [setIsDraggingOver, setDragOverIndex]);

  const createBlockFromDragData = useCallback((dragData: any, getDefaultContent: Function, getDefaultStyles: Function) => {
    const baseBlock = {
      id: generateUniqueId('block'), // Use enhanced ID generation
      type: dragData.blockType,
      content: getDefaultContent(dragData.blockType),
      styling: getDefaultStyles(dragData.blockType),
      position: { x: 0, y: 0 },
      displayOptions: {
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true
      },
      isStarred: false
    };

    // Handle layout-specific data
    if (dragData.layoutData && dragData.blockType === 'columns') {
      const columnCount = dragData.layoutData.columnCount || 2;
      const columnRatio = dragData.layoutData.columnRatio || '50-50';
      
      const columns = Array.from({ length: columnCount }, (_, index) => ({
        id: generateUniqueId(`column-${index}`), // Use enhanced ID generation for columns too
        blocks: []
      }));

      baseBlock.content = {
        ...baseBlock.content,
        columnRatio,
        columns,
        gap: '16px'
      };
    }

    return baseBlock;
  }, []);

  const handleCanvasDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setDragOverIndex(null);

    const dragData = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');
    const blockType = dragData.blockType;

    if (!blockType) {
      const blockId = e.dataTransfer.getData('text/plain');
      
      setBlocks(prev => {
        const reorderedBlocks = [...prev];
        const blockToMoveIndex = reorderedBlocks.findIndex(block => block.id === blockId);
        
        if (blockToMoveIndex === -1) {
          return prev;
        }
        
        const [blockToMove] = reorderedBlocks.splice(blockToMoveIndex, 1);
        
        if (dragOverIndex === null) {
          reorderedBlocks.push(blockToMove);
        } else {
          reorderedBlocks.splice(dragOverIndex, 0, blockToMove);
        }
        
        return reorderedBlocks;
      });
      return;
    }

    const newBlock = createBlockFromDragData(dragData, getDefaultContent, getDefaultStyles);

    setBlocks(prev => {
      const newBlocks = [...prev];
      if (dragOverIndex === null || dragOverIndex >= newBlocks.length) {
        newBlocks.push(newBlock);
      } else {
        newBlocks.splice(dragOverIndex, 0, newBlock);
      }
      return newBlocks;
    });
  }, [setBlocks, setIsDraggingOver, setDragOverIndex, createBlockFromDragData, getDefaultContent, getDefaultStyles, dragOverIndex]);

  const handleBlockDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('text/plain');
    
    setBlocks(prev => {
      const reorderedBlocks = [...prev];
      const blockToMoveIndex = reorderedBlocks.findIndex(block => block.id === blockId);
      
      if (blockToMoveIndex === -1) {
        return prev;
      }
      
      const [blockToMove] = reorderedBlocks.splice(blockToMoveIndex, 1);
      reorderedBlocks.splice(targetIndex, 0, blockToMove);
      
      return reorderedBlocks;
    });
  }, [setBlocks]);

  const handleColumnDrop = useCallback((e: React.DragEvent, layoutBlockId: string, columnIndex: number) => {
    e.preventDefault();
    const droppedBlockId = e.dataTransfer.getData('text/plain');
    
    setBlocks(prev => {
      let droppedBlock: EmailBlock | undefined;
      
      // Remove block from its original position
      const updatedBlocks = prev.map(block => {
        if (block.id === layoutBlockId && block.type === 'columns') {
          const updatedColumns = block.content.columns.map(column => {
            const blockIndex = column.blocks.findIndex(b => b.id === droppedBlockId);
            if (blockIndex !== -1) {
              droppedBlock = column.blocks[blockIndex];
              const newBlocks = [...column.blocks];
              newBlocks.splice(blockIndex, 1);
              return { ...column, blocks: newBlocks };
            }
            return column;
          });
          return {
            ...block,
            content: {
              ...block.content,
              columns: updatedColumns
            }
          };
        } else {
          return block;
        }
      }).filter(block => block.id !== droppedBlockId); // Remove from top level if it was there
      
      if (!droppedBlock) {
        droppedBlock = prev.find(b => b.id === droppedBlockId);
      }
      
      if (!droppedBlock) {
        console.error('Dropped block not found:', droppedBlockId);
        return updatedBlocks;
      }
      
      // Add block to the target column
      const finalBlocks = updatedBlocks.map(block => {
        if (block.id === layoutBlockId && block.type === 'columns') {
          const updatedColumns = block.content.columns.map((column, index) => {
            if (index === columnIndex) {
              return { ...column, blocks: [...column.blocks, droppedBlock!] };
            }
            return column;
          });
          return {
            ...block,
            content: {
              ...block.content,
              columns: updatedColumns
            }
          };
        }
        return block;
      });
      
      return finalBlocks;
    });
  }, [setBlocks]);

  return {
    handleDragStart,
    handleBlockDragStart,
    handleCanvasDragEnter,
    handleCanvasDragOver,
    handleCanvasDragLeave,
    handleCanvasDrop,
    handleBlockDrop,
    handleColumnDrop
  };
};
