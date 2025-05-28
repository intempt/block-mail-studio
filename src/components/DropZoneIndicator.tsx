
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
        return { 
          icon: Layout, 
          color: 'text-purple-700 bg-purple-50 border-purple-400',
          accentColor: 'bg-purple-400'
        };
      case 'reorder':
        return { 
          icon: Move, 
          color: 'text-orange-700 bg-orange-50 border-orange-400',
          accentColor: 'bg-orange-400'
        };
      default:
        return { 
          icon: Plus, 
          color: 'text-blue-700 bg-blue-50 border-blue-400',
          accentColor: 'bg-blue-400'
        };
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

  const { icon: Icon, color, accentColor } = getIconAndColor();

  if (position === 'top' || position === 'bottom') {
    return (
      <div className={`relative ${className}`}>
        {/* Precise insertion line */}
        <div className={`h-1 ${accentColor} rounded-full mx-4 opacity-80`} />
        
        {/* Drop zone indicator */}
        <div className={`
          flex items-center justify-center gap-2 py-3 px-4 mx-4 mt-2
          border-2 border-dashed rounded-lg
          transition-all duration-200 ease-in-out
          ${color}
          animate-pulse
        `}>
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{getMessage()}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main drop zone */}
      <div className={`
        flex items-center justify-center gap-3 p-8
        border-3 border-dashed rounded-xl
        transition-all duration-300 ease-in-out
        ${color}
        min-h-32
        animate-pulse
        shadow-lg
        backdrop-blur-sm
      `}>
        <div className="text-center">
          <div className={`w-12 h-12 rounded-full ${accentColor} bg-opacity-20 flex items-center justify-center mx-auto mb-3`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="text-lg font-semibold mb-1">{getMessage()}</div>
          <div className="text-xs opacity-70">
            {dragType === 'layout' ? 'Create column structure' : 
             dragType === 'reorder' ? 'Reposition this block' : 
             'Add content block'}
          </div>
        </div>
      </div>
      
      {/* Glowing border effect */}
      <div className={`
        absolute inset-0 rounded-xl
        ${accentColor} opacity-20
        animate-pulse
        pointer-events-none
        blur-sm
      `} />
    </div>
  );
};
