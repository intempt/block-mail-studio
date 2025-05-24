import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Star,
  Search,
  Grid3X3,
  List,
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
  onBlockAdd: (blockType: string) => void;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sectionsExpanded, setSectionsExpanded] = useState({
    layout: true,
    basic: true,
    media: false,
    advanced: false,
    universal: false
  });

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredBlocks = blockItems.filter(block =>
    block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    block.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBlocksByCategory = (category: string) => {
    return filteredBlocks.filter(block => block.category === category);
  };

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ blockType }));
  };

  const handleLayoutSelect = (layout: any) => {
    // Create a columns block with the selected layout ratio
    onBlockAdd('columns');
  };

  const renderBlockItem = (block: BlockItem) => {
    const baseClasses = "relative cursor-pointer transition-all duration-200 hover:shadow-md group";
    const gridClasses = compactMode ? "p-2" : "p-3";
    const listClasses = compactMode ? "p-2" : "p-3";
    
    const itemClasses = viewMode === 'grid' 
      ? `${baseClasses} ${gridClasses}` 
      : `${baseClasses} ${listClasses} flex items-center gap-3`;

    return (
      <Card
        key={block.id}
        className={itemClasses}
        draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onClick={() => onBlockAdd(block.id)}
      >
        {block.isPro && (
          <Badge className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500">
            Pro
          </Badge>
        )}
        
        {viewMode === 'grid' ? (
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
        ) : (
          <>
            <div className="text-slate-600 group-hover:text-blue-600 transition-colors">
              {block.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-slate-800 ${compactMode ? 'text-xs' : 'text-sm'}`}>
                {block.name}
              </div>
              <div className={`text-slate-500 truncate ${compactMode ? 'text-xs' : 'text-xs'}`}>
                {block.description}
              </div>
            </div>
          </>
        )}
      </Card>
    );
  };

  const renderBlockSection = (title: string, category: string, icon: React.ReactNode) => {
    const blocks = getBlocksByCategory(category);
    const sectionKey = category as keyof typeof sectionsExpanded;
    const isExpanded = sectionsExpanded[sectionKey];
    
    if (blocks.length === 0) return null;

    return (
      <Collapsible key={category} open={isExpanded} onOpenChange={() => toggleSection(sectionKey)}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-2">
            <div className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
              {icon}
              {title}
            </div>
            {isExpanded ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className={`${viewMode === 'grid' 
            ? `grid ${compactMode ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-3'}` 
            : 'space-y-2'} mb-4`}>
            {blocks.map(renderBlockItem)}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <TabsList className={`mx-2 ${compactMode ? 'mb-1' : 'mb-2'}`}>
          <TabsTrigger value="blocks" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>Blocks</TabsTrigger>
          <TabsTrigger value="universal" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>Saved</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="blocks" className="h-full mt-0">
            <div className={compactMode ? 'px-2' : 'px-4'}>
              {/* Search and View Controls */}
              <div className={`space-y-2 ${compactMode ? 'mb-2' : 'mb-4'}`}>
                <div className="relative">
                  <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 ${compactMode ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  <Input
                    placeholder="Search blocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-8 ${compactMode ? 'h-7 text-xs' : 'h-8 text-sm'}`}
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 ${compactMode ? 'h-6' : 'h-7'}`}
                  >
                    <Grid3X3 className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`flex-1 ${compactMode ? 'h-6' : 'h-7'}`}
                  >
                    <List className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className={compactMode ? 'px-2 pb-4' : 'px-4 pb-6'}>
                {/* Layout Section with Layout Config Panel */}
                <Collapsible 
                  open={sectionsExpanded.layout} 
                  onOpenChange={() => toggleSection('layout')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-2">
                      <div className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                        <Layout className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                        Layout
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
                    <div className={`${viewMode === 'grid' 
                      ? `grid ${compactMode ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-3'}` 
                      : 'space-y-2'} mb-4`}>
                      {getBlocksByCategory('layout').map(renderBlockItem)}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Other sections */}
                {renderBlockSection('Basic', 'basic', <Blocks className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />)}
                {renderBlockSection('Media', 'media', <Video className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />)}
                {renderBlockSection('Advanced', 'advanced', <Code className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />)}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="universal" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className={compactMode ? 'p-2' : 'p-4'}>
                {universalContent.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Star className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className={compactMode ? 'text-xs' : 'text-sm'}>No saved content yet</p>
                    <p className={`text-slate-400 ${compactMode ? 'text-xs' : 'text-xs'}`}>
                      Save blocks and sections to reuse them
                    </p>
                  </div>
                ) : (
                  <div className={`space-y-2 ${compactMode ? 'gap-2' : 'gap-3'}`}>
                    {universalContent.map((content) => (
                      <Card
                        key={content.id}
                        className={`${compactMode ? 'p-2' : 'p-3'} cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => onUniversalContentAdd(content)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${compactMode ? 'text-xs' : 'text-sm'}`}>
                              {content.name}
                            </div>
                            <div className={`text-slate-500 capitalize ${compactMode ? 'text-xs' : 'text-xs'}`}>
                              {content.type}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {content.usageCount}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
