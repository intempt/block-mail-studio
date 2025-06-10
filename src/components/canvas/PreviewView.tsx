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
  canvasWidth?: number;
}

export const PreviewView: React.FC<PreviewViewProps> = ({
  emailHtml,
  subject,
  viewMode,
  canvasWidth = 600
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
    PreviewVariable,
  ], []);

  // Create a read-only editor for preview
  const previewEditor = useEditor({
    extensions: previewExtensions,
    content: emailHtml,
    editable: false,
    immediatelyRender: false,
  });

  // Update editor content when emailHtml changes
  React.useEffect(() => {
    if (previewEditor && emailHtml !== previewEditor.getHTML()) {
      previewEditor.commands.setContent(emailHtml);
    }
  }, [emailHtml, previewEditor]);

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

  // Mobile preview with constrained width and mobile-optimized styling
  const mobileWidth = Math.min(375, canvasWidth);
  
  return (
    <div className="relative h-full bg-background">
      <div className="h-full w-full flex flex-col items-center justify-start p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Mobile Preview</h2>
          <p className="text-sm text-muted-foreground">Optimized for {mobileWidth}px width</p>
        </div>
        
        <div 
          className="bg-card border rounded-lg shadow-sm overflow-auto"
          style={{ 
            width: `${mobileWidth}px`,
            maxWidth: '100%',
            minHeight: '600px',
            maxHeight: '80vh'
          }}
        >
          {/* Mobile email header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                Y
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{subject}</h3>
                <p className="text-xs text-gray-600 mt-1">Your Campaign</p>
                <p className="text-xs text-gray-500">noreply@yourcompany.com</p>
              </div>
            </div>
          </div>
          
          {/* Mobile email content - render table-based HTML directly */}
          <div className="overflow-auto">
            <div 
              className="email-content mobile-email-content"
              dangerouslySetInnerHTML={{ __html: emailHtml }}
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '1.5',
                maxWidth: 'none'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Enhanced mobile-specific styles for table layouts */}
      <style>{`
        .mobile-email-content table {
          width: 100% !important;
          max-width: 100% !important;
          border-collapse: collapse !important;
        }
        .mobile-email-content td {
          padding: 8px !important;
          word-break: break-word !important;
        }
        .mobile-email-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
        }
        .mobile-email-content h1,
        .mobile-email-content h2,
        .mobile-email-content h3 {
          font-size: 1.1em !important;
          line-height: 1.3 !important;
          margin: 0.5em 0 !important;
        }
        .mobile-email-content p {
          margin: 0.5em 0 !important;
        }
        /* Stack columns on mobile */
        @media (max-width: 480px) {
          .mobile-email-content table[role="presentation"] td {
            display: block !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
