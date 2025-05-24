
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Type, 
  Image, 
  MousePointer, 
  Minus, 
  Video, 
  Share2, 
  Code, 
  Menu,
  Table,
  ChevronDown,
  ChevronRight,
  Blocks,
  Layout,
  Columns,
  Split
} from 'lucide-react';
import { UniversalContent } from '@/types/emailBlocks';
import { LayoutConfigPanel } from './LayoutConfigPanel';

interface BlockItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'basic' | 'layout' | 'media' | 'advanced';
  isPro?: boolean;
}

interface EnhancedEmailBlockPaletteProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
  compactMode?: boolean;
}

const blockItems: BlockItem[] = [
  // Basic blocks
  { id: 'text', name: 'Text', description: 'Add paragraphs, headings, and formatted text', icon: <Type className="w-4 h-4" />, category: 'basic' },
  { id: 'image', name: 'Image', description: 'Insert images with optional links', icon: <Image className="w-4 h-4" />, category: 'basic' },
  { id: 'button', name: 'Button', description: 'Call-to-action buttons with custom styling', icon: <MousePointer className="w-4 h-4" />, category: 'basic' },
  { id: 'spacer', name: 'Spacer', description: 'Add vertical spacing between blocks', icon: <Minus className="w-4 h-4" />, category: 'basic' },
  { id: 'divider', name: 'Divider', description: 'Horizontal line separators', icon: <Minus className="w-4 h-4" />, category: 'basic' },
  
  // Layout blocks
  { id: 'columns', name: 'Columns', description: 'Multi-column layouts for complex designs', icon: <Columns className="w-4 h-4" />, category: 'layout' },
  { id: 'split', name: 'Split', description: 'Two-column content blocks', icon: <Split className="w-4 h-4" />, category: 'layout' },
  
  // Media blocks
  { id: 'video', name: 'Video', description: 'Embed videos with thumbnails', icon: <Video className="w-4 h-4" />, category: 'media' },
  { id: 'social', name: 'Social', description: 'Social media icons and links', icon: <Share2 className="w-4 h-4" />, category: 'media' },
  
  // Advanced blocks
  { id: 'html', name: 'HTML', description: 'Custom HTML content', icon: <Code className="w-4 h-4" />, category: 'advanced', isPro: true },
  { id: 'menu', name: 'Menu', description: 'Navigation menu bars', icon: <Menu className="w-4 h-4" />, category: 'advanced' },
  { id: 'code', name: 'Code', description: 'Syntax-highlighted code blocks', icon: <Code className="w-4 h-4" />, category: 'advanced', isPro: true },
  { id: 'table', name: 'Table', description: 'Data tables with customizable styling', icon: <Table className="w-4 h-4" />, category: 'advanced', isPro: true },
];

export const EnhancedEmailBlockPalette: React.FC<EnhancedEmailBlockPaletteProps> = ({
  onBlockAdd,
  universalContent,
  onUniversalContentAdd,
  compactMode = false
}) => {
  const [sectionsExpanded, setSectionsExpanded] = useState({
    layout: true,
    blocks: true
  });

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getBlocksByCategory = (categories: string[]) => {
    return blockItems.filter(block => categories.includes(block.category));
  };

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ blockType }));
  };

  const handleLayoutSelect = (layout: any) => {
    // Create a columns block with the selected layout configuration
    onBlockAdd('columns', layout);
  };

  const renderBlockItem = (block: BlockItem) => {
    const gridClasses = compactMode ? "p-2" : "p-3";
    
    return (
      <Card
        key={block.id}
        className={`relative cursor-pointer transition-all duration-200 hover:shadow-md group ${gridClasses}`}
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onClick={() => onBlockAdd(block.id)}
      >
        {block.isPro && (
          <Badge className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500">
            Pro
          </Badge>
        )}
        
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

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="layouts" className="flex-1 flex flex-col">
        <TabsList className={`mx-2 ${compactMode ? 'mb-1' : 'mb-2'}`}>
          <TabsTrigger value="layouts" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>Layouts</TabsTrigger>
          <TabsTrigger value="blocks" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>Blocks</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="layouts" className="h-full mt-0">
            <ScrollArea className="flex-1">
              <div className={compactMode ? 'px-2 pb-4' : 'px-4 pb-6'}>
                <Collapsible 
                  open={sectionsExpanded.layout} 
                  onOpenChange={() => toggleSection('layout')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-2">
                      <div className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                        <Layout className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                        Column Layouts
                      </div>
                      {sectionsExpanded.layout ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mb-4">
                      <LayoutConfigPanel 
                        onLayoutSelect={handleLayoutSelect}
                        compactMode={compactMode}
                      />
                    </div>
                    <div className={`grid ${compactMode ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-3'} mb-4`}>
                      {getBlocksByCategory(['layout']).map(renderBlockItem)}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="blocks" className="h-full mt-0">
            <ScrollArea className="flex-1">
              <div className={compactMode ? 'px-2 pb-4' : 'px-4 pb-6'}>
                <Collapsible 
                  open={sectionsExpanded.blocks} 
                  onOpenChange={() => toggleSection('blocks')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-2">
                      <div className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                        <Blocks className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                        Content Blocks
                      </div>
                      {sectionsExpanded.blocks ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className={`grid ${compactMode ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-3'} mb-4`}>
                      {getBlocksByCategory(['basic', 'media', 'advanced']).map(renderBlockItem)}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
