
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { EmailBlock } from '@/types/emailBlocks';
import { DraggableBlock } from './DraggableBlock';

interface DroppableCanvasProps {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  onBlockClick: (blockId: string) => void;
  onBlockUpdate: (block: EmailBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onSaveAsSnippet: (blockId: string) => void;
}

export const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  blocks,
  selectedBlockId,
  onBlockClick,
  onBlockUpdate,
  onDeleteBlock,
  onDuplicateBlock,
  onSaveAsSnippet
}) => {
  console.log('DroppableCanvas: Received blocks:', blocks.length, blocks);

  return (
    <Droppable droppableId="canvas">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-64 p-6 transition-all duration-200 ${
            snapshot.isDraggingOver 
              ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg' 
              : ''
          }`}
        >
          {blocks.length === 0 ? (
            <div className="text-center py-16">
              <div className={`text-gray-500 transition-all duration-200 ${
                snapshot.isDraggingOver ? 'text-blue-600 scale-105' : ''
              }`}>
                <div className="text-xl font-medium mb-3">
                  {snapshot.isDraggingOver ? 'Drop here to add!' : 'Ready to build!'}
                </div>
                <div className="text-sm">
                  {snapshot.isDraggingOver 
                    ? 'Release to add this block to your email' 
                    : 'Drag a layout from the toolbar above to start building your email'
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {blocks.map((block, index) => {
                console.log('DroppableCanvas: Mapping block to DraggableBlock:', { block, index });
                return (
                  <DraggableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    isSelected={selectedBlockId === block.id}
                    onBlockClick={onBlockClick}
                    onBlockUpdate={onBlockUpdate}
                    onDeleteBlock={onDeleteBlock}
                    onDuplicateBlock={onDuplicateBlock}
                    onSaveAsSnippet={onSaveAsSnippet}
                  />
                );
              })}
            </div>
          )}
          {provided.placeholder}
          
          {snapshot.isDraggingOver && (
            <div className="mt-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 text-center text-blue-600 font-medium">
              Drop here to add block
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
};
