
import React from 'react';
import { Card } from '@/components/ui/card';

interface EmailPreviewProps {
  html: string;
  subject: string;
  viewport: 'desktop' | 'tablet' | 'mobile';
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ html, subject, viewport }) => {
  const getViewportStyles = () => {
    switch (viewport) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' };
      default:
        return { maxWidth: '100%' };
    }
  };

  return (
    <Card className="h-full p-4">
      <div className="mb-4">
        <h3 className="font-semibold">Email Preview</h3>
        <p className="text-sm text-gray-600">Subject: {subject || 'No subject'}</p>
      </div>
      <div 
        className="border rounded p-4 bg-white overflow-auto"
        style={getViewportStyles()}
      >
        <div dangerouslySetInnerHTML={{ __html: html || '<p>No content to preview</p>' }} />
      </div>
    </Card>
  );
};
