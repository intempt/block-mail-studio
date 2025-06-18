import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  User, 
  Plus,
  Edit,
  MessageCircle,
  ChevronDown,
  Lightbulb,
  Upload,
  Square
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface CompactAIChatProps {
  onMessage?: (message: string) => void;
}

export const CompactAIChat: React.FC<CompactAIChatProps> = ({ onMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I can help you create professional emails. What would you like to build?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    onMessage?.(inputMessage);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I'll help you with "${inputMessage}". Let me create that for you.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white border-0 shadow-none">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="text-sm">{message.content}</div>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Working...</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Dark Input Area - Redesigned */}
      <div className="bg-gray-800 p-4 rounded-b-lg">
        <div className="space-y-3">
          {/* Main input row with lightbulb and textarea */}
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700 flex-shrink-0 mt-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
            </div>
            
            <div className="flex-1">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Intempt..."
                onKeyPress={handleKeyPress}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 min-h-[40px] resize-none"
                disabled={isLoading}
                rows={1}
              />
            </div>
            
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 h-10 flex-shrink-0 mt-1"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </div>
          
          {/* Bottom row with upload/stop icons */}
          <div className="flex items-center gap-2 pl-11">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              disabled={isLoading}
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <Upload className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              disabled={!isLoading}
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <Square className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
