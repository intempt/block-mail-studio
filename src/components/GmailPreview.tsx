

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Printer,
  ExternalLink,
  Star,
  Reply,
  EllipsisVertical
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
  senderName = "Anthropic Team",
  senderEmail = "team@email.anthropic.com",
  timestamp = "10:02 AM (6 hours ago)"
}) => {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Email Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <h1 
            className="text-xl font-normal text-gray-900 flex-1 mr-4"
            style={{ textAlign: 'start', marginLeft: '50px' }}
          >
            {subject}
          </h1>
          <div className="flex items-center gap-0">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Printer className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ExternalLink className="w-4 h-4" />
            </Button>
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
              <a href="#" className="text-sm text-blue-600 hover:underline">Unsubscribe</a>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1" style={{ textAlign: 'start' }}>
              to me
              <span 
                className="inline-block" 
                style={{ height: '23px' }}
                dangerouslySetInnerHTML={{ __html: '&#128899;' }} 
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500" style={{ alignSelf: 'flex-start' }}>
            <span>{timestamp}</span>
            <Button variant="ghost" size="sm" className="text-gray-400 w-9">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 w-9">
              <Reply className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 w-9">
              <EllipsisVertical className="w-4 h-4" />
            </Button>
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

