
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { FontSize } from '@/extensions/FontSizeExtension';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProBubbleMenuToolbar } from './ProBubbleMenuToolbar';
import { EmailContext } from '@/services/tiptapAIService';
import { 
  ExternalLink,
  Play,
  Sparkles
} from 'lucide-react';
import { AIDropdownMenu } from './AIDropdownMenu';

interface UniversalTipTapEditorProps {
  content: string | { html: string; textStyle?: string };
  contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video';
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  position?: { x: number; y: number };
  emailContext?: EmailContext;
}

export const UniversalTipTapEditor: React.FC<UniversalTipTapEditorProps> = ({
  content,
  contentType,
  onChange,
  onBlur,
  placeholder,
  position,
  emailContext
}) => {
  const [urlValue, setUrlValue] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  // Extract HTML content from potentially complex content object
  const getHtmlContent = (content: string | { html: string; textStyle?: string }): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object' && 'html' in content) {
      return content.html;
    }
    return '';
  };

  const htmlContent = getHtmlContent(content);
  const isUrlMode = contentType === 'url' || contentType === 'video';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-6',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-blue-400 pl-4 italic text-gray-700',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'bg-gray-100 px-2 py-1 rounded text-sm font-mono',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
    ],
    content: isUrlMode ? '' : htmlContent,
    onUpdate: ({ editor }) => {
      if (!isUrlMode) {
        onChange(editor.getHTML());
      }
    },
    onFocus: () => {
      setHasFocus(true);
    },
    onBlur: () => {
      setHasFocus(false);
      onBlur?.();
    },
    immediatelyRender: false,
  });

  const handleContentUpdate = (newContent: string) => {
    if (editor) {
      editor.commands.setContent(newContent);
      onChange(newContent);
    }
  };

  useEffect(() => {
    if (editor && !isUrlMode) {
      const currentHtml = getHtmlContent(content);
      if (currentHtml !== editor.getHTML()) {
        editor.commands.setContent(currentHtml);
      }
    }
    if (isUrlMode) {
      const currentContent = typeof content === 'string' ? content : content?.html || '';
      setUrlValue(currentContent);
    }
  }, [content, editor, isUrlMode]);

  const handleUrlChange = (value: string) => {
    setUrlValue(value);
    onChange(value);
  };

  if (isUrlMode) {
    return (
      <div 
        className="universal-tiptap-editor"
        style={position ? {
          position: 'absolute',
          top: position.y,
          left: position.x,
          zIndex: 1000
        } : {}}
      >
        <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
          <div className="flex gap-1 p-2 border-b bg-gray-50">
            <ExternalLink className="w-4 h-4 text-gray-500" />
            {contentType === 'video' && <Play className="w-4 h-4 text-gray-500" />}
            <span className="text-sm text-gray-600">
              {contentType === 'video' ? 'Video URL' : 'URL'}
            </span>
          </div>
          
          <div className="p-3">
            <Input
              value={urlValue}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder || (contentType === 'video' ? 'Enter video URL...' : 'Enter URL...')}
              className="w-full"
              autoFocus
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="universal-tiptap-editor relative group"
      style={position ? {
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000
      } : {}}
    >
      <div className={`
        border rounded-lg bg-white transition-all duration-200
        ${hasFocus ? 'border-blue-400 shadow-md ring-1 ring-blue-400/20' : 'border-gray-200 hover:border-gray-300'}
      `}>
        {/* TipTap Pro AI Toolbar - Show when focused or has content */}
        {(hasFocus || htmlContent) && (
          <div className="flex items-center gap-1 px-3 py-2 border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-1 text-xs text-purple-700">
              <Sparkles className="w-3 h-3" />
              <span className="font-medium">TipTap Pro AI</span>
            </div>
            
            <div className="ml-auto">
              <AIDropdownMenu
                selectedText=""
                fullContent={htmlContent}
                onContentUpdate={handleContentUpdate}
                size="sm"
              />
            </div>
          </div>
        )}

        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 focus:outline-none min-h-[80px]"
          placeholder={placeholder}
        />

        {/* Enhanced TipTap Pro BubbleMenu with AI features */}
        {editor && <ProBubbleMenuToolbar editor={editor} />}
      </div>
    </div>
  );
};
