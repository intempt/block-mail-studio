
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, ZoomIn, ZoomOut } from 'lucide-react';

interface StatusBarProps {
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  blockCount?: number;
  wordCount?: number;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  canvasWidth,
  previewMode,
  blockCount = 0,
  wordCount = 0,
  zoom = 100,
  onZoomChange
}) => {
  const handleZoomIn = () => {
    if (onZoomChange && zoom < 200) {
      onZoomChange(zoom + 25);
    }
  };

  const handleZoomOut = () => {
    if (onZoomChange && zoom > 50) {
      onZoomChange(zoom - 25);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {previewMode === 'desktop' ? 
            <Monitor className="w-4 h-4" /> : 
            <Smartphone className="w-4 h-4" />
          }
          <span>{canvasWidth}px</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {blockCount} blocks
          </Badge>
          <Badge variant="outline" className="text-xs">
            {wordCount} words
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="h-6 w-6 p-0"
        >
          <ZoomOut className="w-3 h-3" />
        </Button>
        <span className="min-w-[50px] text-center">{zoom}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="h-6 w-6 p-0"
        >
          <ZoomIn className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
