
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Monitor, Smartphone, RotateCcw } from 'lucide-react';
import { GmailDesktopPreview } from './GmailDesktopPreview';
import { GmailMobilePreview } from './GmailMobilePreview';
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
        <div className="bg-white rounded-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Preparing Gmail Preview</h3>
            <p className="text-gray-600 text-sm">Processing email for Gmail compatibility...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Preview Mode Selector */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('desktop')}
            className="flex items-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </Button>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <Badge variant="outline" className="text-xs">
            Gmail Preview
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      {viewMode === 'desktop' ? (
        <GmailDesktopPreview
          emailHtml={processedHtml}
          subject={subject}
          sender={sender}
          recipient={recipient}
          onClose={onClose}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <GmailMobilePreview
            emailHtml={processedHtml}
            subject={subject}
            sender={sender}
            recipient={recipient}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  );
};
