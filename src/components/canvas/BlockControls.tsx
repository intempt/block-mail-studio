
import React, { useState } from 'react';
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
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
  onSaveAsSnippet?: (blockId: string) => void;
  isStarred?: boolean;
  onUnstar?: (blockId: string) => void;
  onAddVariable?: (blockId: string, variable: VariableOption) => void;
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
  const [isHovering, setIsHovering] = useState(false);
  const [stickyMode, setStickyMode] = useState(false);

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

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovering(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!stickyMode) {
      setIsHovering(false);
    }
  };

  const handleControlInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setStickyMode(true);
    setTimeout(() => setStickyMode(false), 2000); // Auto-release sticky mode after 2 seconds
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

  return (
    <TooltipProvider>
      <div 
        className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col gap-1 z-30 bg-white/10 backdrop-blur-sm rounded-lg p-1"
        style={{
          isolation: 'isolate',
          transform: 'translateZ(0)', // Create stacking context
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 cursor-grab hover:cursor-grabbing hover:bg-gray-50 relative z-10"
              draggable={true}
              onDragStart={handleDragStart}
              onMouseDown={handleControlInteraction}
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
              <div onMouseDown={handleControlInteraction}>
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
                className={`w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 transition-colors relative z-10 ${
                  isStarred 
                    ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                    : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
                onClick={handleStarClick}
                onMouseDown={handleControlInteraction}
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
              className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 relative z-10"
              onClick={handleDuplicate}
              onMouseDown={handleControlInteraction}
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
              className="w-8 h-8 p-0 bg-white shadow-lg border border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50 relative z-10"
              onClick={handleDelete}
              onMouseDown={handleControlInteraction}
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
