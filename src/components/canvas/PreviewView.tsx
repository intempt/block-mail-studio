
import React from 'react';

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
  const previewTitle = viewMode === 'desktop-preview' ? 'Desktop Preview' : 'Mobile Preview';
  const previewWidth = viewMode === 'desktop-preview' ? '600px' : '375px';

  return (
    <div className="relative h-full bg-background">
      <div className="h-full w-full flex flex-col items-center justify-center p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">{previewTitle}</h2>
        </div>
        
        <div 
          className="bg-card border rounded-lg p-6 shadow-sm overflow-auto"
          style={{ 
            width: previewWidth,
            maxWidth: '100%',
            minHeight: '600px',
            maxHeight: '80vh'
          }}
        >
          <div 
            className="email-content"
            dangerouslySetInnerHTML={{ __html: emailHtml }}
          />
        </div>
      </div>
    </div>
  );
};
