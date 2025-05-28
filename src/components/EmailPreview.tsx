
import React from 'react';
import { Card } from '@/components/ui/card';

interface EmailPreviewProps {
  html: string;
  previewMode: 'desktop' | 'mobile';
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ html, previewMode }) => {
  return (
    <div className="h-full p-4 overflow-y-auto bg-gray-50">
      <div className={`mx-auto transition-all duration-300 ${
        previewMode === 'desktop' ? 'max-w-2xl' : 'max-w-sm'
      }`}>
        {/* Device Frame */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Email Client Header */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="ml-2 font-medium">Email Preview</span>
              <span className="ml-auto">{previewMode}</span>
            </div>
          </div>

          {/* Email Content Area */}
          <div className="bg-white">
            <div 
              className="email-content"
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                maxWidth: '100%',
                overflow: 'hidden',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
          </div>
        </div>

        {/* Device Info */}
        <div className="text-center mt-4 text-xs text-gray-500">
          Preview mode: {previewMode === 'desktop' ? 'Desktop Email Client' : 'Mobile Email App'}
        </div>
      </div>
    </div>
  );
};
