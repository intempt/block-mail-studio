import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Droppable } from 'react-beautiful-dnd';
import { 
  Type, 
  Image, 
  MousePointer, 
  MoveVertical, 
  Minus,
  Video, 
  Share2, 
  FileCode,
  Table,
  ChevronDown,
  ChevronRight,
  Blocks
} from 'lucide-react';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { LayoutConfigPanel } from './LayoutConfigPanel';
import { SnippetManager } from './SnippetManager';
import { DraggablePaletteItem } from './drag-drop/DraggablePaletteItem';

interface EnhancedEmailBlockPaletteProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd?: (snippet: EmailSnippet) => void;
  universalContent?: UniversalContent[];
  onUniversalContentAdd?: (content: UniversalContent) => void;
  compactMode?: boolean;
  snippetRefreshTrigger?: number;
}

interface BlockItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const blockItems: BlockItem[] = [
  { id: 'text', name: 'Text', description: 'Add paragraphs, headings, and formatted text', icon: <Type className="w-4 h-4" /> },
  { id: 'image', name: 'Image', description: 'Insert images with optional links', icon: <Image className="w-4 h-4" /> },
  { id: 'button', name: 'Button', description: 'Call-to-action buttons with custom styling', icon: <MousePointer className="w-4 h-4" /> },
  { id: 'spacer', name: 'Spacer', description: 'Add vertical spacing between blocks', icon: <MoveVertical className="w-4 h-4" /> },
  { id: 'divider', name: 'Divider', description: 'Horizontal line separators', icon: <Minus className="w-4 h-4" /> },
  { id: 'video', name: 'Video', description: 'Embed videos with thumbnails', icon: <Video className="w-4 h-4" /> },
  { id: 'social', name: 'Social', description: 'Social media icons and links', icon: <Share2 className="w-4 h-4" /> },
  { id: 'html', name: 'HTML', description: 'Custom HTML content', icon: <FileCode className="w-4 h-4" /> },
  { id: 'table', name: 'Table', description: 'Data tables with customizable styling', icon: <Table className="w-4 h-4" /> },
];

export const EnhancedEmailBlockPalette: React.FC<EnhancedEmailBlockPaletteProps> = ({
  onBlockAdd,
  onSnippetAdd,
  universalContent,
  onUniversalContentAdd,
  compactMode = false,
  snippetRefreshTrigger = 0
}) => {
  console.log('EnhancedEmailBlockPalette rendering');
  
  const [sectionsExpanded, setSectionsExpanded] = useState({
    blocks: true
  });

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLayoutSelect = (layout: any) => {
    console.log('Layout selected:', layout);
    onBlockAdd('columns', layout);
  };

  const handleSnippetSelect = (snippet: EmailSnippet) => {
    console.log('Snippet selected:', snippet);
    if (onSnippetAdd) {
      onSnippetAdd(snippet);
    }
  };

  const renderBlocksSection = () => (
    <Droppable droppableId="palette-blocks" isDropDisabled={true}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`grid ${compactMode ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-3'} mb-4`}
        >
          {blockItems.map((block, index) => (
            <DraggablePaletteItem
              key={block.id}
              blockId={block.id}
              blockName={block.name}
              blockDescription={block.description}
              icon={block.icon}
              index={index}
              compactMode={compactMode}
              onClick={() => onBlockAdd(block.id)}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  const renderSnippetsTab = () => {
    try {
      return (
        <SnippetManager
          onSnippetSelect={handleSnippetSelect}
          compactMode={compactMode}
          refreshTrigger={snippetRefreshTrigger}
        />
      );
    } catch (error) {
      console.error('Error rendering snippets tab:', error);
      return (
        <div className="p-4 text-center">
          <p className="text-slate-500 text-sm">Snippets not available</p>
        </div>
      );
    }
  };

  try {
    return (
      <div className="h-full flex flex-col">
        <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
          <TabsList className={`mx-2 ${compactMode ? 'mb-1' : 'mb-2'}`}>
            <TabsTrigger value="blocks" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>
              Blocks
            </TabsTrigger>
            <TabsTrigger value="layouts" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>
              Layouts
            </TabsTrigger>
            <TabsTrigger value="snippets" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>
              Snippets
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
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
                      {renderBlocksSection()}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="layouts" className="h-full mt-0">
              <ScrollArea className="flex-1">
                <div className={compactMode ? 'px-2 pb-4' : 'px-4 pb-6'}>
                  <LayoutConfigPanel 
                    onLayoutSelect={handleLayoutSelect}
                    compactMode={compactMode}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="snippets" className="h-full mt-0">
              {renderSnippetsTab()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error('Error in EnhancedEmailBlockPalette:', error);
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-500">Error loading block palette</p>
      </div>
    );
  }
};
