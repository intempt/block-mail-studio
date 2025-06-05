import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, ArrowLeft } from 'lucide-react';
import { GmailDesktopPreview } from './gmail/GmailDesktopPreview';
import { GmailMobilePreview } from './gmail/GmailMobilePreview';
import { GmailResponsiveFrame } from './gmail/GmailDeviceFrames';
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

interface IntegratedGmailPreviewProps {
  emailHtml: string;
  subject: string;
  previewMode: 'desktop' | 'mobile';
  sender?: SenderInfo;
  recipient?: RecipientInfo;
  onPreviewModeChange?: (mode: 'desktop' | 'mobile') => void;
  fullWidth?: boolean;
}

export const IntegratedGmailPreview: React.FC<IntegratedGmailPreviewProps> = ({
  emailHtml,
  subject,
  previewMode,
  sender,
  recipient,
  onPreviewModeChange,
  fullWidth = false
}) => {
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(true);

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
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--gmail-gray-50)' }}>
        <div className="text-center">
          <div 
            className="animate-spin gmail-rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
            style={{ borderColor: 'var(--gmail-blue)' }}
          ></div>
          <h3 className="gmail-text-title-medium mb-2 gmail-font-google-sans">Preparing Gmail Preview</h3>
          <p className="gmail-text-body-medium" style={{ color: 'var(--gmail-text-secondary)' }}>
            Processing email for Gmail compatibility...
          </p>
        </div>
      </div>
    );
  }

  const containerClass = fullWidth 
    ? "h-full flex flex-col bg-white" 
    : "h-full flex flex-col bg-white border-l" + " " + "border-gray-200";

  return (
    <div className={containerClass}>
      {/* Preview Content - Optimized for canvas integration */}
      <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'var(--gmail-gray-100)' }}>
        <div className="h-full w-full flex items-center justify-center p-4">
          <div 
            style={{ 
              transform: previewMode === 'desktop' 
                ? (fullWidth ? 'scale(0.8)' : 'scale(0.7)') 
                : (fullWidth ? 'scale(1.2)' : 'scale(1)'), 
              transformOrigin: 'center center'
            }}
          >
            <GmailResponsiveFrame mode={previewMode} mobileDevice="iphone14pro">
              {previewMode === 'desktop' ? (
                <GmailDesktopPreview
                  emailHtml={processedHtml}
                  subject={subject}
                  sender={sender}
                  recipient={recipient}
                  onClose={() => {}} // No close needed in integrated mode
                />
              ) : (
                <GmailMobilePreview
                  emailHtml={processedHtml}
                  subject={subject}
                  sender={sender}
                  recipient={recipient}
                  onClose={() => {}} // No close needed in integrated mode
                />
              )}
            </GmailResponsiveFrame>
          </div>
        </div>
      </div>
    </div>
  );
};
