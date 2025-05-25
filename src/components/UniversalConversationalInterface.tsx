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

interface UniversalConversationalInterfaceProps {
  context: 'journeys' | 'messages' | 'snippets';
  onEmailBuilderOpen?: (emailHTML?: string, subjectLine?: string) => void;
}

const getStarterChips = (context: 'journeys' | 'messages' | 'snippets'): ConversationalChip[] => {
  switch (context) {
    case 'journeys':
      return [
        { id: 'welcome-sequence', label: 'Plan a welcome sequence for new users', type: 'starter' },
        { id: 'cart-abandonment', label: 'Design a cart abandonment flow', type: 'starter' },
        { id: 're-engagement', label: 'Create a re-engagement campaign', type: 'starter' },
        { id: 'onboarding-journey', label: 'Build a user onboarding journey', type: 'starter' }
      ];
    case 'messages':
      return [
        { id: 'html-email', label: 'Create an HTML email campaign', type: 'starter' },
        { id: 'marketing-email', label: 'Build a marketing email', type: 'starter' },
        { id: 'sms-campaign', label: 'Design an SMS campaign', type: 'starter' },
        { id: 'push-notification', label: 'Create a push notification', type: 'starter' }
      ];
    case 'snippets':
      return [
        { id: 'email-header', label: 'Create an email header template', type: 'starter' },
        { id: 'cta-snippet', label: 'Write compelling CTA copy', type: 'starter' },
        { id: 'footer-template', label: 'Design a footer template', type: 'starter' },
        { id: 'social-links', label: 'Create social media links section', type: 'starter' }
      ];
    default:
      return [];
  }
};

const getWelcomeMessage = (context: 'journeys' | 'messages' | 'snippets'): string => {
  switch (context) {
    case 'journeys':
      return 'What kind of customer journey would you like to create? Select a journey type below or describe your workflow needs.';
    case 'messages':
      return 'What kind of message would you like to create? Select a message type below or describe your campaign needs.';
    case 'snippets':
      return 'What content snippet would you like to create? Select a snippet type below or describe your content needs.';
    default:
      return 'How can I help you today?';
  }
};

