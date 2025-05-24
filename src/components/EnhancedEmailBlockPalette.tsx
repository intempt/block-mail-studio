
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, 
  Image, 
  MousePointer, 
  Columns, 
  Minus, 
  Play, 
  Share2, 
  Menu, 
  Code,
  Search,
  Palette,
  ShoppingCart,
  Table,
  Navigation,
  Quote,
  Layers,
  Star,
  Sparkles
} from 'lucide-react';

interface BlockTemplate {
  type: string;
  name: string;
  icon: React.ReactNode;
  category: 'basic' | 'layout' | 'media' | 'navigation' | 'commerce' | 'advanced';
  description: string;
  preview: string;
  isNew?: boolean;
}

interface EnhancedEmailBlockPaletteProps {
  onBlockAdd: (blockType: string) => void;
  universalContent?: any[];
  onUniversalContentAdd?: (content: any) => void;
}

export const EnhancedEmailBlockPalette: React.FC<EnhancedEmailBlockPaletteProps> = ({ 
  onBlockAdd,
  universalContent = [],
  onUniversalContentAdd
}) => {
  const blockTemplates: BlockTemplate[] = [
    // Basic Content Blocks
    {
      type: 'text',
      name: 'Text',
      icon: <Type className="w-6 h-6" />,
      category: 'basic',
      description: 'Rich text content with formatting and styles',
      preview: 'Add your text content here...'
    },
    {
      type: 'image',
      name: 'Image',
      icon: <Image className="w-6 h-6" />,
      category: 'basic',
      description: 'Images with optional links and dynamic content',
      preview: 'Image placeholder'
    },
    {
      type: 'button',
      name: 'Button',
      icon: <MousePointer className="w-6 h-6" />,
      category: 'basic',
      description: 'Call-to-action buttons with customizable styles',
      preview: 'Click Here'
    },
    {
      type: 'spacer',
      name: 'Spacer',
      icon: <Minus className="w-6 h-6" />,
      category: 'basic',
      description: 'Add vertical spacing between blocks',
      preview: '—'
    },
    {
      type: 'divider',
      name: 'Divider',
      icon: <Minus className="w-6 h-6" />,
      category: 'basic',
      description: 'Horizontal dividing line with customizable styles',
      preview: '———'
    },

    // Layout Blocks
    {
      type: 'split',
      name: 'Split',
      icon: <Columns className="w-6 h-6" />,
      category: 'layout',
      description: 'Two-column layout with text and images',
      preview: 'Left | Right'
    },
    {
      type: 'columns',
      name: 'Columns',
      icon: <Columns className="w-6 h-6" />,
      category: 'layout',
      description: '1-4 column flexible layouts for any content',
      preview: 'Col 1 | Col 2 | Col 3',
      isNew: true
    },
    {
      type: 'drop-shadow',
      name: 'Drop Shadow',
      icon: <Layers className="w-6 h-6" />,
      category: 'layout',
      description: 'Add depth and emphasis with shadow effects',
      preview: '□ Shadow',
      isNew: true
    },
    {
      type: 'table',
      name: 'Table',
      icon: <Table className="w-6 h-6" />,
      category: 'layout',
      description: 'Structured data in rows and columns',
      preview: 'Row | Col',
      isNew: true
    },

    // Media Blocks
    {
      type: 'video',
      name: 'Video',
      icon: <Play className="w-6 h-6" />,
      category: 'media',
      description: 'Video thumbnail with play button for YouTube, Vimeo, TikTok',
      preview: '▶ Video'
    },

    // Navigation Blocks
    {
      type: 'social',
      name: 'Social',
      icon: <Share2 className="w-6 h-6" />,
      category: 'navigation',
      description: 'Social media icons with customizable styles',
      preview: 'f t in'
    },
    {
      type: 'header-link-bar',
      name: 'Header/Link Bar',
      icon: <Navigation className="w-6 h-6" />,
      category: 'navigation',
      description: 'Logo and navigation links for email headers',
      preview: 'Logo | Nav Links',
      isNew: true
    },

    // Commerce Blocks
    {
      type: 'product',
      name: 'Product',
      icon: <ShoppingCart className="w-6 h-6" />,
      category: 'commerce',
      description: 'Product showcase with images, prices, and CTAs',
      preview: '🛍️ Product Grid',
      isNew: true
    },
    {
      type: 'review-quote',
      name: 'Review Quote',
      icon: <Quote className="w-6 h-6" />,
      category: 'commerce',
      description: 'Customer reviews and testimonials for social proof',
      preview: '"Great product!"',
      isNew: true
    },

    // Advanced Blocks
    {
      type: 'html',
      name: 'HTML',
      icon: <Code className="w-6 h-6" />,
      category: 'advanced',
      description: 'Custom HTML code and third-party integrations',
      preview: '<html>'
    },
  ];

  const handleBlockDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ blockType }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Block Library</h3>
      </div>

      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mb-2">
          <TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger>
          <TabsTrigger value="universal" className="flex-1">
            <Star className="w-4 h-4 mr-1" />
            Universal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {blockTemplates.map((template) => (
                <Card
                  key={template.type}
                  className="p-3 cursor-grab hover:shadow-md transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500"
                  draggable
                  onDragStart={(e) => handleBlockDragStart(e, template.type)}
                  onClick={() => onBlockAdd(template.type)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                          {template.isNew && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              <Sparkles className="w-3 h-3 mr-1" />
                              New
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <div className="text-xs text-gray-400 font-mono bg-gray-50 p-1 rounded">
                        {template.preview}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="universal" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {universalContent.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No saved content</p>
                  <p className="text-gray-400 text-xs mt-1">Save blocks or sections to reuse them across templates</p>
                </div>
              ) : (
                universalContent.map((content) => (
                  <Card
                    key={content.id}
                    className="p-3 cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => onUniversalContentAdd?.(content)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                        <Star className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{content.name}</h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {content.type === 'block' ? 'Saved Block' : 'Saved Section'}
                        </p>
                        <p className="text-xs text-gray-400">Used {content.usageCount} times</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
