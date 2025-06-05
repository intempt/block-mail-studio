
import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Star, Edit3 } from 'lucide-react';
import {
  GmailSearchIcon,
  GmailMenuIcon,
  GmailReplyIcon,
  GmailForwardIcon,
  GmailArchiveIcon,
  GmailDeleteIcon
} from './GmailIcons';

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

interface GmailMobilePreviewProps {
  emailHtml: string;
  subject: string;
  sender?: SenderInfo;
  recipient?: RecipientInfo;
  onClose: () => void;
}

export const GmailMobilePreview: React.FC<GmailMobilePreviewProps> = ({
  emailHtml,
  subject,
  sender = { name: 'Marketing Team', email: 'marketing@company.com', initials: 'MT' },
  recipient = { name: 'John Doe', email: 'john.doe@example.com' },
  onClose
}) => {
  const [showInboxList, setShowInboxList] = useState(true);
  const [starred, setStarred] = useState(false);
  
  const senderInitials = sender.initials || sender.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  // Gmail's exact avatar color algorithm
  const getAvatarColor = (email: string) => {
    const colors = [
      '#1a73e8', '#ea4335', '#fbbc04', '#34a853', '#9aa0a6',
      '#ff6d01', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'
    ];
    const hash = email.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const mockEmails = [
    {
      id: 1,
      sender: sender.name,
      subject: subject,
      preview: 'This email contains important information...',
      time: 'now',
      unread: true
    },
    {
      id: 2,
      sender: 'Team Updates',
      subject: 'Weekly Newsletter',
      preview: 'Check out this week\'s highlights and updates...',
      time: '2h',
      unread: false
    },
    {
      id: 3,
      sender: 'Support Team',
      subject: 'Account Verification',
      preview: 'Please verify your account to continue...',
      time: '5h',
      unread: true
    }
  ];

  return (
    <div className="w-full h-full bg-white flex items-center justify-center p-4">
      {/* iPhone 13 Pro Frame */}
      <div 
        className="bg-black shadow-2xl relative overflow-hidden"
        style={{ 
          width: '390px',
          height: '844px',
          borderRadius: '47px',
          padding: '2px'
        }}
      >
        {/* Screen */}
        <div 
          className="w-full h-full bg-white overflow-hidden relative"
          style={{ borderRadius: '45px' }}
        >
          {/* Dynamic Island */}
          <div 
            className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black z-50"
            style={{
              width: '126px',
              height: '37px',
              borderRadius: '19px'
            }}
          />

          {/* Status Bar */}
          <div className="flex items-center justify-between px-8 pt-3 pb-1 text-black relative z-10" style={{ 
            fontSize: '17px',
            fontWeight: '600',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            <span>9:41</span>
            <div className="flex items-center gap-1">
              {/* Signal, WiFi, Battery icons */}
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <svg className="w-4 h-3 ml-1" viewBox="0 0 24 18" fill="black">
                <path d="M1 9l11-9h11v18H12L1 9z"/>
              </svg>
              <div className="w-6 h-3 border border-black rounded-sm relative ml-1">
                <div className="w-4 h-1.5 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
              </div>
            </div>
          </div>

          {showInboxList ? (
            /* Inbox List View */
            <div className="h-full bg-white flex flex-col" style={{ paddingTop: '8px' }}>
              {/* Gmail Mobile Header */}
              <div className="px-4 py-3" style={{ backgroundColor: 'var(--gmail-red)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GmailMenuIcon className="w-6 h-6 text-white cursor-pointer" />
                    <span className="text-white text-xl font-medium" style={{ 
                      fontFamily: '"Product Sans", "Google Sans", sans-serif' 
                    }}>
                      Inbox
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GmailSearchIcon className="w-6 h-6 text-white cursor-pointer" />
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      {recipient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email List */}
              <div className="flex-1 overflow-auto">
                {mockEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setShowInboxList(false)}
                    className={`flex items-start gap-3 p-4 border-b active:bg-gray-50 ${
                      email.unread ? 'bg-blue-50' : 'bg-white'
                    }`}
                    style={{ 
                      borderColor: 'var(--gmail-gray-100)',
                      minHeight: '84px',
                      cursor: 'pointer'
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 mt-1"
                      style={{ backgroundColor: getAvatarColor(sender.email) }}
                    >
                      {senderInitials}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm truncate ${email.unread ? 'font-semibold' : 'font-normal'}`} style={{
                          color: email.unread ? 'var(--gmail-text-primary)' : 'var(--gmail-text-secondary)',
                          fontSize: '16px'
                        }}>
                          {email.sender}
                        </span>
                        <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--gmail-text-secondary)' }}>
                          {email.time}
                        </span>
                      </div>
                      
                      <div className={`text-sm mb-1 ${email.unread ? 'font-medium' : 'font-normal'}`} style={{
                        color: email.unread ? 'var(--gmail-text-primary)' : 'var(--gmail-text-secondary)',
                        fontSize: '16px'
                      }}>
                        {email.subject}
                      </div>
                      
                      <div className="text-sm truncate" style={{ 
                        color: 'var(--gmail-text-secondary)',
                        fontSize: '14px'
                      }}>
                        {email.preview}
                      </div>
                    </div>
                    
                    <Star className={`w-5 h-5 mt-1 ${email.unread ? 'text-yellow-400' : 'text-gray-300'}`} />
                  </div>
                ))}
              </div>

              {/* Floating Compose Button */}
              <div className="absolute bottom-6 right-6">
                <button 
                  className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center gmail-transition hover:shadow-xl"
                  style={{ backgroundColor: 'var(--gmail-red)' }}
                >
                  <Edit3 className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          ) : (
            /* Email Detail View */
            <div className="h-full bg-white flex flex-col" style={{ paddingTop: '8px' }}>
              {/* Email Header */}
              <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--gmail-red)' }}>
                <ArrowLeft 
                  className="w-6 h-6 text-white cursor-pointer" 
                  onClick={() => setShowInboxList(true)}
                />
                <div className="flex-1">
                  <span className="text-white text-lg font-medium" style={{ 
                    fontFamily: '"Product Sans", "Google Sans", sans-serif' 
                  }}>
                    Gmail
                  </span>
                </div>
                <MoreVertical className="w-6 h-6 text-white cursor-pointer" />
              </div>

              {/* Email Content */}
              <div className="flex-1 overflow-auto">
                {/* Subject and Sender Info */}
                <div className="p-4 border-b" style={{ borderColor: 'var(--gmail-gray-100)' }}>
                  <h1 className="text-xl font-medium mb-4 leading-tight" style={{ 
                    color: 'var(--gmail-text-primary)',
                    fontFamily: '"Roboto", sans-serif'
                  }}>
                    {subject}
                  </h1>
                  
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                      style={{ backgroundColor: getAvatarColor(sender.email) }}
                    >
                      {sender.avatar ? (
                        <img src={sender.avatar} alt={sender.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        senderInitials
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-base truncate" style={{ color: 'var(--gmail-text-primary)' }}>
                          {sender.name}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm" style={{ color: 'var(--gmail-text-secondary)' }}>
                            {new Date().toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                          <Star 
                            className={`w-6 h-6 cursor-pointer ${starred ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                            onClick={() => setStarred(!starred)}
                          />
                        </div>
                      </div>
                      
                      <div className="text-sm mb-1" style={{ color: 'var(--gmail-text-secondary)' }}>
                        to {recipient.name}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Email Body */}
                <div className="p-4">
                  <div 
                    className="gmail-mobile-content"
                    style={{
                      fontFamily: '"Roboto", Arial, sans-serif',
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: 'var(--gmail-text-primary)',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{ __html: emailHtml }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white border-t px-4 py-3" style={{ 
                borderColor: 'var(--gmail-gray-100)',
                paddingBottom: 'env(safe-area-inset-bottom, 16px)'
              }}>
                <div className="flex items-center justify-center gap-8">
                  <button className="flex flex-col items-center gap-1 p-2 min-w-0 gmail-transition">
                    <GmailReplyIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--gmail-text-secondary)' }}>Reply</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 min-w-0 gmail-transition">
                    <GmailForwardIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--gmail-text-secondary)' }}>Forward</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 min-w-0 gmail-transition">
                    <GmailArchiveIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--gmail-text-secondary)' }}>Archive</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 min-w-0 gmail-transition">
                    <GmailDeleteIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--gmail-text-secondary)' }}>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
