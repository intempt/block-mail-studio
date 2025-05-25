
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User } from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { SimpleConversationalInput } from './SimpleConversationalInput';
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

  // Reset interface when context changes
  useEffect(() => {
    const welcomeMessage: Message = {
      id: `welcome-${context}`,
      type: 'ai',
      content: GrowthOSService.getGrowthOSWelcome(context),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setConversationDepth(0);
    GrowthOSService.resetContext();
    generateInitialChips();
  }, [context]);

  const generateInitialChips = async () => {
    setIsGeneratingChips(true);
    try {
      const growthChips = await GrowthOSService.generateMarketingChips(
        'initial conversation',
        context,
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
      setChips(getFallbackChips(context));
    } finally {
      setIsGeneratingChips(false);
    }
  };

  const getFallbackChips = (context: string): ConversationalChip[] => {
    const fallbacks = {
      journeys: [
        { id: 'welcome-journey', label: 'Design a customer onboarding journey', type: 'starter' as const },
        { id: 'retention-flow', label: 'Create a retention automation flow', type: 'starter' as const },
        { id: 'lifecycle-mapping', label: 'Map customer lifecycle stages', type: 'starter' as const },
        { id: 'engagement-triggers', label: 'Set up behavioral triggers', type: 'starter' as const }
      ],
      messages: [
        { id: 'conversion-email', label: 'Create a high-converting email campaign', type: 'starter' as const },
        { id: 'customer-segmentation', label: 'Segment customers for personalized messaging', type: 'starter' as const },
        { id: 'retention-strategy', label: 'Design a customer retention email series', type: 'starter' as const },
        { id: 'growth-metrics', label: 'Set up growth tracking and analytics', type: 'starter' as const }
      ],
      snippets: [
        { id: 'cta-optimization', label: 'Optimize call-to-action copy', type: 'starter' as const },
        { id: 'subject-lines', label: 'Write high-open-rate subject lines', type: 'starter' as const },
        { id: 'personalization', label: 'Create personalized content templates', type: 'starter' as const },
        { id: 'ab-test-content', label: 'Generate A/B test variations', type: 'starter' as const }
      ]
    };
    return fallbacks[context] || fallbacks.messages;
  };

  const generateProgressiveChips = async (userMessage: string, aiResponse: string) => {
    setIsGeneratingChips(true);
    try {
      const growthChips = await GrowthOSService.generateMarketingChips(
        userMessage,
        context,
        conversationDepth
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
    GrowthOSService.updateMarketingContext(message);
    setIsLoading(true);

    try {
      // Handle Do mode logic - only for messages context
      if (mode === 'do' && context === 'messages') {
        if (conversationDepth >= 2 && (message.toLowerCase().includes('email') || message.toLowerCase().includes('campaign'))) {
          const emailGenerationPrompt = `Generate a growth-optimized email based on this marketing conversation: ${message}`;

          const emailResponse = await OpenAIEmailService.generateEmailContent({
            prompt: emailGenerationPrompt,
            emailType: 'promotional',
            tone: 'professional'
          });

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `Perfect! I've created a growth-focused email campaign based on our conversation. Opening the email builder now...`,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, aiResponse]);
          
          setTimeout(() => {
            if (onEmailBuilderOpen) {
              onEmailBuilderOpen(emailResponse.html, emailResponse.subject);
            }
          }, 1000);
          
          setIsLoading(false);
          return;
        }
      }

      const response = await GrowthOSService.getGrowthOSResponse(message, context);

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
        content: `I had trouble processing that. Let's focus on your growth marketing goals - what specific ${context} challenge can I help you solve?`,
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
    GrowthOSService.updateMarketingContext(chip.label);
    setIsLoading(true);

    try {
      const response = await GrowthOSService.getGrowthOSResponse(chip.label, context);

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
    generateInitialChips();
  };

  const placeholderText = {
    journeys: 'your customer journey challenge...',
    messages: 'your growth marketing challenge...',
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
        />
      )}
    </div>
  );
};
