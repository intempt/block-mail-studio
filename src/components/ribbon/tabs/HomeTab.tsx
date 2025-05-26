
import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Cut, 
  Clipboard, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered
} from 'lucide-react';

interface HomeTabProps {
  editor: any;
  selectedBlockId: string | null;
  onContentChange: (content: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  editor,
  selectedBlockId,
  onContentChange
}) => {
  const handleFormat = (command: string) => {
    if (editor) {
      switch (command) {
        case 'bold':
          editor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          editor.chain().focus().toggleItalic().run();
          break;
        case 'underline':
          editor.chain().focus().toggleUnderline().run();
          break;
        case 'alignLeft':
          editor.chain().focus().setTextAlign('left').run();
          break;
        case 'alignCenter':
          editor.chain().focus().setTextAlign('center').run();
          break;
        case 'alignRight':
          editor.chain().focus().setTextAlign('right').run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
      }
    }
  };

  return (
    <div className="home-tab flex items-stretch bg-white border-b border-gray-100">
      {/* Clipboard Group */}
      <RibbonGroup title="Clipboard">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3" title="Paste (Ctrl+V)">
            <Clipboard className="w-4 h-4 mr-1" />
            Paste
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2" title="Cut (Ctrl+X)">
              <Cut className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2" title="Copy (Ctrl+C)">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </RibbonGroup>

      {/* Font Group */}
      <RibbonGroup title="Font">
        <div className="flex flex-wrap gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleFormat('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleFormat('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleFormat('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-1 mt-1">
          <select className="text-xs border border-gray-300 rounded px-2 py-1 w-20">
            <option>Arial</option>
            <option>Helvetica</option>
            <option>Georgia</option>
          </select>
          <select className="text-xs border border-gray-300 rounded px-2 py-1 w-12">
            <option>12</option>
            <option>14</option>
            <option>16</option>
            <option>18</option>
          </select>
        </div>
      </RibbonGroup>

      {/* Paragraph Group */}
      <RibbonGroup title="Paragraph">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleFormat('alignLeft')}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleFormat('alignCenter')}
            title="Center"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleFormat('alignRight')}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-1 mt-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => handleFormat('bulletList')}
            title="Bullet List"
          >
            <List className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => handleFormat('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-3 h-3" />
          </Button>
        </div>
      </RibbonGroup>

      {/* Styles Group */}
      <RibbonGroup title="Styles">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-6 px-3 text-xs">
            Normal
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3 text-xs font-bold">
            Heading 1
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3 text-xs font-semibold">
            Heading 2
          </Button>
        </div>
      </RibbonGroup>
    </div>
  );
};
