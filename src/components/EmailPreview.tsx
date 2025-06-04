
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Mail } from 'lucide-react';
import { GmailPreviewContainer } from './gmail/GmailPreviewContainer';

interface EmailPreviewProps {
  html: string;
  previewMode: 'desktop' | 'mobile';
  subject?: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ 
  html, 
  previewMode,
  subject = 'Email Preview'
}) => {
  const [showGmailPreview, setShowGmailPreview] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const previewWidth = previewMode === 'desktop' ? 700 : 375;

  const handleGmailPreview = () => {
    setShowGmailPreview(true);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Enhanced Preview Controls */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {previewMode === 'desktop' ? (
                <Monitor className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
              <span>
                {previewMode === 'desktop' ? 'Desktop Email' : 'Mobile Email'} ({previewWidth}px)
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGmailPreview}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Gmail Preview
            </Button>
          </div>
        </div>

        {/* Clean Preview Area */}
        <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
          <div 
            className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden transition-all duration-300"
            style={{ width: previewWidth, maxWidth: '100%' }}
          >
            <div 
              className="email-content overflow-auto"
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.6'
              }}
            />
          </div>
        </div>

        {/* Enhanced Preview Info */}
        <div className="bg-white border-t border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Preview at {previewMode} width ({previewWidth}px)
            </div>
            <div className="text-xs text-gray-400">
              Click "Gmail Preview" for realistic email client rendering
            </div>
          </div>
        </div>
      </div>

      {/* Gmail Preview Modal */}
      {showGmailPreview && (
        <GmailPreviewContainer
          emailHtml={html}
          subject={subject}
          initialMode={previewMode}
          onClose={() => setShowGmailPreview(false)}
        />
      )}
    </>
  );
};
