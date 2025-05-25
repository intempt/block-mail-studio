
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
        { id: 'welcome-sequence', label: 'Welcome sequence', type: 'starter' },
        { id: 'cart-abandonment', label: 'Cart abandonment flow', type: 'starter' },
        { id: 're-engagement', label: 'Re-engagement campaign', type: 'starter' },
        { id: 'onboarding-journey', label: 'User onboarding', type: 'starter' }
      ];
    case 'messages':
      return [
        { id: 'html-email', label: 'HTML email', type: 'starter' },
        { id: 'marketing-email', label: 'Marketing email', type: 'starter' },
        { id: 'sms-campaign', label: 'SMS campaign', type: 'starter' },
        { id: 'push-notification', label: 'Push notification', type: 'starter' }
      ];
    case 'snippets':
      return [
        { id: 'email-header', label: 'Email header', type: 'starter' },
        { id: 'cta-snippet', label: 'CTA snippet', type: 'starter' },
        { id: 'footer-template', label: 'Footer template', type: 'starter' },
        { id: 'social-links', label: 'Social media links', type: 'starter' }
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

const canCreateInDoMode = (messageType: string): boolean => {
  return ['html-email', 'marketing-email'].includes(messageType);
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
        journeys: 'customer journey and workflow',
        messages: 'message campaign',
        snippets: 'content snippet'
      };

      const prompt = `Based on this conversation about creating a ${selectedMessageType}:

User latest: "${userMessage}"
AI response: "${aiResponse}"
Context: ${conversationContext.join(' ')}

Generate 5 contextual follow-up questions or suggestions that would help gather more details for creating this ${selectedMessageType}. Make them specific and actionable. Return as JSON array of strings:

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
    } finally {
      setIsGeneratingChips(false);
    }
  };

  const hasEnoughContextForEmail = (): boolean => {
    return conversationContext.length >= 3 && selectedMessageType && canCreateInDoMode(selectedMessageType);
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
      
      // Handle Do mode logic
      if (mode === 'do') {
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

        if (!canCreateInDoMode(selectedMessageType)) {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I can help you plan and discuss ${selectedMessageType} creation, but I can only generate HTML emails and Marketing emails in "Do" mode currently. Other message types are coming soon! Switch to "Ask" mode for planning assistance.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
          return;
        }

        if (hasEnoughContextForEmail()) {
          // Generate email and open editor
          const emailGenerationPrompt = `Generate a complete ${selectedMessageType} based on this conversation:
          
Context: ${conversationContext.join(' ')}
Latest request: ${message}

Create a professional email with proper HTML structure and compelling content.`;

          const emailResponse = await OpenAIEmailService.generateEmailContent({
            prompt: emailGenerationPrompt,
            emailType: 'promotional',
            tone: 'professional'
          });

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `Perfect! I've generated your ${selectedMessageType} based on our conversation. Opening the email editor now...`,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, aiResponse]);
          
          // Open email builder with generated content
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
    // If it's a starter chip, set the message type
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
        // For starter chips, generate initial contextual chips
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

      {/* Enhanced Input */}
      <EnhancedChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder={placeholderText[context]}
      />
    </div>
  );
};
