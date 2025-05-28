
import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { FloatingTipTapToolbar } from '../FloatingTipTapToolbar';

interface TableCellEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  isEditing: boolean;
  onBlur: () => void;
  onFocus: () => void;
  isHeader?: boolean;
}

export const TableCellEditor: React.FC<TableCellEditorProps> = ({
  content,
  onUpdate,
  onKeyDown,
  isEditing,
  onBlur,
  onFocus,
  isHeader = false
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    onFocus: () => {
      onFocus();
    },
    onBlur: () => {
      setShowToolbar(false);
      onBlur();
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to && editorRef.current) {
        const rect = editorRef.current.getBoundingClientRect();
        setToolbarPosition({
          top: rect.top - 10,
          left: rect.left + rect.width / 2
        });
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  if (!isEditing) {
    return (
      <div 
        className="p-2 cursor-pointer hover:bg-gray-50 min-h-[40px] flex items-center"
        onClick={onFocus}
        dangerouslySetInnerHTML={{ __html: content || 'Click to edit...' }}
      />
    );
  }

  return (
    <div ref={editorRef} className="relative">
      <EditorContent
        editor={editor}
        className={`
          table-cell-editor p-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded
          ${isHeader ? 'font-semibold' : ''}
        `}
        onKeyDown={handleKeyDown}
      />
      
      {showToolbar && editor && (
        <FloatingTipTapToolbar
          editor={editor}
          isVisible={showToolbar}
          position={toolbarPosition}
        />
      )}
    </div>
  );
};
