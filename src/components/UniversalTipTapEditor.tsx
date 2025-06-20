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
import { Placeholder } from '@tiptap/extension-placeholder';
import { Variable } from '@/extensions/VariableExtension';
import { FontSize } from '@/extensions/FontSizeExtension';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextBlockBubbleMenu } from './block-toolbars/TextBlockBubbleMenu';
import { EmailContext } from '@/services/tiptapAIService';
import { 
  ExternalLink,
  Play
} from 'lucide-react';

interface TextContent {
  html: string;
  textStyle?: string;
  placeholder?: string;
}

interface UniversalTipTapEditorProps {
  content: string | TextContent;
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
  const getHtmlContent = (content: string | TextContent): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object' && 'html' in content) {
      return content.html;
    }
    return '';
  };

  // Get placeholder text from content object or prop
  const getPlaceholderText = (): string => {
    if (placeholder) return placeholder;
    if (typeof content === 'object' && content?.placeholder) {
      return content.placeholder;
    }
    return 'Click to add text...';
  };

  const htmlContent = getHtmlContent(content);
  const placeholderText = getPlaceholderText();
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
      Variable,
      Placeholder.configure({
        placeholder: placeholderText,
      }),
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

  // Set up global variable insertion handler
  useEffect(() => {
    if (editor) {
      const blockId = (content as any)?.blockId || 'unknown';
      (window as any)[`insertVariable_${blockId}`] = (variable: { text: string; value: string }) => {
        console.log('UniversalTipTapEditor: Inserting variable into editor', variable);
        editor.commands.insertVariable({
          text: variable.text,
          value: variable.value
        });
      };

      return () => {
        delete (window as any)[`insertVariable_${blockId}`];
      };
    }
  }, [editor, content]);

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
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 focus:outline-none min-h-[80px]"
        />

        {/* Enhanced TipTap Pro BubbleMenu with AI features */}
        {editor && <TextBlockBubbleMenu editor={editor} />}
      </div>
    </div>
  );
};
