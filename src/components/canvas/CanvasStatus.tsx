
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CanvasStatusProps {
  blocksCount: number;
  canvasWidth: number;
  selectedBlockId: string | null;
  isDraggingOver: boolean;
  previewMode: 'desktop' | 'mobile' | 'tablet';
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  blocksCount,
  canvasWidth,
  selectedBlockId,
  isDraggingOver,
  previewMode
}) => {
  return (
    <div className="bg-white border-t p-2 text-xs text-gray-600 flex items-center justify-between">
      <div>
        Blocks: {blocksCount} | Width: {canvasWidth}px
        {selectedBlockId && <span className="ml-2 text-blue-600">• Block selected</span>}
        {isDraggingOver && <span className="ml-2 text-green-600">• Drop zone active</span>}
      </div>
      <Badge variant="outline" className="text-xs">
        {previewMode}
      </Badge>
    </div>
  );
};
