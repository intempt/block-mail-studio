
import React from 'react';
import { GmailDesktopPreview } from '../gmail/GmailDesktopPreview';
import { GmailMobilePreview } from '../gmail/GmailMobilePreview';

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

  return (
    <div className="relative h-full">
      {viewMode === 'desktop-preview' ? (
        <GmailDesktopPreview
          emailHtml={emailHtml}
          subject={subject}
          sender={defaultSender}
          recipient={defaultRecipient}
          onClose={() => {}} // No close action needed in preview mode
        />
      ) : (
        <GmailMobilePreview
          emailHtml={emailHtml}
          subject={subject}
          sender={defaultSender}
          recipient={defaultRecipient}
          onClose={() => {}} // No close action needed in preview mode
        />
      )}
    </div>
  );
};
