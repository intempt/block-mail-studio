
import React from 'react';
import { IntegratedGmailPreview } from '../IntegratedGmailPreview';

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
  const gmailPreviewMode = viewMode === 'desktop-preview' ? 'desktop' : 'mobile';
  
  return (
    <div className="relative h-full">
      <IntegratedGmailPreview
        emailHtml={emailHtml}
        subject={subject}
        previewMode={gmailPreviewMode}
        fullWidth={true}
      />
    </div>
  );
};
