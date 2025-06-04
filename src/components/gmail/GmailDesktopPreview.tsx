
import React from 'react';

interface GmailDesktopPreviewProps {
  emailHtml: string;
  subject: string;
  onClose: () => void;
}

export const GmailDesktopPreview: React.FC<GmailDesktopPreviewProps> = ({
  emailHtml,
  subject,
  onClose
}) => {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Gmail Desktop Email Content */}
        <div className="p-6">
          {/* Subject Line */}
          <div className="mb-6">
            <h1 className="text-xl font-normal text-black mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {subject}
            </h1>
            
            {/* Sender Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                S
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Sender Name</div>
                <div className="text-sm text-gray-600">
                  to me • {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Email Body Content */}
          <div 
            className="gmail-email-content"
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '14px',
              lineHeight: '1.4',
              color: '#222'
            }}
            dangerouslySetInnerHTML={{ __html: emailHtml }}
          />
        </div>
      </div>
    </div>
  );
};
