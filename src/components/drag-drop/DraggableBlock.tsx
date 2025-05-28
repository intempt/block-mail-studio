
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { EmailBlock } from '@/types/emailBlocks';
import { BlockRenderer } from '../BlockRenderer';
import { BlockControls } from '../canvas/BlockControls';

interface DraggableBlockProps {
  block: EmailBlock;
  index: number;
  isSelected: boolean;
  onBlockClick: (blockId: string) => void;
  onBlockUpdate: (block: EmailBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onSaveAsSnippet: (blockId: string) => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  index,
  isSelected,
  onBlockClick,
  onBlockUpdate,
  onDeleteBlock,
  onDuplicateBlock,
  onSaveAsSnippet
}) => {
  return (
    <Draggable draggableId={block.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`email-block group relative mb-4 rounded-lg transition-all duration-200 ${
            isSelected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
          } ${
            snapshot.isDragging 
              ? 'shadow-2xl rotate-2 scale-105 z-50' 
              : 'hover:shadow-lg'
          }`}
          onClick={() => onBlockClick(block.id)}
        >
          <div {...provided.dragHandleProps}>
            <BlockControls
              blockId={block.id}
              onDelete={onDeleteBlock}
              onDuplicate={onDuplicateBlock}
              onDragStart={() => {}} // Handled by react-beautiful-dnd
              onSaveAsSnippet={onSaveAsSnippet}
            />
          </div>
          
          <BlockRenderer 
            block={block}
            isSelected={isSelected}
            onUpdate={onBlockUpdate}
          />
          
          {snapshot.isDragging && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 border-2 border-blue-400 border-dashed rounded-lg pointer-events-none" />
          )}
        </div>
      )}
    </Draggable>
  );
};
