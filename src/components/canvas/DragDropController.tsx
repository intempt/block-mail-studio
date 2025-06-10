
import { useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { BlockFactoryService } from '@/services/BlockFactoryService';
import { useDragState } from '@/hooks/useDragState';
import { useCanvasDrag } from '@/hooks/useCanvasDrag';
import { useBlockDrop } from '@/hooks/useBlockDrop';
import { useColumnDrop } from '@/hooks/useColumnDrop';

interface DragDropControllerProps {
  blocks: EmailBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>;
  getDefaultContent: (blockType: string) => any;
  getDefaultStyles: (blockType: string) => any;
}

export const useDragDropController = ({
  blocks,
  setBlocks,
  getDefaultContent,
  getDefaultStyles
}: DragDropControllerProps) => {
  
  const {
    dragOverIndex,
    isDraggingOver,
    currentDragType,
    setDragOverIndex,
    setIsDraggingOver,
    setCurrentDragType,
    resetDragState
  } = useDragState();

  // Initialize block factory
  const blockFactory = new BlockFactoryService({
    getDefaultContent,
    getDefaultStyles
  });

  // Initialize specialized hooks
  const { handleCanvasDragEnter, handleCanvasDragOver, handleCanvasDragLeave } = useCanvasDrag({
    setIsDraggingOver,
    setDragOverIndex
  });

  const { handleCanvasDrop, handleBlockDrop } = useBlockDrop({
    setBlocks,
    setIsDraggingOver,
    setDragOverIndex,
    dragOverIndex,
    blockFactory
  });

  const { handleColumnDrop } = useColumnDrop({
    setBlocks,
    blockFactory
  });

  // Drag start handlers
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

  return {
    // State
    dragOverIndex,
    isDraggingOver,
    currentDragType,
    
    // Canvas operations
    handleCanvasDragEnter,
    handleCanvasDragOver,
    handleCanvasDragLeave,
    handleCanvasDrop,
    
    // Block operations
    handleDragStart,
    handleBlockDragStart,
    handleBlockDrop,
    
    // Column operations
    handleColumnDrop,
    
    // Utilities
    resetDragState
  };
};
