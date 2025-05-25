import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Zap } from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { SimpleConversationalInput } from './SimpleConversationalInput';
import { ConversationalChipGenerator } from './ConversationalChipGenerator';
import { GrowthOSService, GrowthOSChip } from '@/services/growthOSService';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  mode?: 'ask' | 'do';
  emailData?: {
    subject: string;
    html: string;
    previewText: string;
  };
}

interface ConversationalChip {
  id: string;
  label: string;
  type: 'starter' | 'contextual';
  topic?: string;
}

interface UniversalConversationalInterfaceProps {
  context: 'journeys' | 'messages' | 'snippets';
  onEmailBuilderOpen?: (emailHTML?: string, subjectLine?: string) => void;
}

export const UniversalConversationalInterface: React.FC<UniversalConversationalInterfaceProps> = ({
  context,
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
      id: `welcome-${context}`,
      type: 'ai',
      content: GrowthOSService.getGrowthOSWelcome(context),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setConversationDepth(0);
    setCurrentTopic(undefined);
    GrowthOSService.resetContext();
    generateInitialChips();
  }, [context]);

  const generateInitialChips = async () => {
    setIsGeneratingChips(true);
    try {
      const growthChips = await GrowthOSService.generateContextSpecificChips(
        'initial conversation',
        context,
        0
      );
      
      const conversationalChips: ConversationalChip[] = growthChips.map(chip => ({
        id: chip.id,
        label: chip.label,
        type: 'starter' as const,
        topic: chip.topic
      }));
      
      setChips(conversationalChips);
    } catch (error) {
      console.error('Error generating initial chips:', error);
      setChips(getFallbackChips(context));
    } finally {
      setIsGeneratingChips(false);
    }
  };

  const getFallbackChips = (context: string): ConversationalChip[] => {
    const fallbacks = {
      journeys: [
        { id: 'saas-onboarding', label: 'Design SaaS user onboarding journey', type: 'starter' as const, topic: 'saas-onboarding' },
        { id: 'ecommerce-lifecycle', label: 'Map ecommerce customer lifecycle', type: 'starter' as const, topic: 'ecommerce-lifecycle' },
        { id: 'trial-conversion', label: 'Create trial-to-paid conversion flow', type: 'starter' as const, topic: 'trial-conversion' },
        { id: 'reactivation-journey', label: 'Build customer reactivation journey', type: 'starter' as const, topic: 'customer-reactivation' }
      ],
      messages: [
        { id: 'welcome-series', label: 'Create welcome email sequence', type: 'starter' as const, topic: 'welcome-series' },
        { id: 'segment-audience', label: 'Segment audience for personalized campaigns', type: 'starter' as const, topic: 'audience-segmentation' },
        { id: 'cart-abandonment', label: 'Build cart abandonment email flow', type: 'starter' as const, topic: 'cart-recovery' },
        { id: 'newsletter-optimize', label: 'Optimize newsletter engagement', type: 'starter' as const, topic: 'newsletter-optimization' }
      ],
      snippets: [
        { id: 'subject-lines', label: 'Write high-converting subject lines', type: 'starter' as const, topic: 'subject-lines' },
        { id: 'cta-optimization', label: 'Optimize call-to-action copy', type: 'starter' as const, topic: 'cta-optimization' },
        { id: 'personalization-tokens', label: 'Create personalization templates', type: 'starter' as const, topic: 'personalization' },
        { id: 'ab-test-copy', label: 'Generate A/B test variations', type: 'starter' as const, topic: 'ab-testing' }
      ]
    };
    return fallbacks[context] || fallbacks.messages;
  };

  const generateProgressiveChips = async (userMessage: string, aiResponse: string) => {
    setIsGeneratingChips(true);
    try {
      const growthChips = await GrowthOSService.generateContextSpecificChips(
        userMessage,
        context,
        conversationDepth,
        currentTopic
      );
      
      const conversationalChips: ConversationalChip[] = growthChips.map(chip => ({
        id: chip.id,
        label: chip.label,
        type: 'contextual' as const,
        topic: chip.topic
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
      let aiResponse: Message;

      if (mode === 'ask') {
        const response = await GrowthOSService.getAskModeResponse(message, context);
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response,
          timestamp: new Date()
        };
      } else { // mode === 'do'
        const doResponse = await GrowthOSService.getDoModeResponse(message, context);
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: doResponse.content,
          timestamp: new Date(),
          emailData: doResponse.emailData
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      await generateProgressiveChips(message, aiResponse.content);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I had trouble processing that. Let's focus on your ${context} goals - what specific challenge can I help you solve?`,
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
    
    if (chip.topic) {
      setCurrentTopic(chip.topic);
    }
    
    GrowthOSService.updateMarketingContext(chip.label, undefined, chip.topic);
    setIsLoading(true);

    try {
      const response = await GrowthOSService.getAskModeResponse(chip.label, context);

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

  const handleLoadIntoEditor = (emailData: any) => {
    if (onEmailBuilderOpen && emailData) {
      onEmailBuilderOpen(emailData.html, emailData.subject);
    }
  };

  const placeholderText = {
    journeys: 'your customer journey challenge...',
    messages: 'your email marketing challenge...',
    snippets: 'your content optimization need...'
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
                    <div className="flex items-center gap-2">
                      {message.mode && (
                        <span className="text-xs opacity-70">
                          {message.mode === 'ask' ? '💭' : '⚡'}
                        </span>
                      )}
                      {message.emailData && (
                        <button
                          onClick={() => handleLoadIntoEditor(message.emailData)}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          Load in Editor
                        </button>
                      )}
                    </div>
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

      {/* Context-Specific Input */}
      {context === 'messages' ? (
        <EnhancedChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={placeholderText[context]}
          context={context}
        />
      ) : (
        <SimpleConversationalInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={placeholderText[context]}
          context={context}
          disableDoMode={true}
        />
      )}
    </div>
  );
};
