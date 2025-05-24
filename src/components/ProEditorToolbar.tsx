
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Undo,
  Redo,
  Type
} from 'lucide-react';

interface ProEditorToolbarProps {
  editor: Editor | null;
}

export const ProEditorToolbar: React.FC<ProEditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-2">
      <div className="flex items-center gap-1">
        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-7 w-7 p-0"
          >
            <Undo className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-7 w-7 p-0"
          >
            <Redo className="w-3 h-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 h-5" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-7 w-7 p-0"
          >
            <Bold className="w-3 h-3" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-7 w-7 p-0"
          >
            <Italic className="w-3 h-3" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="h-7 w-7 p-0"
          >
            <Underline className="w-3 h-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 h-5" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="h-7 w-7 p-0"
          >
            <AlignLeft className="w-3 h-3" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="h-7 w-7 p-0"
          >
            <AlignCenter className="w-3 h-3" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className="h-7 w-7 p-0"
          >
            <AlignRight className="w-3 h-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 h-5" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-7 w-7 p-0"
          >
            <List className="w-3 h-3" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-7 w-7 p-0"
          >
            <ListOrdered className="w-3 h-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 h-5" />

        {/* Heading Levels */}
        <div className="flex items-center gap-1">
          <select
            value={
              editor.isActive('heading', { level: 1 }) ? '1' :
              editor.isActive('heading', { level: 2 }) ? '2' :
              editor.isActive('heading', { level: 3 }) ? '3' :
              'paragraph'
            }
            onChange={(e) => {
              const level = e.target.value;
              if (level === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: parseInt(level) as 1 | 2 | 3 }).run();
              }
            }}
            className="h-7 px-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500"
          >
            <option value="paragraph">P</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
          </select>
        </div>

        <Separator orientation="vertical" className="mx-2 h-5" />

        {/* Insert Elements */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addLink}
            className="h-7 w-7 p-0"
          >
            <Link className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addImage}
            className="h-7 w-7 p-0"
          >
            <Image className="w-3 h-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-2 h-5" />

        {/* Color Picker */}
        <div className="flex items-center gap-1">
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="h-7 w-7 border border-slate-300 rounded cursor-pointer"
            title="Text Color"
          />
        </div>
      </div>
    </div>
  );
};
