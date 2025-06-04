
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
    <div className="w-full h-full bg-white flex items-center justify-center p-4">
      <div 
        className="bg-white h-full overflow-auto"
        style={{ 
          width: '375px',
          minHeight: '667px',
          maxHeight: '667px'
        }}
      >
        {/* Gmail Mobile Email View - Accurate Recreation */}
        <div className="bg-white h-full">
          {/* Subject Line - Gmail Mobile Style */}
          <div className="px-4 py-4 border-b border-gray-100">
            <h1 
              className="font-medium text-gray-900 mb-3 leading-tight"
              style={{ 
                fontFamily: 'Roboto, Arial, sans-serif',
                color: '#202124',
                fontSize: '20px',
                fontWeight: '500',
                lineHeight: '24px'
              }}
            >
              {subject}
            </h1>
            
            {/* Sender Info - Gmail Mobile Layout */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-blue-500 flex-shrink-0"
                style={{ backgroundColor: '#1a73e8' }}
              >
                S
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="font-medium text-sm truncate"
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
                    className="text-xs flex-shrink-0 ml-2"
                    style={{ 
                      color: '#5f6368',
                      fontSize: '12px',
                      fontFamily: 'Roboto, Arial, sans-serif'
                    }}
                  >
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div 
                  className="text-xs"
                  style={{ 
                    color: '#5f6368',
                    fontSize: '12px',
                    fontFamily: 'Roboto, Arial, sans-serif'
                  }}
                >
                  to me
                </div>
              </div>
            </div>
          </div>
          
          {/* Email Body Content - Gmail Mobile Styling */}
          <div className="px-4 py-4">
            <div 
              className="gmail-mobile-content"
              style={{
                fontFamily: 'Roboto, Arial, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#202124',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
              dangerouslySetInnerHTML={{ __html: emailHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
