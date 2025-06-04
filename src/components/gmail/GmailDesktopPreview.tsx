
import React, { useState } from 'react';
import { 
  ArrowLeft, Archive, Trash2, MoreHorizontal, Reply, Forward, Star, 
  Search, Settings, Menu, ChevronDown, Clock, Tag, AlertCircle,
  Paperclip, Print, OpenInNew, MoreVertical, Plus, Inbox,
  Send, Edit3, RotateCcw, Shield
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
  
  // Gmail's avatar color algorithm simulation
  const getAvatarColor = (email: string) => {
    const colors = [
      '#1a73e8', '#ea4335', '#fbbc04', '#34a853', '#9aa0a6',
      '#ff6d01', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'
    ];
    const hash = email.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const labels = [
    { id: 'inbox', name: 'Inbox', count: 12, icon: Inbox },
    { id: 'starred', name: 'Starred', count: 3, icon: Star },
    { id: 'sent', name: 'Sent', count: null, icon: Send },
    { id: 'drafts', name: 'Drafts', count: 2, icon: Edit3 },
    { id: 'spam', name: 'Spam', count: null, icon: Shield },
    { id: 'trash', name: 'Trash', count: null, icon: Trash2 }
  ];

  return (
    <div className="w-full h-screen bg-white flex flex-col font-sans" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>
      {/* Gmail Header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Menu className="w-6 h-6 text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1" />
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-normal text-gray-700">Gmail</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search mail"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 hover:bg-white hover:shadow-md rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1" />
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-md transition-colors">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Compose</span>
            </button>
          </div>
          
          <div className="flex-1 px-2">
            {labels.map((label) => (
              <div
                key={label.id}
                onClick={() => setSelectedLabel(label.id)}
                className={`flex items-center justify-between px-4 py-2 rounded-r-full cursor-pointer transition-colors ${
                  selectedLabel === label.id 
                    ? 'bg-red-100 text-red-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <label.icon className="w-5 h-5" />
                  <span className="text-sm">{label.name}</span>
                </div>
                {label.count && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {label.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-4">
              <ArrowLeft 
                className="w-5 h-5 text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1" 
                onClick={onClose}
              />
              <Archive className="w-5 h-5 text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1" />
              <Trash2 className="w-5 h-5 text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1" />
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <Clock className="w-5 h-5 text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1" />
              <Tag className="w-5 h-5 text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">1 of 1</span>
              <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1" />
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="max-w-4xl mx-auto px-6 py-6">
              {/* Subject */}
              <h1 className="text-2xl font-normal text-gray-900 mb-6 leading-tight" style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>
                {subject}
              </h1>
              
              {/* Email Header */}
              <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-100">
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
                      <span className="font-medium text-gray-900 text-sm">{sender.name}</span>
                      <span className="text-xs text-gray-500">&lt;{sender.email}&gt;</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star 
                        className={`w-5 h-5 cursor-pointer ${starred ? 'text-yellow-400 fill-current' : 'text-gray-400 hover:text-yellow-400'}`}
                        onClick={() => setStarred(!starred)}
                      />
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                      <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    to {recipient.name} &lt;{recipient.email}&gt;
                  </div>
                </div>
              </div>
              
              {/* Email Body */}
              <div 
                className="prose max-w-none gmail-content"
                style={{
                  fontFamily: 'Roboto, Arial, sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#202124'
                }}
                dangerouslySetInnerHTML={{ __html: emailHtml }}
              />
              
              {/* Reply Box */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-2 rounded-full text-sm font-medium transition-colors">
                    <Forward className="w-4 h-4" />
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
