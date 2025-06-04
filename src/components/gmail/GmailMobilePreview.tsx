
import React from 'react';
import { ArrowLeft, MoreVertical, Reply, Forward, Archive } from 'lucide-react';

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
        className="bg-white h-full overflow-auto shadow-lg"
        style={{ 
          width: '375px',
          minHeight: '667px',
          maxHeight: '667px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}
      >
        {/* Gmail Mobile Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
              <span 
                className="text-lg font-medium"
                style={{ 
                  color: '#202124',
                  fontSize: '18px',
                  fontWeight: '500',
                  fontFamily: 'Roboto, Arial, sans-serif'
                }}
              >
                Gmail
              </span>
            </div>
            <MoreVertical className="w-6 h-6 text-gray-700" />
          </div>
        </div>

        {/* Gmail Mobile Email View */}
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
          <div className="px-4 py-4 flex-1">
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

          {/* Mobile Action Buttons - Fixed at bottom */}
          <div className="bg-white border-t border-gray-100 px-4 py-3">
            <div className="flex items-center justify-center gap-6">
              <button className="flex flex-col items-center gap-1 p-2">
                <Reply className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600">Reply</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2">
                <Forward className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600">Forward</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2">
                <Archive className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600">Archive</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
