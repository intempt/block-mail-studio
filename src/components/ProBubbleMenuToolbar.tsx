
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
  Copy,
  ChevronDown
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AIDropdownMenu } from './AIDropdownMenu';

interface ProBubbleMenuToolbarProps {
  editor: Editor;
}

export const ProBubbleMenuToolbar: React.FC<ProBubbleMenuToolbarProps> = ({ editor }) => {
  const [paragraphSelectorOpen, setParagraphSelectorOpen] = useState(false);

  if (!editor) return null;

  const selectedText = editor.state.selection.empty ? '' : editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to
  );

  const handleContentUpdate = (content: string) => {
    editor.chain().focus().deleteSelection().insertContent(content).run();
  };

  const getCurrentNodeType = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    if (editor.isActive('heading', { level: 4 })) return 'H4';
    if (editor.isActive('heading', { level: 5 })) return 'H5';
    if (editor.isActive('heading', { level: 6 })) return 'H6';
    return 'P';
  };

  const handleNodeTypeChange = (nodeType: string) => {
    if (nodeType === 'P') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(nodeType.replace('H', ''));
      editor.chain().focus().toggleHeading({ level }).run();
    }
    setParagraphSelectorOpen(false);
  };

  const nodeTypeOptions = [
    { value: 'P', label: 'Paragraph', tag: 'p' },
    { value: 'H1', label: 'Heading 1', tag: 'h1' },
    { value: 'H2', label: 'Heading 2', tag: 'h2' },
    { value: 'H3', label: 'Heading 3', tag: 'h3' },
    { value: 'H4', label: 'Heading 4', tag: 'h4' },
    { value: 'H5', label: 'Heading 5', tag: 'h5' },
    { value: 'H6', label: 'Heading 6', tag: 'h6' },
  ];

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
      {/* Paragraph/Heading Selector */}
      <Popover open={paragraphSelectorOpen} onOpenChange={setParagraphSelectorOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-medium border border-gray-200 bg-gray-50 hover:bg-gray-100"
          >
            {getCurrentNodeType()}
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-40 p-1 z-[60] bg-white" 
          align="start"
          side="bottom"
        >
          <div className="space-y-1">
            {nodeTypeOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-left h-8 px-2 ${
                  getCurrentNodeType() === option.value ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => handleNodeTypeChange(option.value)}
              >
                <span className="text-xs font-mono text-gray-500 mr-2 w-6">
                  {option.tag}
                </span>
                <span className="text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-gray-300 mx-1" />

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
