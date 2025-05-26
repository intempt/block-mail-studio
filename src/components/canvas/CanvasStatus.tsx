
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone } from 'lucide-react';

interface CanvasStatusProps {
  selectedBlockId: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode
}) => {
  return (
    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {previewMode === 'desktop' ? 
            <Monitor className="w-3 h-3" /> : 
            <Smartphone className="w-3 h-3" />
          }
          <span>{canvasWidth}px</span>
        </div>
        
        {selectedBlockId && (
          <Badge variant="outline" className="text-xs">
            Block: {selectedBlockId}
          </Badge>
        )}
      </div>
      
      <div className="text-right">
        <span className="text-gray-400">Email Canvas</span>
      </div>
    </div>
  );
};
