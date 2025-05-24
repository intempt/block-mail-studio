
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Layout, ChevronDown, ChevronRight } from 'lucide-react';
import { generateUniqueId } from '@/utils/blockUtils';

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
  // 1 Column
  {
    id: '1-column',
    name: '1 Column',
    columns: 1,
    ratio: '100',
    preview: ['100%']
  },
  // 2 Column layouts (5 variants)
  {
    id: '2-column-50-50',
    name: '50/50',
    columns: 2,
    ratio: '50-50',
    preview: ['50%', '50%']
  },
  {
    id: '2-column-33-67',
    name: '33/67',
    columns: 2,
    ratio: '33-67',
    preview: ['33%', '67%']
  },
  {
    id: '2-column-67-33',
    name: '67/33',
    columns: 2,
    ratio: '67-33',
    preview: ['67%', '33%']
  },
  {
    id: '2-column-25-75',
    name: '25/75',
    columns: 2,
    ratio: '25-75',
    preview: ['25%', '75%']
  },
  {
    id: '2-column-75-25',
    name: '75/25',
    columns: 2,
    ratio: '75-25',
    preview: ['75%', '25%']
  },
  // 3 Column layouts (4 variants)
  {
    id: '3-column-equal',
    name: '33/33/33',
    columns: 3,
    ratio: '33-33-33',
    preview: ['33.33%', '33.33%', '33.33%']
  },
  {
    id: '3-column-25-50-25',
    name: '25/50/25',
    columns: 3,
    ratio: '25-50-25',
    preview: ['25%', '50%', '25%']
  },
  {
    id: '3-column-25-25-50',
    name: '25/25/50',
    columns: 3,
    ratio: '25-25-50',
    preview: ['25%', '25%', '50%']
  },
  {
    id: '3-column-50-25-25',
    name: '50/25/25',
    columns: 3,
    ratio: '50-25-25',
    preview: ['50%', '25%', '25%']
  },
  // 4 Column layout (1 variant)
  {
    id: '4-column-equal',
    name: '25/25/25/25',
    columns: 4,
    ratio: '25-25-25-25',
    preview: ['25%', '25%', '25%', '25%']
  }
];

export const LayoutConfigPanel: React.FC<LayoutConfigPanelProps> = ({
  onLayoutSelect,
  compactMode = false,
  isExpanded = true,
  onToggleExpanded
}) => {
  const gridCols = compactMode ? 'grid-cols-2' : 'grid-cols-3';
  const spacing = compactMode ? 'gap-2' : 'gap-3';
  const padding = compactMode ? 'p-2' : 'p-3';

  const handleLayoutClick = (layout: LayoutOption) => {
    // Create the columns structure for the layout
    const columns = Array.from({ length: layout.columns }, () => ({
      id: generateUniqueId(),
      blocks: [],
      width: layout.preview[0] // This will be overridden by the column renderer
    }));

    const layoutConfig = {
      ...layout,
      columns
    };

    onLayoutSelect(layoutConfig);
  };

  const handleLayoutDragStart = (e: React.DragEvent, layout: LayoutOption) => {
    console.log('Starting layout drag:', layout.name);
    
    const columns = Array.from({ length: layout.columns }, () => ({
      id: generateUniqueId(),
      blocks: [],
      width: layout.preview[0]
    }));

    const layoutConfig = {
      blockType: 'columns',
      layoutData: {
        ...layout,
        columns
      }
    };

    e.dataTransfer.setData('application/json', JSON.stringify(layoutConfig));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderLayoutPreview = (layout: LayoutOption) => (
    <div className={`flex gap-1 h-6 ${compactMode ? 'h-4' : 'h-6'}`}>
      {layout.preview.map((width, index) => (
        <div
          key={index}
          className="bg-blue-200 rounded-sm border border-blue-300"
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
          className={`${padding} cursor-grab hover:bg-slate-50 border-2 hover:border-blue-200 transition-all duration-200 active:cursor-grabbing`}
          draggable
          onDragStart={(e) => handleLayoutDragStart(e, layout)}
          onClick={() => handleLayoutClick(layout)}
        >
          <div className="space-y-2">
            <div className={`text-xs font-medium text-slate-700 ${compactMode ? 'text-xs' : 'text-sm'}`}>
              {layout.name}
            </div>
            {renderLayoutPreview(layout)}
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
              Layout
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
