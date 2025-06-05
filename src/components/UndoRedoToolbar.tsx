
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UndoRedoToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const UndoRedoToolbar: React.FC<UndoRedoToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 w-8 p-0"
            >
              <Undo className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-8 w-8 p-0"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
