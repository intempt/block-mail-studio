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

  const getCompleteDefaultContent = useCallback((blockType: string) => {
    console.log('Getting default content for block type:', blockType);
    
    // Get base content from provided function
    const baseContent = getDefaultContent(blockType);
    
    // Ensure we have complete content for all block types
    const defaultContentMap = {
      text: {
        html: '<p>Enter your text here...</p>',
        textStyle: 'normal',
        ...baseContent
      },
      image: {
        src: '',
        alt: 'Image description',
        width: '100%',
        height: 'auto',
        alignment: 'center',
        ...baseContent
      },
      button: {
        text: 'Click Here',
        url: '#',
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        borderRadius: '4px',
        padding: '12px 24px',
        alignment: 'center',
        ...baseContent
      },
      divider: {
        style: 'solid',
        color: '#e5e7eb',
        thickness: '1px',
        width: '100%',
        ...baseContent
      },
      spacer: {
        height: '20px',
        ...baseContent
      },
      social: {
        platforms: [],
        alignment: 'center',
        iconSize: 'medium',
        ...baseContent
      },
      video: {
        src: '',
        thumbnail: '',
        width: '100%',
        height: 'auto',
        alignment: 'center',
        ...baseContent
      },
      html: {
        content: '<p>Custom HTML content</p>',
        ...baseContent
      },
      table: {
        rows: 2,
        columns: 2,
        data: [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']],
        ...baseContent
      },
      content: {
        html: '<p>Dynamic content placeholder</p>',
        contentType: 'text',
        ...baseContent
      },
      productfeed: {
        products: [],
        layout: 'grid',
        itemsPerRow: 2,
        ...baseContent
      },
      columns: {
        columnRatio: '50-50',
        columns: [],
        gap: '16px',
        ...baseContent
      }
    };
    
    const content = defaultContentMap[blockType as keyof typeof defaultContentMap] || baseContent;
    console.log('Generated default content for', blockType, ':', content);
    return content;
  }, [getDefaultContent]);

  const getCompleteDefaultStyles = useCallback((blockType: string) => {
    console.log('Getting default styles for block type:', blockType);
    
    // Get base styles from provided function
    const baseStyles = getDefaultStyles(blockType);
    
    // Ensure complete responsive styles
    const completeStyles = {
      desktop: {
        width: '100%',
        height: 'auto',
        margin: '0',
        padding: '0',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0',
        ...baseStyles?.desktop
      },
      tablet: {
        width: '100%',
        height: 'auto',
        margin: '0',
        padding: '0',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0',
        ...baseStyles?.tablet
      },
      mobile: {
        width: '100%',
        height: 'auto',
        margin: '0',
        padding: '0',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0',
        ...baseStyles?.mobile
      }
    };
    
    console.log('Generated default styles for', blockType, ':', completeStyles);
    return completeStyles;
  }, [getDefaultStyles]);

  const createBlockFromDragData = useCallback((dragData: any) => {
    console.log('Creating block from drag data:', dragData);
    
    if (!dragData || !dragData.blockType) {
      console.error('Invalid drag data - missing blockType:', dragData);
      return null;
    }
    
    try {
      const baseBlock = {
        id: generateUniqueId('block'),
        type: dragData.blockType,
        content: getCompleteDefaultContent(dragData.blockType),
        styling: getCompleteDefaultStyles(dragData.blockType),
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        },
        isStarred: false
      };

      // Handle layout-specific data for columns
      if (dragData.layoutData && dragData.blockType === 'columns') {
        const columnCount = dragData.layoutData.columnCount || 2;
        const columnRatio = dragData.layoutData.columnRatio || '50-50';
        
        const columns = Array.from({ length: columnCount }, (_, index) => ({
          id: generateUniqueId(`column-${index}`),
          blocks: []
        }));

        baseBlock.content = {
          ...baseBlock.content,
          columnRatio,
          columns,
          gap: '16px'
        };
      }

      console.log('Successfully created block:', baseBlock);
      return baseBlock;
    } catch (error) {
      console.error('Error creating block from drag data:', error);
      return null;
    }
  }, [getCompleteDefaultContent, getCompleteDefaultStyles]);

  const handleCanvasDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setDragOverIndex(null);

    console.log('Canvas drop event triggered');

    try {
      const dragDataString = e.dataTransfer.getData('text/plain');
      console.log('Raw drag data string:', dragDataString);

      if (!dragDataString) {
        console.error('No drag data found');
        return;
      }

      let dragData;
      try {
        dragData = JSON.parse(dragDataString);
        console.log('Parsed drag data:', dragData);
      } catch (parseError) {
        console.error('Failed to parse drag data:', parseError);
        
        // Fallback: treat as block ID reordering
        const blockId = dragDataString;
        console.log('Treating as block reorder for ID:', blockId);
        
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
        return;
      }

      const blockType = dragData.blockType;

      if (!blockType) {
        console.error('No blockType found in drag data:', dragData);
        return;
      }

      console.log('Creating new block of type:', blockType);

      const newBlock = createBlockFromDragData(dragData);

      if (!newBlock) {
        console.error('Failed to create block from drag data');
        return;
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
        
        console.log('Updated blocks array:', newBlocks);
        return newBlocks;
      });

      console.log('Block successfully added to canvas');
    } catch (error) {
      console.error('Error handling canvas drop:', error);
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
