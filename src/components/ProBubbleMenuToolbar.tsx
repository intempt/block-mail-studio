
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
  Link,
  Palette,
  Type,
  Wand2,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Copy
} from 'lucide-react';
import { TipTapProService } from '@/services/TipTapProService';

interface ProBubbleMenuToolbarProps {
  editor: Editor;
}

export const ProBubbleMenuToolbar: React.FC<ProBubbleMenuToolbarProps> = ({ editor }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!editor) return null;

  const selectedText = editor.state.selection.empty ? '' : editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to
  );

  const handleAIImprove = async () => {
    if (!selectedText || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const result = await TipTapProService.improveText(selectedText, {
        style: 'professional',
        goal: 'clarity'
      });
      
      if (result.success && result.data) {
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
      }
    } catch (error) {
      console.error('AI improve failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIRewrite = async (tone: string) => {
    if (!selectedText || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const result = await TipTapProService.generateContent(
        `Rewrite this text: "${selectedText}"`,
        tone
      );
      
      if (result.success && result.data) {
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
      }
    } catch (error) {
      console.error('AI rewrite failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIMakeShortener = async () => {
    if (!selectedText || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const result = await TipTapProService.refineEmail(selectedText, 'Make this more concise and impactful');
      
      if (result.success && result.data) {
        editor.chain().focus().deleteSelection().insertContent(result.data).run();
      }
    } catch (error) {
      console.error('AI shorten failed:', error);
    } finally {
      setIsGenerating(false);
    }
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

      {/* TipTap Pro AI Features - Only show when text is selected */}
      {selectedText && (
        <>
          <div className="w-px h-6 bg-purple-300 mx-1" />
          
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span className="text-xs text-purple-700 font-medium">TipTap Pro AI</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIImprove}
            disabled={isGenerating}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700"
            title="AI Improve"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAIRewrite('professional')}
            disabled={isGenerating}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700"
            title="Rewrite Professional"
          >
            <Target className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAIRewrite('casual')}
            disabled={isGenerating}
            className="bg-green-50 hover:bg-green-100 text-green-700"
            title="Rewrite Casual"
          >
            <Type className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIMakeShortener}
            disabled={isGenerating}
            className="bg-orange-50 hover:bg-orange-100 text-orange-700"
            title="Make Shorter"
          >
            <TrendingUp className="w-4 h-4" />
          </Button>

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
