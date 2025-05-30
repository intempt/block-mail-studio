
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Sparkles, Wand2, Eye, RefreshCw } from 'lucide-react';
import { EmailBlock } from '@/types/emailBlocks';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    generatedBlocks?: EmailBlock[];
  };
}

interface ConversationalInterfaceProps {
  onEmailGeneration: (prompt: string, context: any) => Promise<EmailBlock[]>;
  onBlocksUpdate: (blocks: EmailBlock[]) => void;
  currentBlocks: EmailBlock[];
}

export const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({
  onEmailGeneration,
  onBlocksUpdate,
  currentBlocks
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI email designer. Describe the email you'd like to create, and I'll build it for you. I understand context, brand tone, audience, and can optimize for performance.",
      timestamp: new Date()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectIntent = (message: string): { intent: string; confidence: number } => {
    const lowerMessage = message.toLowerCase();
    
    // Intent detection patterns
    if (lowerMessage.includes('create') || lowerMessage.includes('generate') || lowerMessage.includes('make')) {
      return { intent: 'create', confidence: 0.9 };
    }
    if (lowerMessage.includes('modify') || lowerMessage.includes('change') || lowerMessage.includes('update')) {
      return { intent: 'modify', confidence: 0.8 };
    }
    if (lowerMessage.includes('analyze') || lowerMessage.includes('review') || lowerMessage.includes('feedback')) {
      return { intent: 'analyze', confidence: 0.7 };
    }
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('better')) {
      return { intent: 'optimize', confidence: 0.8 };
    }
    
    return { intent: 'general', confidence: 0.5 };
  };

  const processUserMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    const { intent, confidence } = detectIntent(content);
    setCurrentIntent(intent);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      let response: Message;

      switch (intent) {
        case 'create':
          const generatedBlocks = await onEmailGeneration(content, {
            existingBlocks: currentBlocks,
            intent,
            confidence
          });
          
          response = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `Perfect! I've created an email based on your description. I've generated ${generatedBlocks.length} content blocks with optimized structure and styling. Would you like me to make any adjustments?`,
            timestamp: new Date(),
            metadata: {
              intent,
              confidence,
              generatedBlocks
            }
          };
          
          onBlocksUpdate(generatedBlocks);
          break;

        case 'modify':
          response = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I can help you modify the current email. Based on your request, I'll make the specific changes you mentioned while maintaining the overall design quality and brand consistency.`,
            timestamp: new Date(),
            metadata: { intent, confidence }
          };
          break;

        case 'analyze':
          response = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I've analyzed your email design. Here's what I found: Strong visual hierarchy, good mobile responsiveness, and clear call-to-action placement. I recommend optimizing the subject line for better open rates and adding more personalization elements.`,
            timestamp: new Date(),
            metadata: { intent, confidence }
          };
          break;

        case 'optimize':
          response = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I'll optimize your email for better performance. I'm enhancing the content structure, improving mobile compatibility, optimizing images, and strengthening the call-to-action elements for higher engagement rates.`,
            timestamp: new Date(),
            metadata: { intent, confidence }
          };
          break;

        default:
          response = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I understand you want to work on email design. Could you be more specific about what you'd like to create, modify, or analyze? I can help with content generation, design optimization, performance analysis, and more.`,
            timestamp: new Date(),
            metadata: { intent, confidence }
          };
      }

      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('AI processing error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I encountered an issue processing your request. Let me try a different approach. Could you rephrase what you\'d like me to help you with?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsThinking(false);
      setCurrentIntent(null);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Email Designer</h3>
            <p className="text-xs text-gray-600">Context-aware • Performance-optimized</p>
          </div>
          {currentIntent && (
            <Badge variant="outline" className="ml-auto text-xs">
              {currentIntent}
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {message.metadata?.confidence && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(message.metadata.confidence * 100)}% confidence
                    </Badge>
                  )}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Processing your request...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <ConversationalInput onSubmit={processUserMessage} disabled={isThinking} />
      </div>
    </Card>
  );
};

const ConversationalInput: React.FC<{ 
  onSubmit: (message: string) => void; 
  disabled: boolean; 
}> = ({ onSubmit, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe what you want to create or modify..."
        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-purple-400 focus:ring-1 outline-none text-sm"
        disabled={disabled}
      />
      <Button 
        type="submit" 
        disabled={!input.trim() || disabled}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Sparkles className="w-4 h-4" />
      </Button>
    </form>
  );
};
