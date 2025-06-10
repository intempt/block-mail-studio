
import { useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { DragDataService } from '@/services/DragDataService';
import { BlockFactoryService } from '@/services/BlockFactoryService';

interface UseBlockDropProps {
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>;
  setIsDraggingOver: (value: boolean) => void;
  setDragOverIndex: (value: number | null) => void;
  dragOverIndex: number | null;
  blockFactory: BlockFactoryService;
}

export const useBlockDrop = ({ 
  setBlocks, 
  setIsDraggingOver, 
  setDragOverIndex, 
  dragOverIndex,
  blockFactory 
}: UseBlockDropProps) => {
  
  const handleCanvasDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setDragOverIndex(null);

    const dragDataString = e.dataTransfer.getData('text/plain');
    if (!dragDataString) {
      console.error('No drag data found');
      return;
    }

    const dragData = DragDataService.parse(dragDataString);
    if (!dragData || !DragDataService.validate(dragData)) {
      console.error('Invalid drag data:', dragData);
      return;
    }

    if (DragDataService.isExistingBlockReorder(dragData)) {
      // Handle block reordering
      const blockId = dragData.blockId!;
      
      setBlocks(prev => {
        const reorderedBlocks = [...prev];
        const blockToMoveIndex = reorderedBlocks.findIndex(block => block.id === blockId);
        
        if (blockToMoveIndex === -1) {
          console.error('Block not found for reordering:', blockId);
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
    } else if (DragDataService.isNewBlockFromPalette(dragData)) {
      // Handle new block from palette
      const newBlock = blockFactory.createFromDragData(dragData);
      
      if (!newBlock) {
        console.error('Failed to create block from drag data');
        return;
      }

      setBlocks(prev => {
        const newBlocks = [...prev];
        if (dragOverIndex === null || dragOverIndex >= newBlocks.length) {
          newBlocks.push(newBlock);
        } else {
          newBlocks.splice(dragOverIndex, 0, newBlock);
        }
        return newBlocks;
      });
    }
  }, [setBlocks, setIsDraggingOver, setDragOverIndex, dragOverIndex, blockFactory]);

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

  return {
    handleCanvasDrop,
    handleBlockDrop
  };
};
