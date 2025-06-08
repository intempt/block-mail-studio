
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

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

interface EmailPreviewProps {
  html: string;
  previewMode: 'desktop' | 'mobile';
  subject?: string;
  sender?: SenderInfo;
  recipient?: RecipientInfo;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ 
  html, 
  previewMode,
  subject = 'Email Preview',
  sender,
  recipient
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const previewWidth = previewMode === 'desktop' ? 700 : 375;

  return (
    <div className="h-full flex flex-col bg-brand-secondary">
      {/* Enhanced Preview Controls */}
      <div className="flex items-center justify-between u-p-4 bg-brand-bg border-b border-brand">
        <div className="flex items-center u-gap-2 text-caption text-brand-fg">
          <div className="flex items-center u-gap-1">
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
      </div>

      {/* Clean Preview Area */}
      <div className="flex-1 overflow-auto u-p-8 flex items-start justify-center">
        <div 
          className="bg-brand-bg border border-brand shadow-sm rounded-lg overflow-hidden transition-all duration-300"
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
      <div className="bg-brand-bg border-t border-brand u-p-3">
        <div className="flex items-center justify-between">
          <div className="text-caption text-brand-fg">
            Preview at {previewMode} width ({previewWidth}px)
          </div>
          <div className="text-caption text-muted-foreground">
            Clean email preview without external interface
          </div>
        </div>
      </div>
    </div>
  );
};
