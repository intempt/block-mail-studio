
import React from 'react';

interface GmailMobilePreviewProps {
  emailHtml: string;
  subject: string;
  onClose: () => void;
}

export const GmailMobilePreview: React.FC<GmailMobilePreviewProps> = ({
  emailHtml,
  subject,
  onClose
}) => {
  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm overflow-hidden" style={{ minHeight: '600px' }}>
        {/* Gmail Mobile Email Content */}
        <div className="p-4">
          {/* Subject Line */}
          <div className="mb-4">
            <h1 className="text-lg font-medium text-black mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {subject}
            </h1>
            
            {/* Sender Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-medium">
                S
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Sender Name</div>
                <div className="text-xs text-gray-600">
                  to me • {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Email Body Content */}
          <div 
            className="gmail-mobile-content"
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '16px',
              lineHeight: '1.5',
              color: '#222'
            }}
            dangerouslySetInnerHTML={{ __html: emailHtml }}
          />
        </div>
      </div>
    </div>
  );
};
