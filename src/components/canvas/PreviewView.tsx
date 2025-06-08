
import React, { useMemo } from 'react';
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
import { PreviewVariable } from '@/extensions/PreviewVariableExtension';
import { GmailPreview } from '../GmailPreview';

interface PreviewViewProps {
  emailHtml: string;
  subject: string;
  viewMode: 'desktop-preview' | 'mobile-preview';
}

export const PreviewView: React.FC<PreviewViewProps> = ({
  emailHtml,
  subject,
  viewMode
}) => {
  const isDesktop = viewMode === 'desktop-preview';
  
  // Create extensions for preview mode (without editing capabilities)
  const previewExtensions = useMemo(() => [
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
    PreviewVariable, // Use preview-specific variable extension
  ], []);

  // Create a read-only editor for preview
  const previewEditor = useEditor({
    extensions: previewExtensions,
    content: emailHtml,
    editable: false,
    immediatelyRender: false,
  });

  if (isDesktop) {
    // Use Gmail interface for desktop preview
    return (
      <div className="relative h-full bg-gray-100">
        <div className="h-full w-full flex flex-col">
          <div className="flex-1 bg-gray-100 p-4">
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <GmailPreview
                emailHtml={emailHtml}
                subject={subject}
                senderName="Your Campaign"
                senderEmail="noreply@yourcompany.com"
                timestamp="just now"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile preview with preview editor
  return (
    <div className="relative h-full bg-background">
      <div className="h-full w-full flex flex-col items-center justify-center p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Mobile Preview</h2>
        </div>
        
        <div 
          className="bg-card border rounded-lg p-6 shadow-sm overflow-auto"
          style={{ 
            width: '375px',
            maxWidth: '100%',
            minHeight: '600px',
            maxHeight: '80vh'
          }}
        >
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{subject}</h3>
            <p className="text-sm text-gray-600 mt-1">Your Campaign &lt;noreply@yourcompany.com&gt;</p>
          </div>
          
          {previewEditor ? (
            <EditorContent 
              editor={previewEditor}
              className="prose prose-sm max-w-none"
            />
          ) : (
            <div 
              className="email-content text-sm"
              dangerouslySetInnerHTML={{ __html: emailHtml }}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.5'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
