
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface EmailEditorProps {
  content: string;
  subject: string;
  onContentChange: (content: string) => void;
  onSubjectChange: (subject: string) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({
  content,
  subject,
  onContentChange,
  onSubjectChange
}) => {
  const [localContent, setLocalContent] = useState(content);
  const [localSubject, setLocalSubject] = useState(subject);

  console.log('EmailEditor rendering with:', { content, subject });

  const handleContentUpdate = useCallback((newContent: string) => {
    setLocalContent(newContent);
    onContentChange(newContent);
  }, [onContentChange]);

  const handleSubjectUpdate = useCallback((newSubject: string) => {
    setLocalSubject(newSubject);
    onSubjectChange(newSubject);
  }, [onSubjectChange]);

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="flex-1 p-6">
        <div className="space-y-6">
          {/* Subject Line Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Subject Line</label>
            <Input
              value={localSubject}
              onChange={(e) => handleSubjectUpdate(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full"
            />
          </div>

          <Separator />

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Content</label>
            <Textarea
              value={localContent}
              onChange={(e) => handleContentUpdate(e.target.value)}
              placeholder="Start typing your email content..."
              className="w-full min-h-96 resize-none"
            />
          </div>

          <Separator />

          {/* Editor Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={() => handleContentUpdate('Welcome to our newsletter!\n\nThis is a sample email content.')}
              variant="outline"
              size="sm"
            >
              Insert Sample Content
            </Button>
            
            <Button 
              onClick={() => {
                handleContentUpdate('');
                handleSubjectUpdate('');
              }}
              variant="outline"
              size="sm"
            >
              Clear All
            </Button>
          </div>

          {/* Preview Stats */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Content Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Subject length:</span> {localSubject.length} characters
              </div>
              <div>
                <span className="font-medium">Content length:</span> {localContent.length} characters
              </div>
              <div>
                <span className="font-medium">Word count:</span> {localContent.split(/\s+/).filter(word => word.length > 0).length} words
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className="text-green-600 ml-1">Ready to edit</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailEditor;
