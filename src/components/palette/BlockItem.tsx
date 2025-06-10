
import React from 'react';
import { Card } from '@/components/ui/card';
import { BlockItemProps } from '@/types/blockPalette';

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  compactMode,
  onBlockAdd,
  onDragStart
}) => {
  const gridClasses = compactMode ? "p-2" : "p-3";
  
  const handleDragStart = (e: React.DragEvent) => {
    console.log('BlockItem: Starting drag for block:', block.id);
    
    // Use text/plain to match drop handler expectation
    const dragData = JSON.stringify({ blockType: block.id });
    e.dataTransfer.setData('text/plain', dragData);
    e.dataTransfer.effectAllowed = 'copy';
    
    console.log('BlockItem: Set drag data:', dragData);
    
    // Call the parent's drag start handler
    if (onDragStart) {
      onDragStart(e, block.id);
    }
  };
  
  return (
    <Card
      key={block.id}
      className={`cursor-grab hover:shadow-md transition-all duration-200 group ${gridClasses} active:cursor-grabbing`}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onBlockAdd(block.id)}
    >
      <div className="text-center space-y-2">
        <div className="flex justify-center text-slate-600 group-hover:text-blue-600 transition-colors">
          {block.icon}
        </div>
        <div>
          <div className={`font-medium text-slate-800 ${compactMode ? 'text-xs' : 'text-sm'}`}>
            {block.name}
          </div>
          {!compactMode && (
            <div className="text-xs text-slate-500 mt-1 line-clamp-2">
              {block.description}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
