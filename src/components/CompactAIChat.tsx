
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Square,
  Upload,
  MessageCircle,
  Zap,
  X,
  Paperclip
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

type ChatMode = 'chat' | 'agentic';

export const CompactAIChat: React.FC<CompactAIChatProps> = ({ onMessage }) => {
  const [mode, setMode] = useState<ChatMode>('chat');
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    'Create newsletter',
    'Add CTA button',
    'Optimize layout'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFiles([]);
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

  const stopGeneration = () => {
    setIsLoading(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <Card className="h-full flex flex-col bg-white">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
        </div>

        {/* Compact Mode Toggle */}
        <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-md">
          <Button
            variant={mode === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('chat')}
            className="flex-1 h-6 text-xs px-2"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chat
          </Button>
          <Button
            variant={mode === 'agentic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('agentic')}
            className="flex-1 h-6 text-xs px-2"
          >
            <Zap className="w-3 h-3 mr-1" />
            Agentic
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-lg text-xs px-3 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.content}
              </div>
              
              {message.type === 'user' && (
                <div className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      <div className="px-3 py-2 border-t border-gray-100">
        <div className="flex gap-1 flex-wrap">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt)}
              className="h-6 text-xs px-2 border-gray-200 hover:bg-gray-50"
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>

      {/* File Upload Preview */}
      {uploadedFiles.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-100">
          <div className="flex gap-1 flex-wrap">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="bg-blue-50 rounded px-2 py-1 text-xs flex items-center gap-1 border border-blue-200">
                <Paperclip className="w-3 h-3 text-blue-600" />
                <span className="max-w-[60px] truncate text-blue-700">{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-blue-500 hover:text-blue-700">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compact Input - Lovable Style */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={mode === 'chat' ? "Ask me anything..." : "Tell me what to change..."}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              className="pr-16 text-sm h-9 border-gray-200 focus:border-blue-400 rounded-lg"
              disabled={isLoading}
            />
            
            {/* Upload & Send/Stop buttons */}
            <div className="absolute right-1 top-1 flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-7 h-7 p-0 hover:bg-gray-100"
              >
                <Paperclip className="w-3 h-3 text-gray-500" />
              </Button>
              
              {isLoading ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopGeneration}
                  className="w-7 h-7 p-0 hover:bg-gray-100"
                >
                  <Square className="w-3 h-3 text-gray-600" />
                </Button>
              ) : (
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() && uploadedFiles.length === 0}
                  size="sm"
                  className="w-7 h-7 p-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-3 h-3 text-white" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
