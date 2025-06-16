
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
  ChevronDown,
  Eraser,
  Palette,
  Highlighter
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AIDropdownMenu } from '../AIDropdownMenu';

interface TextBlockBubbleMenuProps {
  editor: Editor;
}

export const TextBlockBubbleMenu: React.FC<TextBlockBubbleMenuProps> = ({ editor }) => {
  const [paragraphSelectorOpen, setParagraphSelectorOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false);

  if (!editor) return null;

  const selectedText = editor.state.selection.empty ? '' : editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to
  );

  const handleContentUpdate = (content: string) => {
    editor.chain().focus().deleteSelection().insertContent(content).run();
  };

  const handleClearFormatting = () => {
    editor.chain()
      .focus()
      .clearNodes()
      .unsetAllMarks()
      .run();
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
    const { from, to } = editor.state.selection;
    const selectedContent = editor.state.doc.textBetween(from, to);
    
    if (selectedContent) {
      // Replace selected text with wrapped content
      let wrappedContent = '';
      
      if (nodeType === 'P') {
        wrappedContent = `<p>${selectedContent}</p>`;
      } else {
        const level = nodeType.replace('H', '');
        wrappedContent = `<h${level}>${selectedContent}</h${level}>`;
      }
      
      editor.chain()
        .focus()
        .deleteSelection()
        .insertContent(wrappedContent)
        .run();
    } else {
      // Fallback to original behavior if no text is selected
      if (nodeType === 'P') {
        editor.chain().focus().setParagraph().run();
      } else {
        const level = parseInt(nodeType.replace('H', '')) as 1 | 2 | 3 | 4 | 5 | 6;
        editor.chain().focus().toggleHeading({ level }).run();
      }
    }
    
    setParagraphSelectorOpen(false);
  };

  // Check text alignment - default to left if no specific alignment is set
  const isLeftAligned = () => {
    return editor.isActive({ textAlign: 'left' }) || 
           (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' }));
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
    <>
      <style>{`
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0.5rem 0;
        }
        .ProseMirror h2 {
          font-size: 1.75rem;
          font-weight: 600;
          line-height: 1.2;
          margin: 0.5rem 0;
        }
        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.2;
          margin: 0.5rem 0;
        }
        .ProseMirror h4 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.2;
          margin: 0.5rem 0;
        }
        .ProseMirror h5 {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.2;
          margin: 0.5rem 0;
        }
        .ProseMirror h6 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.2;
          margin: 0.5rem 0;
        }
        .ProseMirror p {
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          margin: 0.25rem 0;
          text-align: left;
        }
        .ProseMirror {
          text-align: left;
        }
      `}</style>
      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ 
          duration: 100,
          placement: 'top',
          theme: 'light-border',
          interactive: true,
          appendTo: document.body,
          maxWidth: 'none',
          zIndex: 99999,
          flip: true,
          preventOverflow: true
        }}
        className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 flex items-center gap-1 max-w-none"
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
            className="w-40 p-1 bg-white" 
            align="start"
            side="bottom"
            style={{ zIndex: 100000 }}
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

        {/* Text Color Picker */}
        <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
              title="Text Color"
            >
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-48 p-3 bg-white" 
            align="start"
            side="bottom"
            style={{ zIndex: 100000 }}
          >
            <div className="space-y-3">
              <p className="text-sm font-medium">Text Color</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  onChange={(e) => {
                    editor.chain().focus().setColor(e.target.value).run();
                  }}
                  title="Select text color"
                />
                <span className="text-sm text-gray-600">Choose color</span>
              </div>
              <button
                className="text-sm text-gray-600 hover:text-gray-800 underline"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setColorPickerOpen(false);
                }}
              >
                Remove Color
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight Color Picker */}
        <Popover open={highlightPickerOpen} onOpenChange={setHighlightPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={editor.isActive('highlight') ? 'bg-gray-100' : 'hover:bg-gray-100'}
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-48 p-3 bg-white" 
            align="start"
            side="bottom"
            style={{ zIndex: 100000 }}
          >
            <div className="space-y-3">
              <p className="text-sm font-medium">Highlight Color</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  defaultValue="#fef3c7"
                  onChange={(e) => {
                    editor.chain().focus().toggleHighlight({ color: e.target.value }).run();
                  }}
                  title="Select highlight color"
                />
                <span className="text-sm text-gray-600">Choose color</span>
              </div>
              <button
                className="text-sm text-gray-600 hover:text-gray-800 underline"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setHighlightPickerOpen(false);
                }}
              >
                Remove Highlight
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear formatting button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFormatting}
          className="hover:bg-red-50 hover:text-red-600"
          title="Clear Formatting"
        >
          <Eraser className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={isLeftAligned() ? 'bg-gray-100' : ''}
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
    </>
  );
};
