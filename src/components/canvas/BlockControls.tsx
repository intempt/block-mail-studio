
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, GripVertical, Star } from 'lucide-react';

interface BlockControlsProps {
  blockId: string;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
  onSaveAsSnippet?: (blockId: string) => void;
}

export const BlockControls: React.FC<BlockControlsProps> = ({
  blockId,
  onDelete,
  onDuplicate,
  onDragStart,
  onSaveAsSnippet
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log('BlockControls: Drag start for block:', blockId);
    onDragStart(e, blockId);
  };

  return (
    <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col gap-1 z-10">
      <Button
        size="sm"
        variant="ghost"
        className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 cursor-grab hover:cursor-grabbing hover:bg-gray-50"
        draggable={true}
        onDragStart={handleDragStart}
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-600" />
      </Button>
      
      {onSaveAsSnippet && (
        <Button
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          onClick={(e) => {
            e.stopPropagation();
            onSaveAsSnippet(blockId);
          }}
          title="Save as snippet"
        >
          <Star className="w-4 h-4" />
        </Button>
      )}
      
      <Button
        size="sm"
        variant="ghost"
        className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate(blockId);
        }}
        title="Duplicate block"
      >
        <Copy className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(blockId);
        }}
        title="Delete block"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
