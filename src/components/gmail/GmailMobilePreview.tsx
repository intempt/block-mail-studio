
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Archive,
  Delete,
  Reply,
  Star,
  Menu,
  Edit
} from 'lucide-react';
import { MockGmailData } from '@/services/mockGmailData';

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
  const [showEmailList, setShowEmailList] = useState(true);
  const mockThread = MockGmailData.generateMockThread(subject);
  const currentEmail = mockThread.emails[0];

  const handleEmailOpen = () => {
    setShowEmailList(false);
  };

  const handleBackToList = () => {
    setShowEmailList(true);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-sm mx-auto">
      {showEmailList ? (
        <>
          {/* Mobile Gmail Header - Inbox View */}
          <div className="h-14 bg-red-500 text-white flex items-center px-4">
            <Button variant="ghost" onClick={onClose} className="text-white p-2 -ml-2">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-lg font-medium">Inbox</span>
            </div>
            <Button variant="ghost" className="text-white p-2 -mr-2">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Email List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-100">
              {mockThread.emails.map((email, index) => (
                <div
                  key={email.id}
                  className={`p-4 cursor-pointer active:bg-gray-50 ${
                    index === 0 ? 'border-l-4 border-l-red-500' : ''
                  }`}
                  onClick={handleEmailOpen}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {email.sender.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm truncate ${email.isRead ? 'text-gray-700' : 'text-black font-medium'}`}>
                          {email.sender.name}
                        </span>
                        <div className="flex items-center gap-1 ml-2">
                          <span className="text-xs text-gray-500">
                            {email.timestamp.toLocaleDateString()}
                          </span>
                          {email.isStarred && (
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          )}
                        </div>
                      </div>
                      <div className={`text-sm mb-1 truncate ${email.isRead ? 'text-gray-600' : 'text-black font-medium'}`}>
                        {email.subject}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {index === 0 ? 'Preview of your email content...' : 'Email preview text...'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Mobile FAB */}
          <div className="absolute bottom-6 right-6">
            <Button className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg">
              <Edit className="w-6 h-6" />
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Mobile Gmail Header - Email View */}
          <div className="h-14 bg-red-500 text-white flex items-center px-4">
            <Button variant="ghost" onClick={handleBackToList} className="text-white p-2 -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-sm truncate">{subject}</span>
            </div>
            <Button variant="ghost" className="text-white p-2 -mr-2">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Email Actions */}
          <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-around">
            <Button variant="ghost" size="sm" className="flex-1">
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Delete className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Reply className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Email Content */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="mb-4">
                <h1 className="text-lg font-medium text-black mb-2">{subject}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-medium">
                    {currentEmail.sender.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{currentEmail.sender.name}</span>
                      {currentEmail.sender.isVerified && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      to me • {currentEmail.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
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
          </ScrollArea>

          {/* Mobile Reply FAB */}
          <div className="absolute bottom-6 right-6">
            <Button className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg">
              <Reply className="w-6 h-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
