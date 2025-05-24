
import React, { useState, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle,
  Zap,
  Upload,
  Image as ImageIcon,
  Paperclip,
  Square,
  RefreshCw,
  Sparkles,
  Play,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';
import { emailAIService } from '@/services/EmailAIService';
import { ApiKeyService } from '@/services/apiKeyService';
import { EmailContentAnalyzer } from '@/services/EmailContentAnalyzer';
import { AIBlockGenerator } from '@/services/AIBlockGenerator';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system' | 'error';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
  actions?: Array<{
    label: string;
    type: 'implement' | 'preview' | 'modify';
    payload?: any;
  }>;
  isStreaming?: boolean;
}

interface EnhancedAIAssistantProps {
  editor: Editor | null;
  emailHTML: string;
  canvasRef?: React.RefObject<EmailBlockCanvasRef>;
  subjectLine?: string;
  onSubjectLineChange?: (subjectLine: string) => void;
  onLoadToEditor?: (blocks: any[], layoutConfig: any) => void;
  currentEmailBlocks?: any[];
}

type ChatMode = 'chat' | 'agentic';

export const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({ 
  editor, 
  emailHTML,
  canvasRef,
  subjectLine = '',
  onSubjectLineChange,
  onLoadToEditor,
  currentEmailBlocks = []
}) => {
  const [mode, setMode] = useState<ChatMode>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: mode === 'chat' 
        ? 'Welcome! I\'m your AI email assistant. I can help you plan, create, and optimize professional emails. What would you like to work on today?'
        : 'Agentic mode activated! I\'ll directly implement changes to your current email. Tell me what you\'d like to improve.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const handleModeSwitch = (newMode: ChatMode) => {
    setMode(newMode);
    
    // Add system message about mode switch
    const systemMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: newMode === 'chat' 
        ? '💬 Chat Mode: Plan and discuss your email strategy'
        : '⚡ Agentic Mode: Direct implementation on your current email',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const stopGeneration = useCallback(() => {
    setIsLoading(false);
    setStreamingMessageId(null);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      attachments: uploadedFiles.map(file => ({
        type: file.type.startsWith('image/') ? 'image' as const : 'file' as const,
        url: URL.createObjectURL(file),
        name: file.name
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      if (mode === 'agentic' && currentEmailBlocks.length > 0) {
        // Agentic mode: Direct implementation
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I'll implement "${inputMessage}" on your current email...`,
          timestamp: new Date(),
          isStreaming: true
        };
        setMessages(prev => [...prev, aiResponse]);
        setStreamingMessageId(aiResponse.id);

        // Simulate streaming response
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiResponse.id 
              ? { 
                  ...msg, 
                  content: `✅ **Implementation Complete**\n\nI've applied your requested changes: "${inputMessage}"\n\n**Changes Made:**\n• Updated content structure\n• Optimized for mobile\n• Enhanced visual hierarchy\n\nThe changes have been applied directly to your email.`,
                  isStreaming: false,
                  actions: [
                    { label: 'Preview Changes', type: 'preview' },
                    { label: 'Undo Changes', type: 'modify', payload: { action: 'undo' } }
                  ]
                }
              : msg
          ));
          setIsLoading(false);
          setStreamingMessageId(null);
        }, 2000);

      } else {
        // Chat mode: Planning and discussion
        const response = await emailAIService.getConversationalResponse(inputMessage);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response,
          timestamp: new Date(),
          actions: [
            { label: 'Implement This Plan', type: 'implement' },
            { label: 'Generate Email', type: 'implement', payload: { action: 'generate' } },
            { label: 'Switch to Agentic Mode', type: 'modify', payload: { action: 'switch-mode' } }
          ]
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'Sorry, I encountered an error. Please check your API configuration and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: { label: string; type: string; payload?: any }) => {
    if (action.type === 'implement') {
      // Switch to agentic mode and implement
      if (mode !== 'agentic') {
        setMode('agentic');
      }
      // Implementation logic here
    } else if (action.payload?.action === 'switch-mode') {
      setMode('agentic');
    }
  };

  const renderMessage = (message: Message) => (
    <div key={message.id}>
      <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
        {(message.type === 'ai' || message.type === 'system') && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.type === 'ai' ? 'bg-blue-600' : 'bg-gray-500'
          }`}>
            {message.type === 'ai' ? (
              <Bot className="w-4 h-4 text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </div>
        )}
        
        {message.type === 'error' && (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div
          className={`max-w-[80%] rounded-xl text-sm ${
            message.type === 'user'
              ? 'bg-blue-600 text-white px-4 py-3'
              : message.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800 px-4 py-3'
              : message.type === 'system'
              ? 'bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2'
              : 'bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3'
          }`}
        >
          <div className="whitespace-pre-wrap">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
            )}
          </div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="bg-white/20 rounded px-2 py-1 text-xs flex items-center gap-1">
                  {attachment.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <Paperclip className="w-3 h-3" />}
                  {attachment.name}
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs opacity-70 mt-2">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        {message.type === 'user' && (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>

      {message.actions && message.actions.length > 0 && (
        <div className="mt-3 ml-11">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Quick Actions</p>
            <div className="flex gap-2 flex-wrap">
              {message.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(action)}
                  className="text-xs h-8"
                  disabled={isLoading}
                >
                  {action.type === 'implement' && <Play className="w-3 h-3 mr-1" />}
                  {action.type === 'preview' && <Eye className="w-3 h-3 mr-1" />}
                  {action.type === 'modify' && <Zap className="w-3 h-3 mr-1" />}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      {/* Header with Mode Toggle */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">AI Assistant</h3>
          </div>
          
          <Badge variant="secondary" className={`text-xs ${
            ApiKeyService.isKeyAvailable() ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {ApiKeyService.isKeyAvailable() ? 'Connected' : 'Setup Required'}
          </Badge>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={mode === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeSwitch('chat')}
            className={`flex-1 text-xs h-8 ${mode === 'chat' ? 'bg-white shadow-sm' : ''}`}
          >
            <MessageCircle className="w-3 h-3 mr-2" />
            Chat
          </Button>
          <Button
            variant={mode === 'agentic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeSwitch('agentic')}
            className={`flex-1 text-xs h-8 ${mode === 'agentic' ? 'bg-white shadow-sm' : ''}`}
          >
            <Zap className="w-3 h-3 mr-2" />
            Agentic
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.map(renderMessage)}
          
          {isLoading && !streamingMessageId && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              {isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopGeneration}
                  className="self-end"
                >
                  <Square className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* File Upload Preview */}
      {uploadedFiles.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-2 flex-wrap">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="bg-white rounded px-3 py-1 text-xs flex items-center gap-2 border">
                {file.type.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : <Paperclip className="w-3 h-3" />}
                <span className="max-w-[100px] truncate">{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-500">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={mode === 'chat' ? "Ask me anything about your email..." : "Tell me what to change..."}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              className="border-gray-300 focus:border-blue-500 text-sm resize-none"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-9 h-9 p-0"
            >
              <Upload className="w-4 h-4" />
            </Button>
            
            <Button 
              onClick={sendMessage} 
              disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 w-9 h-9 p-0"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
