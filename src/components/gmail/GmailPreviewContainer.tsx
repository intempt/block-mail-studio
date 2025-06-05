
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Monitor, Smartphone, User, Mail } from 'lucide-react';
import { GmailDesktopPreview } from './GmailDesktopPreview';
import { GmailMobilePreview } from './GmailMobilePreview';
import { GmailResponsiveFrame } from './GmailDeviceFrames';
import { EmailCompatibilityProcessor } from '@/services/emailCompatibilityProcessor';

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

interface GmailPreviewContainerProps {
  emailHtml: string;
  subject: string;
  sender?: SenderInfo;
  recipient?: RecipientInfo;
  initialMode?: 'desktop' | 'mobile';
  onClose: () => void;
}

// Generate realistic sender/recipient data if not provided
const generateRealisticData = (emailHtml: string, subject: string) => {
  const defaultSenders = [
    { name: 'Marketing Team', email: 'marketing@company.com', initials: 'MT' },
    { name: 'Sarah Wilson', email: 'sarah.wilson@business.com', initials: 'SW' },
    { name: 'Customer Success', email: 'success@startup.io', initials: 'CS' },
    { name: 'Newsletter', email: 'newsletter@brand.com', initials: 'NL' },
    { name: 'Alex Chen', email: 'alex@techcorp.com', initials: 'AC' }
  ];
  
  const defaultRecipients = [
    { name: 'John Doe', email: 'john.doe@gmail.com' },
    { name: 'Maria Garcia', email: 'maria.garcia@outlook.com' },
    { name: 'David Smith', email: 'david.smith@yahoo.com' },
    { name: 'Lisa Johnson', email: 'lisa.j@company.com' },
    { name: 'Mike Brown', email: 'mike.brown@email.com' }
  ];
  
  // Simple hash to consistently pick same data for same content
  const contentHash = (emailHtml + subject).length % 5;
  
  return {
    sender: defaultSenders[contentHash],
    recipient: defaultRecipients[contentHash]
  };
};

export const GmailPreviewContainer: React.FC<GmailPreviewContainerProps> = ({
  emailHtml,
  subject,
  sender,
  recipient,
  initialMode = 'desktop',
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(initialMode);
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(true);
  
  // Generate realistic data if not provided
  const realisticData = generateRealisticData(emailHtml, subject);
  const finalSender = sender || realisticData.sender;
  const finalRecipient = recipient || realisticData.recipient;

  useEffect(() => {
    const processEmail = async () => {
      setIsProcessing(true);
      try {
        const processed = EmailCompatibilityProcessor.processEmailForGmail(emailHtml, {
          stripUnsupportedElements: true,
          inlineStyles: true,
          processImages: true,
          darkModeSupport: true
        });
        setProcessedHtml(processed);
      } catch (error) {
        console.error('Error processing email for Gmail:', error);
        setProcessedHtml(emailHtml);
      } finally {
        setIsProcessing(false);
      }
    };

    processEmail();
  }, [emailHtml]);

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white gmail-rounded-lg p-8 max-w-md mx-4 gmail-elevation-3">
          <div className="text-center">
            <div 
              className="animate-spin gmail-rounded-full h-8 w-8 border-b-2 mx-auto mb-4" 
              style={{ borderColor: 'var(--gmail-red)' }}
            ></div>
            <h3 
              className="gmail-text-title-medium mb-2 gmail-font-google-sans" 
              style={{ color: 'var(--gmail-text-primary)' }}
            >
              Preparing Gmail Preview
            </h3>
            <p className="gmail-text-body-medium mb-4" style={{ color: 'var(--gmail-text-secondary)' }}>
              Processing email for pixel-perfect Gmail rendering...
            </p>
            <div className="gmail-text-label-medium" style={{ color: 'var(--gmail-text-secondary)' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <span>From: {finalSender.name}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>To: {finalRecipient.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50" style={{ backgroundColor: 'var(--gmail-gray-100)' }}>
      {/* Enhanced Preview Mode Selector */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div 
          className="bg-white gmail-rounded-lg gmail-elevation-2 border p-2 flex items-center gap-2" 
          style={{ borderColor: 'var(--gmail-gray-200)' }}
        >
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('desktop')}
            className="flex items-center gap-2 gmail-transition"
            style={{
              backgroundColor: viewMode === 'desktop' ? 'var(--gmail-blue)' : 'transparent',
              color: viewMode === 'desktop' ? 'white' : 'var(--gmail-text-primary)'
            }}
          >
            <Monitor className="w-4 h-4" />
            Desktop Gmail
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="flex items-center gap-2 gmail-transition"
            style={{
              backgroundColor: viewMode === 'mobile' ? 'var(--gmail-blue)' : 'transparent',
              color: viewMode === 'mobile' ? 'white' : 'var(--gmail-text-primary)'
            }}
          >
            <Smartphone className="w-4 h-4" />
            Mobile Gmail
          </Button>
          <div className="h-6 w-px mx-2" style={{ backgroundColor: 'var(--gmail-gray-300)' }} />
          <div className="flex items-center gap-2 gmail-text-label-medium" style={{ color: 'var(--gmail-text-secondary)' }}>
            <User className="w-3 h-3" />
            <span>{finalSender.name}</span>
            <span>→</span>
            <span>{finalRecipient.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-2 gmail-transition">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content with Enhanced Frames */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <GmailResponsiveFrame mode={viewMode} mobileDevice="iphone14pro">
          {viewMode === 'desktop' ? (
            <GmailDesktopPreview
              emailHtml={processedHtml}
              subject={subject}
              sender={finalSender}
              recipient={finalRecipient}
              onClose={onClose}
            />
          ) : (
            <GmailMobilePreview
              emailHtml={processedHtml}
              subject={subject}
              sender={finalSender}
              recipient={finalRecipient}
              onClose={onClose}
            />
          )}
        </GmailResponsiveFrame>
      </div>
    </div>
  );
};
