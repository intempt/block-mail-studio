
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Mail, Star, Archive, Trash2 } from 'lucide-react';

interface EmailPreviewProps {
  emailHTML: string;
  subjectLine: string;
  isOpen: boolean;
  onClose: () => void;
  deviceMode?: 'desktop' | 'mobile';
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  emailHTML,
  subjectLine,
  isOpen,
  onClose,
  deviceMode = 'desktop'
}) => {
  if (!isOpen) return null;

  const isMobile = deviceMode === 'mobile';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className={`bg-white shadow-2xl ${isMobile ? 'w-full max-w-sm h-full max-h-[600px]' : 'w-full max-w-4xl h-full max-h-[90vh]'} flex flex-col`}>
        {/* Email Client Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Email Preview</h2>
            <Badge variant="outline" className="text-xs">
              {isMobile ? 'Mobile' : 'Desktop'} View
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Email Client Toolbar */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-gray-25">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Archive className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Star className="w-4 h-4" />
          </Button>
        </div>

        {/* Email Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">From:</span>
                  <span>your-company@example.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="font-medium">To:</span>
                  <span>recipient@example.com</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="pt-2">
              <h1 className="text-lg font-semibold text-gray-900">
                {subjectLine || 'Email Subject Line'}
              </h1>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-auto bg-white">
          <div className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <div 
              className={`email-content ${isMobile ? 'max-w-full' : 'max-w-2xl'} mx-auto`}
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                lineHeight: '1.6',
                color: '#333333'
              }}
              dangerouslySetInnerHTML={{ 
                __html: emailHTML || '<p style="color: #666; font-style: italic;">No content to preview. Start building your email to see the preview.</p>' 
              }}
            />
          </div>
        </div>

        {/* Email Client Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            This is a preview of how your email will appear to recipients
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EmailPreview;
