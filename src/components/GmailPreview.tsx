
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Archive, 
  Trash2, 
  MoreHorizontal, 
  Star, 
  ArrowLeft,
  Printer,
  ExternalLink
} from 'lucide-react';

interface GmailPreviewProps {
  emailHtml: string;
  subject: string;
  senderName?: string;
  senderEmail?: string;
  timestamp?: string;
}

export const GmailPreview: React.FC<GmailPreviewProps> = ({
  emailHtml,
  subject,
  senderName = "Email Builder",
  senderEmail = "builder@example.com",
  timestamp = "10:20 (5 hours ago)"
}) => {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Gmail Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Archive className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Email Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-xl font-normal text-gray-900 flex-1 mr-4">
            {subject}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Star className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-500">{timestamp}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-500 text-white text-sm">
              {senderName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{senderName}</span>
              <span className="text-sm text-gray-500">&lt;{senderEmail}&gt;</span>
            </div>
            <div className="text-sm text-gray-500">
              to me
            </div>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          <div 
            className="gmail-email-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: emailHtml }}
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              lineHeight: '1.4',
              color: '#222'
            }}
          />
        </div>
      </div>
    </div>
  );
};
