import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Bot, User, Zap, Target } from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { SimpleConversationalInput } from './SimpleConversationalInput';
import { ConversationalChipGenerator } from './ConversationalChipGenerator';
import { ScrollToBottomButton } from './ScrollToBottomButton';
import { StreamingMessage } from './StreamingMessage';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ChatCompletionService } from '@/services/chatCompletionService';
import { StreamingChatService } from '@/services/streamingChatService';
import { MarkdownFormatter } from './MarkdownFormatter';
import { useAutoScroll } from '@/hooks/useAutoScroll';

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
  isStreaming?: boolean;
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
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [campaignContext, setCampaignContext] = useState<any>(null);
  
  const {
    scrollRef,
    isNearBottom,
    unreadCount,
    scrollToBottom,
    scrollToBottomIfNeeded
  } = useAutoScroll({ threshold: 100 });

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
        { id: 'email-campaign', label: 'I want to create an email campaign', type: 'starter' as const },
        { id: 'sms-campaign', label: 'I need to build an SMS campaign', type: 'starter' as const },
        { id: 'push-notification', label: 'Help me create push notifications', type: 'starter' as const },
        { id: 'rich-text-email', label: 'I want to design a rich text email', type: 'starter' as const }
      ],
      journeys: [
        { id: 'map-journey', label: 'I need to map a customer journey', type: 'starter' as const },
        { id: 'onboarding-flow', label: 'Help me design an onboarding flow', type: 'starter' as const },
        { id: 'retention-strategy', label: 'I want to build a retention strategy', type: 'starter' as const },
        { id: 'conversion-optimization', label: 'Show me how to optimize conversions', type: 'starter' as const }
      ],
      snippets: [
        { id: 'subject-lines', label: 'I need help writing better subject lines', type: 'starter' as const },
        { id: 'cta-optimization', label: 'Help me optimize my call-to-actions', type: 'starter' as const },
        { id: 'personalization', label: 'I want to add more personalization', type: 'starter' as const },
        { id: 'ab-testing', label: 'Show me how to plan A/B tests', type: 'starter' as const }
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
    setIsThinking(true);
    
    // Auto-scroll when user sends message
    setTimeout(scrollToBottomIfNeeded, 100);

    try {
      // Show thinking indicator
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsThinking(false);
      setIsLoading(true);

      // Create streaming message
      const streamingMessageId = (Date.now() + 1).toString();
      const streamingMessage: Message = {
        id: streamingMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, streamingMessage]);
      
      // Start streaming response
      const streamGenerator = StreamingChatService.streamResponse(message);
      
      for await (const chunk of streamGenerator) {
        if (chunk.error) {
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessageId 
              ? { ...msg, content: 'I had trouble processing that. Please try again.', isStreaming: false }
              : msg
          ));
          break;
        }

        setMessages(prev => prev.map(msg => 
          msg.id === streamingMessageId 
            ? { ...msg, content: chunk.content, isStreaming: !chunk.isComplete }
            : msg
        ));

        // Auto-scroll during streaming if user is near bottom
        scrollToBottomIfNeeded();

        if (chunk.isComplete) {
          // Get actual AI response for functionality
          try {
            const response = await ChatCompletionService.processUserMessage(sessionId, message, mode);
            
            setMessages(prev => prev.map(msg => 
              msg.id === streamingMessageId 
                ? { 
                    ...msg, 
                    content: response.content, 
                    isStreaming: false, 
                    emailData: response.emailData 
                  }
                : msg
            ));

            // Update campaign context and chips
            if (response.campaignContext) {
              setCampaignContext(response.campaignContext);
            }

            const newChips: ConversationalChip[] = response.suggestedChips.map((chip, index) => ({
              id: `chip-${Date.now()}-${index}`,
              label: chip,
              type: 'contextual' as const
            }));
            setChips(newChips);

          } catch (error) {
            console.error('Error getting actual response:', error);
            setMessages(prev => prev.map(msg => 
              msg.id === streamingMessageId 
                ? { ...msg, content: chunk.content, isStreaming: false }
                : msg
            ));
          }
          break;
        }
      }

    } catch (error) {
      console.error('Error processing message:', error);
      setIsThinking(false);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I had trouble processing that. Let's focus on your ${context} goals - what specific challenge can I help you solve?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottomIfNeeded, 100);
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
      // Properly map the email data structure to the expected parameters
      const emailHTML = emailData.html || emailData.emailHTML || '';
      const subjectLine = emailData.subject || emailData.subjectLine || '';
      
      console.log('Mapped data - HTML:', emailHTML.substring(0, 100) + '...', 'Subject:', subjectLine);
      
      // Call the email builder with proper parameters
      onEmailBuilderOpen(emailHTML, subjectLine);
    } else {
      console.error('Missing email data or callback:', { emailData, onEmailBuilderOpen });
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

      {/* Chat Messages with Enhanced Scrolling */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="h-64 mb-6 overflow-y-auto scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="space-y-4 pr-2">
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
                    {message.isStreaming ? (
                      <StreamingMessage 
                        content={message.content}
                        isComplete={false}
                        isStreaming={true}
                        className={message.type === 'user' ? 'text-white' : 'text-gray-900'}
                      />
                    ) : (
                      <MarkdownFormatter 
                        content={message.content} 
                        className={message.type === 'user' ? 'text-white' : 'text-gray-900'} 
                      />
                    )}
                    
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
                        {message.emailData && message.emailData.html && (
                          <button
                            onClick={() => handleLoadIntoEditor(message.emailData)}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1 transition-colors"
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
            
            {isThinking && <ThinkingIndicator />}
          </div>
        </div>

        <ScrollToBottomButton
          isVisible={!isNearBottom}
          unreadCount={unreadCount}
          onClick={scrollToBottom}
        />
      </div>

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
