
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { EmailBlock } from '@/types/emailBlocks';

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
    const { destination, source, draggableId } = result;

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

    // Handle block reordering within canvas
    if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      handleBlockReorder(source, destination);
    } 
    // Handle adding new blocks from palette to canvas
    else if (source.droppableId === 'palette-blocks' && destination.droppableId === 'canvas') {
      const blockType = draggableId.replace('palette-', '');
      handleBlockAdd(blockType, destination);
    }
    // Handle column drops
    else if (destination.droppableId.includes('-col-')) {
      const blockType = draggableId.replace('palette-', '');
      handleColumnDrop(blockType, destination);
    }
  };

  const handleBlockReorder = (source: any, destination: any) => {
    const newBlocks = Array.from(blocks);
    const [reorderedBlock] = newBlocks.splice(source.index, 1);
    newBlocks.splice(destination.index, 0, reorderedBlock);
    onBlocksChange(newBlocks);
  };

  const handleBlockAdd = (blockType: string, destination: any) => {
    // Parse any layout data from the blockType
    if (blockType.startsWith('layout:')) {
      const layoutData = blockType.replace('layout:', '');
      try {
        const layoutConfig = JSON.parse(layoutData);
        onBlockAdd('columns', layoutConfig);
      } catch (error) {
        console.error('Error parsing layout data:', error);
      }
    } else {
      onBlockAdd(blockType);
    }
  };

  const handleColumnDrop = (blockType: string, destination: any) => {
    // Handle dropping blocks into columns
    const [layoutId, columnIndex] = destination.droppableId.split('-col-');
    if (layoutId && columnIndex !== undefined) {
      const newBlocks = blocks.map(block => {
        if (block.id === layoutId && block.type === 'columns') {
          const updatedColumns = [...block.content.columns];
          if (updatedColumns[parseInt(columnIndex)]) {
            // Create new block for the column
            const newBlock: EmailBlock = {
              id: `block-${Date.now()}`,
              type: blockType as any,
              content: getDefaultContentForType(blockType),
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

  const getDefaultContentForType = (blockType: string): any => {
    switch (blockType) {
      case 'text':
        return { 
          html: '<p>Start typing your content here...</p>', 
          textStyle: 'normal' as const 
        };
      case 'button':
        return { 
          text: 'Click Here', 
          link: '#', 
          style: 'solid' as const, 
          size: 'medium' as const 
        };
      case 'image':
        return { 
          src: 'https://via.placeholder.com/400x200?text=Image', 
          alt: 'Image', 
          alignment: 'center' as const, 
          width: '100%', 
          isDynamic: false 
        };
      case 'spacer':
        return { 
          height: '20px', 
          mobileHeight: '20px' 
        };
      case 'divider':
        return { 
          style: 'solid' as const, 
          thickness: '1px', 
          color: '#ddd', 
          width: '100%', 
          alignment: 'center' as const 
        };
      case 'video':
        return {
          videoUrl: '',
          thumbnail: 'https://via.placeholder.com/400x225?text=Video+Thumbnail',
          showPlayButton: true,
          platform: 'youtube' as const,
          autoThumbnail: true
        };
      case 'social':
        return {
          platforms: [
            {
              name: 'Facebook',
              url: 'https://facebook.com',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg',
              iconStyle: 'color' as const,
              showLabel: false
            }
          ],
          layout: 'horizontal' as const,
          iconSize: '32px',
          spacing: '16px'
        };
      case 'html':
        return {
          html: '<p>Custom HTML content</p>',
          customCSS: ''
        };
      case 'table':
        return {
          rows: 2,
          columns: 2,
          cells: [
            [
              { type: 'text', content: 'Header 1' },
              { type: 'text', content: 'Header 2' }
            ],
            [
              { type: 'text', content: 'Cell 1' },
              { type: 'text', content: 'Cell 2' }
            ]
          ],
          headerRow: true,
          borderStyle: 'solid' as const,
          borderColor: '#ddd',
          borderWidth: '1px'
        };
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
