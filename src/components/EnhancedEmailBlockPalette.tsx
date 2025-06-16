
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  Image, 
  MousePointer, 
  Square, 
  Video, 
  Layout,
  Palette,
  Mail,
  MousePointerClick,
  Link
} from 'lucide-react';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EmailSettingsCard } from './EmailSettingsCard';
import { TextHeadingsCard } from './TextHeadingsCard';
import { ButtonsCard } from './ButtonsCard';
import { LinksCard } from './LinksCard';

interface EnhancedEmailBlockPaletteProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd?: (snippet: EmailSnippet) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
  compactMode: boolean;
  snippetRefreshTrigger?: number;
  onGlobalStylesChange?: (styles: any) => void;
}

export const EnhancedEmailBlockPalette: React.FC<EnhancedEmailBlockPaletteProps> = ({
  onBlockAdd,
  onSnippetAdd,
  universalContent,
  onUniversalContentAdd,
  compactMode,
  snippetRefreshTrigger = 0,
  onGlobalStylesChange
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const blocks = [
    { id: 'text', name: 'Text', icon: Type, description: 'Add text content' },
    { id: 'image', name: 'Image', icon: Image, description: 'Add an image' },
    { id: 'button', name: 'Button', icon: MousePointer, description: 'Add a button' },
    { id: 'divider', name: 'Divider', icon: Square, description: 'Add a divider line' },
    { id: 'video', name: 'Video', icon: Video, description: 'Add a video thumbnail' },
    { id: 'columns', name: 'Columns', icon: Layout, description: 'Add column layout' }
  ];

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedItem(blockId);
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'block',
      blockType: blockId
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleBlockClick = (blockId: string) => {
    onBlockAdd(blockId);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <div className="px-4 pb-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="blocks" className="h-full mt-0">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3 pb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Email Blocks</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {blocks.map((block) => (
                      <Card
                        key={block.id}
                        className={`p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 ${
                          draggedItem === block.id ? 'opacity-50 scale-95' : ''
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleBlockClick(block.id)}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <block.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-900">{block.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{block.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {universalContent.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Universal Content</h3>
                    <div className="space-y-2">
                      {universalContent.map((content, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm font-medium">{content.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {content.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{content.content}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="styles" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <h3 className="text-sm font-medium text-gray-700">Email Settings</h3>
                    </div>
                    <EmailSettingsCard
                      isOpen={true}
                      onToggle={() => {}}
                      onStylesChange={onGlobalStylesChange || (() => {})}
                      inline={true}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Type className="w-4 h-4 text-gray-600" />
                      <h3 className="text-sm font-medium text-gray-700">Text & Headings</h3>
                    </div>
                    <TextHeadingsCard
                      isOpen={true}
                      onToggle={() => {}}
                      onStylesChange={onGlobalStylesChange || (() => {})}
                      inline={true}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MousePointerClick className="w-4 h-4 text-gray-600" />
                      <h3 className="text-sm font-medium text-gray-700">Buttons</h3>
                    </div>
                    <ButtonsCard
                      isOpen={true}
                      onToggle={() => {}}
                      onStylesChange={onGlobalStylesChange || (() => {})}
                      inline={true}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Link className="w-4 h-4 text-gray-600" />
                      <h3 className="text-sm font-medium text-gray-700">Links</h3>
                    </div>
                    <LinksCard
                      isOpen={true}
                      onToggle={() => {}}
                      onStylesChange={onGlobalStylesChange || (() => {})}
                      inline={true}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
