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
import Image from '@tiptap/extension-image';
import { FontSize } from '@/extensions/FontSizeExtension';
import { Variable } from '@/extensions/VariableExtension';
import { TextBlock } from '@/types/emailBlocks';
import { FullTipTapToolbar } from './FullTipTapToolbar';
import { EmailContext } from '@/services/tiptapAIService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VariableOption {
  text: string;
  value: string;
}

interface EnhancedTextBlockRendererProps {
  block: TextBlock;
  isSelected: boolean;
  isEditing: boolean;
  onUpdate: (block: TextBlock) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
  emailContext?: string;
  onInsertVariable?: (variable: VariableOption) => void;
}

export const EnhancedTextBlockRenderer: React.FC<EnhancedTextBlockRendererProps> = ({
  block,
  isSelected,
  isEditing,
  onUpdate,
  onEditStart,
  onEditEnd,
  emailContext,
  onInsertVariable
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasTextSelection, setHasTextSelection] = useState(false);
  const [savedCaretPosition, setSavedCaretPosition] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const positionUpdateRef = useRef<NodeJS.Timeout>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      Variable,
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
      if (!isEditing) return;
      
      const hasSelection = !editor.state.selection.empty;
      setHasTextSelection(hasSelection);
      
      // Save caret position for variable insertion
      setSavedCaretPosition(editor.state.selection.from);
      
      if (hasSelection) {
        // Clear any pending hide timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = undefined;
        }
        
        // Update toolbar position with debounce
        if (positionUpdateRef.current) {
          clearTimeout(positionUpdateRef.current);
        }
        
        positionUpdateRef.current = setTimeout(() => {
          updateToolbarPosition();
          setShowToolbar(true);
        }, 50);
      } else {
        // Hide toolbar after a short delay when no selection
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        
        hideTimeoutRef.current = setTimeout(() => {
          if (!hasTextSelection) {
            setShowToolbar(false);
          }
        }, 150);
      }
    },
    onFocus: () => {
      console.log('Editor focused');
      
      // Clear any hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = undefined;
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
      
      // Don't close if clicking on toolbar or related UI elements
      if (relatedTarget?.closest('.full-tiptap-toolbar') || 
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
      
      // Set a timeout to close editor, but allow cancellation
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      hideTimeoutRef.current = setTimeout(() => {
        console.log('Closing editor after blur timeout');
        setShowToolbar(false);
        setShowLinkDialog(false);
        if (isEditing) {
          onEditEnd();
        }
      }, 150);
    },
    immediatelyRender: false,
  });

  // Handle variable insertion
  const handleInsertVariable = useCallback((variable: VariableOption) => {
    console.log('handleInsertVariable called with savedCaretPosition:', savedCaretPosition);
    
    if (!editor) return;
    
    // If we have a saved caret position, restore it
    if (savedCaretPosition !== null) {
      editor.commands.setTextSelection(savedCaretPosition);
    }
    
    // Insert the variable at the current position
    editor.commands.insertVariable({
      text: variable.text,
      value: variable.value
    });
    
    // Focus back to editor
    editor.commands.focus();
  }, [editor, savedCaretPosition]);

  // Expose the insert variable function to parent
  useEffect(() => {
    if (onInsertVariable) {
      // This is a bit of a hack, but we need to expose the function to the parent
      (onInsertVariable as any).current = handleInsertVariable;
    }
  }, [handleInsertVariable, onInsertVariable]);

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
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (positionUpdateRef.current) {
        clearTimeout(positionUpdateRef.current);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing && e.key === 'Escape') {
      e.preventDefault();
      console.log('Escape pressed - closing editor');
      
      // Clear all timeouts
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (positionUpdateRef.current) {
        clearTimeout(positionUpdateRef.current);
      }
      
      setShowToolbar(false);
      setShowLinkDialog(false);
      editor?.commands.blur();
      onEditEnd();
    }
  };

  const handleLinkAdd = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  // Create email context for AI operations
  const aiEmailContext: EmailContext = {
    blockType: 'text',
    emailHTML: emailContext,
    targetAudience: 'general'
  };

  // Provide default styling values
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

        {/* Status Indicators */}
        {isEditing && (
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 animate-pulse">
                Saving...
              </Badge>
            )}
            <Badge variant="outline" className="text-xs bg-white">
              {wordCount} words
            </Badge>
            {hasTextSelection && (
              <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                Text Selected
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Enhanced TipTap Toolbar */}
      <FullTipTapToolbar
        editor={editor}
        isVisible={showToolbar && isEditing && hasTextSelection}
        position={toolbarPosition}
        onLinkClick={() => setShowLinkDialog(true)}
        containerElement={editorRef.current}
        emailContext={aiEmailContext}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div 
          className="link-dialog absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-80 animate-in fade-in-0 slide-in-from-top-2 duration-200"
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

      {/* Keyboard Shortcut Hints */}
      {isEditing && (
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Badge variant="outline" className="text-xs text-gray-500 bg-white">
            Press Esc to finish • Select text for formatting
          </Badge>
        </div>
      )}
    </div>
  );
};
