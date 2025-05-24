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
  RefreshCw
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
}

interface EmailAIChatProps {
  editor: Editor | null;
}

const quickPrompts = [
  {
    label: 'Welcome Email',
    prompt: 'Create a welcome email for new subscribers to a SaaS platform',
    tone: 'friendly' as const,
    type: 'welcome' as const
  },
  {
    label: 'Product Launch',
    prompt: 'Create a product launch announcement email with excitement and urgency',
    tone: 'professional' as const,
    type: 'announcement' as const
  },
  {
    label: 'Newsletter',
    prompt: 'Create a weekly newsletter with company updates and industry insights',
    tone: 'professional' as const,
    type: 'newsletter' as const
  },
  {
    label: 'Promotional Sale',
    prompt: 'Create a promotional email for a 25% off flash sale ending soon',
    tone: 'urgent' as const,
    type: 'promotional' as const
  }
];

export const EmailAIChat: React.FC<EmailAIChatProps> = ({ editor }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'friendly' | 'urgent'>('professional');
  const [selectedType, setSelectedType] = useState<'welcome' | 'promotional' | 'newsletter' | 'announcement'>('welcome');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage({ type: 'user', content: userMessage });
    setIsLoading(true);

    try {
      const request: EmailGenerationRequest = {
        prompt: userMessage,
        tone: selectedTone,
        type: selectedType
      };

      const response = await emailAIService.generateEmail(request);
      
      addMessage({ 
        type: 'ai', 
        content: `I've generated an email with the subject: "${response.subject}". Click "Apply to Editor" to use it in your email editor.`,
        emailData: response
      });
    } catch (error) {
      addMessage({ 
        type: 'ai', 
        content: 'Sorry, I encountered an error generating your email. Please try again with a different prompt.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: typeof quickPrompts[0]) => {
    setSelectedTone(prompt.tone);
    setSelectedType(prompt.type);
    setInput(prompt.prompt);
    textareaRef.current?.focus();
  };

  const applyEmailToEditor = (emailData: Message['emailData']) => {
    if (editor && emailData) {
      editor.commands.setContent(emailData.html);
    }
  };

  const refineCurrentEmail = async (refinementPrompt: string) => {
    if (!editor) return;
    
    setIsLoading(true);
    try {
      const currentHtml = editor.getHTML();
      const refinedHtml = await emailAIService.refineEmail(currentHtml, refinementPrompt);
      editor.commands.setContent(refinedHtml);
      
      addMessage({ 
        type: 'ai', 
        content: `I've refined your email based on: "${refinementPrompt}". The changes have been applied to the editor.`
      });
    } catch (error) {
      addMessage({ 
        type: 'ai', 
        content: 'Sorry, I encountered an error refining your email. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Email Generator</h3>
        </div>
        
        <div className="flex gap-2 mb-3">
          <select 
            value={selectedTone} 
            onChange={(e) => setSelectedTone(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="welcome">Welcome</option>
            <option value="promotional">Promotional</option>
            <option value="newsletter">Newsletter</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>
        
        <div className="mb-3">
          <ImageUploader 
            maxImages={3}
            onImagesChange={(images) => {
              console.log('Images uploaded:', images);
            }}
          />
        </div>
        
        <div className="flex flex-wrap gap-1">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt)}
              className="text-xs"
            >
              {prompt.label}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">Start by describing the email you want to create</p>
              <p className="text-xs text-gray-400 mt-1">Try: "Create a welcome email for a fitness app"</p>
            </div>
          )}
          
          {messages.map((message) => (
            <Card key={message.id} className={`p-3 ${
              message.type === 'user' ? 'ml-8 bg-blue-50' : 'mr-8 bg-gray-50'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  message.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {message.type === 'user' ? 
                    <User className="w-4 h-4 text-blue-600" /> : 
                    <Bot className="w-4 h-4 text-gray-600" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{message.content}</p>
                  {message.emailData && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs text-gray-600">
                        <strong>Subject:</strong> {message.emailData.subject}
                      </div>
                      <div className="text-xs text-gray-600">
                        <strong>Preview:</strong> {message.emailData.previewText}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => applyEmailToEditor(message.emailData)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Apply to Editor
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          {isLoading && (
            <Card className="mr-8 bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                </div>
                <p className="text-sm text-gray-600">Generating your email...</p>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the email you want to create..."
            className="resize-none"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="self-end bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {editor && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refineCurrentEmail("Make this email more casual and friendly")}
                disabled={isLoading}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Make Casual
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refineCurrentEmail("Add a clear call-to-action button")}
                disabled={isLoading}
              >
                Add CTA
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refineCurrentEmail("Make this email shorter and more concise")}
                disabled={isLoading}
              >
                Shorten
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
