
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Palette
} from 'lucide-react';
import { EmailBlock } from '@/types/emailBlocks';

interface BlockTemplate {
  type: string;
  name: string;
  icon: React.ReactNode;
  category: 'content' | 'layout' | 'media' | 'navigation';
  description: string;
  preview: string;
}

interface EmailBlockPaletteProps {
  onBlockAdd: (blockType: string) => void;
}

export const EmailBlockPalette: React.FC<EmailBlockPaletteProps> = ({ onBlockAdd }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const blockTemplates: BlockTemplate[] = [
    {
      type: 'text',
      name: 'Text',
      icon: <Type className="w-6 h-6" />,
      category: 'content',
      description: 'Rich text content with formatting',
      preview: 'Add your text content here...'
    },
    {
      type: 'image',
      name: 'Image',
      icon: <Image className="w-6 h-6" />,
      category: 'media',
      description: 'Images with optional links',
      preview: 'Image placeholder'
    },
    {
      type: 'button',
      name: 'Button',
      icon: <MousePointer className="w-6 h-6" />,
      category: 'content',
      description: 'Call-to-action buttons',
      preview: 'Click Here'
    },
    {
      type: 'split',
      name: 'Split',
      icon: <Columns className="w-6 h-6" />,
      category: 'layout',
      description: 'Two-column layout',
      preview: 'Left | Right'
    },
    {
      type: 'spacer',
      name: 'Spacer',
      icon: <Minus className="w-6 h-6" />,
      category: 'layout',
      description: 'Add vertical spacing',
      preview: '—'
    },
    {
      type: 'divider',
      name: 'Divider',
      icon: <Minus className="w-6 h-6" />,
      category: 'layout',
      description: 'Horizontal dividing line',
      preview: '———'
    },
    {
      type: 'video',
      name: 'Video',
      icon: <Play className="w-6 h-6" />,
      category: 'media',
      description: 'Video thumbnail with play button',
      preview: '▶ Video'
    },
    {
      type: 'social',
      name: 'Social',
      icon: <Share2 className="w-6 h-6" />,
      category: 'navigation',
      description: 'Social media icons',
      preview: 'f t in'
    },
    {
      type: 'menu',
      name: 'Menu',
      icon: <Menu className="w-6 h-6" />,
      category: 'navigation',
      description: 'Navigation menu',
      preview: 'Home | About | Contact'
    },
    {
      type: 'html',
      name: 'HTML',
      icon: <Code className="w-6 h-6" />,
      category: 'content',
      description: 'Custom HTML code',
      preview: '<html>'
    },
    {
      type: 'code',
      name: 'Code',
      icon: <Code className="w-6 h-6" />,
      category: 'content',
      description: 'Code snippets with syntax highlighting',
      preview: 'console.log()'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Blocks', icon: <Palette className="w-4 h-4" /> },
    { id: 'content', name: 'Content', icon: <Type className="w-4 h-4" /> },
    { id: 'layout', name: 'Layout', icon: <Columns className="w-4 h-4" /> },
    { id: 'media', name: 'Media', icon: <Image className="w-4 h-4" /> },
    { id: 'navigation', name: 'Navigation', icon: <Menu className="w-4 h-4" /> }
  ];

  const filteredBlocks = blockTemplates.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBlockDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ blockType }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card className="w-80 h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Block Library</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span className="ml-1">{category.name}</span>
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredBlocks.map((template) => (
            <Card
              key={template.type}
              className="p-3 cursor-grab hover:shadow-md transition-shadow group"
              draggable
              onDragStart={(e) => handleBlockDragStart(e, template.type)}
              onClick={() => onBlockAdd(template.type)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                    <Badge variant="outline" className="text-xs">
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

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No blocks found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
