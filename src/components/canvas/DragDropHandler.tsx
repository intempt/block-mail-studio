
import { useState, useCallback } from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { generateUniqueId } from '@/utils/idGenerator';
import { createBlock } from '@/utils/enhancedBlockFactory';

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
    console.log('=== Main Drag Start ===');
    console.log('Starting drag for block:', blockId);
    e.stopPropagation();
    const blockType = (e.target as HTMLElement).dataset.blockType;
    setCurrentDragType(blockType === 'columns' ? 'layout' : 'block');
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.effectAllowed = 'move';
    console.log('Drag data set:', blockId);
  }, [setCurrentDragType]);

  const handleBlockDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    console.log('=== Block Reorder Drag Start ===');
    console.log('Starting block reorder drag for:', blockId);
    e.stopPropagation();
    setCurrentDragType('reorder');
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.effectAllowed = 'move';
    console.log('Block reorder drag data set:', blockId);
  }, [setCurrentDragType]);

  const createBlockFromDragData = useCallback((dragData: any) => {
    console.log('Creating block from drag data:', dragData);
    
    if (!dragData || !dragData.blockType) {
      console.error('Invalid drag data - missing blockType:', dragData);
      return null;
    }
    
    try {
      // Use the enhanced block factory for proper block creation
      const newBlock = createBlock(dragData.blockType);

      // Handle layout-specific data for columns
      if (dragData.layoutData && dragData.blockType === 'columns') {
        const columnCount = dragData.layoutData.columnCount || 2;
        const columnRatio = dragData.layoutData.columnRatio || '50-50';
        
        const columns = Array.from({ length: columnCount }, (_, index) => ({
          id: generateUniqueId(`column-${index}`),
          blocks: []
        }));

        newBlock.content = {
          ...newBlock.content,
          columnRatio,
          columns,
          gap: '16px'
        };
      }

      console.log('Successfully created block:', newBlock);
      return newBlock;
    } catch (error) {
      console.error('Error creating block from drag data:', error);
      return null;
    }
  }, []);

  const handleCanvasDrop = useCallback(async (e: React.DragEvent) => {
    console.log('=== Canvas Drop Event START ===');
    e.preventDefault();
    setIsDraggingOver(false);
    setDragOverIndex(null);

    console.log('Canvas drop event triggered');
    console.log('Event dataTransfer:', e.dataTransfer);
    console.log('Event dataTransfer types:', e.dataTransfer.types);

    try {
      let dragDataString = '';
      
      dragDataString = e.dataTransfer.getData('text/plain');
      console.log('Raw drag data (text/plain):', dragDataString);
      
      if (!dragDataString) {
        dragDataString = e.dataTransfer.getData('application/json');
        console.log('Raw drag data (application/json):', dragDataString);
      }
      
      console.log('All available data types:', Array.from(e.dataTransfer.types));
      for (const type of e.dataTransfer.types) {
        const data = e.dataTransfer.getData(type);
        console.log(`Data for type ${type}:`, data);
      }

      if (!dragDataString) {
        console.error('No drag data found in any format');
        console.error('DataTransfer object:', {
          types: Array.from(e.dataTransfer.types),
          effectAllowed: e.dataTransfer.effectAllowed,
          dropEffect: e.dataTransfer.dropEffect
        });
        return { success: false };
      }

      let dragData;
      try {
        dragData = JSON.parse(dragDataString);
        console.log('Successfully parsed drag data:', dragData);
      } catch (parseError) {
        console.error('Failed to parse drag data as JSON:', parseError);
        console.log('Treating as block ID for reordering:', dragDataString);
        
        const blockId = dragDataString;
        
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
          
          console.log('Reordered blocks successfully');
          return reorderedBlocks;
        });
        console.log('=== Canvas Drop Event END (Reorder) ===');
        return { success: true, isReorder: true };
      }

      const blockType = dragData.blockType;

      if (!blockType) {
        console.error('No blockType found in drag data:', dragData);
        console.log('=== Canvas Drop Event END (Error) ===');
        return { success: false };
      }

      console.log('Creating new block of type:', blockType);

      const newBlock = createBlockFromDragData(dragData);

      if (!newBlock) {
        console.error('Failed to create block from drag data');
        console.log('=== Canvas Drop Event END (Error) ===');
        return { success: false };
      }

      console.log('Adding new block to canvas:', newBlock);

      setBlocks(prev => {
        const newBlocks = [...prev];
        if (dragOverIndex === null || dragOverIndex >= newBlocks.length) {
          newBlocks.push(newBlock);
          console.log('Added block to end of canvas');
        } else {
          newBlocks.splice(dragOverIndex, 0, newBlock);
          console.log('Inserted block at index:', dragOverIndex);
        }
        
        console.log('Updated blocks array length:', newBlocks.length);
        console.log('New block added with ID:', newBlock.id);
        return newBlocks;
      });

      console.log('Block successfully added to canvas');
      console.log('=== Canvas Drop Event END (Success) ===');
      
      // Return information about the dropped block
      return { 
        success: true, 
        blockId: newBlock.id, 
        blockType: newBlock.type,
        isNewBlock: true 
      };
    } catch (error) {
      console.error('Error handling canvas drop:', error);
      console.log('=== Canvas Drop Event END (Error) ===');
      return { success: false };
    }
  }, [setBlocks, setIsDraggingOver, setDragOverIndex, createBlockFromDragData, dragOverIndex]);

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
    console.log('=== Column Drop Event START ===');
    console.log('Column drop - layoutBlockId:', layoutBlockId, 'columnIndex:', columnIndex);
    e.preventDefault();
    e.stopPropagation();
    
    // Get drag data from all possible formats
    let rawDragData = '';
    const dataTypes = Array.from(e.dataTransfer.types);
    console.log('Available data types:', dataTypes);
    
    // Try each data type until we find data
    for (const type of dataTypes) {
      const data = e.dataTransfer.getData(type);
      console.log(`Data for type ${type}:`, data);
      if (data && data.length > 0) {
        rawDragData = data;
        break;
      }
    }
    
    if (!rawDragData) {
      console.error('No drag data found in column drop');
      console.error('Available types:', dataTypes);
      console.error('DataTransfer object:', e.dataTransfer);
      return;
    }

    console.log('Column drop - raw drag data found:', rawDragData);

    let dragData;
    let isNewBlock = false;
    
    // Try to parse as JSON first (new block from palette)
    try {
      dragData = JSON.parse(rawDragData);
      isNewBlock = true;
      console.log('Column drop - parsed as new block from palette:', dragData);
    } catch (error) {
      // If parsing fails, treat as existing block ID
      dragData = rawDragData;
      isNewBlock = false;
      console.log('Column drop - treating as existing block ID:', dragData);
    }

    setBlocks(prev => {
      if (isNewBlock) {
        console.log('Creating new block for column from palette data');
        const newBlock = createBlockFromDragData(dragData);
        
        if (!newBlock) {
          console.error('Failed to create new block for column');
          return prev;
        }
        
        console.log('Created new block for column:', newBlock.id, newBlock.type);
        
        return prev.map(block => {
          if (block.id === layoutBlockId && block.type === 'columns') {
            const updatedColumns = block.content.columns.map((column, index) => {
              if (index === columnIndex) {
                console.log('Adding new block to column', index);
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
      } else {
        // Handle existing block movement
        const droppedBlockId = dragData;
        console.log('Moving existing block to column:', droppedBlockId);
        
        let droppedBlock: EmailBlock | undefined;
        
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
        }).filter(block => block.id !== droppedBlockId);
        
        if (!droppedBlock) {
          droppedBlock = prev.find(b => b.id === droppedBlockId);
        }
        
        if (!droppedBlock) {
          console.error('Dropped block not found:', droppedBlockId);
          return prev;
        }
        
        console.log('Found existing block to move:', droppedBlock.type);
        
        const finalBlocks = updatedBlocks.map(block => {
          if (block.id === layoutBlockId && block.type === 'columns') {
            const updatedColumns = block.content.columns.map((column, index) => {
              if (index === columnIndex) {
                console.log('Moving existing block to column', index);
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
      }
    });
    
    console.log('=== Column Drop Event END ===');
  }, [setBlocks, createBlockFromDragData]);

  return {
    handleDragStart,
    handleBlockDragStart,
    handleCanvasDragEnter: useCallback((e: React.DragEvent) => {
      console.log('=== Canvas Drag Enter ===');
      e.preventDefault();
      setIsDraggingOver(true);
      setDragOverIndex(null);
      console.log('Canvas drag enter completed');
    }, [setIsDraggingOver, setDragOverIndex]),
    handleCanvasDragOver: useCallback((e: React.DragEvent) => {
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
    }, [setDragOverIndex, setIsDraggingOver]),
    handleCanvasDragLeave: useCallback((e: React.DragEvent) => {
      console.log('=== Canvas Drag Leave ===');
      e.preventDefault();
      setIsDraggingOver(false);
      setDragOverIndex(null);
      console.log('Canvas drag leave completed');
    }, [setIsDraggingOver, setDragOverIndex]),
    handleCanvasDrop,
    handleBlockDrop,
    handleColumnDrop
  };
};
