
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Settings,
  Palette,
  Layout,
  Sliders,
  Code,
  Eye,
  Smartphone,
  Monitor
} from 'lucide-react';

import { GlobalStylesPanel } from './GlobalStylesPanel';

interface ProfessionalToolPaletteProps {
  editor: Editor | null;
}

type ToolCategory = 'properties' | 'styling' | 'layout' | 'advanced' | 'preview';

export const ProfessionalToolPalette: React.FC<ProfessionalToolPaletteProps> = ({ editor }) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('properties');

  const toolCategories = [
    { id: 'properties' as ToolCategory, name: 'Global Styles', icon: <Palette className="w-4 h-4" /> },
    { id: 'styling' as ToolCategory, name: 'Styling', icon: <Settings className="w-4 h-4" /> },
    { id: 'layout' as ToolCategory, name: 'Layout', icon: <Layout className="w-4 h-4" /> },
    { id: 'advanced' as ToolCategory, name: 'Advanced', icon: <Sliders className="w-4 h-4" /> },
    { id: 'preview' as ToolCategory, name: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'properties':
        return <GlobalStylesPanel />;
      
      case 'styling':
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-slate-900">Advanced Styling</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Font Family</label>
                <select className="w-full h-8 px-2 border border-slate-300 rounded text-sm">
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>Georgia</option>
                  <option>Times New Roman</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Font Size</label>
                <input type="range" min="12" max="48" className="w-full" />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Line Height</label>
                <input type="range" min="1" max="3" step="0.1" className="w-full" />
              </div>
            </div>
          </div>
        );
      
      case 'layout':
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-slate-900">Layout Controls</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Container Width</label>
                <input type="range" min="300" max="800" className="w-full" />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Padding</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Top" className="h-8 px-2 border border-slate-300 rounded text-sm" />
                  <input type="number" placeholder="Bottom" className="h-8 px-2 border border-slate-300 rounded text-sm" />
                  <input type="number" placeholder="Left" className="h-8 px-2 border border-slate-300 rounded text-sm" />
                  <input type="number" placeholder="Right" className="h-8 px-2 border border-slate-300 rounded text-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'advanced':
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-slate-900">Advanced Features</h4>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Code className="w-4 h-4 mr-2" />
                Custom CSS
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Email Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Sliders className="w-4 h-4 mr-2" />
                A/B Testing
              </Button>
            </div>
          </div>
        );
      
      case 'preview':
        return (
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-slate-900">Preview Options</h4>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Monitor className="w-4 h-4 mr-2" />
                Desktop Preview
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Preview
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Category Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex flex-col">
          {toolCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="justify-start h-10 px-4 rounded-none"
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Category Content */}
      <ScrollArea className="flex-1">
        {renderCategoryContent()}
      </ScrollArea>
    </div>
  );
};
