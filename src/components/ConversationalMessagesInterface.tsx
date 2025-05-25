import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User } from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { ConversationalChipGenerator } from './ConversationalChipGenerator';
import { GrowthOSService, GrowthOSChip } from '@/services/growthOSService';
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

export const ConversationalMessagesInterface: React.FC<ConversationalMessagesInterfaceProps> = ({
  onEmailBuilderOpen
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<ConversationalChip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingChips, setIsGeneratingChips] = useState(false);
  const [conversationDepth, setConversationDepth] = useState(0);
  const [currentTopic, setCurrentTopic] = useState<string | undefined>();

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: GrowthOSService.getGrowthOSWelcome('messages'),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    generateInitialChips();
  }, []);

  const generateInitialChips = async () => {
    setIsGeneratingChips(true);
    try {
      const growthChips = await GrowthOSService.generateContextSpecificChips(
        'initial conversation',
        'messages',
        0
      );
      
      const conversationalChips: ConversationalChip[] = growthChips.map(chip => ({
        id: chip.id,
        label: chip.label,
        type: 'starter' as const
      }));
      
      setChips(conversationalChips);
    } catch (error) {
      console.error('Error generating initial chips:', error);
      setChips([
        { id: 'welcome-series', label: 'Create welcome email sequence', type: 'starter' },
        { id: 'segment-audience', label: 'Segment audience for personalized campaigns', type: 'starter' },
        { id: 'cart-abandonment', label: 'Build cart abandonment email flow', type: 'starter' },
        { id: 'newsletter-optimize', label: 'Optimize newsletter engagement', type: 'starter' }
      ]);
    } finally {
      setIsGeneratingChips(false);
    }
  };

  const generateProgressiveChips = async (userMessage: string, aiResponse: string) => {
    setIsGeneratingChips(true);
    try {
      const growthChips = await GrowthOSService.generateContextSpecificChips(
        userMessage,
        'messages',
        conversationDepth,
        currentTopic
      );
      
      const conversationalChips: ConversationalChip[] = growthChips.map(chip => ({
        id: chip.id,
        label: chip.label,
        type: 'contextual' as const
      }));
      
      setChips(conversationalChips);
    } catch (error) {
      console.error('Error generating progressive chips:', error);
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
    setConversationDepth(prev => prev + 1);
    GrowthOSService.updateMarketingContext(message, undefined, currentTopic);
    setIsLoading(true);

    try {
      if (mode === 'do' && conversationDepth >= 2) {
        if (message.toLowerCase().includes('email') || message.toLowerCase().includes('campaign')) {
          const response = await OpenAIEmailService.generateEmailContent({
            prompt: `Create a growth-focused email based on this ${currentTopic || 'email marketing'} conversation: ${message}`,
            emailType: 'promotional',
            tone: 'professional'
          });

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `Excellent! I've created a ${currentTopic || 'growth-optimized'} email campaign for you. Opening the email builder now...`,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, aiResponse]);

          setTimeout(() => {
            if (onEmailBuilderOpen) {
              onEmailBuilderOpen(response.html, response.subject);
            }
          }, 1000);

          setIsLoading(false);
          return;
        }
      }

      const response = await GrowthOSService.getContextSpecificResponse(message, 'messages');

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      await generateProgressiveChips(message, response);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I had trouble processing that. Let\'s focus on your email marketing goals - what specific campaign challenge can I help you solve?',
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
    setConversationDepth(prev => prev + 1);
    
    // Extract topic from chip if it's a starter chip
    if (chip.type === 'starter') {
      const topicMap: { [key: string]: string } = {
        'Create welcome email sequence': 'welcome-series',
        'Segment audience for personalized campaigns': 'audience-segmentation',
        'Build cart abandonment email flow': 'cart-recovery',
        'Optimize newsletter engagement': 'newsletter-optimization'
      };
      setCurrentTopic(topicMap[chip.label]);
    }
    
    GrowthOSService.updateMarketingContext(chip.label, undefined, currentTopic);
    setIsLoading(true);

    try {
      const response = await GrowthOSService.getContextSpecificResponse(chip.label, 'messages');

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      await generateProgressiveChips(chip.label, response);

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
      await generateProgressiveChips(lastUserMessage.content, lastAiMessage.content);
    }
  };

  const resetToFreshStart = () => {
    GrowthOSService.resetContext();
    setConversationDepth(0);
    setCurrentTopic(undefined);
    generateInitialChips();
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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Current Topic Display */}
      {currentTopic && (
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Topic: {currentTopic.replace('-', ' ')}
          </span>
        </div>
      )}

      {/* Conversational Chips */}
      <div className="mb-6">
        <ConversationalChipGenerator
          chips={chips}
          onChipSelect={handleChipSelect}
          onRefreshChips={handleRefreshChips}
          onResetToStarter={resetToFreshStart}
          isLoading={isLoading || isGeneratingChips}
        />
      </div>

      {/* Enhanced Input */}
      <EnhancedChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="your email marketing challenge..."
        context="messages"
      />
    </div>
  );
};
