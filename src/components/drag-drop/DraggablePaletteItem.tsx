
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';

interface DraggablePaletteItemProps {
  blockId: string;
  blockName: string;
  blockDescription?: string;
  icon: React.ReactNode;
  index: number;
  compactMode?: boolean;
  onClick?: () => void;
}

export const DraggablePaletteItem: React.FC<DraggablePaletteItemProps> = ({
  blockId,
  blockName,
  blockDescription,
  icon,
  index,
  compactMode = false,
  onClick
}) => {
  const gridClasses = compactMode ? "p-2" : "p-3";
  
  return (
    <Draggable draggableId={`palette-${blockId}`} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`cursor-grab transition-all duration-200 group ${gridClasses} ${
            snapshot.isDragging 
              ? 'shadow-2xl scale-110 rotate-3 z-50 ring-2 ring-blue-400' 
              : 'hover:shadow-md'
          }`}
          onClick={onClick}
        >
          <div className="text-center space-y-2">
            <div className={`flex justify-center transition-colors ${
              snapshot.isDragging 
                ? 'text-blue-600' 
                : 'text-slate-600 group-hover:text-blue-600'
            }`}>
              {icon}
            </div>
            <div>
              <div className={`font-medium ${
                snapshot.isDragging ? 'text-blue-800' : 'text-slate-800'
              } ${compactMode ? 'text-xs' : 'text-sm'}`}>
                {blockName}
              </div>
              {!compactMode && blockDescription && (
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {blockDescription}
                </div>
              )}
            </div>
          </div>
          
          {snapshot.isDragging && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-30 border-2 border-blue-400 border-dashed rounded-lg pointer-events-none" />
          )}
        </Card>
      )}
    </Draggable>
  );
};
