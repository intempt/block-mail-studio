
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import { FontSize } from '@/extensions/FontSizeExtension';
import { FullTipTapToolbar } from './FullTipTapToolbar';
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
  const [hasFocus, setHasFocus] = useState(false);

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
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
    ],
    content: content || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[32px] text-sm p-2 rounded border border-gray-200 focus:border-blue-400 transition-colors',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log('TableCellEditor content updated:', html);
      onChange(html);
    },
    onSelectionUpdate: ({ editor }) => {
      updateToolbarPosition();
    },
    onFocus: () => {
      console.log('TableCellEditor focused');
      setHasFocus(true);
      updateToolbarPosition();
      setTimeout(() => setIsToolbarVisible(true), 100);
    },
    onBlur: ({ event }) => {
      console.log('TableCellEditor blurred');
      const relatedTarget = event.relatedTarget as HTMLElement;
      
      // Don't hide toolbar if clicking on toolbar
      if (relatedTarget?.closest('.full-tiptap-toolbar') || 
          relatedTarget?.closest('[data-radix-popover-content]') ||
          relatedTarget?.closest('[data-radix-dropdown-content]')) {
        return;
      }
      
      setTimeout(() => {
        setHasFocus(false);
        setIsToolbarVisible(false);
        onBlur();
      }, 200);
    },
    immediatelyRender: false,
  });

  const updateToolbarPosition = () => {
    if (!editor) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarPosition({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    } else {
      // Fallback to editor position
      const editorElement = editor.view.dom;
      const rect = editorElement.getBoundingClientRect();
      setToolbarPosition({
        top: rect.top + window.scrollY - 60,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
  };

  useEffect(() => {
    if (editor && autoFocus) {
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
      <div className="min-h-[32px] p-2 text-gray-400 text-sm border border-gray-200 rounded">
        Loading editor...
      </div>
    );
  }

  console.log('TableCellEditor: Rendering with editor', editor);

  return (
    <div className="table-cell-editor relative w-full">
      <FullTipTapToolbar 
        editor={editor} 
        isVisible={isToolbarVisible && hasFocus}
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
