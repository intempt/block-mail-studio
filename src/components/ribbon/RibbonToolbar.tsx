
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Mail, 
  MousePointerClick, 
  Link
} from 'lucide-react';
import { DynamicLayoutIcon } from '../DynamicLayoutIcon';
import { createDragData } from '@/utils/dragDropUtils';
import { generateUniqueId } from '@/utils/blockUtils';
import { ribbonBlockItems, RibbonBlockItem } from '@/data/ribbonBlockItems';
import { ribbonLayoutOptions, RibbonLayoutOption } from '@/data/ribbonLayoutOptions';

interface RibbonToolbarProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  draggedLayout: string | null;
  setDraggedLayout: (id: string | null) => void;
  showEmailSettings: boolean;
  showTextHeadings: boolean;
  showButtons: boolean;
  showLinks: boolean;
  closeAllPanels: () => void;
  setShowEmailSettings: (show: boolean) => void;
  setShowTextHeadings: (show: boolean) => void;
  setShowButtons: (show: boolean) => void;
  setShowLinks: (show: boolean) => void;
}

export const RibbonToolbar: React.FC<RibbonToolbarProps> = ({
  onBlockAdd,
  draggedLayout,
  setDraggedLayout,
  showEmailSettings,
  showTextHeadings,
  showButtons,
  showLinks,
  closeAllPanels,
  setShowEmailSettings,
  setShowTextHeadings,
  setShowButtons,
  setShowLinks
}) => {
  const createLayoutConfig = (layout: RibbonLayoutOption) => {
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
    console.log('OmnipresentRibbon: Starting block drag:', blockType);
    const dragData = createDragData({ blockType });
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleLayoutDragStart = (e: React.DragEvent, layout: RibbonLayoutOption) => {
    console.log('OmnipresentRibbon: Starting layout drag:', layout.name);
    setDraggedLayout(layout.id);
    
    const layoutConfig = createLayoutConfig(layout);
    const dragData = createDragData({
      blockType: 'columns',
      isLayout: true,
      layoutData: layoutConfig
    });

    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';

    const dragPreview = document.createElement('div');
    dragPreview.className = 'bg-white border-2 border-blue-400 rounded-lg p-3 shadow-lg';
    dragPreview.style.transform = 'rotate(2deg)';
    dragPreview.innerHTML = `
      <div class="text-sm font-medium text-blue-700 mb-2">${layout.name}</div>
      <div class="flex gap-1 h-6">
        ${layout.preview.map(width => `<div class="bg-blue-200 rounded border" style="width: ${width}"></div>`).join('')}
      </div>
    `;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 60, 30);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleLayoutDragEnd = () => {
    setDraggedLayout(null);
  };

  const handleLayoutSelect = (layout: RibbonLayoutOption) => {
    console.log('OmnipresentRibbon: Layout clicked:', layout.name);
    const layoutConfig = createLayoutConfig(layout);
    onBlockAdd('columns', layoutConfig);
  };

  return (
    <div className="px-0 py-2">
      <div className="flex items-end justify-center overflow-x-auto gap-0">
        {/* Content */}
        <div className="flex-shrink-0">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Content</span>
            <div className="flex gap-0">
              {ribbonBlockItems.map((block) => (
                <Button
                  key={block.id}
                  variant="ghost"
                  size="lg"
                  className="p-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 [&_svg]:!w-6 [&_svg]:!h-6"
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onClick={() => onBlockAdd(block.id)}
                  title={`Add ${block.name}`}
                >
                  {React.cloneElement(block.icon as React.ReactElement, { className: "w-6 h-6" })}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Layout Options */}
        <div className="flex-shrink-0">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Layouts</span>
            <div className="flex gap-0">
              {ribbonLayoutOptions.map((layout) => (
                <Button
                  key={layout.id}
                  variant="ghost"
                  size="lg"
                  className={`p-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 [&_svg]:!w-6 [&_svg]:!h-6 ${
                    draggedLayout === layout.id ? 'bg-blue-100 scale-105' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleLayoutDragStart(e, layout)}
                  onDragEnd={handleLayoutDragEnd}
                  onClick={() => handleLayoutSelect(layout)}
                  title={`Add ${layout.name} Layout`}
                >
                  <DynamicLayoutIcon layout={layout} className="w-6 h-6" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tool Buttons */}
        <div className="flex-shrink-0">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Styles</span>
            <div className="flex gap-0">
              <Button
                variant={showEmailSettings ? 'default' : 'ghost'}
                size="lg"
                className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 [&_svg]:!w-6 [&_svg]:!h-6"
                onClick={() => {
                  closeAllPanels();
                  setShowEmailSettings(!showEmailSettings);
                }}
                title="Email Styles"
              >
                <Mail className="w-6 h-6" />
              </Button>

              <Button
                variant={showTextHeadings ? 'default' : 'ghost'}
                size="lg"
                className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 [&_svg]:!w-6 [&_svg]:!h-6"
                onClick={() => {
                  closeAllPanels();
                  setShowTextHeadings(!showTextHeadings);
                }}
                title="Text & Headings"
              >
                <Type className="w-6 h-6" />
              </Button>

              <Button
                variant={showButtons ? 'default' : 'ghost'}
                size="lg"
                className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 [&_svg]:!w-6 [&_svg]:!h-6"
                onClick={() => {
                  closeAllPanels();
                  setShowButtons(!showButtons);
                }}
                title="Buttons"
              >
                <MousePointerClick className="w-6 h-6" />
              </Button>

              <Button
                variant={showLinks ? 'default' : 'ghost'}
                size="lg"
                className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 [&_svg]:!w-6 [&_svg]:!h-6"
                onClick={() => {
                  closeAllPanels();
                  setShowLinks(!showLinks);
                }}
                title="Links"
              >
                <Link className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
