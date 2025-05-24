
import React from 'react';
import { Card } from '@/components/ui/card';

interface EmailPreviewProps {
  html: string;
  previewMode: 'desktop' | 'mobile';
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ html, previewMode }) => {
  return (
    <div className="h-full p-8 overflow-y-auto bg-gray-100">
      <Card className={`mx-auto transition-all duration-300 ${
        previewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
      }`}>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="bg-gray-800 text-white p-2 text-xs font-mono">
            HTML Output - {previewMode === 'desktop' ? 'Desktop' : 'Mobile'} Preview
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border overflow-x-auto">
              <code>{html}</code>
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};
