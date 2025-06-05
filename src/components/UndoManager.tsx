
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';

interface UndoManagerProps {
  onUndo?: () => void;
  onRedo?: () => void;
}

export const UndoManager: React.FC<UndoManagerProps> = ({
  onUndo,
  onRedo
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        className="h-8 w-8 p-0"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        className="h-8 w-8 p-0"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};
