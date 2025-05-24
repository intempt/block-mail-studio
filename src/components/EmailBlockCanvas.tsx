
import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { EmailBlock, EmailCanvas } from '@/types/emailBlocks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Move } from 'lucide-react';
import { BlockRenderer } from './BlockRenderer';
import { ContextualEditor } from './ContextualEditor';

interface EmailBlockCanvasProps {
  canvas: EmailCanvas;
  onCanvasChange: (canvas: EmailCanvas) => void;
  onBlockSelect: (blockId: string | null) => void;
  selectedBlockId: string | null;
}

export const EmailBlockCanvas: React.FC<EmailBlockCanvasProps> = ({
  canvas,
  onCanvasChange,
  onBlockSelect,
  selectedBlockId
}) => {
  const [draggedBlock, setDraggedBlock] = useState<EmailBlock | null>(null);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const newBlocks = Array.from(canvas.blocks);
    const [reorderedBlock] = newBlocks.splice(result.source.index, 1);
    newBlocks.splice(result.destination.index, 0, reorderedBlock);

    onCanvasChange({
      ...canvas,
      blocks: newBlocks
    });
  }, [canvas, onCanvasChange]);

  const handleBlockUpdate = useCallback((blockId: string, updatedBlock: EmailBlock) => {
    const newBlocks = canvas.blocks.map(block => 
      block.id === blockId ? updatedBlock : block
    );
    onCanvasChange({
      ...canvas,
      blocks: newBlocks
    });
  }, [canvas, onCanvasChange]);

  const handleBlockDelete = useCallback((blockId: string) => {
    const newBlocks = canvas.blocks.filter(block => block.id !== blockId);
    onCanvasChange({
      ...canvas,
      blocks: newBlocks
    });
    onBlockSelect(null);
  }, [canvas, onCanvasChange, onBlockSelect]);

  const handleBlockDuplicate = useCallback((blockId: string) => {
    const blockToDuplicate = canvas.blocks.find(block => block.id === blockId);
    if (!blockToDuplicate) return;

    const duplicatedBlock: EmailBlock = {
      ...blockToDuplicate,
      id: `${blockToDuplicate.id}-copy-${Date.now()}`,
    };

    const blockIndex = canvas.blocks.findIndex(block => block.id === blockId);
    const newBlocks = [...canvas.blocks];
    newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);

    onCanvasChange({
      ...canvas,
      blocks: newBlocks
    });
  }, [canvas, onCanvasChange]);

  const handleBlockClick = useCallback((blockId: string) => {
    onBlockSelect(blockId === selectedBlockId ? null : blockId);
  }, [selectedBlockId, onBlockSelect]);

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      {/* Canvas Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Email Canvas</h3>
        <p className="text-sm text-gray-600">Drag blocks to reorder, click to edit</p>
      </div>

      {/* Email Canvas */}
      <Card className="mx-auto bg-white shadow-sm" style={{ width: canvas.settings.width }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="email-canvas">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-96 p-4 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                style={{ backgroundColor: canvas.settings.backgroundColor }}
              >
                {canvas.blocks.length === 0 ? (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <Move className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Drag blocks here to start building your email</p>
                    </div>
                  </div>
                ) : (
                  canvas.blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group relative mb-2 ${
                            selectedBlockId === block.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                          } ${snapshot.isDragging ? 'opacity-50' : ''}`}
                        >
                          {/* Block Actions */}
                          <div className="absolute -top-2 -right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBlockDuplicate(block.id)}
                              className="h-6 w-6 p-0 bg-white shadow-sm"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBlockDelete(block.id)}
                              className="h-6 w-6 p-0 bg-white shadow-sm text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab flex items-center justify-center"
                          >
                            <Move className="w-3 h-3 text-gray-500" />
                          </div>

                          {/* Block Content */}
                          <div onClick={() => handleBlockClick(block.id)} className="cursor-pointer">
                            <BlockRenderer 
                              block={block} 
                              isSelected={selectedBlockId === block.id}
                              onUpdate={(updatedBlock) => handleBlockUpdate(block.id, updatedBlock)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>

      {/* Contextual Editor */}
      {selectedBlockId && (
        <ContextualEditor
          block={canvas.blocks.find(b => b.id === selectedBlockId)!}
          onBlockUpdate={(updatedBlock) => handleBlockUpdate(selectedBlockId, updatedBlock)}
          onClose={() => onBlockSelect(null)}
        />
      )}
    </div>
  );
};
