
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Settings,
  HelpCircle,
  Grid3X3,
  Menu,
  Archive,
  Delete,
  MailOpen,
  Star,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  Inbox,
  Send,
  FileText,
  Bookmark,
  Mail,
  Shield,
  Trash
} from 'lucide-react';
import { MockGmailData } from '@/services/mockGmailData';

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
  const mockThread = MockGmailData.generateMockThread(subject);
  const gmailLabels = MockGmailData.getGmailLabels();

  const getLabelIcon = (iconName: string) => {
    const iconMap = {
      inbox: Inbox,
      star: Star,
      bookmark: Bookmark,
      send: Send,
      'file-text': FileText,
      mail: Mail,
      shield: Shield,
      trash: Trash
    };
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Mail;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Gmail Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose} className="p-2">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="text-xl font-normal text-red-500">Gmail</div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search mail"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Grid3X3 className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Gmail Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
              Compose
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="px-2 space-y-1">
              {gmailLabels.map((label) => (
                <div
                  key={label.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-r-full cursor-pointer hover:bg-gray-100 ${
                    label.id === 'inbox' ? 'bg-red-100 text-red-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getLabelIcon(label.icon)}
                    <span className="text-sm">{label.name}</span>
                  </div>
                  {label.count > 0 && (
                    <span className="text-xs text-gray-500">{label.count}</span>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Gmail Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Email List */}
          <div className="w-96 bg-white border-r border-gray-200">
            <div className="h-12 border-b border-gray-200 flex items-center px-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <Button variant="ghost" size="sm">
                  <Archive className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Delete className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MailOpen className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="divide-y divide-gray-100">
                {mockThread.emails.map((email, index) => (
                  <div
                    key={email.id}
                    className={`p-4 cursor-pointer hover:shadow-sm ${
                      index === 0 ? 'bg-white border-r-4 border-r-blue-500' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 rounded" />
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                        {email.sender.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm ${email.isRead ? 'text-gray-600' : 'text-black font-medium'}`}>
                            {email.sender.name}
                          </span>
                          {email.sender.isVerified && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className={`text-sm mb-1 ${email.isRead ? 'text-gray-600' : 'text-black font-medium'}`}>
                          {email.subject}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {email.timestamp.toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-1">
                            {email.isStarred && (
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            )}
                            {email.hasAttachment && (
                              <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Email Content */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Archive className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Delete className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MailOpen className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Reply className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ReplyAll className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Forward className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="max-w-3xl mx-auto p-6">
                <div className="mb-6">
                  <h1 className="text-xl font-normal text-black mb-2">{subject}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {mockThread.emails[0].sender.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{mockThread.emails[0].sender.name}</span>
                        {mockThread.emails[0].sender.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        to me
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      {mockThread.emails[0].timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div 
                  className="gmail-email-content"
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    color: '#222'
                  }}
                  dangerouslySetInnerHTML={{ __html: emailHtml }}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};
