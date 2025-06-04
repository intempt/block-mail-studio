
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, ArrowLeft } from 'lucide-react';
import { GmailDesktopPreview } from './gmail/GmailDesktopPreview';
import { GmailMobilePreview } from './gmail/GmailMobilePreview';
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
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium mb-2">Preparing Gmail Preview</h3>
          <p className="text-gray-600 text-sm">Processing email for Gmail compatibility...</p>
        </div>
      </div>
    );
  }

  const containerClass = fullWidth 
    ? "h-full flex flex-col bg-white" 
    : "h-full flex flex-col bg-white border-l border-gray-200";

  return (
    <div className={containerClass}>
      {/* Preview Content - Optimized for canvas integration */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        {previewMode === 'desktop' ? (
          <div className="h-full w-full flex items-center justify-center p-4">
            <div 
              className="w-full max-w-7xl h-full rounded-lg overflow-hidden shadow-lg"
              style={{ 
                transform: fullWidth ? 'scale(0.8)' : 'scale(0.7)', 
                transformOrigin: 'center center',
                minHeight: '600px'
              }}
            >
              <GmailDesktopPreview
                emailHtml={processedHtml}
                subject={subject}
                sender={sender}
                recipient={recipient}
                onClose={() => {}} // No close needed in integrated mode
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div style={{ 
              transform: fullWidth ? 'scale(1.2)' : 'scale(1)', 
              transformOrigin: 'center center' 
            }}>
              <GmailMobilePreview
                emailHtml={processedHtml}
                subject={subject}
                sender={sender}
                recipient={recipient}
                onClose={() => {}} // No close needed in integrated mode
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
