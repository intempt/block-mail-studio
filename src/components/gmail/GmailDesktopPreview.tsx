
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
    <div 
      className="w-full h-screen bg-white flex flex-col gmail-font-google-sans gmail-scrollbar" 
      style={{ color: 'var(--gmail-text-primary)' }}
    >
      {/* Gmail Header - Pixel Perfect 56px */}
      <header 
        className="flex items-center px-6 border-b gmail-state-hover" 
        style={{ 
          height: 'var(--gmail-header-height)',
          borderColor: 'var(--gmail-gray-200)',
          backgroundColor: 'var(--gmail-surface)'
        }}
      >
        {/* Left Section */}
        <div className="flex items-center">
          <button className="p-3 gmail-rounded-full gmail-transition gmail-state-hover mr-1">
            <GmailMenuIcon className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
          </button>
          
          <div className="flex items-center ml-2">
            <GmailLogoIcon className="w-8 h-8" />
            <span 
              className="ml-2 gmail-font-product-sans gmail-text-title-large" 
              style={{ color: 'var(--gmail-text-secondary)' }}
            >
              Gmail
            </span>
          </div>
        </div>
        
        {/* Search Bar - Exact Gmail styling with 40px height */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div 
              className="flex items-center gmail-rounded-3xl gmail-transition gmail-state-hover gmail-elevation-1"
              style={{
                backgroundColor: 'var(--gmail-gray-100)',
                height: 'var(--gmail-search-bar-height)'
              }}
            >
              <button className="p-3 gmail-rounded-l-3xl">
                <GmailSearchIcon className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <input
                type="text"
                placeholder="Search mail"
                className="flex-1 py-3 pr-4 bg-transparent border-none outline-none gmail-font-roboto gmail-text-body-medium"
                style={{ fontSize: '16px' }}
              />
              <button className="p-3 gmail-rounded-r-3xl">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gmail-text-secondary)' }}>
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-1">
          <button className="p-3 gmail-rounded-full gmail-transition gmail-state-hover">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gmail-text-secondary)' }}>
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>
          
          <button className="p-3 gmail-rounded-full gmail-transition gmail-state-hover">
            <Settings className="w-6 h-6" style={{ color: 'var(--gmail-text-secondary)' }} />
          </button>
          
          <div className="ml-2">
            <div 
              className="w-8 h-8 gmail-rounded-full flex items-center justify-center text-white gmail-text-label-large cursor-pointer gmail-transition gmail-state-hover"
              style={{ backgroundColor: 'var(--gmail-blue)' }}
            >
              {recipient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Exact 256px width */}
        <nav 
          className="bg-white border-r flex flex-col" 
          style={{ 
            width: 'var(--gmail-sidebar-width)',
            borderColor: 'var(--gmail-gray-200)' 
          }}
        >
          {/* Compose Button */}
          <div className="p-4">
            <button 
              className="flex items-center gap-4 px-6 py-3 gmail-rounded-2xl gmail-transition gmail-elevation-1 gmail-state-hover"
              style={{
                backgroundColor: 'var(--gmail-blue)',
                color: 'var(--gmail-text-white)',
                fontWeight: '500'
              }}
            >
              <GmailComposeIcon className="w-5 h-5" />
              <span className="gmail-text-label-large">Compose</span>
            </button>
          </div>
          
          {/* Navigation Labels */}
          <div className="flex-1 px-2">
            {sidebarLabels.map((label) => (
              <div
                key={label.id}
                onClick={() => setSelectedLabel(label.id)}
                className={`flex items-center justify-between px-4 py-2 mx-2 gmail-rounded-r-full cursor-pointer gmail-transition gmail-state-hover ${
                  selectedLabel === label.id 
                    ? 'text-red-700 gmail-text-label-large' 
                    : 'gmail-text-body-medium gmail-state-hover'
                }`}
                style={{
                  backgroundColor: selectedLabel === label.id ? 'var(--gmail-red-light)' : 'transparent',
                  color: selectedLabel === label.id ? 'var(--gmail-red)' : 'var(--gmail-text-secondary)'
                }}
              >
                <div className="flex items-center gap-4">
                  <label.icon className="w-5 h-5" />
                  <span>{label.name}</span>
                </div>
                {label.count && (
                  <span 
                    className="gmail-text-label-medium px-2 py-0.5 gmail-rounded-full"
                    style={{
                      backgroundColor: 'var(--gmail-gray-200)',
                      color: 'var(--gmail-text-secondary)'
                    }}
                  >
                    {label.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Toolbar - Exact 48px height */}
          <div 
            className="flex items-center justify-between px-6 py-2 border-b" 
            style={{ 
              borderColor: 'var(--gmail-gray-100)',
              height: 'var(--gmail-toolbar-height)'
            }}
          >
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-2 gmail-rounded-full gmail-transition gmail-state-hover">
                <ArrowLeft className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <button className="p-2 gmail-rounded-full gmail-transition gmail-state-hover">
                <GmailArchiveIcon className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <button className="p-2 gmail-rounded-full gmail-transition gmail-state-hover">
                <GmailDeleteIcon className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button className="p-2 gmail-rounded-full gmail-transition gmail-state-hover">
                <Clock className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
              <button className="p-2 gmail-rounded-full gmail-transition gmail-state-hover">
                <Tag className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="gmail-text-body-medium" style={{ color: 'var(--gmail-text-secondary)' }}>1 of 1</span>
              <button className="p-2 gmail-rounded-full gmail-transition gmail-state-hover">
                <GmailMoreIcon className="w-5 h-5" style={{ color: 'var(--gmail-text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Email Content - Max width 960px */}
          <div className="flex-1 overflow-auto bg-white gmail-scrollbar">
            <div 
              className="mx-auto px-6 py-6" 
              style={{ maxWidth: 'var(--gmail-content-max-width)' }}
            >
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
                      <button className="p-1 gmail-rounded gmail-transition gmail-state-hover">
                        <GmailMoreIcon className="w-4 h-4" style={{ color: 'var(--gmail-text-secondary)' }} />
                      </button>
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
      </div>
    </div>
  );
};
