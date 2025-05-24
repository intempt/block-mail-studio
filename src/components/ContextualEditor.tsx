
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { EmailBlock, TextBlock, ImageBlock, ButtonBlock } from '@/types/emailBlocks';

interface ContextualEditorProps {
  block: EmailBlock;
  onBlockUpdate: (block: EmailBlock) => void;
  onClose: () => void;
}

export const ContextualEditor: React.FC<ContextualEditorProps> = ({ 
  block, 
  onBlockUpdate, 
  onClose 
}) => {
  const isTextBlock = block.type === 'text' || block.type === 'button';
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: isTextBlock ? (block as TextBlock).content.html || '' : '',
    onUpdate: ({ editor }) => {
      if (isTextBlock) {
        const updatedBlock = {
          ...block,
          content: {
            ...(block as TextBlock).content,
            html: editor.getHTML()
          }
        };
        onBlockUpdate(updatedBlock);
      }
    },
  });

  const renderTextEditor = () => (
    <div className="space-y-4">
      {/* TipTap Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 rounded border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-gray-200' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-gray-200' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive('underline') ? 'bg-gray-200' : ''}
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="border rounded p-3 min-h-24 focus-within:ring-2 focus-within:ring-blue-500">
        <EditorContent editor={editor} className="prose prose-sm max-w-none" />
      </div>
    </div>
  );

  const renderImageEditor = () => {
    const imageBlock = block as ImageBlock;
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="image-src">Image URL</Label>
          <Input
            id="image-src"
            value={imageBlock.content.src}
            onChange={(e) => onBlockUpdate({
              ...imageBlock,
              content: { ...imageBlock.content, src: e.target.value }
            })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label htmlFor="image-alt">Alt Text</Label>
          <Input
            id="image-alt"
            value={imageBlock.content.alt}
            onChange={(e) => onBlockUpdate({
              ...imageBlock,
              content: { ...imageBlock.content, alt: e.target.value }
            })}
            placeholder="Describe the image"
          />
        </div>
        <div>
          <Label htmlFor="image-link">Link URL (optional)</Label>
          <Input
            id="image-link"
            value={imageBlock.content.link || ''}
            onChange={(e) => onBlockUpdate({
              ...imageBlock,
              content: { ...imageBlock.content, link: e.target.value }
            })}
            placeholder="https://example.com"
          />
        </div>
      </div>
    );
  };

  const renderButtonEditor = () => {
    const buttonBlock = block as ButtonBlock;
    return (
      <div className="space-y-4">
        {renderTextEditor()}
        <Separator />
        <div>
          <Label htmlFor="button-link">Button Link</Label>
          <Input
            id="button-link"
            value={buttonBlock.content.link}
            onChange={(e) => onBlockUpdate({
              ...buttonBlock,
              content: { ...buttonBlock.content, link: e.target.value }
            })}
            placeholder="https://example.com"
          />
        </div>
      </div>
    );
  };

  const renderStylingControls = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Styling</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="bg-color">Background</Label>
          <Input
            id="bg-color"
            type="color"
            value={block.styling.desktop.backgroundColor || '#ffffff'}
            onChange={(e) => onBlockUpdate({
              ...block,
              styling: {
                ...block.styling,
                desktop: {
                  ...block.styling.desktop,
                  backgroundColor: e.target.value
                }
              }
            })}
          />
        </div>
        <div>
          <Label htmlFor="padding">Padding</Label>
          <Input
            id="padding"
            value={block.styling.desktop.padding || '16px'}
            onChange={(e) => onBlockUpdate({
              ...block,
              styling: {
                ...block.styling,
                desktop: {
                  ...block.styling.desktop,
                  padding: e.target.value
                }
              }
            })}
            placeholder="16px"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-80 bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit {block.type} Block</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Content Editor */}
        <div>
          <h4 className="text-sm font-medium mb-3">Content</h4>
          {block.type === 'text' && renderTextEditor()}
          {block.type === 'image' && renderImageEditor()}
          {block.type === 'button' && renderButtonEditor()}
        </div>

        <Separator />

        {/* Styling Controls */}
        {renderStylingControls()}
      </div>
    </Card>
  );
};
