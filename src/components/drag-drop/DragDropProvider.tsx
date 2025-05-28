
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { EmailBlock } from '@/types/emailBlocks';
import { createDragData, parseDragData } from '@/utils/dragDropUtils';

interface DragDropProviderProps {
  children: React.ReactNode;
  blocks: EmailBlock[];
  onBlocksChange: (blocks: EmailBlock[]) => void;
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  blocks,
  onBlocksChange,
  onBlockAdd
}) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    // Handle cancelled drag
    if (!destination) {
      return;
    }

    // Handle same position drop
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle different drop types
    if (type === 'BLOCK_REORDER') {
      handleBlockReorder(source, destination);
    } else if (type === 'BLOCK_ADD') {
      handleBlockAdd(draggableId, destination);
    } else if (type === 'COLUMN_DROP') {
      handleColumnDrop(draggableId, destination);
    }
  };

  const handleBlockReorder = (source: any, destination: any) => {
    if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      const newBlocks = Array.from(blocks);
      const [reorderedBlock] = newBlocks.splice(source.index, 1);
      newBlocks.splice(destination.index, 0, reorderedBlock);
      onBlocksChange(newBlocks);
    }
  };

  const handleBlockAdd = (blockType: string, destination: any) => {
    if (destination.droppableId === 'canvas') {
      // Parse any layout data from the blockType
      let layoutConfig = undefined;
      if (blockType.startsWith('layout:')) {
        const layoutData = blockType.replace('layout:', '');
        try {
          layoutConfig = JSON.parse(layoutData);
          onBlockAdd('columns', layoutConfig);
        } catch (error) {
          console.error('Error parsing layout data:', error);
        }
      } else {
        onBlockAdd(blockType);
      }
    }
  };

  const handleColumnDrop = (blockType: string, destination: any) => {
    // Handle dropping blocks into columns
    const [layoutId, columnIndex] = destination.droppableId.split('-');
    if (layoutId && columnIndex !== undefined) {
      const newBlocks = blocks.map(block => {
        if (block.id === layoutId && block.type === 'columns') {
          const updatedColumns = [...block.content.columns];
          if (updatedColumns[parseInt(columnIndex)]) {
            // Create new block for the column
            const newBlock: EmailBlock = {
              id: `block-${Date.now()}`,
              type: blockType as any,
              content: getDefaultContent(blockType),
              styling: getDefaultStyles(),
              position: { x: 0, y: 0 },
              displayOptions: {
                showOnDesktop: true,
                showOnTablet: true,
                showOnMobile: true
              }
            };
            
            updatedColumns[parseInt(columnIndex)] = {
              ...updatedColumns[parseInt(columnIndex)],
              blocks: [...updatedColumns[parseInt(columnIndex)].blocks, newBlock]
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
      });
      
      onBlocksChange(newBlocks);
    }
  };

  const getDefaultContent = (blockType: string) => {
    switch (blockType) {
      case 'text':
        return { html: '<p>Start typing your content here...</p>', textStyle: 'normal' };
      case 'button':
        return { text: 'Click Here', link: '#', style: 'solid', size: 'medium' };
      case 'image':
        return { src: '', alt: '', alignment: 'center', width: '100%', isDynamic: false };
      case 'spacer':
        return { height: '20px', mobileHeight: '20px' };
      case 'divider':
        return { style: 'solid', thickness: '1px', color: '#ddd', width: '100%', alignment: 'center' };
      default:
        return {};
    }
  };

  const getDefaultStyles = () => ({
    desktop: { width: '100%', height: 'auto' },
    tablet: { width: '100%', height: 'auto' },
    mobile: { width: '100%', height: 'auto' }
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {children}
    </DragDropContext>
  );
};
