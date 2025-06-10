
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
    console.log('=== BlockItem Drag Start ===');
    console.log('BlockItem: Starting drag for block:', block.id, block.name);
    
    e.stopPropagation();
    
    const dragData = JSON.stringify({ 
      blockType: block.id,
      source: 'palette'
    });
    
    console.log('BlockItem: Setting drag data:', dragData);
    
    // Set data in multiple formats for maximum compatibility
    e.dataTransfer.setData('text/plain', dragData);
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.setData('text/x-block-data', dragData);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Set custom drag image to indicate copying
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `
      <div style="
        background: white; 
        border: 2px solid #3b82f6; 
        border-radius: 8px; 
        padding: 8px 12px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 14px;
        color: #1e40af;
        font-weight: 500;
      ">
        ${block.name}
      </div>
    `;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 20);
    
    // Clean up drag image after a delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    console.log('BlockItem: Data transfer configured');
    console.log('BlockItem: effectAllowed:', e.dataTransfer.effectAllowed);
    console.log('BlockItem: Available types after setting:', Array.from(e.dataTransfer.types));
    
    if (onDragStart) {
      console.log('BlockItem: Calling parent onDragStart');
      onDragStart(e, block.id);
    }
    
    console.log('=== BlockItem Drag Start Complete ===');
  };
  
  const handleClick = () => {
    console.log('BlockItem: Clicked, adding block:', block.id);
    onBlockAdd(block.id);
  };
  
  return (
    <Card
      key={block.id}
      className={`cursor-grab hover:shadow-md transition-all duration-200 group ${gridClasses} active:cursor-grabbing border-2 border-transparent hover:border-blue-200`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
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
