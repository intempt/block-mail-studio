import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Link,
  Type,
  Palette,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wand2,
  Zap,
  Target,
  BookOpen,
  List,
  ListOrdered,
  Quote,
  Code,
  Highlighter,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { tiptapAIService } from '@/services/tiptapAIService';
import { EmailContext } from '@/services/tiptapAIService';
import { useNotification } from '@/contexts/NotificationContext';

interface FullTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
  containerElement?: HTMLElement | null;
  emailContext?: EmailContext;
  onToolbarAction?: () => void;
}

const FullTipTapToolbar: React.FC<FullTipTapToolbarProps> = ({
  editor,
  isVisible,
  position,
  onLinkClick,
  containerElement,
  emailContext = {},
  onToolbarAction
}) => {
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { success, error, warning } = useNotification();

  const fontFamilies = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Courier New', value: 'Courier New, monospace' }
  ];

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
  
  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#33CC00', '#0099CC', '#6633CC',
    '#FF3366', '#FF9900', '#FFFF00', '#66FF00', '#00CCFF', '#9966FF'
  ];

  // Helper function for dropdown actions - apply formatting but keep toolbar open
  const handleDropdownAction = useCallback((action: () => void) => {
    action();
    // Don't call onToolbarAction - keep toolbar open for multiple selections
  }, []);

  // Helper function for button actions - apply formatting and hide toolbar
  const handleButtonAction = useCallback((action: () => void) => {
    action();
    onToolbarAction?.();
  }, [onToolbarAction]);

  // Close toolbar manually
  const handleCloseToolbar = useCallback(() => {
    onToolbarAction?.();
  }, [onToolbarAction]);

  // Handle escape key to close toolbar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        handleCloseToolbar();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, handleCloseToolbar]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setShowAIPanel(false);
        setShowColorPicker(false);
        setShowLinkDialog(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAIGenerate = useCallback(async () => {
    if (!aiPrompt.trim() || !editor) return;

    setIsGenerating(true);
    try {
      const result = await tiptapAIService.generateContent({
        prompt: aiPrompt,
        context: emailContext,
        tone: 'professional'
      });

      if (result.success) {
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
        success('AI content generated successfully');
        setAiPrompt('');
        setShowAIPanel(false);
        onToolbarAction?.();
      } else {
        error(result.error || 'Failed to generate AI content');
      }
    } catch (err) {
      error('AI content generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt, editor, emailContext, success, error, onToolbarAction]);

  const handleOptimizeContent = useCallback(async () => {
    if (!editor) return;

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );

    if (!selectedText.trim()) {
      warning('Please select some text to optimize');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await tiptapAIService.optimizeContent({
        content: selectedText,
        optimizationType: 'engagement',
        context: emailContext
      });

      if (result.success) {
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
        success('Content optimized successfully');
        onToolbarAction?.();
      } else {
        error(result.error || 'Failed to optimize content');
      }
    } catch (err) {
      error('Content optimization failed');
    } finally {
      setIsGenerating(false);
    }
  }, [editor, emailContext, success, error, warning, onToolbarAction]);

  const handleImproveReadability = useCallback(async () => {
    if (!editor) return;

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );

    if (!selectedText.trim()) {
      warning('Please select some text to improve');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await tiptapAIService.improveReadability(selectedText);

      if (result.success) {
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
        success('Readability improved successfully');
        onToolbarAction?.();
      } else {
        error(result.error || 'Failed to improve readability');
      }
    } catch (err) {
      error('Readability improvement failed');
    } finally {
      setIsGenerating(false);
    }
  }, [editor, success, error, warning, onToolbarAction]);

  const handleAddLink = () => {
    if (!editor || !linkUrl.trim()) return;
    
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setShowLinkDialog(false);
    success('Link added successfully');
    onToolbarAction?.();
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setShowLinkDialog(false);
    onToolbarAction?.();
  };

  if (!isVisible || !editor) return null;

  const toolbarStyle = {
    position: 'fixed' as const,
    top: Math.max(10, position.top - 80),
    left: Math.max(10, Math.min(window.innerWidth - 500, position.left - 250)),
    zIndex: 1000,
    maxWidth: '480px'
  };

  return (
    <div ref={toolbarRef} style={toolbarStyle} className="full-tiptap-toolbar">
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 flex flex-wrap items-center gap-1">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCloseToolbar}
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          <X className="w-3 h-3" />
        </Button>

        {/* Font Family - Dropdown action (keeps toolbar open) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs bg-white hover:bg-gray-50">
              <Type className="w-3 h-3 mr-1" />
              Font
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border shadow-lg z-[1001]">
            {fontFamilies.map((font) => (
              <DropdownMenuItem
                key={font.value}
                onClick={() => handleDropdownAction(() => editor.chain().focus().setFontFamily(font.value).run())}
                className={`hover:bg-gray-100 ${editor.isActive('textStyle', { fontFamily: font.value }) ? 'bg-gray-100' : ''}`}
              >
                <span style={{ fontFamily: font.value }}>{font.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Size - Dropdown action (keeps toolbar open) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs bg-white hover:bg-gray-50">
              Size
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border shadow-lg z-[1001]">
            {fontSizes.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => handleDropdownAction(() => editor.chain().focus().setFontSize(size).run())}
                className={`hover:bg-gray-100 ${editor.isActive('textStyle', { fontSize: size }) ? 'bg-gray-100' : ''}`}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Basic formatting - Button actions (hide toolbar) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().toggleBold().run())}
          className={editor.isActive('bold') ? 'bg-gray-100' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().toggleItalic().run())}
          className={editor.isActive('italic') ? 'bg-gray-100' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().toggleUnderline().run())}
          className={editor.isActive('underline') ? 'bg-gray-100' : ''}
        >
          <Underline className="w-4 h-4" />
        </Button>

        {/* Text Color - Dropdown action (keeps toolbar open) */}
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="bg-white hover:bg-gray-50">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-white border shadow-lg z-[1001]">
            <div className="grid grid-cols-6 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleDropdownAction(() => editor.chain().focus().setColor(color).run());
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().toggleHighlight().run())}
          className={editor.isActive('highlight') ? 'bg-gray-100' : ''}
        >
          <Highlighter className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment - Button actions (hide toolbar) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().setTextAlign('left').run())}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().setTextAlign('center').run())}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().setTextAlign('right').run())}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists and formatting - Button actions (hide toolbar) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().toggleBulletList().run())}
          className={editor.isActive('bulletList') ? 'bg-gray-100' : ''}
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().toggleOrderedList().run())}
          className={editor.isActive('orderedList') ? 'bg-gray-100' : ''}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().toggleBlockquote().run())}
          className={editor.isActive('blockquote') ? 'bg-gray-100' : ''}
        >
          <Quote className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleButtonAction(() => editor.chain().focus().toggleCode().run())}
          className={editor.isActive('code') ? 'bg-gray-100' : ''}
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link - Modal action (hides toolbar after completion) */}
        <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`bg-white hover:bg-gray-50 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
            >
              <Link className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3 bg-white border shadow-lg z-[1001]">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Link URL</label>
                <Input
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddLink} size="sm" disabled={!linkUrl.trim()}>
                  Add Link
                </Button>
                {editor.isActive('link') && (
                  <Button onClick={handleRemoveLink} variant="outline" size="sm">
                    Remove Link
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* AI Tools - Modal actions (hide toolbar after completion) */}
        <Popover open={showAIPanel} onOpenChange={setShowAIPanel}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              AI Pro
              {showAIPanel ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white border shadow-lg z-[1001]">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  AI Content Generator
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Describe what you want to write..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAIGenerate()}
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleAIGenerate}
                    disabled={!aiPrompt.trim() || isGenerating}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? <Wand2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOptimizeContent}
                  disabled={isGenerating}
                  className="text-xs justify-start"
                >
                  <Target className="w-3 h-3 mr-2" />
                  Optimize for Engagement
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImproveReadability}
                  disabled={isGenerating}
                  className="text-xs justify-start"
                >
                  <BookOpen className="w-3 h-3 mr-2" />
                  Improve Readability
                </Button>
              </div>

              {emailContext.blockType && (
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                  Context: {emailContext.blockType} • {emailContext.targetAudience || 'general'}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export { FullTipTapToolbar };
