
import React from 'react';
import { ArrowLeft, Archive, Trash2, MoreHorizontal, Reply, Forward, Star } from 'lucide-react';

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
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white h-full overflow-auto shadow-sm">
        {/* Gmail Desktop Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <div className="text-sm text-gray-600">Inbox</div>
            </div>
            <div className="flex items-center gap-3">
              <Archive className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <Trash2 className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <MoreHorizontal className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            </div>
          </div>
        </div>

        {/* Gmail Desktop Email Container */}
        <div className="bg-white min-h-full">
          {/* Email Actions Toolbar */}
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                <Reply className="w-4 h-4" />
                Reply
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                <Forward className="w-4 h-4" />
                Forward
              </button>
              <Star className="w-5 h-5 text-gray-400 cursor-pointer hover:text-yellow-400 ml-2" />
            </div>
          </div>

          {/* Subject Line - Gmail Desktop Style */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h1 
              className="text-2xl font-normal text-gray-900 mb-4 leading-tight"
              style={{ 
                fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                color: '#202124',
                fontSize: '28px',
                fontWeight: '400',
                lineHeight: '32px'
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

          {/* Bottom Actions */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                <Reply className="w-4 h-4" />
                Reply
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                <Forward className="w-4 h-4" />
                Forward
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
