
import React, { useEffect, useState } from 'react';
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
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

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
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        setIsToolbarVisible(true);
        // Position toolbar above the selection
        setToolbarPosition({ top: -50, left: 0 });
      } else {
        setIsToolbarVisible(false);
      }
    },
    onBlur: () => {
      setIsToolbarVisible(false);
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
      <FloatingTipTapToolbar 
        editor={editor} 
        isVisible={isToolbarVisible}
        position={toolbarPosition}
      />
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-2 focus:outline-none min-h-[32px] text-sm"
      />
    </div>
  );
};
