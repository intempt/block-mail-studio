import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { LayoutConfigPanel } from './LayoutConfigPanel';
import { SnippetManager } from './SnippetManager';
import { BlockSection } from './palette/BlockSection';
import { PaletteTabContent } from './palette/PaletteTabContent';
import { blockItems } from '@/data/blockItems.tsx';

interface EnhancedEmailBlockPaletteProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd?: (snippet: EmailSnippet) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
  compactMode?: boolean;
  snippetRefreshTrigger?: number;
}

export const EnhancedEmailBlockPalette: React.FC<EnhancedEmailBlockPaletteProps> = ({
  onBlockAdd,
  onSnippetAdd,
  universalContent,
  onUniversalContentAdd,
  compactMode = false,
  snippetRefreshTrigger = 0
}) => {
  console.log('=== EnhancedEmailBlockPalette Render ===');
  console.log('EnhancedEmailBlockPalette rendering with', blockItems.length, 'block items');
  console.log('Block items:', blockItems.map(item => ({ id: item.id, name: item.name })));
  
  const [sectionsExpanded, setSectionsExpanded] = useState({
    blocks: true
  });

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    console.log('=== Palette Drag Start ===');
    console.log('EnhancedEmailBlockPalette: Handling drag start for:', blockType);
    
    // Prevent default and stop propagation to ensure clean event handling
    e.stopPropagation();
    
    // Create consistent drag data format
    const dragData = JSON.stringify({ 
      blockType,
      source: 'palette-handler'
    });
    
    console.log('EnhancedEmailBlockPalette: Setting drag data:', dragData);
    
    // Set data in multiple formats for compatibility
    e.dataTransfer.setData('text/plain', dragData);
    e.dataTransfer.setData('application/json', dragData);
    e.dataTransfer.effectAllowed = 'copy';
    
    console.log('EnhancedEmailBlockPalette: Drag data set successfully');
    console.log('=== Palette Drag Start Complete ===');
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
            <PaletteTabContent value="blocks" compactMode={compactMode}>
              <BlockSection
                blockItems={blockItems}
                compactMode={compactMode}
                isExpanded={sectionsExpanded.blocks}
                onToggle={() => toggleSection('blocks')}
                onBlockAdd={onBlockAdd}
                onDragStart={handleDragStart}
              />
            </PaletteTabContent>

            <PaletteTabContent value="layouts" compactMode={compactMode}>
              <LayoutConfigPanel 
                onLayoutSelect={handleLayoutSelect}
                compactMode={compactMode}
              />
            </PaletteTabContent>

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
