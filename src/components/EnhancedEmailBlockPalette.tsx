import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { LayoutConfigPanel } from './LayoutConfigPanel';
import { BlockSection } from './palette/BlockSection';
import { PaletteTabContent } from './palette/PaletteTabContent';
import { ribbonBlockItems } from '@/data/ribbonBlockItems.tsx';
import { EmailSettingsCard } from './EmailSettingsCard';
import { TextHeadingsCard } from './TextHeadingsCard';
import { ButtonsCard } from './ButtonsCard';
import { LinksCard } from './LinksCard';

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
  console.log('EnhancedEmailBlockPalette rendering with', ribbonBlockItems.length, 'block items');
  console.log('Block items:', ribbonBlockItems.map(item => ({ id: item.id, name: item.name })));
  
  const [sectionsExpanded, setSectionsExpanded] = useState({
    blocks: true
  });

  const [stylesExpanded, setStylesExpanded] = useState({
    emailSettings: false,
    textHeadings: false,
    buttons: false,
    links: false
  });

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleStylesSection = (section: keyof typeof stylesExpanded) => {
    setStylesExpanded(prev => ({ ...prev, [section]: !prev[section] }));
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

  const handleStylesChange = (styles: any) => {
    console.log('Styles changed:', styles);
    // Handle global styles changes here
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
            <TabsTrigger value="styles" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>
              Styles
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <PaletteTabContent value="blocks" compactMode={compactMode}>
              <BlockSection
                blockItems={ribbonBlockItems}
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

            <TabsContent value="styles" className="h-full mt-0">
              <div className="h-full overflow-y-auto">
                <div className={compactMode ? 'px-2 pb-4' : 'px-4 pb-6'}>
                  <div className="space-y-2">
                    <EmailSettingsCard
                      isOpen={stylesExpanded.emailSettings}
                      onToggle={() => toggleStylesSection('emailSettings')}
                      onStylesChange={handleStylesChange}
                    />

                    <TextHeadingsCard
                      isOpen={stylesExpanded.textHeadings}
                      onToggle={() => toggleStylesSection('textHeadings')}
                      onStylesChange={handleStylesChange}
                    />

                    <ButtonsCard
                      isOpen={stylesExpanded.buttons}
                      onToggle={() => toggleStylesSection('buttons')}
                      onStylesChange={handleStylesChange}
                    />

                    <LinksCard
                      isOpen={stylesExpanded.links}
                      onToggle={() => toggleStylesSection('links')}
                      onStylesChange={handleStylesChange}
                    />
                  </div>
                </div>
              </div>
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
