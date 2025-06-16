
import React from 'react';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import { BlockItemProps } from '@/types/blockPalette';

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  compactMode,
  onBlockAdd,
  onDragStart
}) => {
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
      className="cursor-grab hover:shadow-md transition-all duration-200 group border-2 border-transparent hover:border-blue-200 active:cursor-grabbing relative"
      style={{ width: '87px', height: '87px' }}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      {/* Drag indicator dots */}
      <div className="absolute top-1 left-1 opacity-40 group-hover:opacity-60 transition-opacity">
        <GripVertical className="w-3 h-3 text-gray-400" />
      </div>
      
      <div className="h-full flex flex-col items-center justify-center p-2 text-center space-y-1">
        <div className="flex justify-center text-slate-600 group-hover:text-blue-600 transition-colors">
          <div style={{ height: '28px', display: 'flex', alignItems: 'center' }}>
            {React.cloneElement(block.icon as React.ReactElement, { 
              style: { height: '28px', width: 'auto' } 
            })}
          </div>
        </div>
        <div className="text-xs font-medium text-slate-800 leading-tight">
          {block.name}
        </div>
      </div>
    </Card>
  );
};
