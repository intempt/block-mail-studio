
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TipTapAIService, AI_OPERATIONS, EmailContext } from '@/services/tiptapAIService';
import { toast } from 'sonner';
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Palette,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading,
  Highlighter,
  Sparkles,
  Wand2,
  Type,
  Plus,
  Loader2,
  Check,
  X
} from 'lucide-react';

interface FullTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
  containerElement?: HTMLElement | null;
  onAIAssist?: () => void;
  emailContext?: EmailContext;
}

const textColors = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'
];

const highlightColors = [
  '#FEF3C7', '#FECACA', '#DBEAFE', '#D1FAE5',
  '#E0E7FF', '#F3E8FF', '#FCE7F3', '#F0FDFA'
];

const fontSizes = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' }
];

export const FullTipTapToolbar: React.FC<FullTipTapToolbarProps> = ({
  editor,
  isVisible,
  position,
  onLinkClick,
  containerElement,
  onAIAssist,
  emailContext = {}
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [finalPosition, setFinalPosition] = useState(position);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiOperation, setAiOperation] = useState<string | null>(null);
  
  // Simplified link state management
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [storedSelection, setStoredSelection] = useState<{ from: number; to: number } | null>(null);

  // Check if text is selected for link functionality
  const hasTextSelection = editor && !editor.state.selection.empty;

  // Store selection when opening link dialog
  const storeCurrentSelection = useCallback(() => {
    if (editor && hasTextSelection) {
      const { from, to } = editor.state.selection;
      setStoredSelection({ from, to });
      const text = editor.state.doc.textBetween(from, to);
      setSelectedText(text);
      
      // Check if the selected text is already a link
      const existingLink = editor.getAttributes('link');
      if (existingLink.href) {
        setLinkUrl(existingLink.href);
      } else {
        // Auto-detect if selected text looks like a URL
        const urlPattern = /^(https?:\/\/|www\.|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
        if (urlPattern.test(text)) {
          setLinkUrl(text.startsWith('http') ? text : `https://${text}`);
        } else {
          setLinkUrl('');
        }
      }
    }
  }, [editor, hasTextSelection]);

  // Restore selection and apply link
  const restoreSelectionAndApplyLink = useCallback((url: string) => {
    if (!editor || !storedSelection) return false;

    try {
      // Restore the selection
      editor.commands.setTextSelection({
        from: storedSelection.from,
        to: storedSelection.to
      });

      // Apply the link
      const finalUrl = url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:') 
        ? url 
        : `https://${url}`;
      
      editor.chain().focus().setLink({ href: finalUrl }).run();
      return true;
    } catch (error) {
      console.error('Failed to apply link:', error);
      return false;
    }
  }, [editor, storedSelection]);

  // Debounced position calculation to prevent jumping
  const calculateOptimalPosition = useCallback(() => {
    if (!toolbarRef.current || !isVisible) return;

    const toolbar = toolbarRef.current;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let { top, left } = position;

    // Full toolbar dimensions
    const toolbarWidth = 800;
    const toolbarHeight = 60;

    // Position above selection with improved spacing
    if (top >= toolbarHeight + 15) {
      top = top - toolbarHeight - 15;
    } else if (viewportHeight - top >= toolbarHeight + 15) {
      top = top + 35;
    } else {
      top = Math.max(15, top - toolbarHeight - 15);
    }

    // Center horizontally with viewport constraints
    left = Math.max(15, Math.min(left - toolbarWidth / 2, viewportWidth - toolbarWidth - 15));

    // Container constraints
    if (containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      left = Math.max(containerRect.left + 15, Math.min(left, containerRect.right - toolbarWidth - 15));
      top = Math.max(containerRect.top + 15, Math.min(top, containerRect.bottom - toolbarHeight - 15));
    }

    setFinalPosition({ top, left });
  }, [position, isVisible, containerElement]);

  useEffect(() => {
    if (isVisible) {
      calculateOptimalPosition();
    }
  }, [calculateOptimalPosition, isVisible]);

  // Handle formatting operations with improved UX
  const handleFormatOperation = useCallback((operation: () => void) => {
    if (!editor) return;
    
    // Execute the operation
    operation();
    
    // Brief delay to show operation feedback, then restore focus
    setTimeout(() => {
      editor.commands.focus();
    }, 50);
  }, [editor]);

  const handleAIOperation = async (operationType: string) => {
    if (!editor || !editor.getText().trim()) {
      toast.error('No text selected or available for AI operation');
      return;
    }

    const selectedText = editor.state.selection.empty 
      ? editor.getText() 
      : editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to);

    if (!selectedText.trim()) {
      toast.error('Please select text or ensure there is content to enhance');
      return;
    }

    setIsAIProcessing(true);
    setAiOperation(operationType);
    setShowAIMenu(false);

    try {
      const result = await TipTapAIService.enhanceText(
        selectedText, 
        operationType as any, 
        {
          blockType: 'text',
          ...emailContext
        }
      );

      if (editor.state.selection.empty) {
        editor.commands.setContent(result.content);
      } else {
        editor.chain().focus().deleteSelection().insertContent(result.content).run();
      }

      toast.success(`Text ${operationType} completed successfully`);
      
      // Keep focus after AI operation
      setTimeout(() => {
        editor.commands.focus();
      }, 150);
      
    } catch (error) {
      console.error('AI operation failed:', error);
      toast.error(`Failed to ${operationType} text`);
    } finally {
      setIsAIProcessing(false);
      setAiOperation(null);
    }
  };

  const handleTextColorChange = (color: string) => {
    handleFormatOperation(() => {
      editor?.chain().focus().setColor(color).run();
    });
    setShowColorPicker(false);
  };

  const handleHighlightChange = (color: string) => {
    handleFormatOperation(() => {
      editor?.chain().focus().setHighlight({ color }).run();
    });
    setShowHighlightPicker(false);
  };

  const handleFontSizeChange = (size: string) => {
    handleFormatOperation(() => {
      editor?.chain().focus().setFontSize(size).run();
    });
  };

  // Simplified link handling
  const handleLinkClick = () => {
    if (!hasTextSelection) {
      toast.error('Please select text first to add a link');
      return;
    }

    storeCurrentSelection();
    setShowLinkDialog(true);
    onLinkClick?.();
    
    // Focus the input after a brief delay
    setTimeout(() => {
      linkInputRef.current?.focus();
    }, 100);
  };

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    const success = restoreSelectionAndApplyLink(linkUrl);
    if (success) {
      setShowLinkDialog(false);
      setLinkUrl('');
      setStoredSelection(null);
      toast.success('Link added successfully');
    } else {
      toast.error('Failed to add link. Please try again.');
    }
  };

  const handleRemoveLink = () => {
    if (editor && storedSelection) {
      editor.commands.setTextSelection({
        from: storedSelection.from,
        to: storedSelection.to
      });
      editor.chain().focus().unsetLink().run();
      setShowLinkDialog(false);
      setLinkUrl('');
      setStoredSelection(null);
      toast.success('Link removed');
    }
  };

  const handleLinkCancel = () => {
    setShowLinkDialog(false);
    setLinkUrl('');
    setStoredSelection(null);
    if (editor) {
      editor.commands.focus();
    }
  };

  // Handle keyboard shortcuts
  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLinkSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleLinkCancel();
    }
  };

  // Enhanced toolbar styling with smooth transitions
  const toolbarStyle = {
    top: finalPosition.top,
    left: finalPosition.left,
    zIndex: 9999,
    maxWidth: 'calc(100vw - 30px)',
    opacity: isVisible ? 1 : 0,
    transform: `translateY(${isVisible ? 0 : -10}px)`,
    transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
    pointerEvents: (isVisible ? 'auto' : 'none') as 'auto' | 'none'
  };

  if (!editor) return null;

  return (
    <>
      <div
        ref={toolbarRef}
        className="full-tiptap-toolbar fixed bg-white border border-gray-200 rounded-lg shadow-xl p-2 flex items-center gap-1"
        style={toolbarStyle}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* AI Assistant with Menu */}
        <Popover open={showAIMenu} onOpenChange={setShowAIMenu}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-purple-600 hover:bg-purple-50"
              title="AI Assistant"
              disabled={isAIProcessing}
            >
              {isAIProcessing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1" />
              )}
              AI
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">AI Operations</div>
              <div className="grid gap-1">
                {AI_OPERATIONS.map((operation) => (
                  <Button
                    key={operation.type}
                    variant="ghost"
                    size="sm"
                    className="justify-start h-auto p-2 text-left"
                    onClick={() => handleAIOperation(operation.type)}
                    disabled={isAIProcessing}
                  >
                    <div>
                      <div className="font-medium text-sm">{operation.label}</div>
                      <div className="text-xs text-gray-500">{operation.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <Select onValueChange={(value) => {
          handleFormatOperation(() => {
            if (value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
              editor.chain().focus().toggleHeading({ level }).run();
            }
          });
        }}>
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-[120]">
            <SelectItem value="paragraph">Normal</SelectItem>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select onValueChange={handleFontSizeChange}>
          <SelectTrigger className="h-8 w-16 text-xs">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-[120]">
            {fontSizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting with improved feedback */}
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().toggleBold().run())}
          className="h-8 w-8 p-0 transition-all duration-150"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().toggleItalic().run())}
          className="h-8 w-8 p-0 transition-all duration-150"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().toggleUnderline().run())}
          className="h-8 w-8 p-0 transition-all duration-150"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Color */}
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Text Color"
            >
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-white border border-gray-200 shadow-lg z-[120]" sideOffset={5}>
            <div className="grid grid-cols-4 gap-1">
              {textColors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleTextColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight */}
        <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('highlight') ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-white border border-gray-200 shadow-lg z-[120]" sideOffset={5}>
            <div className="grid grid-cols-4 gap-1">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleHighlightChange(color)}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Alignment */}
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().setTextAlign('left').run())}
          className="h-8 w-8 p-0"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().setTextAlign('center').run())}
          className="h-8 w-8 p-0"
          title="Center"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().setTextAlign('right').run())}
          className="h-8 w-8 p-0"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <Button
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().toggleBulletList().run())}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().toggleOrderedList().run())}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Blockquote & Code */}
        <Button
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().toggleBlockquote().run())}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleFormatOperation(() => editor.chain().focus().toggleCode().run())}
          className="h-8 w-8 p-0"
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Enhanced Link Button */}
        <Button
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          size="sm"
          onClick={handleLinkClick}
          className="h-8 w-8 p-0"
          title={hasTextSelection ? "Add Link (Ctrl+K)" : "Select text first to add link"}
          disabled={!hasTextSelection}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Streamlined Link Dialog */}
      {showLinkDialog && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-[9999] animate-in fade-in-0 duration-150"
          style={{
            top: finalPosition.top + 70,
            left: finalPosition.left,
            transform: 'translateX(-50%)',
            minWidth: '350px',
            maxWidth: 'calc(100vw - 40px)'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                {editor.isActive('link') ? 'Edit Link' : 'Add Link'}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLinkCancel}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {selectedText && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                Selected: <span className="font-medium">"{selectedText}"</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Input
                ref={linkInputRef}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com or mailto:email@domain.com"
                className="w-full"
                onKeyDown={handleLinkKeyDown}
              />
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleLinkSubmit} 
                  disabled={!linkUrl.trim()}
                  className="flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  {editor.isActive('link') ? 'Update' : 'Add'} Link
                </Button>
                
                {editor.isActive('link') && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRemoveLink}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleLinkCancel}
                >
                  Cancel
                </Button>
              </div>
              
              <div className="text-xs text-gray-500">
                Press Enter to confirm, Esc to cancel
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
