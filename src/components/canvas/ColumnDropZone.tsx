
import React, { useState } from 'react';
import { DropZoneIndicator } from '../DropZoneIndicator';

interface ColumnDropZoneProps {
  children: React.ReactNode;
  onDrop: (e: React.DragEvent) => void;
  className?: string;
}

export const ColumnDropZone: React.FC<ColumnDropZoneProps> = ({
  children,
  onDrop,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragType, setDragType] = useState<'block' | 'layout' | 'reorder'>('block');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);

    // Detect drag type from dataTransfer
    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (dragData) {
        const data = JSON.parse(dragData);
        if (data.isReorder) {
          setDragType('reorder');
        } else if (data.isLayout || data.blockType === 'columns') {
          setDragType('layout');
        } else {
          setDragType('block');
        }
      }
    } catch (error) {
      setDragType('block');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(e);
  };

  const hasContent = React.Children.count(children) > 0;

  return (
    <div
      className={`
        relative min-h-24 p-3 rounded-lg border-2 border-dashed border-gray-200
        transition-all duration-200
        ${isDragOver ? 'border-blue-400 bg-blue-50' : ''}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {hasContent ? (
        <div className="space-y-4">
          {children}
          {isDragOver && (
            <DropZoneIndicator
              isVisible={true}
              dragType={dragType}
              position="bottom"
              className="mt-4"
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-24">
          {isDragOver ? (
            <DropZoneIndicator
              isVisible={true}
              dragType={dragType}
              position="middle"
            />
          ) : (
            <div className="text-gray-400 text-sm text-center">
              <div>Empty Column</div>
              <div className="text-xs mt-1">Drag blocks here</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
