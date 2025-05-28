
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdaptiveTipTapToolbar } from './AdaptiveTipTapToolbar';
import { 
  ExternalLink,
  Play
} from 'lucide-react';

interface UniversalTipTapEditorProps {
  content: string;
  contentType: 'text' | 'button' | 'image' | 'link' | 'html' | 'url' | 'video';
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  position?: { x: number; y: number };
}

export const UniversalTipTapEditor: React.FC<UniversalTipTapEditorProps> = ({
  content,
  contentType,
  onChange,
  onBlur,
  placeholder,
  position
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [urlValue, setUrlValue] = useState(content);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const isUrlMode = contentType === 'url' || contentType === 'video';

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
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
      Underline,
    ],
    content: isUrlMode ? '' : content,
    onUpdate: ({ editor }) => {
      if (!isUrlMode) {
        onChange(editor.getHTML());
      }
    },
    onSelectionUpdate: ({ editor }) => {
      if (!editor.state.selection.empty) {
        updateToolbarPosition();
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    },
    onFocus: () => {
      if (!isUrlMode) {
        updateToolbarPosition();
        setShowToolbar(true);
      }
    },
    onBlur: ({ event }) => {
      const relatedTarget = event.relatedTarget as HTMLElement;
      
      // Don't hide toolbar if clicking on toolbar or its elements
      if (relatedTarget?.closest('.adaptive-tiptap-toolbar') || 
          relatedTarget?.closest('[data-radix-popover-content]') ||
          showLinkDialog || showImageDialog) {
        return;
      }
      
      setTimeout(() => {
        setShowToolbar(false);
        onBlur?.();
      }, 200);
    },
    immediatelyRender: false,
  });

  const updateToolbarPosition = () => {
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setToolbarPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX
    });
  };

  useEffect(() => {
    if (editor && !isUrlMode && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    if (isUrlMode) {
      setUrlValue(content);
    }
  }, [content, editor, isUrlMode]);

  const handleUrlChange = (value: string) => {
    setUrlValue(value);
    onChange(value);
  };

  const handleLinkAdd = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const handleImageInsert = () => {
    if (imageUrl.trim() && editor) {
      editor.chain().focus().setImage({ 
        src: imageUrl.trim(), 
        alt: 'Image' 
      }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
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
      className="universal-tiptap-editor relative"
      style={position ? {
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1000
      } : {}}
    >
      <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-3 focus:outline-none min-h-[60px]"
          placeholder={placeholder}
        />

        {/* Adaptive Toolbar */}
        <AdaptiveTipTapToolbar
          editor={editor}
          isVisible={showToolbar && !showLinkDialog && !showImageDialog}
          position={toolbarPosition}
          onLinkClick={() => setShowLinkDialog(true)}
        />

        {/* Link Dialog */}
        {showLinkDialog && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-80 animate-scale-in">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-gray-700">Add Link</div>
              <div className="flex gap-2">
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLinkAdd();
                    } else if (e.key === 'Escape') {
                      setShowLinkDialog(false);
                    }
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={handleLinkAdd} disabled={!linkUrl.trim()}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Image Dialog */}
        {showImageDialog && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-80 animate-scale-in">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-gray-700">Insert Image</div>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleImageInsert();
                    } else if (e.key === 'Escape') {
                      setShowImageDialog(false);
                    }
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={handleImageInsert} disabled={!imageUrl.trim()}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowImageDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
