
import React, { useState } from 'react';
import { 
  ArrowLeft, MoreVertical, Reply, Forward, Archive, Search, 
  Menu, Star, Trash2, Clock, Tag, RefreshCw, Edit3
} from 'lucide-react';

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
  
  // Gmail's avatar color algorithm simulation
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
      <div 
        className="bg-white h-full overflow-hidden shadow-2xl relative"
        style={{ 
          width: '375px',
          height: '812px', // iPhone X/11/12 height
          borderRadius: '40px',
          border: '8px solid #1c1c1e'
        }}
      >
        {/* iPhone Status Bar */}
        <div className="bg-white px-6 py-2 flex items-center justify-between text-xs font-medium">
          <span className="text-black">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-6 h-3 border border-black rounded-sm relative">
              <div className="w-4 h-1.5 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
            </div>
          </div>
        </div>

        {showInboxList ? (
          /* Inbox List View */
          <div className="h-full bg-white">
            {/* Gmail Mobile Header */}
            <div className="bg-red-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Menu className="w-6 h-6 text-white cursor-pointer" />
                  <span className="text-white text-xl font-medium">Inbox</span>
                </div>
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-white cursor-pointer" />
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
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
                  className={`flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 ${
                    email.unread ? 'bg-blue-50' : 'bg-white'
                  }`}
                  style={{ minHeight: '80px' }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 mt-1"
                    style={{ backgroundColor: getAvatarColor(sender.email) }}
                  >
                    {senderInitials}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm truncate ${email.unread ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'}`}>
                        {email.sender}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {email.time}
                      </span>
                    </div>
                    
                    <div className={`text-sm mb-1 ${email.unread ? 'font-medium text-gray-900' : 'font-normal text-gray-700'}`}>
                      {email.subject}
                    </div>
                    
                    <div className="text-sm text-gray-600 truncate">
                      {email.preview}
                    </div>
                  </div>
                  
                  <Star className={`w-5 h-5 mt-1 ${email.unread ? 'text-yellow-400' : 'text-gray-300'}`} />
                </div>
              ))}
            </div>

            {/* Floating Compose Button */}
            <div className="absolute bottom-6 right-6">
              <button className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        ) : (
          /* Email Detail View */
          <div className="h-full bg-white flex flex-col">
            {/* Email Header */}
            <div className="bg-red-600 px-4 py-3 flex items-center gap-3">
              <ArrowLeft 
                className="w-6 h-6 text-white cursor-pointer" 
                onClick={() => setShowInboxList(true)}
              />
              <div className="flex-1">
                <span className="text-white text-lg font-medium">Gmail</span>
              </div>
              <MoreVertical className="w-6 h-6 text-white cursor-pointer" />
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-auto">
              {/* Subject and Sender Info */}
              <div className="p-4 border-b border-gray-100">
                <h1 className="text-xl font-medium text-gray-900 mb-4 leading-tight">
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
                      <span className="font-medium text-gray-900 text-base truncate">
                        {sender.name}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-gray-500">
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
                    
                    <div className="text-sm text-gray-600 mb-1">
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

            {/* Action Buttons */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 safe-area-bottom">
              <div className="flex items-center justify-center gap-8">
                <button className="flex flex-col items-center gap-1 p-2 min-w-0">
                  <Reply className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-gray-600 font-medium">Reply</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 min-w-0">
                  <Forward className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-gray-600 font-medium">Forward</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 min-w-0">
                  <Archive className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-gray-600 font-medium">Archive</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 min-w-0">
                  <Trash2 className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-gray-600 font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
