
import React from 'react';
import { Eye } from 'lucide-react';

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

interface RibbonPreviewIndicatorProps {
  viewMode: ViewMode;
}

export const RibbonPreviewIndicator: React.FC<RibbonPreviewIndicatorProps> = ({ viewMode }) => {
  if (viewMode === 'edit') return null;

  return (
    <div className="px-6 py-2 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center justify-center gap-2">
        <Eye className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700">
          {viewMode === 'desktop-preview' ? 'Gmail Desktop Preview' : 'Gmail Mobile Preview'}
        </span>
      </div>
    </div>
  );
};
