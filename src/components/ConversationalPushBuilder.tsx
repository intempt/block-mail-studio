
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, Send, Copy, CheckCircle, Image } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

interface ConversationalPushBuilderProps {
  initialMessages: any[];
  onBack: () => void;
}

export const ConversationalPushBuilder: React.FC<ConversationalPushBuilderProps> = ({
  initialMessages,
  onBack
}) => {
  const [pushData, setPushData] = useState({
    title: '',
    body: '',
    icon: '',
    image: '',
    actionUrl: '',
    actionText: 'Open',
    badge: ''
  });
  const [isComplete, setIsComplete] = useState(false);
  const { success, info } = useNotification();

  const handleFieldChange = (field: string, value: string) => {
    setPushData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopy = () => {
    const pushJson = JSON.stringify(pushData, null, 2);
    navigator.clipboard.writeText(pushJson);
    success('Push notification data copied to clipboard');
  };

  const handleComplete = () => {
    setIsComplete(true);
    success('Your push notification is ready to send');
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
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Push Notification Builder</h2>
              <p className="text-sm text-gray-600">Create your push notification</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON
            </Button>
            <Button onClick={handleComplete} size="sm" className="bg-purple-600 hover:bg-purple-700">
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
            <h3 className="text-lg font-semibold mb-4">Push Notification Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={pushData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Notification title..."
                  maxLength={50}
                />
                <span className="text-xs text-gray-500">{pushData.title.length}/50 characters</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <Textarea
                  value={pushData.body}
                  onChange={(e) => handleFieldChange('body', e.target.value)}
                  placeholder="Notification body text..."
                  className="min-h-[80px]"
                  maxLength={150}
                />
                <span className="text-xs text-gray-500">{pushData.body.length}/150 characters</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Text</label>
                <Input
                  value={pushData.actionText}
                  onChange={(e) => handleFieldChange('actionText', e.target.value)}
                  placeholder="Button text..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action URL</label>
                <Input
                  value={pushData.actionUrl}
                  onChange={(e) => handleFieldChange('actionUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Large Image URL (Optional)</label>
                <Input
                  value={pushData.image}
                  onChange={(e) => handleFieldChange('image', e.target.value)}
                  placeholder="https://image-url.com/image.jpg"
                />
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            
            {/* Mobile Preview */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium mb-2">Mobile Preview</h4>
              <div className="bg-white rounded-lg shadow-sm p-3 border">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                    <Bell className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Your App</span>
                      <span className="text-xs text-gray-500">now</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      {pushData.title || 'Notification title'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {pushData.body || 'Notification body text will appear here...'}
                    </div>
                    {pushData.image && (
                      <div className="mt-2 w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {pushData.actionText && (
                      <Button size="sm" className="mt-2 h-6 px-3 text-xs bg-blue-600 hover:bg-blue-700">
                        {pushData.actionText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Preview */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Desktop Preview</h4>
              <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {pushData.title || 'Notification title'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {pushData.body || 'Notification body text will appear here...'}
                    </div>
                    {pushData.image && (
                      <div className="mt-3 w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Push Notification Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep title under 50 characters</li>
                <li>• Body text should be under 150 characters</li>
                <li>• Use clear, action-oriented language</li>
                <li>• Test on both mobile and desktop</li>
                <li>• Ensure images are web-accessible</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
