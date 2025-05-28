import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { emailAIService } from '@/services/EmailAIService';
import { toast } from 'sonner';
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Link as LinkIcon,
  Plus,
  Minus,
  Code,
  Quote,
  List,
  ListOrdered,
  Undo,
  Redo,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  Loader2
} from 'lucide-react';

interface FloatingTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
}

const fontSizes = [
  { label: 'Small', value: '12px' },
  { label: 'Normal', value: '14px' },
  { label: 'Medium', value: '16px' },
  { label: 'Large', value: '18px' },
  { label: 'Extra Large', value: '24px' },
  { label: 'Huge', value: '32px' }
];

const fontFamilies = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times', value: 'Times New Roman, serif' },
  { label: 'Courier', value: 'Courier New, monospace' }
];

const textColors = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'
];

const bgColors = [
  '#FFFFFF', '#F3F4F6', '#FEF3C7', '#DBEAFE',
  '#FECACA', '#FED7AA', '#FEF08A', '#BBF7D0',
  '#BFDBFE', '#DDD6FE', '#FBCFE8', '#A7F3D0'
];

const aiOperations = [
  { label: 'Improve Writing', action: 'improve', prompt: 'Improve the writing quality, clarity, and flow of this text while maintaining its original meaning:' },
  { label: 'Fix Grammar', action: 'grammar', prompt: 'Fix any grammatical errors, spelling mistakes, and improve sentence structure in this text:' },
  { label: 'Make Professional', action: 'professional', prompt: 'Rewrite this text to sound more professional and formal while keeping the same message:' },
  { label: 'Make Casual', action: 'casual', prompt: 'Rewrite this text to sound more casual and conversational while keeping the same message:' },
  { label: 'Shorten Text', action: 'shorten', prompt: 'Make this text more concise and shorter while preserving all important information:' },
  { label: 'Expand Text', action: 'expand', prompt: 'Expand this text with more detail and elaboration while maintaining the original tone:' }
];

