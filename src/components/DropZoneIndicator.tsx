
import React from 'react';

interface DropZoneIndicatorProps {
  isVisible: boolean;
  dragType: string;
  position: 'top' | 'bottom' | 'middle';
  className?: string;
}

export const DropZoneIndicator: React.FC<DropZoneIndicatorProps> = ({
  isVisible,
  dragType,
  position,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className={`bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center ${className}`}>
      <div className="text-blue-600 font-medium">
        Drop {dragType} here
      </div>
    </div>
  );
};
