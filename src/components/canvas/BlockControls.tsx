
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Copy, GripVertical, Star, Variable } from 'lucide-react';

interface BlockControlsProps {
  blockId: string;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
  onSaveAsSnippet?: (blockId: string) => void;
  isStarred?: boolean;
  onUnstar?: (blockId: string) => void;
  onAddVariable?: (blockId: string) => void;
}

export const BlockControls: React.FC<BlockControlsProps> = ({
  blockId,
  onDelete,
  onDuplicate,
  onDragStart,
  onSaveAsSnippet,
  isStarred = false,
  onUnstar,
  onAddVariable
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log('BlockControls: Drag start for block:', blockId);
    onDragStart(e, blockId);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStarred && onUnstar) {
      onUnstar(blockId);
    } else if (onSaveAsSnippet) {
      onSaveAsSnippet(blockId);
    }
  };

  const handleAddVariable = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddVariable) {
      onAddVariable(blockId);
    }
  };

  return (
    <TooltipProvider>
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col gap-1 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 cursor-grab hover:cursor-grabbing hover:bg-gray-50"
              draggable={true}
              onDragStart={handleDragStart}
            >
              <GripVertical className="w-4 h-4 text-gray-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Drag to reorder</p>
          </TooltipContent>
        </Tooltip>
        
        {onAddVariable && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                onClick={handleAddVariable}
              >
                <Variable className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add variable</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {onSaveAsSnippet && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className={`w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 transition-colors ${
                  isStarred 
                    ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                    : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
                onClick={handleStarClick}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-400' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isStarred ? "Remove from snippets" : "Save as snippet"}</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(blockId);
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate block</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(blockId);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete block</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
