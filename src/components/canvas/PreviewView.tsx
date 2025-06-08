
import React from 'react';
import { GmailDesktopPreview } from '../gmail/GmailDesktopPreview';
import { GmailMobilePreview } from '../gmail/GmailMobilePreview';
import { GmailResponsiveFrame } from '../gmail/GmailDeviceFrames';

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
    name: 'Marketing Team',
    email: 'marketing@company.com',
    initials: 'MT'
  };

  const defaultRecipient: RecipientInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  const gmailPreviewMode = viewMode === 'desktop-preview' ? 'desktop' : 'mobile';

  return (
    <div className="relative h-full" style={{ backgroundColor: 'var(--gmail-gray-100)' }}>
      <div className="h-full w-full flex items-center justify-center p-4">
        <GmailResponsiveFrame mode={gmailPreviewMode} mobileDevice="iphone14pro">
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
        </GmailResponsiveFrame>
      </div>
    </div>
  );
};
