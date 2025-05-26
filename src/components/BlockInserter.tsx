
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  Type, 
  Image, 
  Table, 
  Minus,
  Quote,
  List,
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
  content: string;
}

export const BlockInserter: React.FC<BlockInserterProps> = ({ editor }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const blocks: Block[] = [
    {
      id: 'paragraph',
      name: 'Paragraph',
      icon: <Type className="w-4 h-4" />,
      content: '<p>Add your content here...</p>'
    },
    {
      id: 'heading',
      name: 'Heading',
      icon: <Type className="w-4 h-4" />,
      content: '<h2>Your Heading</h2>'
    },
    {
      id: 'image',
      name: 'Image',
      icon: <Image className="w-4 h-4" />,
      content: '<img src="https://via.placeholder.com/600x300" alt="Placeholder" style="width: 100%; height: auto; border-radius: 8px;" />'
    },
    {
      id: 'button',
      name: 'Button',
      icon: <Star className="w-4 h-4" />,
      content: '<div style="text-align: center; margin: 24px 0;"><a href="#" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Call to Action</a></div>'
    },
    {
      id: 'separator',
      name: 'Separator',
      icon: <Minus className="w-4 h-4" />,
      content: '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />'
    },
    {
      id: 'quote',
      name: 'Quote',
      icon: <Quote className="w-4 h-4" />,
      content: '<blockquote style="border-left: 4px solid #3B82F6; padding-left: 16px; margin: 16px 0; font-style: italic;">"Your quote here..."</blockquote>'
    },
    {
      id: 'list',
      name: 'List',
      icon: <List className="w-4 h-4" />,
      content: '<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>'
    }
  ];

  const insertBlock = (block: Block) => {
    if (!editor) return;
    editor.chain().focus().insertContent(block.content).run();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Block</span>
        </div>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {showDropdown && (
        <Card className="absolute top-full left-0 mt-2 w-64 p-3 shadow-lg z-50 bg-white">
          <div className="grid grid-cols-1 gap-1">
            {blocks.map((block) => (
              <Button
                key={block.id}
                variant="ghost"
                size="sm"
                onClick={() => insertBlock(block)}
                className="flex items-center gap-2 justify-start h-auto p-2"
              >
                {block.icon}
                <span className="text-sm">{block.name}</span>
              </Button>
            ))}
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
