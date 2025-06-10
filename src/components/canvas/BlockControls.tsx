
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Copy, GripVertical, Star } from 'lucide-react';
import { VariableSelector } from './VariableSelector';

interface VariableOption {
  text: string;
  value: string;
}

interface BlockControlsProps {
  blockId: string;
  isVisible: boolean;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
  onSaveAsSnippet?: (blockId: string) => void;
  isStarred?: boolean;
  onUnstar?: (blockId: string) => void;
  onAddVariable?: (blockId: string, variable: VariableOption) => void;
  onControlsEnter: (blockId: string) => void;
  onControlsLeave: (blockId: string) => void;
}

export const BlockControls: React.FC<BlockControlsProps> = ({
  blockId,
  isVisible,
  onDelete,
  onDuplicate,
  onDragStart,
  onSaveAsSnippet,
  isStarred = false,
  onUnstar,
  onAddVariable,
  onControlsEnter,
  onControlsLeave
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log('BlockControls: Drag start for block:', blockId);
    onDragStart(e, blockId);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isStarred && onUnstar) {
      onUnstar(blockId);
    } else if (onSaveAsSnippet) {
      onSaveAsSnippet(blockId);
    }
  };

  const handleVariableSelect = (variable: VariableOption) => {
    if (onAddVariable) {
      onAddVariable(blockId, variable);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(blockId);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDuplicate(blockId);
  };

  const handleControlsMouseEnter = () => {
    onControlsEnter(blockId);
  };

  const handleControlsMouseLeave = () => {
    onControlsLeave(blockId);
  };

  return (
    <TooltipProvider>
      <div 
        className={`absolute -left-14 top-2 transition-all duration-200 flex flex-col gap-1 z-50 bg-white/95 backdrop-blur-sm rounded-lg p-2 border border-gray-200 shadow-lg ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          isolation: 'isolate',
          transform: 'translateZ(0)',
        }}
        onMouseEnter={handleControlsMouseEnter}
        onMouseLeave={handleControlsMouseLeave}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-white shadow-sm border border-gray-200 cursor-grab hover:cursor-grabbing hover:bg-gray-50 hover:scale-110 transition-all"
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
              <div>
                <VariableSelector onSelectVariable={handleVariableSelect} />
              </div>
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
                className={`w-8 h-8 p-0 bg-white shadow-sm border border-gray-200 transition-all hover:scale-110 ${
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
              className="w-8 h-8 p-0 bg-white shadow-sm border border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:scale-110 transition-all"
              onClick={handleDuplicate}
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
              className="w-8 h-8 p-0 bg-white shadow-sm border border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:scale-110 transition-all"
              onClick={handleDelete}
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
