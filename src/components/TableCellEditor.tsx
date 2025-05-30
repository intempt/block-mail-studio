
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { FloatingTipTapToolbar } from './FloatingTipTapToolbar';
import { EmailContext } from '@/services/tiptapAIService';

interface TableCellEditorProps {
  content: string;
  onChange: (html: string) => void;
  onBlur: () => void;
  autoFocus?: boolean;
  emailContext?: EmailContext;
}

export const TableCellEditor: React.FC<TableCellEditorProps> = ({
  content,
  onChange,
  onBlur,
  autoFocus = false,
  emailContext = {}
}) => {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Underline,
    ],
    content: content || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[24px] text-sm p-1',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log('TableCellEditor content updated:', html);
      onChange(html);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        setIsToolbarVisible(true);
        // Position toolbar above the selection
        setToolbarPosition({ top: -60, left: 0 });
      } else {
        setIsToolbarVisible(false);
      }
    },
    onBlur: () => {
      console.log('TableCellEditor blurred');
      setIsToolbarVisible(false);
      onBlur();
    },
    onFocus: () => {
      console.log('TableCellEditor focused');
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && autoFocus) {
      // Delay focus to ensure proper initialization
      setTimeout(() => {
        editor.commands.focus();
      }, 100);
    }
  }, [editor, autoFocus]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      console.log('Setting TableCellEditor content:', content);
      editor.commands.setContent(content || '<p></p>');
    }
  }, [content, editor]);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    console.log('TableCellEditor: Editor not initialized yet');
    return (
      <div className="min-h-[32px] p-2 text-gray-400 text-sm">
        Loading editor...
      </div>
    );
  }

  console.log('TableCellEditor: Rendering with editor', editor);

  return (
    <div className="table-cell-editor relative w-full">
      <FloatingTipTapToolbar 
        editor={editor} 
        isVisible={isToolbarVisible}
        position={toolbarPosition}
        emailContext={emailContext}
      />
      <EditorContent 
        editor={editor} 
        className="w-full"
      />
    </div>
  );
};
