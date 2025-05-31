
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
  const [currentDragType, setCurrentDragType] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleBlockDragStart = useCallback((blockId: string, blockType: string) => {
    setCurrentDragType(blockType);
  }, []);

  const handleBlockDrop = useCallback((dropIndex: number, blockType?: string) => {
    if (blockType) {
      const newBlock: EmailBlock = {
        id: `block-${Date.now()}`,
        type: blockType as any,
        content: getDefaultContent(blockType),
        styling: {
          desktop: getDefaultStyles(blockType),
          tablet: getDefaultStyles(blockType),
          mobile: getDefaultStyles(blockType)
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };
      addBlock(newBlock);
    }
    setIsDraggingOver(false);
    setDragOverIndex(null);
    setCurrentDragType(null);
  }, [addBlock, getDefaultContent, getDefaultStyles]);

  return {
    blocks,
    selectedBlockId,
    isDraggingOver,
    dragOverIndex,
    currentDragType,
    handleBlockDragStart,
    handleBlockDrop,
    setIsDraggingOver,
    setDragOverIndex
  };
};
