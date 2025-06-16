
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Image, 
  MousePointerClick, 
  Space, 
  Video, 
  Share2, 
  Table,
  Minus,
  Code,
  Package,
  Apps,
  Palette
} from 'lucide-react';
import { createDragData } from '@/utils/dragDropUtils';
import { generateUniqueId } from '@/utils/blockUtils';
import { ribbonLayoutOptions } from '@/data/ribbonLayoutOptions';
import { DynamicLayoutIcon } from '../DynamicLayoutIcon';

interface BlocksSidebarProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  draggedLayout: string | null;
  setDraggedLayout: (id: string | null) => void;
}

const blockItems = [
  { id: 'text', name: 'Heading', icon: Type },
  { id: 'text', name: 'Paragraph', icon: Type },
  { id: 'button', name: 'Button', icon: MousePointerClick },
  { id: 'divider', name: 'Divider', icon: Minus },
  { id: 'spacer', name: 'Spacer', icon: Space },
  { id: 'image', name: 'Image', icon: Image },
  { id: 'logo', name: 'Logo', icon: Palette },
  { id: 'video', name: 'Creative Assistant', icon: Video },
  { id: 'video', name: 'Video', icon: Video },
  { id: 'social', name: 'Social', icon: Share2 },
  { id: 'survey', name: 'Survey', icon: Table },
  { id: 'html', name: 'Code', icon: Code },
  { id: 'apps', name: 'Apps', icon: Apps },
  { id: 'product', name: 'Product', icon: Package },
  { id: 'product', name: 'Product Rec', icon: Package }
];

export const BlocksSidebar: React.FC<BlocksSidebarProps> = ({
  onBlockAdd,
  draggedLayout,
  setDraggedLayout
}) => {
  const createLayoutConfig = (layout: any) => {
    const columnElements = Array.from({ length: layout.columns }, (_, index) => ({
      id: generateUniqueId(),
      blocks: [],
      width: layout.preview[index] || `${100 / layout.columns}%`
    }));

    return {
      columnCount: layout.columns,
      columnRatio: layout.ratio,
      columns: columnElements,
      gap: '16px'
    };
  };

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    console.log('BlocksSidebar: Starting block drag:', blockType);
    const dragData = createDragData({ blockType });
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleLayoutDragStart = (e: React.DragEvent, layout: any) => {
    console.log('BlocksSidebar: Starting layout drag:', layout.name);
    setDraggedLayout(layout.id);
    
    const layoutConfig = createLayoutConfig(layout);
    const dragData = createDragData({
      blockType: 'columns',
      isLayout: true,
      layoutData: layoutConfig
    });

    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleLayoutDragEnd = () => {
    setDraggedLayout(null);
  };

  const handleLayoutSelect = (layout: any) => {
    console.log('BlocksSidebar: Layout clicked:', layout.name);
    const layoutConfig = createLayoutConfig(layout);
    onBlockAdd('columns', layoutConfig);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">BLOCKS</h2>
        <p className="text-sm text-gray-600">Drag to add content to your email</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Blocks Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {blockItems.map((block, index) => (
            <div
              key={`${block.id}-${index}`}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              onClick={() => onBlockAdd(block.id)}
              title={`Add ${block.name}`}
            >
              <block.icon className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-xs text-gray-700 text-center font-medium">{block.name}</span>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div key={dot} className="w-1 h-1 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Layouts Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">LAYOUTS</h3>
          <div className="grid grid-cols-2 gap-3">
            {ribbonLayoutOptions.map((layout) => (
              <div
                key={layout.id}
                className={`flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 ${
                  draggedLayout === layout.id ? 'bg-blue-100 border-blue-400' : ''
                }`}
                draggable
                onDragStart={(e) => handleLayoutDragStart(e, layout)}
                onDragEnd={handleLayoutDragEnd}
                onClick={() => handleLayoutSelect(layout)}
                title={`Add ${layout.name} Layout`}
              >
                <DynamicLayoutIcon layout={layout} className="w-8 h-8 text-gray-600 mb-2" />
                <span className="text-xs text-gray-700 text-center font-medium">{layout.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
