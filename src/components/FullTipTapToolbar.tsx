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
  Image,
  Sparkles,
  Wand2,
  Type,
  Plus,
  Loader2
} from 'lucide-react';

interface FullTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
  containerElement?: HTMLElement | null;
  onAIAssist?: () => void;
  onImageInsert?: () => void;
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
  onImageInsert,
  emailContext = {}
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [finalPosition, setFinalPosition] = useState(position);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiOperation, setAiOperation] = useState<string | null>(null);

  const calculateOptimalPosition = useCallback(() => {
    if (!toolbarRef.current || !isVisible) return;

    const toolbar = toolbarRef.current;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let { top, left } = position;

    // Full toolbar width
    const toolbarWidth = 800;
    const toolbarHeight = 60;

    // Position toolbar above selection if there's space, otherwise below
    if (top >= toolbarHeight + 10) {
      top = top - toolbarHeight - 10;
    } else if (viewportHeight - top >= toolbarHeight + 10) {
      top = top + 30;
    } else {
      top = Math.max(10, top - toolbarHeight - 10);
    }

    // Center horizontally, but keep within viewport
    left = Math.max(10, Math.min(left - toolbarWidth / 2, viewportWidth - toolbarWidth - 10));

    // Handle container constraints if provided
    if (containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      left = Math.max(containerRect.left + 10, Math.min(left, containerRect.right - toolbarWidth - 10));
      top = Math.max(containerRect.top + 10, Math.min(top, containerRect.bottom - toolbarHeight - 10));
    }

    setFinalPosition({ top, left });
  }, [position, isVisible, containerElement]);

  useEffect(() => {
    calculateOptimalPosition();
  }, [calculateOptimalPosition]);

  useEffect(() => {
    const handleResize = () => calculateOptimalPosition();
    const handleScroll = () => calculateOptimalPosition();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [calculateOptimalPosition]);

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
        // Replace all content
        editor.commands.setContent(result.content);
      } else {
        // Replace selected text
        editor.chain().focus().deleteSelection().insertContent(result.content).run();
      }

      toast.success(`Text ${operationType} completed successfully`);
    } catch (error) {
      console.error('AI operation failed:', error);
      toast.error(`Failed to ${operationType} text`);
    } finally {
      setIsAIProcessing(false);
      setAiOperation(null);
    }
  };

  const handleQuickAIEnhance = async () => {
    if (!editor || !editor.getText().trim()) {
      toast.error('No text available to enhance');
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
    setAiOperation('enhance');

    try {
      // Use smart analysis to determine best operation
      const analysis = await TipTapAIService.analyzeTextContext(selectedText, emailContext.emailHTML);
      const bestOperation = analysis.suggestedOperations[0] || 'improve';

      const result = await TipTapAIService.enhanceText(
        selectedText, 
        bestOperation, 
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

      toast.success(`Text enhanced using ${bestOperation} operation`);
    } catch (error) {
      console.error('AI enhance failed:', error);
      toast.error('Failed to enhance text');
    } finally {
      setIsAIProcessing(false);
      setAiOperation(null);
    }
  };

  const handleTextColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const handleHighlightChange = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
    setShowHighlightPicker(false);
  };

  const handleFontSizeChange = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
  };

  const toolbarStyle = {
    top: finalPosition.top,
    left: finalPosition.left,
    zIndex: 9999,
    maxWidth: 'calc(100vw - 20px)',
  };

  if (!editor || !isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="full-tiptap-toolbar fixed bg-white border border-gray-200 rounded-lg shadow-xl p-2 flex items-center gap-1 animate-scale-in"
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
            {isAIProcessing && aiOperation !== 'enhance' ? (
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
        if (value === 'paragraph') {
          editor.chain().focus().setParagraph().run();
        } else {
          const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
          editor.chain().focus().toggleHeading({ level }).run();
        }
      }}>
        <SelectTrigger className="h-8 w-20 text-xs">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
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
        <SelectContent>
          {fontSizes.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              {size.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="h-8 w-8 p-0"
        title="Underline"
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
        <PopoverContent className="w-auto p-2 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
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
        <PopoverContent className="w-auto p-2 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
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
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className="h-8 w-8 p-0"
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className="h-8 w-8 p-0"
        title="Center"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
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
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="h-8 w-8 p-0"
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
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
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="h-8 w-8 p-0"
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive('code') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="h-8 w-8 p-0"
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Link & Image */}
      <Button
        variant={editor.isActive('link') ? 'default' : 'ghost'}
        size="sm"
        onClick={onLinkClick}
        className="h-8 w-8 p-0"
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onImageInsert}
        className="h-8 w-8 p-0"
        title="Insert Image"
      >
        <Image className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* AI Enhancement */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleQuickAIEnhance}
        className="h-8 px-3 text-blue-600 hover:bg-blue-50"
        title="AI Enhance"
        disabled={isAIProcessing}
      >
        {isAIProcessing && aiOperation === 'enhance' ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Wand2 className="w-4 h-4 mr-1" />
        )}
        Enhance
      </Button>
    </div>
  );
};
