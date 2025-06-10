
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
    
    console.log('useColumnDrop: Drop event triggered', {
      layoutBlockId,
      columnIndex,
      eventType: e.type
    });
    
    const rawDragData = e.dataTransfer.getData('text/plain');
    if (!rawDragData) {
      console.error('useColumnDrop: No drag data found in column drop event');
      return;
    }

    console.log('useColumnDrop: Raw drag data received:', rawDragData);

    const dragData = DragDataService.parse(rawDragData);
    if (!dragData) {
      console.error('useColumnDrop: Failed to parse drag data for column drop');
      return;
    }

    console.log('useColumnDrop: Parsed drag data:', dragData);

    if (!DragDataService.validate(dragData)) {
      console.error('useColumnDrop: Invalid drag data:', dragData);
      return;
    }

    setBlocks(prev => {
      console.log('useColumnDrop: Current blocks before update:', prev.length);
      
      if (DragDataService.isNewBlockFromPalette(dragData)) {
        console.log('useColumnDrop: Processing new block from palette');
        
        // Handle new block from palette
        const newBlock = blockFactory.createFromDragData(dragData);
        
        if (!newBlock) {
          console.error('useColumnDrop: Failed to create new block for column');
          return prev;
        }
        
        console.log('useColumnDrop: Created new block:', newBlock.id, newBlock.type);
        
        // Add the new block to the target column
        const updatedBlocks = prev.map(block => {
          if (block.id === layoutBlockId && block.type === 'columns') {
            console.log('useColumnDrop: Found target layout block:', block.id);
            
            const updatedColumns = block.content.columns.map((column, index) => {
              if (index === columnIndex) {
                console.log('useColumnDrop: Adding block to column', index, 'existing blocks:', column.blocks.length);
                return { ...column, blocks: [...column.blocks, newBlock] };
              }
              return column;
            });
            
            const updatedBlock = {
              ...block,
              content: {
                ...block.content,
                columns: updatedColumns
              }
            };
            
            console.log('useColumnDrop: Updated layout block with new nested block');
            return updatedBlock;
          }
          return block;
        });
        
        console.log('useColumnDrop: Returning updated blocks with new nested block');
        return updatedBlocks;
        
      } else if (DragDataService.isExistingBlockReorder(dragData)) {
        console.log('useColumnDrop: Processing existing block reorder');
        
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
                console.log('useColumnDrop: Removed block from original column');
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
          console.error('useColumnDrop: Dropped block not found:', droppedBlockId);
          return prev;
        }
        
        console.log('useColumnDrop: Found block to move:', droppedBlock.type);
        
        // Add block to the target column
        const finalBlocks = updatedBlocks.map(block => {
          if (block.id === layoutBlockId && block.type === 'columns') {
            const updatedColumns = block.content.columns.map((column, index) => {
              if (index === columnIndex) {
                console.log('useColumnDrop: Adding moved block to target column');
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
        
        console.log('useColumnDrop: Completed block reorder');
        return finalBlocks;
      }
      
      console.warn('useColumnDrop: Unhandled drag data type:', dragData);
      return prev;
    });
  }, [setBlocks, blockFactory]);

  return {
    handleColumnDrop
  };
};
