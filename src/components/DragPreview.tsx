
import React from 'react';
import { createPortal } from 'react-dom';

interface DragPreviewProps {
  isVisible: boolean;
  content: React.ReactNode;
  position: { x: number; y: number };
}

export const DragPreview: React.FC<DragPreviewProps> = ({
  isVisible,
  content,
  position
}) => {
  if (!isVisible) return null;

  return createPortal(
    <div
      className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="bg-white border-2 border-blue-400 rounded-lg shadow-2xl p-3 rotate-3 scale-110">
        <div className="text-sm font-medium text-blue-700 mb-2">
          Dragging Block
        </div>
        <div className="opacity-75">
          {content}
        </div>
      </div>
    </div>,
    document.body
  );
};
