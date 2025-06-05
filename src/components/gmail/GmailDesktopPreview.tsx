
import React, { useState } from 'react';
import { 
  ArrowLeft, Settings, RefreshCw, Print, ExternalLink,
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
  const [selectedLabel, setSelectedLabel] = useState('inbox');
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

  const sidebarLabels = [
    { id: 'inbox', name: 'Inbox', count: 12, icon: GmailInboxIcon },
    { id: 'starred', name: 'Starred', count: 3, icon: GmailStarIcon },
    { id: 'sent', name: 'Sent', count: null, icon: ArrowLeft },
    { id: 'drafts', name: 'Drafts', count: 2, icon: RefreshCw },
    { id: 'more', name: 'More', count: null, icon: ChevronDown, expandable: true }
  ];

  return (
    <div className="w-full h-screen bg-white flex flex-col gmail-font-system" style={{ 
      fontFamily: '"Google Sans", "Helvetica Neue", Arial, sans-serif',
      color: 'var(--gmail-text-primary)'
    }}>
      {/* Gmail Header - Pixel Perfect */}
      <header className="flex items-center h-16 px-6 border-b" style={{ 
        borderColor: 'var(--gmail-gray-200)',
        backgroundColor: 'var(--gmail-surface)'
      }}>
        {/* Left Section */}
        <div className="flex items-center">
          <button className="p-3 rounded-full gmail-transition hover:bg-gray-100 mr-1">
            <GmailMenuIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
          </button>
          
          <div className="flex items-center ml-2">
            <GmailLogoIcon className="w-8 h-8" />
            <span className="ml-2 text-2xl font-normal" style={{ 
              color: 'var(--gmail-text-secondary)',
              fontFamily: '"Product Sans", "Google Sans", sans-serif'
            }}>
              Gmail
            </span>
          </div>
        </div>
        
        {/* Search Bar - Exact Gmail styling */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="flex items-center bg-gray-100 rounded-lg gmail-transition hover:bg-white hover:shadow-md focus-within:bg-white focus-within:shadow-md">
              <button className="p-3 rounded-l-lg">
                <GmailSearchIcon className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <input
                type="text"
                placeholder="Search mail"
                className="flex-1 py-3 pr-4 bg-transparent border-none outline-none text-base"
                style={{ 
                  fontFamily: '"Roboto", Arial, sans-serif',
                  fontSize: '16px'
                }}
              />
              <button className="p-3 rounded-r-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gmail-text-secondary)' }}>
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-1">
          <button className="p-3 rounded-full gmail-transition hover:bg-gray-100">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gmail-text-secondary)' }}>
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>
          
          <button className="p-3 rounded-full gmail-transition hover:bg-gray-100">
            <Settings className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
          </button>
          
          <div className="ml-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer"
              style={{ backgroundColor: 'var(--gmail-blue)' }}
            >
              {recipient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Pixel Perfect */}
        <nav className="w-64 bg-white border-r flex flex-col" style={{ borderColor: 'var(--gmail-gray-200)' }}>
          {/* Compose Button */}
          <div className="p-4">
            <button className="flex items-center gap-4 px-6 py-3 rounded-2xl gmail-transition gmail-shadow-1 hover:shadow-md" style={{
              backgroundColor: 'var(--gmail-blue)',
              color: 'white',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              <GmailComposeIcon className="w-5 h-5" />
              <span>Compose</span>
            </button>
          </div>
          
          {/* Navigation Labels */}
          <div className="flex-1 px-2">
            {sidebarLabels.map((label) => (
              <div
                key={label.id}
                onClick={() => setSelectedLabel(label.id)}
                className={`flex items-center justify-between px-4 py-2 mx-2 rounded-r-full cursor-pointer gmail-transition ${
                  selectedLabel === label.id 
                    ? 'bg-red-100 text-red-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  fontSize: '14px',
                  fontWeight: selectedLabel === label.id ? '500' : '400'
                }}
              >
                <div className="flex items-center gap-4">
                  <label.icon className="w-5 h-5" />
                  <span>{label.name}</span>
                </div>
                {label.count && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    backgroundColor: 'var(--gmail-gray-200)',
                    color: 'var(--gmail-text-secondary)'
                  }}>
                    {label.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-2 border-b" style={{ 
            borderColor: 'var(--gmail-gray-100)',
            minHeight: '48px'
          }}>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-2 rounded-full gmail-transition hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <button className="p-2 rounded-full gmail-transition hover:bg-gray-100">
                <GmailArchiveIcon className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <button className="p-2 rounded-full gmail-transition hover:bg-gray-100">
                <GmailDeleteIcon className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button className="p-2 rounded-full gmail-transition hover:bg-gray-100">
                <Clock className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <button className="p-2 rounded-full gmail-transition hover:bg-gray-100">
                <Tag className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: 'var(--gmail-text-secondary)' }}>1 of 1</span>
              <button className="p-2 rounded-full gmail-transition hover:bg-gray-100">
                <GmailMoreIcon className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="max-w-4xl mx-auto px-6 py-6">
              {/* Subject */}
              <h1 className="text-2xl font-normal mb-6 leading-tight" style={{ 
                color: 'var(--gmail-text-primary)',
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: '400'
              }}>
                {subject}
              </h1>
              
              {/* Email Header */}
              <div className="flex items-start gap-4 mb-6 pb-4 border-b" style={{ borderColor: 'var(--gmail-gray-100)' }}>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
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
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--gmail-text-primary)' }}>
                        {sender.name}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--gmail-text-secondary)' }}>
                        &lt;{sender.email}&gt;
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <GmailStarIcon 
                        className="w-5 h-5 cursor-pointer gmail-transition"
                        filled={starred}
                        onClick={() => setStarred(!starred)}
                      />
                      <span className="text-xs" style={{ color: 'var(--gmail-text-secondary)' }}>
                        {new Date().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                      <button className="p-1 rounded gmail-transition hover:bg-gray-100">
                        <GmailMoreIcon className="w-4 h-4" style={{ color: 'var(--gmail-text-secondary)' }} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs mb-2" style={{ color: 'var(--gmail-text-secondary)' }}>
                    to {recipient.name} &lt;{recipient.email}&gt;
                  </div>
                </div>
              </div>
              
              {/* Email Body with Gmail-specific styling */}
              <div 
                className="gmail-content"
                style={{
                  fontFamily: '"Roboto", Arial, sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: 'var(--gmail-text-primary)'
                }}
                dangerouslySetInnerHTML={{ __html: emailHtml }}
              />
              
              {/* Reply Actions */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--gmail-gray-100)' }}>
                <div className="flex gap-3">
                  <button className="flex items-center gap-3 px-6 py-3 rounded-full gmail-transition text-sm font-medium" style={{
                    backgroundColor: 'var(--gmail-blue)',
                    color: 'white'
                  }}>
                    <GmailReplyIcon className="w-4 h-4" />
                    Reply
                  </button>
                  <button className="flex items-center gap-3 px-6 py-3 rounded-full gmail-transition text-sm font-medium border" style={{
                    borderColor: 'var(--gmail-gray-300)',
                    color: 'var(--gmail-text-primary)'
                  }}>
                    <GmailForwardIcon className="w-4 h-4" />
                    Forward
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
