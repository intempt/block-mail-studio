import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User } from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { ConversationalChipGenerator } from './ConversationalChipGenerator';
import { OpenAIEmailService } from '@/services/openAIEmailService';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  mode?: 'ask' | 'do';
}

interface ConversationalChip {
  id: string;
  label: string;
  type: 'starter' | 'contextual';
}

interface ConversationalMessagesInterfaceProps {
  onEmailBuilderOpen?: (emailHTML?: string, subjectLine?: string) => void;
}

const STARTER_CHIPS: ConversationalChip[] = [
  { id: 'html-email', label: 'HTML email', type: 'starter' },
  { id: 'marketing-email', label: 'Marketing email', type: 'starter' },
  { id: 'sms-campaign', label: 'SMS campaign', type: 'starter' },
  { id: 'push-notification', label: 'Push notification', type: 'starter' }
];

export const ConversationalMessagesInterface: React.FC<ConversationalMessagesInterfaceProps> = ({
  onEmailBuilderOpen
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<ConversationalChip[]>(STARTER_CHIPS);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingChips, setIsGeneratingChips] = useState(false);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'What kind of message would you like to create today? I can help you build SMS campaigns, push notifications, or email campaigns.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const generateContextualChips = async (userMessage: string, aiResponse: string) => {
    setIsGeneratingChips(true);
    try {
      const conversationContext = messages.slice(-4).map(m => 
        `${m.type}: ${m.content}`
      ).join('\n');

      const prompt = `Based on this conversation about creating a message campaign:

User latest: "${userMessage}"
AI response: "${aiResponse}"
Context: ${conversationContext}

Generate 5 conversational next-step suggestions that would help the user refine their message campaign. Make them natural and specific to what they're trying to build. Return as JSON array of strings:

{"suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]}`;

      const response = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      
      if (response.suggestions && Array.isArray(response.suggestions)) {
        const contextualChips: ConversationalChip[] = response.suggestions.map((suggestion: string, index: number) => ({
          id: `contextual-${Date.now()}-${index}`,
          label: suggestion,
          type: 'contextual' as const
        }));

        setChips([...STARTER_CHIPS, ...contextualChips]);
      }
    } catch (error) {
      console.error('Error generating contextual chips:', error);
    } finally {
      setIsGeneratingChips(false);
    }
  };

  const handleSendMessage = async (message: string, mode: 'ask' | 'do') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      mode
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await OpenAIEmailService.conversationalResponse({
        userMessage: message,
        conversationContext: messages.slice(-3).map(m => m.content),
        currentEmailContent: ''
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      await generateContextualChips(message, response);

      if (message.toLowerCase().includes('html email') && mode === 'do') {
        setTimeout(() => {
          if (onEmailBuilderOpen) {
            onEmailBuilderOpen();
          }
        }, 1000);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I had trouble processing that. Could you tell me more about what you want to create?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipSelect = async (chip: ConversationalChip) => {
    const chipMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chip.label,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, chipMessage]);
    setIsLoading(true);

    try {
      const response = await OpenAIEmailService.conversationalResponse({
        userMessage: chip.label,
        conversationContext: messages.slice(-3).map(m => m.content),
        currentEmailContent: ''
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      await generateContextualChips(chip.label, response);

    } catch (error) {
      console.error('Error processing chip selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshChips = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages.slice().reverse().find(m => m.type === 'user');
    const lastAiMessage = messages.slice().reverse().find(m => m.type === 'ai');
    
    if (lastUserMessage && lastAiMessage) {
      await generateContextualChips(lastUserMessage.content, lastAiMessage.content);
    }
  };

  const resetToStarterChips = () => {
    setChips(STARTER_CHIPS);
  };

  return (
    <div className="space-y-6">
      {/* Chat Messages */}
      <ScrollArea className="h-64 mb-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {(message.type === 'ai' || message.type === 'system') && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[70%] rounded-xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.mode && (
                      <span className="text-xs opacity-70 ml-2">
                        {message.mode === 'ask' ? '💭' : '⚡'}
                      </span>
                    )}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 justify-start">
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
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Conversational Chips */}
      <div className="mb-6">
        <ConversationalChipGenerator
          chips={chips}
          onChipSelect={handleChipSelect}
          onRefreshChips={handleRefreshChips}
          onResetToStarter={resetToStarterChips}
          isLoading={isLoading || isGeneratingChips}
        />
      </div>

      {/* Enhanced Input */}
      <EnhancedChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="your message needs..."
      />
    </div>
  );
};
