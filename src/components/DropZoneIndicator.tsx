
import React from 'react';
import { Plus, Layout, Move } from 'lucide-react';

interface DropZoneIndicatorProps {
  isVisible: boolean;
  dragType: 'block' | 'layout' | 'reorder';
  position?: 'top' | 'bottom' | 'middle';
  message?: string;
  className?: string;
}

export const DropZoneIndicator: React.FC<DropZoneIndicatorProps> = ({
  isVisible,
  dragType,
  position = 'middle',
  message,
  className = ''
}) => {
  if (!isVisible) return null;

  const getIconAndColor = () => {
    switch (dragType) {
      case 'layout':
        return { icon: Layout, color: 'text-purple-600 bg-purple-100 border-purple-300' };
      case 'reorder':
        return { icon: Move, color: 'text-orange-600 bg-orange-100 border-orange-300' };
      default:
        return { icon: Plus, color: 'text-blue-600 bg-blue-100 border-blue-300' };
    }
  };

  const getMessage = () => {
    if (message) return message;
    switch (dragType) {
      case 'layout': return 'Drop layout here';
      case 'reorder': return 'Move block here';
      default: return 'Drop block here';
    }
  };

  const { icon: Icon, color } = getIconAndColor();

  const baseClasses = `
    flex items-center justify-center gap-2 p-4 
    border-2 border-dashed rounded-lg
    transition-all duration-300 ease-in-out
    animate-pulse font-medium text-sm
    ${color} ${className}
  `;

  if (position === 'top' || position === 'bottom') {
    return (
      <div className={`h-16 ${baseClasses}`}>
        <Icon className="w-5 h-5" />
        <span>{getMessage()}</span>
      </div>
    );
  }

  return (
    <div className={`min-h-32 ${baseClasses}`}>
      <div className="text-center">
        <Icon className="w-8 h-8 mx-auto mb-2" />
        <div className="text-lg font-semibold">{getMessage()}</div>
        <div className="text-xs opacity-70 mt-1">
          {dragType === 'layout' ? 'Create column structure' : 
           dragType === 'reorder' ? 'Reposition this block' : 
           'Add content block'}
        </div>
      </div>
    </div>
  );
};
