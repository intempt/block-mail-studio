import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import { FontSize } from '@/extensions/FontSizeExtension';
import { TextBlock } from '@/types/emailBlocks';
import { AdaptiveTipTapToolbar } from './AdaptiveTipTapToolbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EnhancedTextBlockRendererProps {
  block: TextBlock;
  isSelected: boolean;
  isEditing: boolean;
  onUpdate: (block: TextBlock) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
}

export const EnhancedTextBlockRenderer: React.FC<EnhancedTextBlockRendererProps> = ({
  block,
  isSelected,
  isEditing,
  onUpdate,
  onEditStart,
  onEditEnd
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const blurTimeoutRef = useRef<NodeJS.Timeout>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors',
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
    content: block.content.html || '<p>Click to add text...</p>',
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      const words = editor.getText().trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setHasUnsavedChanges(true);
      
      // Auto-save with debounce
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({
          ...block,
          content: {
            ...block.content,
            html: newContent
          }
        });
        setHasUnsavedChanges(false);
      }, 500);
    },
    onSelectionUpdate: ({ editor }) => {
      if (isEditing && !editor.state.selection.empty) {
        updateToolbarPosition();
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    },
    onFocus: () => {
      console.log('Editor focused');
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = undefined;
      }
      
      if (!isEditing && !isTransitioning) {
        console.log('Starting edit mode');
        setIsTransitioning(true);
        onEditStart();
        setTimeout(() => setIsTransitioning(false), 100);
      }
    },
    onBlur: ({ event }) => {
      console.log('Editor blur event triggered');
      const relatedTarget = event.relatedTarget as HTMLElement;
      
      // Don't close if clicking on toolbar, dialogs, or other editor UI elements
      if (relatedTarget?.closest('.adaptive-tiptap-toolbar') || 
          relatedTarget?.closest('.link-dialog') ||
          relatedTarget?.closest('[data-radix-popper-content-wrapper]') ||
          relatedTarget?.closest('.radix-select-content') ||
          relatedTarget?.closest('[data-radix-select-content]') ||
          relatedTarget?.closest('.popover-content') ||
          relatedTarget?.closest('[data-radix-popover-content]') ||
          relatedTarget?.closest('.enhanced-text-block') ||
          showLinkDialog) {
        console.log('Blur ignored - clicking on UI element');
        return;
      }
      
      // Clear any existing timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      
      // Delay closing to allow for UI interactions
      blurTimeoutRef.current = setTimeout(() => {
        console.log('Closing editor after blur timeout');
        setShowToolbar(false);
        setShowLinkDialog(false);
        if (isEditing) {
          onEditEnd();
        }
      }, 300);
    },
    immediatelyRender: false,
  });

  const updateToolbarPosition = useCallback(() => {
    if (!editor || !editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setToolbarPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX
    });
  }, [editor]);

  useEffect(() => {
    if (editor && block.content.html !== editor.getHTML()) {
      editor.commands.setContent(block.content.html || '<p>Click to add text...</p>');
      const words = editor.getText().trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  }, [block.content.html, editor]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Block clicked, isEditing:', isEditing, 'isTransitioning:', isTransitioning);
    
    if (!isEditing && !isTransitioning) {
      console.log('Starting edit mode from click');
      setIsTransitioning(true);
      onEditStart();
      
      setTimeout(() => {
        editor?.commands.focus();
        setIsTransitioning(false);
      }, 50);
    } else if (isEditing) {
      editor?.commands.focus();
    }
  };

  const handleLinkAdd = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing && e.key === 'Escape') {
      e.preventDefault();
      console.log('Escape pressed - closing editor');
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      setShowToolbar(false);
      setShowLinkDialog(false);
      editor?.commands.blur();
      onEditEnd();
    }
  };

  // Provide default styling values to avoid TypeScript errors
  const styling = block.styling?.desktop;
  const defaultStyling = {
    backgroundColor: styling?.backgroundColor || 'transparent',
    padding: styling?.padding || '16px',
    margin: styling?.margin || '8px 0',
    borderRadius: styling?.borderRadius || '6px',
    border: styling?.border || (isSelected ? '2px solid #3b82f6' : '2px solid transparent'),
    textColor: styling?.textColor || '#374151',
    fontSize: styling?.fontSize || '14px',
    fontWeight: styling?.fontWeight || '400'
  };

  return (
    <div 
      className={`enhanced-text-block relative group cursor-text transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-30' : ''
      } ${isEditing ? 'editing shadow-lg bg-white ring-2 ring-blue-500' : 'hover:shadow-md hover:ring-1 hover:ring-gray-300'}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        backgroundColor: defaultStyling.backgroundColor,
        padding: defaultStyling.padding,
        margin: defaultStyling.margin,
        borderRadius: defaultStyling.borderRadius,
        border: defaultStyling.border,
        minHeight: '60px',
        position: 'relative'
      }}
    >
      <div ref={editorRef} className="relative">
        <EditorContent 
          editor={editor}
          className={`prose prose-sm max-w-none focus:outline-none transition-all duration-200 ${
            isEditing ? 'cursor-text' : 'cursor-pointer'
          }`}
          style={{
            color: defaultStyling.textColor,
            fontSize: defaultStyling.fontSize,
            fontWeight: defaultStyling.fontWeight,
          }}
        />

        {/* Status Indicators - Only show when editing and relevant */}
        {isEditing && (
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                Saving...
              </Badge>
            )}
            <Badge variant="outline" className="text-xs bg-white">
              {wordCount} words
            </Badge>
          </div>
        )}
      </div>

      {/* Enhanced Adaptive Toolbar */}
      <AdaptiveTipTapToolbar
        editor={editor}
        isVisible={showToolbar && isEditing}
        position={toolbarPosition}
        onLinkClick={() => setShowLinkDialog(true)}
        containerElement={editorRef.current}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div 
          className="link-dialog absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-80 animate-scale-in"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-3">
            <div className="text-sm font-medium text-gray-700">Add Link</div>
            <div className="flex gap-2">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLinkAdd();
                  } else if (e.key === 'Escape') {
                    setShowLinkDialog(false);
                  }
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleLinkAdd} disabled={!linkUrl.trim()}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcut Hints - Only show when editing */}
      {isEditing && (
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Badge variant="outline" className="text-xs text-gray-500 bg-white">
            Press Esc to finish editing
          </Badge>
        </div>
      )}
    </div>
  );
};
