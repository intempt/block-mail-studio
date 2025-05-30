
import { useState, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';

export const useEmailBlocks = (
  initialBlocks: EmailBlock[] = [],
  onBlocksChange?: (blocks: EmailBlock[]) => void
) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks);

  const updateBlocks = useCallback((newBlocks: EmailBlock[]) => {
    setBlocks(newBlocks);
    onBlocksChange?.(newBlocks);
  }, [onBlocksChange]);

  const addBlock = useCallback((block: EmailBlock) => {
    const newBlocks = [...blocks, block];
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const updateBlock = useCallback((blockId: string, updates: Partial<EmailBlock>) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    );
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const deleteBlock = useCallback((blockId: string) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const duplicateBlock = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: `block-${Date.now()}`
      };
      const newBlocks = [...blocks, duplicatedBlock];
      updateBlocks(newBlocks);
    }
  }, [blocks, updateBlocks]);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const getDefaultContent = useCallback((type: string) => {
    switch (type) {
      case 'text':
        return { html: '<p>New text block</p>' };
      case 'image':
        return { src: '', alt: '' };
      case 'button':
        return { text: 'Click here', url: '#' };
      default:
        return {};
    }
  }, []);

  const getDefaultStyles = useCallback((type: string) => {
    return {
      width: '100%',
      height: 'auto',
      padding: '16px',
      margin: '8px 0',
      backgroundColor: 'transparent'
    };
  }, []);

  return {
    blocks,
    setBlocks: updateBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    getDefaultContent,
    getDefaultStyles
  };
};
