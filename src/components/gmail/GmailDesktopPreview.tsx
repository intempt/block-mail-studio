
import React, { useState } from 'react';
import { 
  ArrowLeft, Settings, RefreshCw,
  ChevronDown, Clock, Tag, Paperclip
} from 'lucide-react';
import {
  GmailLogoIcon,
  GmailSearchIcon,
  GmailMenuIcon,
  GmailComposeIcon,
  GmailInboxIcon,
  GmailStarIcon,
  GmailArchiveIcon,
  GmailDeleteIcon,
  GmailReplyIcon,
  GmailForwardIcon,
  GmailMoreIcon
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

interface GmailDesktopPreviewProps {
  emailHtml: string;
  subject: string;
  sender?: SenderInfo;
  recipient?: RecipientInfo;
  onClose: () => void;
}

export const GmailDesktopPreview: React.FC<GmailDesktopPreviewProps> = ({
  emailHtml,
  subject,
  sender = { name: 'Marketing Team', email: 'marketing@company.com', initials: 'MT' },
  recipient = { name: 'John Doe', email: 'john.doe@example.com' },
  onClose
}) => {
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

  return (
    <div 
      className="w-full h-full bg-white flex flex-col gmail-font-google-sans gmail-scrollbar" 
      style={{ color: 'var(--gmail-text-primary)' }}
    >
      {/* Simplified Gmail Header */}
      <header 
        className="flex items-center px-4 py-2 border-b gmail-state-hover" 
        style={{ 
          height: '48px',
          borderColor: 'var(--gmail-gray-200)',
          backgroundColor: 'var(--gmail-surface)'
        }}
      >
        <div className="flex items-center">
          <GmailLogoIcon className="w-6 h-6" />
          <span 
            className="ml-2 gmail-font-product-sans gmail-text-body-large" 
            style={{ color: 'var(--gmail-text-secondary)' }}
          >
            Gmail
          </span>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1">
          <button onClick={onClose} className="p-2 gmail-rounded-full gmail-transition gmail-state-hover">
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
          </button>
        </div>
      </header>

      {/* Email Content - Focused View */}
      <div className="flex-1 overflow-auto bg-white gmail-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Subject */}
          <h1 
            className="gmail-text-headline-medium mb-6 leading-tight gmail-font-google-sans" 
            style={{ color: 'var(--gmail-text-primary)' }}
          >
            {subject}
          </h1>
          
          {/* Email Header */}
          <div className="flex items-start gap-4 mb-6 pb-4 border-b" style={{ borderColor: 'var(--gmail-gray-100)' }}>
            <div 
              className="w-10 h-10 gmail-rounded-full flex items-center justify-center text-white gmail-text-label-large flex-shrink-0"
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
                <div className="flex items-center gap-2">
                  <span className="gmail-text-body-medium" style={{ color: 'var(--gmail-text-primary)', fontWeight: '500' }}>
                    {sender.name}
                  </span>
                  <span className="gmail-text-label-medium" style={{ color: 'var(--gmail-text-secondary)' }}>
                    &lt;{sender.email}&gt;
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <GmailStarIcon 
                    className="w-5 h-5 cursor-pointer gmail-transition"
                    filled={starred}
                    onClick={() => setStarred(!starred)}
                  />
                  <span className="gmail-text-label-medium" style={{ color: 'var(--gmail-text-secondary)' }}>
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
              
              <div className="gmail-text-label-medium mb-2" style={{ color: 'var(--gmail-text-secondary)' }}>
                to {recipient.name} &lt;{recipient.email}&gt;
              </div>
            </div>
          </div>
          
          {/* Email Body with Gmail-specific styling */}
          <div 
            className="gmail-content gmail-font-roboto"
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              color: 'var(--gmail-text-primary)'
            }}
            dangerouslySetInnerHTML={{ __html: emailHtml }}
          />
          
          {/* Reply Actions */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--gmail-gray-100)' }}>
            <div className="flex gap-3">
              <button 
                className="flex items-center gap-3 px-6 py-3 gmail-rounded-full gmail-transition gmail-text-label-large gmail-state-hover"
                style={{
                  backgroundColor: 'var(--gmail-blue)',
                  color: 'var(--gmail-text-white)'
                }}
              >
                <GmailReplyIcon className="w-4 h-4" />
                Reply
              </button>
              <button 
                className="flex items-center gap-3 px-6 py-3 gmail-rounded-full gmail-transition gmail-text-label-large border gmail-state-hover"
                style={{
                  borderColor: 'var(--gmail-gray-300)',
                  color: 'var(--gmail-text-primary)'
                }}
              >
                <GmailForwardIcon className="w-4 h-4" />
                Forward
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
