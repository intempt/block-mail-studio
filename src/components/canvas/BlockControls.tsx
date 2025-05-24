
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
  return (
    <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="w-6 h-6 p-0 bg-white shadow-sm cursor-grab"
        onMouseDown={(e) => onDragStart(e as any, blockId)}
      >
        <GripVertical className="w-3 h-3" />
      </Button>
      {onSaveAsSnippet && (
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0 bg-white shadow-sm text-yellow-600 hover:text-yellow-700"
          onClick={(e) => {
            e.stopPropagation();
            onSaveAsSnippet(blockId);
          }}
          title="Save as snippet"
        >
          <Star className="w-3 h-3" />
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="w-6 h-6 p-0 bg-white shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate(blockId);
        }}
      >
        <Copy className="w-3 h-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="w-6 h-6 p-0 bg-white shadow-sm text-red-600 hover:text-red-700"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(blockId);
        }}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
};
