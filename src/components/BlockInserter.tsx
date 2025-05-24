import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Type, 
  Image, 
  Table, 
  Minus,
  Quote,
  List,
  Calendar,
  Star,
  ChevronDown
} from 'lucide-react';

interface BlockInserterProps {
  editor: Editor | null;
}

interface Block {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'content' | 'media' | 'layout';
  content: string;
}

export const BlockInserter: React.FC<BlockInserterProps> = ({ editor }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const blocks: Block[] = [
    {
      id: 'paragraph',
      name: 'Paragraph',
      icon: <Type className="w-4 h-4" />,
      category: 'content',
      content: '<p>Add your content here...</p>'
    },
    {
      id: 'heading',
      name: 'Heading',
      icon: <Type className="w-4 h-4" />,
      category: 'content',
      content: '<h2>Your Heading</h2>'
    },
    {
      id: 'image',
      name: 'Image',
      icon: <Image className="w-4 h-4" />,
      category: 'media',
      content: '<img src="https://via.placeholder.com/600x300" alt="Placeholder image" style="width: 100%; height: auto; border-radius: 8px;" />'
    },
    {
      id: 'button',
      name: 'Button',
      icon: <Star className="w-4 h-4" />,
      category: 'content',
      content: '<div style="text-align: center; margin: 24px 0;"><a href="#" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Call to Action</a></div>'
    },
    {
      id: 'table',
      name: 'Table',
      icon: <Table className="w-4 h-4" />,
      category: 'layout',
      content: '<table style="width: 100%; border-collapse: collapse; margin: 16px 0;"><tr><th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header 1</th><th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header 2</th></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td><td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td></tr></table>'
    },
    {
      id: 'separator',
      name: 'Separator',
      icon: <Minus className="w-4 h-4" />,
      category: 'layout',
      content: '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />'
    },
    {
      id: 'quote',
      name: 'Quote',
      icon: <Quote className="w-4 h-4" />,
      category: 'content',
      content: '<blockquote style="border-left: 4px solid #3B82F6; padding-left: 16px; margin: 16px 0; font-style: italic; color: #6B7280;">"Insert your quote here..."</blockquote>'
    },
    {
      id: 'list',
      name: 'List',
      icon: <List className="w-4 h-4" />,
      category: 'content',
      content: '<ul style="margin: 16px 0; padding-left: 24px;"><li>First item</li><li>Second item</li><li>Third item</li></ul>'
    }
  ];

  const insertBlock = (block: Block) => {
    if (!editor) return;
    
    editor.chain().focus().insertContent(block.content).run();
    setShowDropdown(false);
  };

  const categoryBlocks = {
    content: blocks.filter(b => b.category === 'content'),
    media: blocks.filter(b => b.category === 'media'),
    layout: blocks.filter(b => b.category === 'layout')
  };

  return (
    <div className="relative">
      <Button
        variant="default"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Block</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {showDropdown && (
        <Card className="absolute top-full left-0 mt-2 w-80 p-4 shadow-lg z-50 bg-white">
          <div className="space-y-4">
            {Object.entries(categoryBlocks).map(([category, categoryBlockList]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize flex items-center gap-2">
                  {category === 'content' && <Type className="w-4 h-4" />}
                  {category === 'media' && <Image className="w-4 h-4" />}
                  {category === 'layout' && <Table className="w-4 h-4" />}
                  {category}
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {categoryBlockList.map((block) => (
                    <Button
                      key={block.id}
                      variant="outline"
                      size="sm"
                      onClick={() => insertBlock(block)}
                      className="flex items-center gap-2 justify-start h-auto p-3"
                    >
                      {block.icon}
                      <span className="text-xs">{block.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Click any block to insert it at your cursor position
            </p>
          </div>
        </Card>
      )}
      
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)} 
        />
      )}
    </div>
  );
};
