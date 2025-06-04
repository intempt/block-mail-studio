
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
    <div className="w-full h-full bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white h-full overflow-auto">
        {/* Gmail Desktop Email View - Accurate Recreation */}
        <div className="bg-white min-h-full">
          {/* Subject Line - Gmail Desktop Style */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h1 
              className="text-2xl font-normal text-gray-900 mb-3 leading-tight"
              style={{ 
                fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                color: '#202124',
                fontSize: '24px',
                fontWeight: '400',
                lineHeight: '28px'
              }}
            >
              {subject}
            </h1>
            
            {/* Sender Info - Gmail Desktop Layout */}
            <div className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-blue-500 flex-shrink-0"
                style={{ backgroundColor: '#1a73e8' }}
              >
                S
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="font-medium text-sm"
                    style={{ 
                      color: '#202124',
                      fontSize: '14px',
                      fontWeight: '500',
                      fontFamily: 'Roboto, Arial, sans-serif'
                    }}
                  >
                    Sender Name
                  </span>
                  <span 
                    className="text-xs"
                    style={{ 
                      color: '#5f6368',
                      fontSize: '12px',
                      fontFamily: 'Roboto, Arial, sans-serif'
                    }}
                  >
                    &lt;sender@example.com&gt;
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span 
                    style={{ 
                      color: '#5f6368',
                      fontSize: '12px',
                      fontFamily: 'Roboto, Arial, sans-serif'
                    }}
                  >
                    to me
                  </span>
                  <span 
                    style={{ 
                      color: '#5f6368',
                      fontSize: '12px',
                      fontFamily: 'Roboto, Arial, sans-serif'
                    }}
                  >
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Email Body Content - Gmail Desktop Styling */}
          <div className="px-6 py-6">
            <div 
              className="gmail-desktop-content max-w-none"
              style={{
                fontFamily: 'Roboto, Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                color: '#202124',
                wordWrap: 'break-word'
              }}
              dangerouslySetInnerHTML={{ __html: emailHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
