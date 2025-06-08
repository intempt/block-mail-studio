
import React, { useEffect, useCallback, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { Variable } from '@/extensions/VariableExtension';
import { EmailContext } from '@/services/tiptapAIService';
import { EditorToolbar } from './EditorToolbar';
import { VariableSelector } from './canvas/VariableSelector';

interface UniversalTipTapEditorProps {
  content: string;
  contentType: 'text' | 'button' | 'image' | 'link' | 'video' | 'html' | 'url';
  onChange: (html: string) => void;
  emailContext?: EmailContext;
  onBlur?: () => void;
  placeholder?: string;
  blockId?: string;
}

export const UniversalTipTapEditor: React.FC<UniversalTipTapEditorProps> = ({
  content,
  contentType,
  onChange,
  emailContext,
  onBlur,
  placeholder = "Click to edit...",
  blockId
}) => {
  const extensions = useMemo(() => [
    StarterKit.configure({
      history: false,
    }),
    Underline,
    Link,
    Image,
    Variable,
    Placeholder.configure({
      placeholder,
    }),
    TextStyle,
    Color,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ], [placeholder]);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    onBlur: () => {
      onBlur?.();
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const handleVariableSelect = useCallback((variable: { text: string; value: string }) => {
    if (editor) {
      editor.chain().focus().insertVariable(variable).run();
    }
  }, [editor]);

  // Register global variable handler for this block
  useEffect(() => {
    if (blockId && editor) {
      (window as any)[`insertVariable_${blockId}`] = handleVariableSelect;
      
      return () => {
        delete (window as any)[`insertVariable_${blockId}`];
      };
    }
  }, [blockId, handleVariableSelect, editor]);

  if (!editor) {
    return <div className="animate-pulse bg-gray-100 h-20 rounded"></div>;
  }

  return (
    <div className="universal-tiptap-editor relative group">
      <EditorContent 
        editor={editor} 
        className="prose max-w-none focus:outline-none min-h-[40px] p-3 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400"
      />
      
      {/* Variable selector positioned near the editor */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <VariableSelector onSelectVariable={handleVariableSelect} />
      </div>
      
      {/* Toolbar when editor has focus */}
      {editor.isFocused && (
        <div className="mt-2">
          <EditorToolbar editor={editor} />
        </div>
      )}
    </div>
  );
};
