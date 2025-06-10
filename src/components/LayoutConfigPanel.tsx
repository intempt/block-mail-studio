
import React from 'react';
import { Card } from '@/components/ui/card';
import { DynamicLayoutIcon } from './DynamicLayoutIcon';

interface LayoutOption {
  id: string;
  name: string;
  columns: number;
  ratio: string;
  columnRatio: string;
  description: string;
}

interface LayoutConfigPanelProps {
  onLayoutSelect: (layout: any) => void;
  compactMode?: boolean;
}

const layoutOptions: LayoutOption[] = [
  {
    id: 'single',
    name: '1 Column',
    columns: 1,
    ratio: '100%',
    columnRatio: '100%',
    description: 'Single column layout'
  },
  {
    id: 'two-equal',
    name: '2 Columns (50/50)',
    columns: 2,
    ratio: '50-50',
    columnRatio: '50-50',
    description: 'Two equal columns'
  },
  {
    id: 'two-thirds-third',
    name: '2 Columns (67/33)',
    columns: 2,
    ratio: '67-33',
    columnRatio: '67-33',
    description: 'Two-thirds and one-third columns'
  },
  {
    id: 'third-two-thirds',
    name: '2 Columns (33/67)',
    columns: 2,
    ratio: '33-67',
    columnRatio: '33-67',
    description: 'One-third and two-thirds columns'
  },
  {
    id: 'three-equal',
    name: '3 Columns (33/33/33)',
    columns: 3,
    ratio: '33-33-33',
    columnRatio: '33-33-33',
    description: 'Three equal columns'
  },
  {
    id: 'four-equal',
    name: '4 Columns (25/25/25/25)',
    columns: 4,
    ratio: '25-25-25-25',
    columnRatio: '25-25-25-25',
    description: 'Four equal columns'
  }
];

export const LayoutConfigPanel: React.FC<LayoutConfigPanelProps> = ({ 
  onLayoutSelect, 
  compactMode = false 
}) => {
  const handleLayoutClick = (layout: LayoutOption) => {
    console.log('Layout selected:', layout);
    onLayoutSelect({
      columnCount: layout.columns,
      columnRatio: layout.columnRatio
    });
  };

  const handleDragStart = (e: React.DragEvent, layout: LayoutOption) => {
    console.log('LayoutConfigPanel: Starting drag for layout:', layout.name);
    
    const dragData = JSON.stringify({
      blockType: 'columns',
      layoutData: {
        columnCount: layout.columns,
        columnRatio: layout.columnRatio
      }
    });
    
    e.dataTransfer.setData('text/plain', dragData);
    e.dataTransfer.effectAllowed = 'copy';
    
    console.log('LayoutConfigPanel: Set drag data:', dragData);
  };

  const gridClasses = compactMode 
    ? "grid-cols-1 gap-2" 
    : "grid-cols-2 gap-3";

  // Convert layout option to DynamicLayoutIcon format
  const createLayoutForIcon = (layout: LayoutOption) => {
    const percentages = layout.ratio.split('-').map(p => `${p}%`);
    return {
      id: layout.id,
      name: layout.name,
      preview: percentages
    };
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm font-medium text-slate-700 mb-3">
        Layout Options
      </div>
      
      <div className={`grid ${gridClasses}`}>
        {layoutOptions.map((layout) => (
          <Card
            key={layout.id}
            className={`cursor-grab hover:shadow-md transition-all duration-200 group ${
              compactMode ? 'p-2' : 'p-3'
            } active:cursor-grabbing`}
            draggable
            onDragStart={(e) => handleDragStart(e, layout)}
            onClick={() => handleLayoutClick(layout)}
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center text-slate-600 group-hover:text-purple-600 transition-colors">
                <DynamicLayoutIcon 
                  layout={createLayoutForIcon(layout)}
                  className={compactMode ? 'w-5 h-4' : 'w-6 h-5'}
                />
              </div>
              <div>
                <div className={`font-medium text-slate-800 ${
                  compactMode ? 'text-xs' : 'text-sm'
                }`}>
                  {layout.name}
                </div>
                {!compactMode && (
                  <div className="text-xs text-slate-500 mt-1">
                    {layout.description}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
