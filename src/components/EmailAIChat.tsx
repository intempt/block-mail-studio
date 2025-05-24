
import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Image as ImageIcon, 
  Loader2, 
  Sparkles,
  Copy,
  RefreshCw,
  Paperclip,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';
import { emailAIService, EmailGenerationRequest } from '@/services/EmailAIService';
import { ImageUploader } from './ImageUploader';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  emailData?: {
    subject: string;
    html: string;
    previewText: string;
  };
  status?: 'sending' | 'sent' | 'applied';
}

interface EmailAIChatProps {
  editor: Editor | null;
}

const quickStarters = [
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Welcome Series',
    prompt: 'Create a welcome email series for new subscribers to a SaaS platform',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    icon: <Zap className="w-4 h-4" />,
    label: 'Product Launch',
    prompt: 'Design a product launch announcement with excitement and clear CTAs',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    icon: <Clock className="w-4 h-4" />,
    label: 'Newsletter',
    prompt: 'Create a weekly newsletter template with company updates and insights',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Promotional',
    prompt: 'Design a promotional email for a limited-time 30% off sale',
    gradient: 'from-pink-500 to-rose-600'
  }
];

export const EmailAIChat: React.FC<EmailAIChatProps> = ({ editor }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'friendly' | 'urgent'>('professional');
  const [selectedType, setSelectedType] = useState<'welcome' | 'promotional' | 'newsletter' | 'announcement'>('welcome');
  const [showImageUploader, setShowImageUploader] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      addMessage({ 
        type: 'ai', 
        content: "Hi! I'm your AI email assistant. I can help you create professional email campaigns. What kind of email would you like to build today?" 
      });
    }
  }, []);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: message.type === 'user' ? 'sent' : undefined
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessageStatus = (id: string, status: Message['status']) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, status } : msg
    ));
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const messageId = addMessage({ type: 'user', content: userMessage });
    setIsLoading(true);

    try {
      const aiMessageId = addMessage({ 
        type: 'ai', 
        content: '', 
        status: 'sending'
      });

      const request: EmailGenerationRequest = {
        prompt: userMessage,
        tone: selectedTone,
        type: selectedType
      };

      const response = await emailAIService.generateEmail(request);
      
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? {
          ...msg,
          content: `I've created an email campaign for you! **Subject:** "${response.subject}"\n\n**Preview:** ${response.previewText}\n\nClick "Apply to Editor" to use this email in your editor.`,
          emailData: response,
          status: 'sent'
        } : msg
      ));
    } catch (error) {
      addMessage({ 
        type: 'ai', 
        content: '❌ Sorry, I encountered an error generating your email. Please try again with a different prompt.',
        status: 'sent'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickStarter = (starter: typeof quickStarters[0]) => {
    setInput(starter.prompt);
    textareaRef.current?.focus();
  };

  const applyEmailToEditor = (emailData: Message['emailData'], messageId: string) => {
    if (editor && emailData) {
      editor.commands.setContent(emailData.html);
      updateMessageStatus(messageId, 'applied');
      addMessage({
        type: 'ai',
        content: '✅ Email applied to editor! You can now edit it using the visual editor or switch to other editing modes.',
        status: 'sent'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">AI Email Assistant</h3>
            <p className="text-xs text-slate-500">Powered by advanced language models</p>
          </div>
        </div>
        
        {/* Quick Settings */}
        <div className="flex gap-2 mb-3">
          <select 
            value={selectedTone} 
            onChange={(e) => setSelectedTone(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="welcome">Welcome</option>
            <option value="promotional">Promotional</option>
            <option value="newsletter">Newsletter</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>

        {/* Quick Starters */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Quick Starters</p>
            <div className="grid grid-cols-1 gap-2">
              {quickStarters.map((starter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickStarter(starter)}
                  className="justify-start h-auto p-3 text-left border-slate-200 hover:border-slate-300"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${starter.gradient} flex items-center justify-center mr-3 text-white`}>
                    {starter.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-slate-900">{starter.label}</div>
                    <div className="text-xs text-slate-500 line-clamp-2">{starter.prompt}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {message.status === 'sending' ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-900'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  
                  {message.emailData && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="font-medium text-slate-600">Subject:</span>
                          <span className="ml-2 text-slate-900">{message.emailData.subject}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-slate-600">Preview:</span>
                          <span className="ml-2 text-slate-700">{message.emailData.previewText}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => applyEmailToEditor(message.emailData, message.id)}
                          disabled={message.status === 'applied'}
                          className={`w-full mt-2 ${
                            message.status === 'applied' 
                              ? 'bg-green-600 hover:bg-green-600' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {message.status === 'applied' ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Applied to Editor
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Apply to Editor
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.status === 'applied' && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      Applied
                    </Badge>
                  )}
                </div>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 order-1">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2 mb-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the email you want to create..."
              className="resize-none pr-20 bg-slate-50 border-slate-200 focus:bg-white"
              rows={2}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageUploader(!showImageUploader)}
                className="h-8 w-8 p-0"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="self-end bg-blue-600 hover:bg-blue-700 h-16 px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {showImageUploader && (
          <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <ImageUploader 
              maxImages={3}
              onImagesChange={(images) => {
                console.log('Images uploaded:', images);
              }}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{input.length}/2000</span>
        </div>
      </div>
    </div>
  );
};
