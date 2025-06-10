
import { useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { DragDataService } from '@/services/DragDataService';
import { BlockFactoryService } from '@/services/BlockFactoryService';

interface UseColumnDropProps {
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>;
  blockFactory: BlockFactoryService;
}

export const useColumnDrop = ({ setBlocks, blockFactory }: UseColumnDropProps) => {
  const handleColumnDrop = useCallback((e: React.DragEvent, layoutBlockId: string, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rawDragData = e.dataTransfer.getData('text/plain');
    if (!rawDragData) {
      console.error('No drag data found in column drop');
      return;
    }

    const dragData = DragDataService.parse(rawDragData);
    if (!dragData) {
      console.error('Failed to parse drag data for column drop');
      return;
    }

    setBlocks(prev => {
      if (DragDataService.isNewBlockFromPalette(dragData)) {
        // Handle new block from palette
        const newBlock = blockFactory.createFromDragData(dragData);
        
        if (!newBlock) {
          console.error('Failed to create new block for column');
          return prev;
        }
        
        // Add the new block to the target column
        return prev.map(block => {
          if (block.id === layoutBlockId && block.type === 'columns') {
            const updatedColumns = block.content.columns.map((column, index) => {
              if (index === columnIndex) {
                return { ...column, blocks: [...column.blocks, newBlock] };
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
      } else if (DragDataService.isExistingBlockReorder(dragData)) {
        // Handle existing block movement
        const droppedBlockId = dragData.blockId!;
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
          }
          return block;
        }).filter(block => block.id !== droppedBlockId);
        
        if (!droppedBlock) {
          droppedBlock = prev.find(b => b.id === droppedBlockId);
        }
        
        if (!droppedBlock) {
          console.error('Dropped block not found:', droppedBlockId);
          return prev;
        }
        
        // Add block to the target column
        return updatedBlocks.map(block => {
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
      }
      
      return prev;
    });
  }, [setBlocks, blockFactory]);

  return {
    handleColumnDrop
  };
};
