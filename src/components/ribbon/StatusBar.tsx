
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, ZoomIn, ZoomOut } from 'lucide-react';

interface StatusBarProps {
  selectedBlockId: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  wordCount?: number;
  blockCount?: number;
  onPreviewModeChange?: (mode: 'desktop' | 'mobile') => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode,
  wordCount = 0,
  blockCount = 0,
  onPreviewModeChange
}) => {
  return (
    <div className="status-bar bg-blue-600 text-white px-4 py-2 flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <span className="text-white/90">Ready</span>
        
        <div className="flex items-center gap-2">
          <span>Words: {wordCount}</span>
          <span>Blocks: {blockCount}</span>
        </div>
        
        {selectedBlockId && (
          <Badge variant="outline" className="text-white border-white/30 bg-white/10">
            Selected: {selectedBlockId}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
            onClick={() => onPreviewModeChange?.('desktop')}
          >
            <Monitor className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
            onClick={() => onPreviewModeChange?.('mobile')}
          >
            <Smartphone className="w-3 h-3" />
          </Button>
          <span className="text-white/90">{canvasWidth}px</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white/20">
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-white/90">100%</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white/20">
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
