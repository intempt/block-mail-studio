
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
  emailContext?: string;
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
  const [hasTextSelection, setHasTextSelection] = useState(false);

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
      const hasSelection = !editor.state.selection.empty;
      setHasTextSelection(hasSelection);
      
      if (hasSelection) {
        updateToolbarPosition();
        setShowToolbar(true);
      } else {
        // Short delay before hiding to allow for formatting operations
        setTimeout(() => {
          if (!editor.state.selection || editor.state.selection.empty) {
            setShowToolbar(false);
          }
        }, 150);
      }
    },
    onFocus: () => {
      if (!isUrlMode) {
        updateToolbarPosition();
        // Only show toolbar if there's a selection
        if (!editor?.state.selection.empty) {
          setShowToolbar(true);
        }
      }
    },
    onBlur: ({ event }) => {
      const relatedTarget = event.relatedTarget as HTMLElement;
      
      // Don't hide toolbar if clicking on toolbar or its elements
      if (relatedTarget?.closest('.full-tiptap-toolbar') || 
          relatedTarget?.closest('[data-radix-popover-content]')) {
        return;
      }
      
      setTimeout(() => {
        setShowToolbar(false);
        onBlur?.();
      }, 200);
    },
    immediatelyRender: false,
  });

  const updateToolbarPosition = () => {
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setToolbarPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX
    });
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

  // Create email context for AI operations
  const aiEmailContext: EmailContext = {
    blockType: contentType,
    emailHTML: emailContext,
    targetAudience: 'general'
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
      className="universal-tiptap-editor relative"
      style={position ? {
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000
      } : {}}
    >
      <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-3 focus:outline-none min-h-[60px]"
          placeholder={placeholder}
        />

        {/* Enhanced Toolbar - Only show when text is selected */}
        <FullTipTapToolbar
          editor={editor}
          isVisible={showToolbar && hasTextSelection}
          position={toolbarPosition}
          emailContext={aiEmailContext}
        />
      </div>
    </div>
  );
};
