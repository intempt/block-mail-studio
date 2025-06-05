import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import { FontSize } from '@/extensions/FontSizeExtension';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FullTipTapToolbar } from './FullTipTapToolbar';
import { EmailContext } from '@/services/tiptapAIService';
import { 
  ExternalLink,
  Play
} from 'lucide-react';

interface UniversalTipTapEditorProps {
  content: string;
  contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video';
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  position?: { x: number; y: number };
  emailContext?: EmailContext;
}

export const UniversalTipTapEditor: React.FC<UniversalTipTapEditorProps> = ({
  content,
  contentType,
  onChange,
  onBlur,
  placeholder,
  position,
  emailContext
}) => {
  const [urlValue, setUrlValue] = useState(content);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [hasSelection, setHasSelection] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const isUrlMode = contentType === 'url' || contentType === 'video';

  const editor = useEditor({
    extensions: [
      StarterKit,
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
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-6',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-6',
        },
      }),
      ListItem,
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-blue-400 pl-4 italic text-gray-700',
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 px-2 py-1 rounded text-sm font-mono',
        },
      }),
    ],
    content: isUrlMode ? '' : content,
    onUpdate: ({ editor }) => {
      if (!isUrlMode) {
        onChange(editor.getHTML());
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const hasTextSelected = from !== to;
      
      setHasSelection(hasTextSelected);
      
      if (hasTextSelected && hasFocus) {
        updateToolbarPosition();
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    },
    onFocus: () => {
      if (!isUrlMode) {
        setHasFocus(true);
        // Don't show toolbar on focus - only show when text is selected
        const { from, to } = editor?.state.selection || { from: 0, to: 0 };
        if (from !== to) {
          updateToolbarPosition();
          setShowToolbar(true);
        }
      }
    },
    onBlur: ({ event }) => {
      const relatedTarget = event.relatedTarget as HTMLElement;
      
      // Don't hide toolbar if clicking on toolbar or its elements
      if (relatedTarget?.closest('.full-tiptap-toolbar') || 
          relatedTarget?.closest('[data-radix-popover-content]') ||
          relatedTarget?.closest('[data-radix-dropdown-content]')) {
        return;
      }
      
      setTimeout(() => {
        setHasFocus(false);
        setShowToolbar(false);
        setHasSelection(false);
        onBlur?.();
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
        top: rect.top + window.scrollY - 10,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
  };

  const handleToolbarAction = () => {
    // Hide toolbar after any formatting action
    setShowToolbar(false);
    setHasSelection(false);
    
    // Refocus editor and clear selection
    setTimeout(() => {
      if (editor) {
        editor.commands.focus();
        // Clear selection by setting cursor at end
        const { doc } = editor.state;
        editor.commands.setTextSelection(doc.content.size);
      }
    }, 100);
  };

  useEffect(() => {
    if (editor && !isUrlMode && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    if (isUrlMode) {
      setUrlValue(content);
    }
  }, [content, editor, isUrlMode]);

  const handleUrlChange = (value: string) => {
    setUrlValue(value);
    onChange(value);
  };

  if (isUrlMode) {
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
            <ExternalLink className="w-4 h-4 text-gray-500" />
            {contentType === 'video' && <Play className="w-4 h-4 text-gray-500" />}
            <span className="text-sm text-gray-600">
              {contentType === 'video' ? 'Video URL' : 'URL'}
            </span>
          </div>
          
          <div className="p-3">
            <Input
              value={urlValue}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder || (contentType === 'video' ? 'Enter video URL...' : 'Enter URL...')}
              className="w-full"
              autoFocus
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="universal-tiptap-editor relative group"
      style={position ? {
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000
      } : {}}
    >
      {/* Professional Editor Container */}
      <div className={`
        border rounded-lg bg-white transition-all duration-200
        ${hasFocus ? 'border-blue-400 shadow-md ring-1 ring-blue-400/20' : 'border-gray-200 hover:border-gray-300'}
      `}>
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 focus:outline-none min-h-[80px]"
          placeholder={placeholder}
        />

        {/* Selection-Based Toolbar - Only show when text is selected */}
        <FullTipTapToolbar
          editor={editor}
          isVisible={showToolbar && hasSelection && hasFocus}
          position={toolbarPosition}
          emailContext={emailContext}
          onToolbarAction={handleToolbarAction}
        />
      </div>
    </div>
  );
};
