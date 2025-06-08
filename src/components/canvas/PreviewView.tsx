
import React from 'react';
import { IntegratedGmailPreview } from '../IntegratedGmailPreview';

interface SenderInfo {
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
}

interface RecipientInfo {
  name: string;
  email: string;
}

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
  // Default sender and recipient data for preview
  const defaultSender: SenderInfo = {
    name: 'Glovo Prime',
    email: 'prime@glovo.com',
    initials: 'GP'
  };

  const defaultRecipient: RecipientInfo = {
    name: 'You',
    email: 'user@example.com'
  };

  const gmailPreviewMode = viewMode === 'desktop-preview' ? 'desktop' : 'mobile';

  return (
    <div className="relative h-full">
      <IntegratedGmailPreview
        emailHtml={emailHtml}
        subject={subject}
        previewMode={gmailPreviewMode}
        sender={defaultSender}
        recipient={defaultRecipient}
        fullWidth={true}
      />
    </div>
  );
};
