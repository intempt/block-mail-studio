import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, MessageSquare, Send, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ConversationalSMSBuilderProps {
  initialMessages: any[];
  onBack: () => void;
}

export const ConversationalSMSBuilder: React.FC<ConversationalSMSBuilderProps> = ({
  initialMessages,
  onBack
}) => {
  const [smsContent, setSmsContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const maxCharacters = 160;

  const handleContentChange = (content: string) => {
    setSmsContent(content);
    setCharacterCount(content.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(smsContent);
    console.log("SMS content copied to clipboard");
  };

  const handleComplete = () => {
    setIsComplete(true);
    console.log("Your SMS message is ready to send");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Conversation
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SMS Builder</h2>
              <p className="text-sm text-gray-600">Create your text message</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleComplete} size="sm" className="bg-green-600 hover:bg-green-700">
              {isComplete ? <CheckCircle className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {isComplete ? 'Complete' : 'Finish'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Editor */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">SMS Content</h3>
            <div className="space-y-4">
              <div>
                <Textarea
                  value={smsContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Type your SMS message here..."
                  className="min-h-[200px] resize-none"
                  maxLength={maxCharacters}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">
                    Character count: {characterCount}/{maxCharacters}
                  </span>
                  <span className={`text-sm ${characterCount > maxCharacters ? 'text-red-600' : 'text-gray-600'}`}>
                    {characterCount > maxCharacters && 'Message too long!'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleContentChange(smsContent + ' 🎉')}>
                    Add Emoji
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleContentChange(smsContent + ' Reply STOP to opt out.')}>
                    Add Opt-out
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleContentChange('')}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="bg-white rounded-lg shadow-sm p-4 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    B
                  </div>
                  <span className="text-sm font-medium">Your Business</span>
                  <span className="text-xs text-gray-500 ml-auto">now</span>
                </div>
                <div className="bg-blue-500 text-white rounded-lg p-3 text-sm">
                  {smsContent || 'Your SMS message will appear here...'}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">SMS Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep it under 160 characters for single SMS</li>
                <li>• Include clear call-to-action</li>
                <li>• Add opt-out instructions for marketing</li>
                <li>• Use urgent but friendly tone</li>
                <li>• Avoid special characters that may not display</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
