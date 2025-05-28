import React from 'react';
import { createDragData, parseDragData, getDragTypeColor, getDragTypeMessage } from '@/utils/dragDropUtils';
import { EmailBlock } from '@/types/emailBlocks';
import { DirectSnippetService } from '@/services/directSnippetService';

interface DragDropHandlerProps {
  blocks: EmailBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>;
  getDefaultContent: (blockType: string) => any;
  getDefaultStyles: (blockType: string) => any;
  dragOverIndex: number | null;
  setDragOverIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isDraggingOver: boolean;
  setIsDraggingOver: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDragType?: React.Dispatch<React.SetStateAction<'block' | 'layout' | 'reorder' | null>>;
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
}: DragDropHandlerProps) => {
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    setDragOverIndex(null);
    setCurrentDragType?.(null);

    try {
      const data = parseDragData(e.dataTransfer.getData('application/json'));
      if (!data) return;
      
      console.log('DragDropHandler: Canvas drop data:', data);
      
      // Handle snippet drops
      if (data.isSnippet && data.snippetId) {
        console.log('DragDropHandler: Dropping snippet:', data.snippetId);
        const allSnippets = DirectSnippetService.getAllSnippets();
        const snippet = allSnippets.find(s => s.id === data.snippetId);
        
        if (snippet?.blockData) {
          const newBlock: EmailBlock = {
            ...snippet.blockData,
            id: `block-${Date.now()}`, // Generate new unique ID
          };
          
          const insertIndex = dragOverIndex !== null ? dragOverIndex : blocks.length;
          setBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks.splice(insertIndex, 0, newBlock);
            return newBlocks;
          });
          console.log('DragDropHandler: Snippet block added:', newBlock);
        }
        return;
      }
      
      if ((data.isLayout || data.blockType === 'columns') && data.layoutData) {
        console.log('DragDropHandler: Creating layout block with data:', data.layoutData);
        
        const columnCount = data.layoutData.columnCount || 2;
        const columnRatio = data.layoutData.columnRatio || '50-50';
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
        console.log('DragDropHandler: Layout block added:', newBlock);
      } else if (data.blockType) {
        console.log('DragDropHandler: Creating regular block:', data.blockType);
        
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
        console.log('DragDropHandler: Regular block added:', newBlock);
      }
    } catch (error) {
      console.error('DragDropHandler: Error handling drop:', error);
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
    
    // More reliable drag type detection using dataTransfer types
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('application/json')) {
      try {
        const dragDataString = e.dataTransfer.getData('application/json');
        if (dragDataString) {
          const data = parseDragData(dragDataString);
          if (data) {
            if (data.isReorder) {
              setCurrentDragType?.('reorder');
            } else if (data.isLayout || data.blockType === 'columns') {
              setCurrentDragType?.('layout');
            } else {
              setCurrentDragType?.('block');
            }
          }
        }
      } catch (error) {
        // If we can't parse, detect from effectAllowed
        if (e.dataTransfer.effectAllowed === 'move') {
          setCurrentDragType?.('reorder');
        } else {
          setCurrentDragType?.('block');
        }
      }
    }
    
    // Enhanced drop index calculation
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const blockElements = e.currentTarget.querySelectorAll('.email-block');
    
    if (blockElements.length === 0) {
      setDragOverIndex(0);
      return;
    }
    
    let insertIndex = blocks.length;
    let closestDistance = Infinity;
    
    for (let i = 0; i < blockElements.length; i++) {
      const blockRect = blockElements[i].getBoundingClientRect();
      const blockTop = blockRect.top - rect.top;
      const blockBottom = blockRect.bottom - rect.top;
      const blockCenter = blockTop + (blockRect.height / 2);
      
      // Check if we're above this block
      if (y < blockCenter) {
        const distance = Math.abs(y - blockTop);
        if (distance < closestDistance) {
          closestDistance = distance;
          insertIndex = i;
        }
        break;
      }
      
      // Check if we're below the last block
      if (i === blockElements.length - 1 && y > blockBottom) {
        insertIndex = i + 1;
      }
    }
    
    setDragOverIndex(insertIndex);
  };

  const handleCanvasDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleCanvasDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Only hide if we're actually leaving the canvas bounds
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDraggingOver(false);
      setDragOverIndex(null);
      setCurrentDragType?.(null);
    }
  };

  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    const dragData = createDragData({ blockId, isReorder: true });
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'move';
    setCurrentDragType?.('reorder');
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
    } finally {
      setCurrentDragType?.(null);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = parseDragData(e.dataTransfer.getData('application/json'));
      if (!data?.blockType) return;
      
      console.log('DragDropHandler: Adding block to column:', { blockType: data.blockType, layoutBlockId, columnIndex });
      
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
      
      console.log('DragDropHandler: Block added to column:', newBlock);
    } catch (error) {
      console.error('DragDropHandler: Error handling column drop:', error);
    } finally {
      setCurrentDragType?.(null);
    }
  };

  return {
    handleCanvasDrop,
    handleCanvasDragOver,
    handleCanvasDragEnter,
    handleCanvasDragLeave,
    handleBlockDragStart,
    handleBlockDrop,
    handleColumnDrop
  };
};