export const UniversalConversationalInterface: React.FC<UniversalConversationalInterfaceProps> = ({
  context,
  onEmailBuilderOpen
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<ConversationalChip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingChips, setIsGeneratingChips] = useState(false);
  const [selectedMessageType, setSelectedMessageType] = useState<string | null>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);

  // Reset interface when context changes
  useEffect(() => {
    const welcomeMessage: Message = {
      id: `welcome-${context}`,
      type: 'ai',
      content: getWelcomeMessage(context),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setChips(getStarterChips(context));
    setSelectedMessageType(null);
    setConversationContext([]);
  }, [context]);

  const generateContextualChips = async (userMessage: string, aiResponse: string) => {
    if (!selectedMessageType) return;
    
    setIsGeneratingChips(true);
    try {
      const contextPrompts = {
        journeys: 'customer journey and workflow automation',
        messages: 'message campaign creation',
        snippets: 'content snippet development'
      };

      const prompt = `Based on this conversation about ${contextPrompts[context]}:

User latest: "${userMessage}"
AI response: "${aiResponse}"
Context: ${conversationContext.join(' ')}
Selected type: ${selectedMessageType}

Generate 5 contextual follow-up questions that would help gather more specific details for ${context}. Make them actionable and progressive. Return as JSON array of strings:

{"suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]}`;

      const response = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      
      if (response.suggestions && Array.isArray(response.suggestions)) {
        const contextualChips: ConversationalChip[] = response.suggestions.map((suggestion: string, index: number) => ({
          id: `contextual-${Date.now()}-${index}`,
          label: suggestion,
          type: 'contextual' as const
        }));

        setChips([...getStarterChips(context), ...contextualChips]);
      }
    } catch (error) {
      console.error('Error generating contextual chips:', error);
      // Add fallback chips
      const fallbackChips = getFallbackChips(context);
      setChips([...getStarterChips(context), ...fallbackChips]);
    } finally {
      setIsGeneratingChips(false);
    }
  };

  const getFallbackChips = (context: string): ConversationalChip[] => {
    const fallbacks = {
      journeys: [
        { id: 'fb-trigger', label: 'What triggers this journey?', type: 'contextual' as const },
        { id: 'fb-steps', label: 'How many steps should it have?', type: 'contextual' as const },
        { id: 'fb-timing', label: 'What\'s the timing between steps?', type: 'contextual' as const }
      ],
      messages: [
        { id: 'fb-audience', label: 'Who is the target audience?', type: 'contextual' as const },
        { id: 'fb-goal', label: 'What\'s the main goal?', type: 'contextual' as const },
        { id: 'fb-tone', label: 'What tone should it have?', type: 'contextual' as const }
      ],
      snippets: [
        { id: 'fb-purpose', label: 'What\'s the snippet\'s purpose?', type: 'contextual' as const },
        { id: 'fb-style', label: 'What style should it have?', type: 'contextual' as const },
        { id: 'fb-placement', label: 'Where will this be used?', type: 'contextual' as const }
      ]
    };
    return fallbacks[context] || [];
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
    setConversationContext(prev => [...prev, message]);
    setIsLoading(true);

    try {
      let contextualPrompt = `User is working on ${context}. ${selectedMessageType ? `They are creating a ${selectedMessageType}. ` : ''}${message}`;
      
      // Handle Do mode logic - only for messages context
      if (mode === 'do' && context === 'messages') {
        if (!selectedMessageType) {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: 'Please first select a message type from the options above, then I can help you create it.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
          return;
        }

        if (conversationContext.length >= 2 && (selectedMessageType.includes('email') || selectedMessageType.includes('html'))) {
          const emailGenerationPrompt = `Generate a complete email based on this conversation:
          
Context: ${conversationContext.join(' ')}
Latest request: ${message}
Message type: ${selectedMessageType}

Create a professional email with proper HTML structure and compelling content.`;

          const emailResponse = await OpenAIEmailService.generateEmailContent({
            prompt: emailGenerationPrompt,
            emailType: 'promotional',
            tone: 'professional'
          });

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `Perfect! I've generated your email based on our conversation. Opening the email editor now...`,
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

      const response = await OpenAIEmailService.conversationalResponse({
        userMessage: contextualPrompt,
        conversationContext: conversationContext.slice(-3),
        currentEmailContent: ''
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      if (selectedMessageType) {
        await generateContextualChips(message, response);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I had trouble processing that. Could you tell me more about the ${context} you want to create?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipSelect = async (chip: ConversationalChip) => {
    if (chip.type === 'starter') {
      setSelectedMessageType(chip.id);
      setConversationContext([chip.label]);
    }

    const chipMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chip.label,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, chipMessage]);
    setIsLoading(true);

    try {
      const contextualPrompt = `User is working on ${context}. They selected: ${chip.label}`;
      const response = await OpenAIEmailService.conversationalResponse({
        userMessage: contextualPrompt,
        conversationContext: conversationContext.slice(-3),
        currentEmailContent: ''
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      if (chip.type === 'contextual') {
        setConversationContext(prev => [...prev, chip.label]);
        await generateContextualChips(chip.label, response);
      } else {
        await generateContextualChips(chip.label, response);
      }

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
    setChips(getStarterChips(context));
    setSelectedMessageType(null);
    setConversationContext([]);
  };

  const placeholderText = {
    journeys: 'your journey needs...',
    messages: 'your message needs...',
    snippets: 'your content needs...'
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

      {/* Input Component - Different based on context */}
      <EnhancedChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder={placeholderText[context]}
        disableDoMode={context !== 'messages'}
        context={context}
      />
    </div>
  );
};
