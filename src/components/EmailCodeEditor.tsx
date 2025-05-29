
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface EmailCodeEditorProps {
  html: string;
  onHtmlChange?: (html: string) => void;
}

export const EmailCodeEditor: React.FC<EmailCodeEditorProps> = ({ html, onHtmlChange }) => {
  return (
    <Card className="h-full p-4">
      <h3 className="font-semibold mb-4">HTML Code Editor</h3>
      <Textarea
        value={html}
        onChange={(e) => onHtmlChange?.(e.target.value)}
        className="font-mono text-sm min-h-96"
        placeholder="HTML content will appear here..."
      />
    </Card>
  );
};
