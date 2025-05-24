
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette
} from 'lucide-react';

interface UniversalTipTapEditorProps {
  content: string;
  contentType: 'text' | 'button' | 'image' | 'link' | 'html';
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  position?: { x: number; y: number };
}

export const UniversalTipTapEditor: React.FC<UniversalTipTapEditorProps> = ({
  content,
  contentType,
  onChange,
  onBlur,
  placeholder,
  position
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const getToolbarForContentType = () => {
    const baseTools = (
      <>
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
        >
          <Italic className="w-4 h-4" />
        </Button>
      </>
    );

    const alignmentTools = (
      <>
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </>
    );

    const linkTool = (
      <Button
        variant={editor.isActive('link') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setShowLinkDialog(true)}
        className="h-8 w-8 p-0"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
    );

    const imageTool = (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowImageDialog(true)}
        className="h-8 w-8 p-0"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>
    );

    switch (contentType) {
      case 'text':
        return (
          <>
            {baseTools}
            <div className="w-px h-6 bg-gray-300 mx-1" />
            {alignmentTools}
            <div className="w-px h-6 bg-gray-300 mx-1" />
            {linkTool}
            {imageTool}
          </>
        );
      case 'button':
        return (
          <>
            {baseTools}
            <div className="w-px h-6 bg-gray-300 mx-1" />
            {linkTool}
          </>
        );
      case 'image':
        return (
          <>
            {imageTool}
            <div className="w-px h-6 bg-gray-300 mx-1" />
            {baseTools}
          </>
        );
      case 'link':
        return (
          <>
            {baseTools}
            <div className="w-px h-6 bg-gray-300 mx-1" />
            {linkTool}
          </>
        );
      default:
        return baseTools;
    }
  };

  return (
    <div 
      className="universal-tiptap-editor"
      style={position ? {
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000
      } : {}}
    >
      <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="flex gap-1 p-2 border-b bg-gray-50">
          {getToolbarForContentType()}
        </div>
        
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-3 focus:outline-none min-h-[60px]"
          placeholder={placeholder}
        />

        {showLinkDialog && (
          <div className="p-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addLink();
                  }
                }}
              />
              <Button size="sm" onClick={addLink}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {showImageDialog && (
          <div className="p-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addImage();
                  }
                }}
              />
              <Button size="sm" onClick={addImage}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setShowImageDialog(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
