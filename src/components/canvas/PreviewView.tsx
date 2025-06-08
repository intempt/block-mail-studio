
import React from 'react';
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
  
  if (isDesktop) {
    // Use Gmail interface for desktop preview
    return (
      <div className="relative h-full bg-gray-100">
        <div className="h-full w-full flex flex-col">
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-900">Desktop Preview - Gmail Interface</h2>
          </div>
          
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

  // Mobile preview - simple view
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
          
          <div 
            className="email-content text-sm"
            dangerouslySetInnerHTML={{ __html: emailHtml }}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: '1.5'
            }}
          />
        </div>
      </div>
    </div>
  );
};
