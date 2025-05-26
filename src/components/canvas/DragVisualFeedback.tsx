
import React from 'react';

interface DragVisualFeedbackProps {
  isDragging: boolean;
  dragOverIndex: number | null;
  totalBlocks: number;
  isOverCanvas: boolean;
  dragPreview?: string;
}

export const DragVisualFeedback: React.FC<DragVisualFeedbackProps> = ({
  isDragging,
  dragOverIndex,
  totalBlocks,
  isOverCanvas,
  dragPreview
}) => {
  if (!isDragging) return null;

  return (
    <>
      {/* Drop line indicators */}
      {dragOverIndex !== null && (
        <div 
          className="absolute left-0 right-0 h-0.5 bg-blue-500 z-10 animate-pulse"
          style={{
            top: dragOverIndex === 0 ? '0px' : 'auto',
            bottom: dragOverIndex === totalBlocks ? '0px' : 'auto'
          }}
        />
      )}
      
      {/* Canvas overlay when dragging */}
      {isOverCanvas && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-300 rounded-lg z-5 pointer-events-none">
          <div className="flex items-center justify-center h-full">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">
                {dragPreview || 'Drop to add block'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
