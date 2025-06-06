
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Layout, ChevronDown, ChevronRight } from 'lucide-react';
import { generateUniqueId } from '@/utils/blockUtils';
import { createDragData } from '@/utils/dragDropUtils';

interface LayoutOption {
  id: string;
  name: string;
  columns: number;
  ratio: string;
  preview: string[];
}

interface LayoutConfigPanelProps {
  onLayoutSelect: (layout: any) => void;
  compactMode?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const layoutOptions: LayoutOption[] = [
  { id: '1-column', name: '1 Column', columns: 1, ratio: '100', preview: ['100%'] },
  { id: '2-column-50-50', name: '50/50', columns: 2, ratio: '50-50', preview: ['50%', '50%'] },
  { id: '2-column-33-67', name: '33/67', columns: 2, ratio: '33-67', preview: ['33%', '67%'] },
  { id: '2-column-67-33', name: '67/33', columns: 2, ratio: '67-33', preview: ['67%', '33%'] },
  { id: '2-column-25-75', name: '25/75', columns: 2, ratio: '25-75', preview: ['25%', '75%'] },
  { id: '2-column-75-25', name: '75/25', columns: 2, ratio: '75-25', preview: ['75%', '25%'] },
  { id: '3-column-equal', name: '33/33/33', columns: 3, ratio: '33-33-33', preview: ['33.33%', '33.33%', '33.33%'] },
  { id: '3-column-25-50-25', name: '25/50/25', columns: 3, ratio: '25-50-25', preview: ['25%', '50%', '25%'] },
  { id: '3-column-25-25-50', name: '25/25/50', columns: 3, ratio: '25-25-50', preview: ['25%', '25%', '50%'] },
  { id: '3-column-50-25-25', name: '50/25/25', columns: 3, ratio: '50-25-25', preview: ['50%', '25%', '25%'] },
  { id: '4-column-equal', name: '25/25/25/25', columns: 4, ratio: '25-25-25-25', preview: ['25%', '25%', '25%', '25%'] }
];

export const LayoutConfigPanel: React.FC<LayoutConfigPanelProps> = ({
  onLayoutSelect,
  compactMode = false,
  isExpanded = true,
  onToggleExpanded
}) => {
  const [draggedLayout, setDraggedLayout] = useState<string | null>(null);
  
  const gridCols = compactMode ? 'grid-cols-2' : 'grid-cols-3';
  const spacing = compactMode ? 'gap-2' : 'gap-3';
  const padding = compactMode ? 'p-2' : 'p-3';

  const createLayoutConfig = (layout: LayoutOption) => {
    const columnElements = Array.from({ length: layout.columns }, (_, index) => ({
      id: generateUniqueId(),
      blocks: [],
      width: layout.preview[index] || `${100 / layout.columns}%`
    }));

    return {
      columnCount: layout.columns,
      columnRatio: layout.ratio,
      columnElements: columnElements
    };
  };

  const handleLayoutClick = (layout: LayoutOption) => {
    console.log('LayoutConfigPanel: Layout clicked:', layout.name);
    
    const layoutConfig = createLayoutConfig(layout);
    console.log('LayoutConfigPanel: Created layout config for click:', layoutConfig);
    
    onLayoutSelect(layoutConfig);
  };

  const handleLayoutDragStart = (e: React.DragEvent, layout: LayoutOption) => {
    console.log('LayoutConfigPanel: Starting layout drag:', layout.name);
    setDraggedLayout(layout.id);
    
    const layoutConfig = createLayoutConfig(layout);
    console.log('LayoutConfigPanel: Created layout config for drag:', layoutConfig);

    const dragData = createDragData({
      blockType: 'columns',
      isLayout: true,
      layoutData: layoutConfig
    });

    console.log('LayoutConfigPanel: Drag data:', dragData);
    
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 25);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleLayoutDragEnd = () => {
    setDraggedLayout(null);
  };

  const renderLayoutPreview = (layout: LayoutOption) => (
    <div className={`flex gap-1 ${compactMode ? 'h-4' : 'h-6'}`}>
      {layout.preview.map((width, index) => (
        <div
          key={index}
          className={`rounded-sm border transition-all duration-200 ${
            draggedLayout === layout.id 
              ? 'bg-blue-300 border-blue-400 shadow-md' 
              : 'bg-blue-200 border-blue-300'
          }`}
          style={{ width }}
        />
      ))}
    </div>
  );

  const content = (
    <div className={`grid ${gridCols} ${spacing}`}>
      {layoutOptions.map((layout) => (
        <Card
          key={layout.id}
          className={`${padding} cursor-grab transition-all duration-200 active:cursor-grabbing ${
            draggedLayout === layout.id 
              ? 'border-blue-400 bg-blue-50 shadow-lg scale-105' 
              : 'border-2 hover:border-blue-200 hover:bg-slate-50 hover:shadow-md'
          }`}
          draggable
          onDragStart={(e) => handleLayoutDragStart(e, layout)}
          onDragEnd={handleLayoutDragEnd}
          onClick={() => handleLayoutClick(layout)}
        >
          <div className="space-y-2">
            <div className={`font-medium text-slate-700 ${compactMode ? 'text-xs' : 'text-sm'}`}>
              {layout.name}
            </div>
            {renderLayoutPreview(layout)}
            <div className="text-xs text-slate-500 opacity-75">
              {layout.columns} column{layout.columns > 1 ? 's' : ''}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  if (onToggleExpanded) {
    return (
      <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-2">
            <Label className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
              <Layout className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
              Layout ({layoutOptions.length} options)
            </Label>
            {isExpanded ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {content}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return content;
};
