
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Zap, Target } from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { SimpleConversationalInput } from './SimpleConversationalInput';
import { ConversationalChipGenerator } from './ConversationalChipGenerator';
import { ChatCompletionService } from '@/services/chatCompletionService';

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
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [campaignContext, setCampaignContext] = useState<any>(null);

  useEffect(() => {
    // Initialize chat completion context
    ChatCompletionService.initializeContext(sessionId, context);
    
    const welcomeMessage: Message = {
      id: `welcome-${context}`,
      type: 'ai',
      content: getWelcomeMessage(context),
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setChips(getInitialChips(context));
  }, [context, sessionId]);

  const getWelcomeMessage = (context: string): string => {
    const messages = {
      messages: "Hello! I'm your GrowthOS assistant for campaign creation. I can help you build email campaigns, SMS blasts, and push notifications from strategy to execution. What type of campaign would you like to create?",
      journeys: "Welcome to GrowthOS customer journeys! I can help you map customer experiences, design touchpoints, and plan automation flows. What journey challenge can I help you solve?",
      snippets: "Hi! I'm here to help with content optimization and copywriting. I can assist with subject lines, CTAs, personalization, and A/B testing strategies. What content challenge are you working on?"
    };
    return messages[context] || messages.messages;
  };

  const getInitialChips = (context: string): ConversationalChip[] => {
    const chipSets = {
      messages: [
        { id: 'email-campaign', label: '📧 Email Campaign', type: 'starter' as const },
        { id: 'sms-campaign', label: '📱 SMS Campaign', type: 'starter' as const },
        { id: 'push-notification', label: '🔔 Push Notification', type: 'starter' as const },
        { id: 'rich-text-email', label: '📝 Rich Text Email', type: 'starter' as const }
      ],
      journeys: [
        { id: 'map-journey', label: 'Map customer journey', type: 'starter' as const },
        { id: 'onboarding-flow', label: 'Design onboarding flow', type: 'starter' as const },
        { id: 'retention-strategy', label: 'Build retention strategy', type: 'starter' as const },
        { id: 'conversion-optimization', label: 'Optimize conversions', type: 'starter' as const }
      ],
      snippets: [
        { id: 'subject-lines', label: 'Write better subject lines', type: 'starter' as const },
        { id: 'cta-optimization', label: 'Optimize call-to-actions', type: 'starter' as const },
        { id: 'personalization', label: 'Add personalization', type: 'starter' as const },
        { id: 'ab-testing', label: 'Plan A/B tests', type: 'starter' as const }
      ]
    };
    return chipSets[context] || chipSets.messages;
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
      const response = await ChatCompletionService.processUserMessage(sessionId, message, mode);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        emailData: response.emailData
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update campaign context if available
      if (response.campaignContext) {
        setCampaignContext(response.campaignContext);
      }

      // Update chips based on AI suggestions
      const newChips: ConversationalChip[] = response.suggestedChips.map((chip, index) => ({
        id: `chip-${Date.now()}-${index}`,
        label: chip,
        type: 'contextual' as const
      }));
      setChips(newChips);

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
    await handleSendMessage(chip.label, 'ask');
  };

  const handleRefreshChips = async () => {
    const conversationHistory = ChatCompletionService.getConversationHistory(sessionId);
    if (conversationHistory.length < 2) return;
    
    // Generate new contextual chips based on conversation
    const recentContext = conversationHistory.slice(-2).map(msg => msg.content).join(' ');
    const refreshedChips = getInitialChips(context).map((chip, index) => ({
      ...chip,
      id: `refresh-${Date.now()}-${index}`,
      type: 'contextual' as const
    }));
    
    setChips(refreshedChips);
  };

  const resetToFreshStart = () => {
    ChatCompletionService.clearContext(sessionId);
    ChatCompletionService.initializeContext(sessionId, context);
    setCampaignContext(null);
    setMessages([{
      id: `reset-${Date.now()}`,
      type: 'ai',
      content: getWelcomeMessage(context),
      timestamp: new Date()
    }]);
    setChips(getInitialChips(context));
  };

  const handleLoadIntoEditor = (emailData: any) => {
    console.log('Loading email into editor:', emailData);
    if (onEmailBuilderOpen && emailData) {
      onEmailBuilderOpen(emailData.html, emailData.subject);
    }
  };

  const placeholderText = {
    journeys: 'your customer journey challenge...',
    messages: 'your campaign idea...',
    snippets: 'your content optimization need...'
  };

  return (
    <div className="space-y-6">
      {/* Campaign Progress Indicator */}
      {campaignContext && context === 'messages' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">
              Campaign: {campaignContext.type || 'Type'} → {campaignContext.purpose || 'Purpose'} → {campaignContext.stage}
            </span>
          </div>
        </div>
      )}

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

      {/* Conversational Chips */}
      <div className="mb-6">
        <ConversationalChipGenerator
          chips={chips}
          onChipSelect={handleChipSelect}
          onRefreshChips={handleRefreshChips}
          onResetToStarter={resetToFreshStart}
          isLoading={isLoading}
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
