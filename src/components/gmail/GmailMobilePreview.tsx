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
  const [showInboxList, setShowInboxList] = useState(false); // Start with email view
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

  if (showInboxList) {
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
      }
    ];

    return (
      <div className="h-full bg-white flex flex-col gmail-font-roboto">
        {/* Gmail Mobile Header */}
        <div className="px-4 py-3 flex-shrink-0" style={{ backgroundColor: 'var(--gmail-red)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GmailMenuIcon className="w-6 h-6 text-white cursor-pointer" />
              <span className="text-white gmail-text-title-large gmail-font-product-sans">
                Inbox
              </span>
            </div>
            <div className="flex items-center gap-3">
              <GmailSearchIcon className="w-6 h-6 text-white cursor-pointer" />
              <div 
                className="w-8 h-8 gmail-rounded-full flex items-center justify-center text-white gmail-text-label-large"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {recipient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-auto gmail-scrollbar">
          {mockEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => setShowInboxList(false)}
              className="flex items-start gap-3 p-4 border-b active:bg-gray-50 gmail-transition gmail-state-hover cursor-pointer"
              style={{ 
                borderColor: 'var(--gmail-gray-100)',
                minHeight: '84px',
                backgroundColor: email.unread ? 'var(--gmail-blue-light)' : 'var(--gmail-surface)'
              }}
            >
              <div 
                className="w-10 h-10 gmail-rounded-full flex items-center justify-center text-white gmail-text-label-large flex-shrink-0 mt-1"
                style={{ backgroundColor: getAvatarColor(sender.email) }}
              >
                {senderInitials}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="gmail-text-body-large truncate"
                    style={{
                      color: email.unread ? 'var(--gmail-text-primary)' : 'var(--gmail-text-secondary)',
                      fontWeight: email.unread ? '500' : '400'
                    }}
                  >
                    {email.sender}
                  </span>
                  <span className="gmail-text-label-medium flex-shrink-0 ml-2" style={{ color: 'var(--gmail-text-secondary)' }}>
                    {email.time}
                  </span>
                </div>
                
                <div 
                  className="gmail-text-body-large mb-1"
                  style={{
                    color: email.unread ? 'var(--gmail-text-primary)' : 'var(--gmail-text-secondary)',
                    fontWeight: email.unread ? '500' : '400'
                  }}
                >
                  {email.subject}
                </div>
                
                <div className="gmail-text-body-medium truncate" style={{ color: 'var(--gmail-text-secondary)' }}>
                  {email.preview}
                </div>
              </div>
              
              <Star className={`w-5 h-5 mt-1 ${email.unread ? 'text-yellow-400' : 'text-gray-300'}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Email Detail View - Default view focused on email content
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Email Header */}
      <div 
        className="px-4 py-3 flex items-center gap-3 flex-shrink-0" 
        style={{ backgroundColor: 'var(--gmail-red)' }}
      >
        <ArrowLeft 
          className="w-6 h-6 text-white cursor-pointer" 
          onClick={() => setShowInboxList(true)}
        />
        <div className="flex-1">
          <span className="text-white gmail-text-title-large gmail-font-product-sans">
            Gmail
          </span>
        </div>
        <MoreVertical className="w-6 h-6 text-white cursor-pointer" />
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto gmail-scrollbar">
        {/* Subject and Sender Info */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--gmail-gray-100)' }}>
          <h1 
            className="gmail-text-title-large mb-4 leading-tight gmail-font-roboto" 
            style={{ color: 'var(--gmail-text-primary)' }}
          >
            {subject}
          </h1>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 gmail-rounded-full flex items-center justify-center text-white gmail-text-label-large flex-shrink-0"
              style={{ backgroundColor: getAvatarColor(sender.email) }}
            >
              {sender.avatar ? (
                <img src={sender.avatar} alt={sender.name} className="w-full h-full gmail-rounded-full object-cover" />
              ) : (
                senderInitials
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span 
                  className="gmail-text-body-large truncate" 
                  style={{ color: 'var(--gmail-text-primary)', fontWeight: '500' }}
                >
                  {sender.name}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="gmail-text-body-medium" style={{ color: 'var(--gmail-text-secondary)' }}>
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                  <Star 
                    className={`w-6 h-6 cursor-pointer gmail-transition ${starred ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                    onClick={() => setStarred(!starred)}
                  />
                </div>
              </div>
              
              <div className="gmail-text-body-medium mb-1" style={{ color: 'var(--gmail-text-secondary)' }}>
                to {recipient.name}
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Body */}
        <div className="p-4 flex-1">
          <div 
            className="gmail-mobile-content gmail-font-roboto"
            style={{
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
      <div 
        className="bg-white border-t px-4 py-3 flex-shrink-0" 
        style={{ borderColor: 'var(--gmail-gray-100)' }}
      >
        <div className="flex items-center justify-center gap-8">
          <button className="flex flex-col items-center gap-1 p-2 min-w-0 gmail-transition gmail-state-hover">
            <GmailReplyIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
            <span className="gmail-text-label-medium" style={{ color: 'var(--gmail-text-secondary)' }}>Reply</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 min-w-0 gmail-transition gmail-state-hover">
            <GmailForwardIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
            <span className="gmail-text-label-medium" style={{ color: 'var(--gmail-text-secondary)' }}>Forward</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 min-w-0 gmail-transition gmail-state-hover">
            <GmailArchiveIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
            <span className="gmail-text-label-medium" style={{ color: 'var(--gmail-text-secondary)' }}>Archive</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 min-w-0 gmail-transition gmail-state-hover">
            <GmailDeleteIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
            <span className="gmail-text-label-medium" style={{ color: 'var(--gmail-text-secondary)' }}>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
