
import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { TextBlock } from '@/types/emailBlocks';
import { FloatingTipTapToolbar } from './FloatingTipTapToolbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Underline,
    ],
    content: block.content.html || '<p>Click to add text...</p>',
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onUpdate({
        ...block,
        content: {
          ...block.content,
          html: newContent
        }
      });
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
      if (!isEditing) {
        onEditStart();
      }
    },
    onBlur: ({ event }) => {
      // Check if the blur is happening because user clicked on toolbar
      const relatedTarget = event.relatedTarget as HTMLElement;
      if (relatedTarget?.closest('.floating-toolbar')) {
        return;
      }
      
      setTimeout(() => {
        setShowToolbar(false);
        onEditEnd();
      }, 100);
    },
    immediatelyRender: false,
  });

  const updateToolbarPosition = () => {
    if (!editor || !editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setToolbarPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX
    });
  };

  useEffect(() => {
    if (editor && block.content.html !== editor.getHTML()) {
      editor.commands.setContent(block.content.html || '<p>Click to add text...</p>');
    }
  }, [block.content.html, editor]);

  const handleClick = () => {
    if (!isEditing) {
      onEditStart();
      setTimeout(() => {
        editor?.commands.focus();
      }, 0);
    }
  };

  const handleLinkAdd = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  // Provide default styling values to avoid TypeScript errors
  const styling = block.styling?.desktop || {};
  const defaultStyling = {
    backgroundColor: styling.backgroundColor || 'transparent',
    padding: styling.padding || '12px',
    margin: styling.margin || '8px 0',
    borderRadius: styling.borderRadius || '4px',
    border: styling.border || (isSelected ? '1px solid #3b82f6' : '1px solid transparent'),
    textColor: styling.textColor || '#000000',
    fontSize: styling.fontSize || '14px',
    fontWeight: styling.fontWeight || '400'
  };

  return (
    <div 
      className={`enhanced-text-block relative group cursor-text ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${isEditing ? 'editing' : ''}`}
      onClick={handleClick}
      style={{
        backgroundColor: defaultStyling.backgroundColor,
        padding: defaultStyling.padding,
        margin: defaultStyling.margin,
        borderRadius: defaultStyling.borderRadius,
        border: defaultStyling.border,
        minHeight: '40px'
      }}
    >
      <div ref={editorRef} className="relative">
        <EditorContent 
          editor={editor}
          className={`prose prose-sm max-w-none focus:outline-none ${
            isEditing ? 'cursor-text' : 'cursor-pointer'
          }`}
          style={{
            color: defaultStyling.textColor,
            fontSize: defaultStyling.fontSize,
            fontWeight: defaultStyling.fontWeight,
          }}
        />
        
        {!isEditing && (
          <div className="absolute inset-0 bg-transparent hover:bg-blue-50 hover:bg-opacity-30 transition-all duration-200 rounded" />
        )}
      </div>

      <FloatingTipTapToolbar
        editor={editor}
        isVisible={showToolbar && isEditing}
        position={toolbarPosition}
        onLinkClick={() => setShowLinkDialog(true)}
      />

      {showLinkDialog && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-64">
          <div className="flex gap-2">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL..."
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
            <Button size="sm" onClick={handleLinkAdd}>Add</Button>
            <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs bg-gray-900 text-white px-2 py-1 rounded">
            Click to edit
          </div>
        </div>
      )}
    </div>
  );
};
