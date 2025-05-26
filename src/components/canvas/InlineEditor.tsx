
import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon,
  Palette,
  Type
} from 'lucide-react';

interface InlineEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  onBlur: () => void;
  position?: { x: number; y: number };
  placeholder?: string;
  contentType: 'text' | 'button' | 'image' | 'link';
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  content,
  onUpdate,
  onBlur,
  position,
  placeholder = 'Enter text...',
  contentType
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    onBlur: () => {
      setTimeout(() => {
        setIsVisible(false);
        onBlur();
      }, 150);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    setIsVisible(true);
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor || !isVisible) return null;

  const toolbarStyle = position ? {
    position: 'fixed' as const,
    top: position.y - 50,
    left: position.x,
    zIndex: 1000,
  } : {};

  return (
    <div className="relative">
      {/* Floating Toolbar */}
      <div
        style={toolbarStyle}
        className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 mb-2"
      >
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>
        {contentType === 'text' && (
          <>
            <Button
              variant={editor.isActive('link') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                const url = window.prompt('Enter URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const color = window.prompt('Enter color (hex):');
                if (color) {
                  editor.chain().focus().setColor(color).run();
                }
              }}
            >
              <Palette className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Editor */}
      <div ref={editorRef} className="border border-blue-300 rounded-md p-2 bg-white shadow-sm">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
};
