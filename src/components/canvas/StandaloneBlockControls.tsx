import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Copy, GripVertical, Star } from 'lucide-react';
import { VariableSelector } from './VariableSelector';
import { Portal } from '@/components/ui/Portal';
import { calculateFloatingPosition } from '@/utils/floatingPositioning';

interface VariableOption {
  text: string;
  value: string;
}

interface StandaloneBlockControlsProps {
  selectedBlockId: string | null;
  blocks: any[]; // EmailBlock array
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
  onSaveAsSnippet?: (blockId: string) => void;
  onUnstar?: (blockId: string) => void;
  onAddVariable?: (blockId: string, variable: VariableOption) => void;
  isHoveringAnyBlock: boolean;
  isHoveringControls: boolean;
  onControlsHoverChange: (isHovering: boolean) => void;
}

export const StandaloneBlockControls: React.FC<StandaloneBlockControlsProps> = ({
  selectedBlockId,
  blocks,
  onDelete,
  onDuplicate,
  onDragStart,
  onSaveAsSnippet,
  onUnstar,
  onAddVariable,
  isHoveringAnyBlock,
  isHoveringControls,
  onControlsHoverChange
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const controlsRef = useRef<HTMLDivElement>(null);

  // Refined visibility logic - only show when hovering blocks or controls
  const shouldShowControls = selectedBlockId && (isHoveringAnyBlock || isHoveringControls);

  console.log('StandaloneBlockControls render:', {
    selectedBlockId,
    isHoveringAnyBlock,
    isHoveringControls,
    shouldShowControls
  });

  // Find the selected block to get its starred state
  const selectedBlock = blocks.find(block => {
    if (block.id === selectedBlockId) return true;
    // Also check nested blocks in columns
    if (block.type === 'columns' && block.content?.columns) {
      return block.content.columns.some(column => 
        column.blocks?.some(nestedBlock => nestedBlock.id === selectedBlockId)
      );
    }
    return false;
  });

  const getBlockElement = (blockId: string): HTMLElement | null => {
    return document.querySelector(`[data-testid="email-block-${blockId}"]`) as HTMLElement;
  };

  useEffect(() => {
    if (!selectedBlockId || !shouldShowControls || !controlsRef.current) {
      return;
    }

    const blockElement = getBlockElement(selectedBlockId);
    if (!blockElement) {
      return;
    }

    const updatePosition = () => {
      const newPosition = calculateFloatingPosition(
        blockElement,
        controlsRef.current!,
        { preferredPlacement: 'left', offset: 8 }
      );
      setPosition(newPosition);
    };

    updatePosition();

    // Update position on scroll or resize
    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, { passive: true });
    window.addEventListener('resize', handleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [selectedBlockId, shouldShowControls]);

  // Handle controls hover state
  const handleControlsMouseEnter = () => {
    console.log('Controls mouse enter');
    onControlsHoverChange(true);
  };

  const handleControlsMouseLeave = () => {
    console.log('Controls mouse leave');
    onControlsHoverChange(false);
  };

  if (!shouldShowControls) {
    return null;
  }

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, selectedBlockId!);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const isStarred = selectedBlock?.isStarred;
    if (isStarred && onUnstar) {
      onUnstar(selectedBlockId!);
    } else if (onSaveAsSnippet) {
      onSaveAsSnippet(selectedBlockId!);
    }
  };

  const handleVariableSelect = (variable: VariableOption) => {
    if (onAddVariable) {
      onAddVariable(selectedBlockId!, variable);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(selectedBlockId!);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDuplicate(selectedBlockId!);
  };

  return (
    <Portal>
      <TooltipProvider>
        <div 
          ref={controlsRef}
          className="bg-white/95 backdrop-blur-sm rounded-lg p-2 border border-gray-200 shadow-lg transition-all duration-200"
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 99999,
            pointerEvents: 'auto'
          }}
          onMouseEnter={handleControlsMouseEnter}
          onMouseLeave={handleControlsMouseLeave}
        >
          <div className="flex flex-col gap-1">
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
                      selectedBlock?.isStarred 
                        ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                        : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                    onClick={handleStarClick}
                  >
                    <Star className={`w-4 h-4 ${selectedBlock?.isStarred ? 'fill-yellow-400' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{selectedBlock?.isStarred ? "Remove from snippets" : "Save as snippet"}</p>
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
        </div>
      </TooltipProvider>
    </Portal>
  );
};
