
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { FloatingTipTapToolbar } from './FloatingTipTapToolbar';

interface TableCellEditorProps {
  content: string;
  onChange: (html: string) => void;
  onBlur: () => void;
  autoFocus?: boolean;
}

export const TableCellEditor: React.FC<TableCellEditorProps> = ({
  content,
  onChange,
  onBlur,
  autoFocus = false
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur();
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && autoFocus) {
      editor.commands.focus();
    }
  }, [editor, autoFocus]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="table-cell-editor relative">
      <FloatingTipTapToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-2 focus:outline-none min-h-[32px] text-sm"
      />
    </div>
  );
};
