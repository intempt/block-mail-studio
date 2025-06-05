
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
  BookOpen
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TipTapAIService } from '@/services/tiptapAIService';
import { EmailContext } from '@/services/tiptapAIService';
import { useNotification } from '@/contexts/NotificationContext';

interface FullTipTapToolbarProps {
  editor: Editor | null;
  isVisible: boolean;
  position: { top: number; left: number };
  onLinkClick?: () => void;
  containerElement?: HTMLElement | null;
  emailContext?: EmailContext;
}

const FullTipTapToolbar: React.FC<FullTipTapToolbarProps> = ({
  editor,
  isVisible,
  position,
  onLinkClick,
  containerElement,
  emailContext = {}
}) => {
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { success, error, warning } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setShowAIPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAIGenerate = useCallback(async () => {
    if (!aiPrompt.trim() || !editor) return;

    setIsGenerating(true);
    try {
      const result = await TipTapAIService.generateContent({
        prompt: aiPrompt,
        context: emailContext,
        tone: 'professional'
      });

      if (result.success) {
        const currentSelection = editor.state.selection;
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
        success('AI content generated successfully');
        setAiPrompt('');
        setShowAIPanel(false);
      } else {
        error(result.error || 'Failed to generate AI content');
      }
    } catch (err) {
      error('AI content generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt, editor, emailContext, success, error]);

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
      const result = await TipTapAIService.optimizeContent({
        content: selectedText,
        optimizationType: 'engagement',
        context: emailContext
      });

      if (result.success) {
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
        success('Content optimized successfully');
      } else {
        error(result.error || 'Failed to optimize content');
      }
    } catch (err) {
      error('Content optimization failed');
    } finally {
      setIsGenerating(false);
    }
  }, [editor, emailContext, success, error, warning]);

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
      const result = await TipTapAIService.improveReadability(selectedText);

      if (result.success) {
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
        success('Readability improved successfully');
      } else {
        error(result.error || 'Failed to improve readability');
      }
    } catch (err) {
      error('Readability improvement failed');
    } finally {
      setIsGenerating(false);
    }
  }, [editor, success, error, warning]);

  const handleSmartSuggestions = useCallback(async () => {
    if (!editor) return;

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );

    const contextText = selectedText || editor.getText();
    
    setIsGenerating(true);
    try {
      const result = await TipTapAIService.generateContent({
        prompt: `Provide 3 smart suggestions to improve this email content: "${contextText}"`,
        context: emailContext,
        tone: 'professional'
      });

      if (result.success) {
        success('AI suggestions generated - check the content');
      } else {
        error(result.error || 'Failed to generate suggestions');
      }
    } catch (err) {
      error('Smart suggestions failed');
    } finally {
      setIsGenerating(false);
    }
  }, [editor, emailContext, success, error]);

  // Show toolbar on focus, not just selection
  if (!isVisible || !editor) return null;

  const toolbarStyle = {
    position: 'fixed' as const,
    top: position.top - 60,
    left: Math.max(10, position.left - 200),
    zIndex: 1000,
    maxWidth: '400px'
  };

  return (
    <div ref={toolbarRef} style={toolbarStyle}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1 flex-wrap">
        {/* Basic formatting buttons */}
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

        {/* Alignment buttons */}
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

        {/* Enhanced AI Tools */}
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
          <PopoverContent className="w-80 p-4">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSmartSuggestions}
                  disabled={isGenerating}
                  className="text-xs justify-start"
                >
                  <Zap className="w-3 h-3 mr-2" />
                  Smart Suggestions
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

        {/* Link button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLinkClick}
        >
          <Link className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export { FullTipTapToolbar };
