
import { useState, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';

interface UseDragDropProps {
  blocks: EmailBlock[];
  setBlocks: (blocks: EmailBlock[]) => void;
  addBlock: (block: EmailBlock) => void;
  updateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  getDefaultContent: (type: string) => any;
  getDefaultStyles: (type: string) => any;
}

export const useDragDrop = ({
  blocks,
  setBlocks,
  addBlock,
  updateBlock,
  deleteBlock,
  duplicateBlock,
  moveBlock,
  getDefaultContent,
  getDefaultStyles
}: UseDragDropProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [currentDragType, setCurrentDragType] = useState<"block" | "layout" | "reorder" | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleBlockDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    console.log('Drag start for block:', blockId);
    setCurrentDragType('reorder');
    e.dataTransfer.setData('application/json', JSON.stringify({ 
      blockId, 
      isReorder: true 
    }));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleBlockDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      console.log('Drop data:', data, 'at index:', targetIndex);

      if (data.isReorder && data.blockId) {
        // Handle block reordering
        const sourceIndex = blocks.findIndex(block => block.id === data.blockId);
        if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
          moveBlock(sourceIndex, targetIndex);
        }
      } else if (data.blockType || data.isLayout) {
        // Handle new block/layout drop
        const newBlock: EmailBlock = {
          id: `block-${Date.now()}`,
          type: data.blockType || 'columns',
          content: data.layoutData || getDefaultContent(data.blockType),
          styling: {
            desktop: getDefaultStyles(data.blockType),
            tablet: getDefaultStyles(data.blockType),
            mobile: getDefaultStyles(data.blockType)
          },
          position: { x: 0, y: 0 },
          displayOptions: {
            showOnDesktop: true,
            showOnTablet: true,
            showOnMobile: true
          }
        };
        
        // Insert at the target index
        const newBlocks = [...blocks];
        newBlocks.splice(targetIndex, 0, newBlock);
        setBlocks(newBlocks);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
    
    setIsDraggingOver(false);
    setDragOverIndex(null);
    setCurrentDragType(null);
  }, [blocks, setBlocks, moveBlock, getDefaultContent, getDefaultStyles]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
    
    // Determine drag type
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.isReorder) {
        setCurrentDragType('reorder');
      } else if (data.isLayout || data.blockType === 'columns') {
        setCurrentDragType('layout');
      } else {
        setCurrentDragType('block');
      }
    } catch (error) {
      // Fallback based on effect allowed
      if (e.dataTransfer.effectAllowed === 'move') {
        setCurrentDragType('reorder');
      } else {
        setCurrentDragType('block');
      }
    }

    // Calculate drop index based on mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const blockElements = e.currentTarget.querySelectorAll('.email-block');
    
    if (blockElements.length === 0) {
      setDragOverIndex(0);
      return;
    }
    
    let insertIndex = blocks.length;
    
    for (let i = 0; i < blockElements.length; i++) {
      const blockRect = blockElements[i].getBoundingClientRect();
      const blockTop = blockRect.top - rect.top;
      const blockCenter = blockTop + (blockRect.height / 2);
      
      if (y < blockCenter) {
        insertIndex = i;
        break;
      }
    }
    
    setDragOverIndex(insertIndex);
  }, [blocks.length]);

  const handleCanvasDragLeave = useCallback((e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Only hide if we're actually leaving the canvas bounds
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDraggingOver(false);
      setDragOverIndex(null);
      setCurrentDragType(null);
    }
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const insertIndex = dragOverIndex !== null ? dragOverIndex : blocks.length;
    handleBlockDrop(e, insertIndex);
  }, [dragOverIndex, blocks.length, handleBlockDrop]);

  return {
    blocks,
    selectedBlockId,
    isDraggingOver,
    dragOverIndex,
    currentDragType,
    handleBlockDragStart,
    handleBlockDrop,
    handleCanvasDragOver,
    handleCanvasDragLeave,
    handleCanvasDrop,
    setIsDraggingOver,
    setDragOverIndex
  };
};
