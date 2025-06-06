
import React, { useState } from 'react';
import { Editor, BubbleMenu } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Copy
} from 'lucide-react';
import { AIDropdownMenu } from './AIDropdownMenu';

interface ProBubbleMenuToolbarProps {
  editor: Editor;
}

export const ProBubbleMenuToolbar: React.FC<ProBubbleMenuToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const selectedText = editor.state.selection.empty ? '' : editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to
  );

  const handleContentUpdate = (content: string) => {
    editor.chain().focus().deleteSelection().insertContent(content).run();
  };

  return (
    <BubbleMenu 
      editor={editor} 
      tippyOptions={{ 
        duration: 100,
        placement: 'top',
        theme: 'light-border',
        interactive: true,
        appendTo: 'parent',
        maxWidth: 'none'
      }}
      className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 flex items-center gap-1 z-50 max-w-none"
    >
      {/* Basic formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-100' : ''}
      >
        <Bold className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-100' : ''}
      >
        <Italic className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-gray-100' : ''}
      >
        <Underline className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists and quotes */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-100' : ''}
      >
        <List className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-100' : ''}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-gray-100' : ''}
      >
        <Quote className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-gray-100' : ''}
      >
        <Code className="w-4 h-4" />
      </Button>

      {/* AI Features - Only show when text is selected */}
      {selectedText && (
        <>
          <div className="w-px h-6 bg-purple-300 mx-1" />
          
          <AIDropdownMenu
            selectedText={selectedText}
            onContentUpdate={handleContentUpdate}
            size="sm"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(selectedText)}
            className="bg-gray-50 hover:bg-gray-100"
            title="Copy Selected"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </>
      )}
    </BubbleMenu>
  );
};
