
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
  Sparkles,
  Grid3X3,
  List
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
  compactMode?: boolean;
}

export const EnhancedEmailBlockPalette: React.FC<EnhancedEmailBlockPaletteProps> = ({ 
  onBlockAdd,
  universalContent = [],
  onUniversalContentAdd,
  compactMode = false
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
    {
      type: 'video',
      name: 'Video',
      icon: <Play className="w-6 h-6" />,
      category: 'media',
      description: 'Video thumbnail with play button for YouTube, Vimeo, TikTok',
      preview: '▶ Video'
    },
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

  const renderBlockCard = (template: BlockTemplate) => {
    const cardPadding = compactMode ? 'p-2' : 'p-3';
    const iconSize = compactMode ? 'w-4 h-4' : 'w-6 h-6';
    const iconPadding = compactMode ? 'p-1.5' : 'p-2';

    if (viewMode === 'grid') {
      return (
        <Card
          key={template.type}
          className={`${cardPadding} cursor-grab hover:shadow-md transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500`}
          draggable
          onDragStart={(e) => handleBlockDragStart(e, template.type)}
          onClick={() => onBlockAdd(template.type)}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className={`${iconPadding} bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200`}>
              {React.cloneElement(template.icon as React.ReactElement, { 
                className: iconSize 
              })}
            </div>
            <div className="flex items-center gap-1">
              <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>
                {template.name}
              </h4>
              {template.isNew && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  <Sparkles className="w-2 h-2" />
                </Badge>
              )}
            </div>
            {!compactMode && (
              <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
            )}
          </div>
        </Card>
      );
    }

    return (
      <Card
        key={template.type}
        className={`${cardPadding} cursor-grab hover:shadow-md transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500`}
        draggable
        onDragStart={(e) => handleBlockDragStart(e, template.type)}
        onClick={() => onBlockAdd(template.type)}
      >
        <div className="flex items-start gap-2 lg:gap-3">
          <div className={`${iconPadding} bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200`}>
            {React.cloneElement(template.icon as React.ReactElement, { 
              className: iconSize 
            })}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 lg:gap-2">
                <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>
                  {template.name}
                </h4>
                {template.isNew && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    <Sparkles className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />
                    New
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {template.category}
              </Badge>
            </div>
            {!compactMode && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.description}</p>
            )}
            <div className={`text-xs text-gray-400 font-mono bg-gray-50 p-1 rounded ${compactMode ? 'hidden lg:block' : ''}`}>
              {template.preview}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className={`${compactMode ? 'p-2' : 'p-4'} border-b border-gray-200`}>
        <div className="flex items-center justify-between mb-2 lg:mb-3">
          <h3 className={`${compactMode ? 'text-sm' : 'text-lg'} font-semibold text-gray-900`}>
            Block Library
          </h3>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-6 w-6 p-0 lg:h-8 lg:w-8"
            >
              <List className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-6 w-6 p-0 lg:h-8 lg:w-8"
            >
              <Grid3X3 className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <TabsList className={`mx-2 lg:mx-4 ${compactMode ? 'mb-1' : 'mb-2'}`}>
          <TabsTrigger value="blocks" className="flex-1 text-xs lg:text-sm">Blocks</TabsTrigger>
          <TabsTrigger value="universal" className="flex-1 text-xs lg:text-sm">
            <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Universal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className={`${compactMode ? 'p-2' : 'p-4'} ${viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
              {blockTemplates.map((template) => renderBlockCard(template))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="universal" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className={`${compactMode ? 'p-2' : 'p-4'} space-y-2`}>
              {universalContent.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-4 h-4 lg:w-6 lg:h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-xs lg:text-sm">No saved content</p>
                  <p className="text-gray-400 text-xs mt-1">Save blocks or sections to reuse them across templates</p>
                </div>
              ) : (
                universalContent.map((content) => (
                  <Card
                    key={content.id}
                    className={`${compactMode ? 'p-2' : 'p-3'} cursor-pointer hover:shadow-md transition-shadow group`}
                    onClick={() => onUniversalContentAdd?.(content)}
                  >
                    <div className="flex items-start gap-2 lg:gap-3">
                      <div className={`${compactMode ? 'p-1.5' : 'p-2'} bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors`}>
                        <Star className={`${compactMode ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>
                          {content.name}
                        </h4>
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
