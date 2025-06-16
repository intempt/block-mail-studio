
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar';
import { ribbonBlockItems } from '@/data/ribbonBlockItems';
import { createDragData } from '@/utils/dragDropUtils';

interface BlocksSidebarProps {
  onBlockAdd: (blockType: string) => void;
}

export const BlocksSidebar: React.FC<BlocksSidebarProps> = ({ onBlockAdd }) => {
  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    console.log('BlocksSidebar: Starting block drag:', blockType);
    const dragData = createDragData({ blockType });
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">BLOCKS</h2>
          <p className="text-sm text-gray-600">Drag to add content to your email</p>
        </SidebarHeader>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="grid grid-cols-2 gap-3 p-4">
              {ribbonBlockItems.map((block) => (
                <Button
                  key={block.id}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onClick={() => onBlockAdd(block.id)}
                  title={`Add ${block.name}`}
                >
                  {React.cloneElement(block.icon as React.ReactElement, { className: "w-5 h-5" })}
                  <span className="text-xs font-medium">{block.name}</span>
                </Button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
