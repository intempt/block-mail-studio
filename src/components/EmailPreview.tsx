
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

interface EmailPreviewProps {
  html: string;
  previewMode: 'desktop' | 'mobile';
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ html, previewMode }) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const previewWidth = previewMode === 'desktop' ? 700 : 375;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Simple Preview Controls */}
      <div className="flex items-center justify-center p-4 bg-white border-b border-gray-200">
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

      {/* Preview Info */}
      <div className="bg-white border-t border-gray-200 p-3 text-center">
        <div className="text-xs text-gray-500">
          Preview at {previewMode} width ({previewWidth}px)
        </div>
      </div>
    </div>
  );
};
