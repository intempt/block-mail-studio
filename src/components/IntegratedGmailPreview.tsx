
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone } from 'lucide-react';
import { GmailDesktopPreview } from './gmail/GmailDesktopPreview';
import { GmailMobilePreview } from './gmail/GmailMobilePreview';
import { EmailCompatibilityProcessor } from '@/services/emailCompatibilityProcessor';

interface IntegratedGmailPreviewProps {
  emailHtml: string;
  subject: string;
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'mobile') => void;
  fullWidth?: boolean;
}

export const IntegratedGmailPreview: React.FC<IntegratedGmailPreviewProps> = ({
  emailHtml,
  subject,
  previewMode,
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Processing Gmail preview...</p>
        </div>
      </div>
    );
  }

  const containerClass = fullWidth 
    ? "h-full flex flex-col bg-white" 
    : "h-full flex flex-col bg-white border-l border-gray-200";

  return (
    <div className={containerClass}>
      {/* Preview Mode Header - Hide when fullWidth since mode is controlled elsewhere */}
      {!fullWidth && onPreviewModeChange && (
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Gmail Preview</Badge>
          </div>
          <div className="flex items-center bg-white rounded-lg p-1 border">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPreviewModeChange('desktop')}
              className="flex items-center gap-1 h-7 px-2 text-xs"
            >
              <Monitor className="w-3 h-3" />
              Desktop
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPreviewModeChange('mobile')}
              className="flex items-center gap-1 h-7 px-2 text-xs"
            >
              <Smartphone className="w-3 h-3" />
              Mobile
            </Button>
          </div>
        </div>
      )}

      {/* Preview Content */}
      <div className="flex-1 overflow-auto">
        {previewMode === 'desktop' ? (
          <div 
            className="h-full w-full flex items-center justify-center"
            style={{ 
              transform: fullWidth ? 'scale(0.9)' : 'scale(0.75)', 
              transformOrigin: 'top center'
            }}
          >
            <GmailDesktopPreview
              emailHtml={processedHtml}
              subject={subject}
              onClose={() => {}} // No close needed in integrated mode
            />
          </div>
        ) : (
          <div className="flex justify-center p-4">
            <div style={{ 
              transform: fullWidth ? 'scale(1)' : 'scale(0.9)', 
              transformOrigin: 'top center' 
            }}>
              <GmailMobilePreview
                emailHtml={processedHtml}
                subject={subject}
                onClose={() => {}} // No close needed in integrated mode
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