const FloatingTipTapToolbar: React.FC<FloatingTipTapToolbarProps> = ({
  editor,
  isVisible,
  position,
  onLinkClick
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  if (!editor || !isVisible) return null;

  const handleHeadingChange = (value: string) => {
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const handleFontSizeChange = (size: string) => {
    console.log('Setting font size:', size);
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  const handleFontFamilyChange = (family: string) => {
    console.log('Setting font family:', family);
    editor.chain().focus().setFontFamily(family).run();
  };

  const handleTextColorChange = (color: string) => {
    console.log('Setting text color:', color);
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const handleBgColorChange = (color: string) => {
    console.log('Setting background color:', color);
    editor.chain().focus().toggleHighlight({ color }).run();
    setShowBgColorPicker(false);
  };

  const handleImageInsert = () => {
    if (imageUrl.trim()) {
      console.log('Inserting image:', { src: imageUrl, alt: imageAlt });
      editor.chain().focus().setImage({ 
        src: imageUrl.trim(), 
        alt: imageAlt.trim() || 'Image' 
      }).run();
      setImageUrl('');
      setImageAlt('');
      setShowImageDialog(false);
    }
  };

  const handleAIOperation = async (operation: { action: string; prompt: string; label: string }) => {
    if (isAIProcessing) return;
    
    setIsAIProcessing(true);
    setShowAIDialog(false);
    
    try {
      const selectedText = editor.state.selection.empty ? 
        editor.getText() : 
        editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to);
      
      if (!selectedText.trim()) {
        toast.error('Please select some text to process');
        return;
      }

      toast.info(`Processing text with AI: ${operation.label}...`);
      
      const fullPrompt = `${operation.prompt}\n\n"${selectedText}"\n\nReturn only the improved text, no explanations or quotes.`;
      const processedText = await emailAIService.getConversationalResponse(fullPrompt);
      
      if (processedText) {
        if (editor.state.selection.empty) {
          editor.chain().focus().selectAll().insertContent(processedText).run();
        } else {
          editor.chain().focus().insertContent(processedText).run();
        }
        toast.success(`Text ${operation.action} completed!`);
      } else {
        throw new Error('No response from AI service');
      }
    } catch (error) {
      console.error('AI operation failed:', error);
      toast.error(`Failed to ${operation.action} text. Please try again.`);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return '1';
    if (editor.isActive('heading', { level: 2 })) return '2';
    if (editor.isActive('heading', { level: 3 })) return '3';
    if (editor.isActive('heading', { level: 4 })) return '4';
    if (editor.isActive('heading', { level: 5 })) return '5';
    if (editor.isActive('heading', { level: 6 })) return '6';
    return 'paragraph';
  };

  const toolbarStyle = {
    top: position.top - 80,
    left: position.left,
    transform: 'translateX(-50%)',
    maxWidth: 'calc(100vw - 32px)',
    minWidth: '450px'
  };

  return (
    <div
      className="floating-toolbar fixed z-[100] bg-white border border-gray-200 rounded-xl shadow-2xl p-3 flex items-center gap-2 animate-scale-in"
      style={toolbarStyle}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Text Style */}
      <Select value={getCurrentHeading()} onValueChange={handleHeadingChange}>
        <SelectTrigger className="w-28 h-8 text-xs bg-white border border-gray-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-[110]">
          <SelectItem value="paragraph">Text</SelectItem>
          <SelectItem value="1">Heading 1</SelectItem>
          <SelectItem value="2">Heading 2</SelectItem>
          <SelectItem value="3">Heading 3</SelectItem>
          <SelectItem value="4">Heading 4</SelectItem>
          <SelectItem value="5">Heading 5</SelectItem>
          <SelectItem value="6">Heading 6</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Family */}
      <Select onValueChange={handleFontFamilyChange}>
        <SelectTrigger className="w-24 h-8 text-xs bg-white border border-gray-300">
          <Type className="w-4 h-4" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-[110]">
          {fontFamilies.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size */}
      <Select onValueChange={handleFontSizeChange}>
        <SelectTrigger className="w-20 h-8 text-xs bg-white border border-gray-300">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-[110]">
          {fontSizes.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              {size.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Basic Formatting */}
      <div className="flex gap-1">
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling bold');
            editor.chain().focus().toggleBold().run();
          }}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling italic');
            editor.chain().focus().toggleItalic().run();
          }}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling underline');
            editor.chain().focus().toggleUnderline().run();
          }}
          className="h-8 w-8 p-0"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text & Background Color */}
      <div className="flex gap-1">
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
          <PopoverContent className="w-auto p-3 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
            <div className="text-xs font-medium mb-2">Text Color</div>
            <div className="grid grid-cols-4 gap-2">
              {textColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleTextColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showBgColorPicker} onOpenChange={setShowBgColorPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Background Color"
            >
              <div className="w-4 h-4 bg-yellow-200 border border-gray-300 rounded"></div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
            <div className="text-xs font-medium mb-2">Background Color</div>
            <div className="grid grid-cols-4 gap-2">
              {bgColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleBgColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex gap-1">
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Setting text align left');
            editor.chain().focus().setTextAlign('left').run();
          }}
          className="h-8 w-8 p-0"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Setting text align center');
            editor.chain().focus().setTextAlign('center').run();
          }}
          className="h-8 w-8 p-0"
          title="Center"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Setting text align right');
            editor.chain().focus().setTextAlign('right').run();
          }}
          className="h-8 w-8 p-0"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists & Special */}
      <div className="flex gap-1">
        <Button
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling bullet list');
            editor.chain().focus().toggleBulletList().run();
          }}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling ordered list');
            editor.chain().focus().toggleOrderedList().run();
          }}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling blockquote');
            editor.chain().focus().toggleBlockquote().run();
          }}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Toggling inline code');
            editor.chain().focus().toggleCode().run();
          }}
          className="h-8 w-8 p-0"
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Media & AI */}
      <div className="flex gap-1">
        {/* Link */}
        <Button
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            console.log('Opening link dialog');
            onLinkClick?.();
          }}
          className="h-8 w-8 p-0"
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        {/* Image */}
        <Popover open={showImageDialog} onOpenChange={setShowImageDialog}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Insert Image"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
            <div className="space-y-3">
              <div className="text-sm font-medium">Insert Image</div>
              <div className="space-y-2">
                <Input
                  placeholder="Image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full"
                />
                <Input
                  placeholder="Alt text (optional)..."
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowImageDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleImageInsert}
                  disabled={!imageUrl.trim()}
                >
                  Insert
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* AI Operations */}
        <Popover open={showAIDialog} onOpenChange={setShowAIDialog}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              title="AI Operations"
              disabled={isAIProcessing}
            >
              {isAIProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-white border border-gray-200 shadow-lg z-[110]" sideOffset={5}>
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Text Operations
              </div>
              <div className="grid gap-1">
                {aiOperations.map((operation) => (
                  <Button
                    key={operation.action}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAIOperation(operation)}
                    className="justify-start h-8 text-xs hover:bg-purple-50"
                    disabled={isAIProcessing}
                  >
                    {operation.label}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log('Undoing');
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log('Redoing');
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

function getCurrentHeading(editor: Editor) {
  if (editor.isActive('heading', { level: 1 })) return '1';
  if (editor.isActive('heading', { level: 2 })) return '2';
  if (editor.isActive('heading', { level: 3 })) return '3';
  if (editor.isActive('heading', { level: 4 })) return '4';
  if (editor.isActive('heading', { level: 5 })) return '5';
  if (editor.isActive('heading', { level: 6 })) return '6';
  return 'paragraph';
}

function handleHeadingChange(editor: Editor, value: string) {
  if (value === 'paragraph') {
    editor.chain().focus().setParagraph().run();
  } else {
    const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
    editor.chain().focus().toggleHeading({ level }).run();
  }
}

export { FloatingTipTapToolbar };
