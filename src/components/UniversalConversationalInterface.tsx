import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Bot, User, Zap, Target } from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { ConversationalChipGenerator } from './ConversationalChipGenerator';
import { StreamingMessage } from './StreamingMessage';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ScrollToBottomButton } from './ScrollToBottomButton';
import { ChatCompletionService } from '@/services/chatCompletionService';
import { StreamingChatService } from '@/services/streamingChatService';
import { MarkdownFormatter } from './MarkdownFormatter';

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
  const [currentMode, setCurrentMode] = useState<'ask' | 'do'>('ask');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsThinking(false);
      setIsLoading(true);

      const streamingMessageId = (Date.now() + 1).toString();
      const streamingMessage: Message = {
        id: streamingMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, streamingMessage]);
      
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

        if (chunk.isComplete) {
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
    }
  };

  const handleChipSelect = async (chip: ConversationalChip) => {
    await handleSendMessage(chip.label, currentMode);
  };

  const handleLoadIntoEditor = (emailData: any) => {
    console.log('Loading email into editor:', emailData);
    
    if (onEmailBuilderOpen && emailData) {
      const emailHTML = emailData.html || emailData.emailHTML || '';
      const subjectLine = emailData.subject || emailData.subjectLine || '';
      
      console.log('Mapped data - HTML:', emailHTML.substring(0, 100) + '...', 'Subject:', subjectLine);
      
      onEmailBuilderOpen(emailHTML, subjectLine);
    } else {
      console.error('Missing email data or callback:', { emailData, onEmailBuilderOpen });
    }
  };

  // Add scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      // Show button when user is more than 200px from bottom
      setShowScrollButton(distanceFromBottom > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      // Only auto-scroll if user is near the bottom (within 300px)
      if (distanceFromBottom < 300) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        setUnreadCount(0);
      } else {
        // User is scrolled up, increment unread count
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  };

  const placeholderText = {
    journeys: 'your customer journey challenge...',
    messages: 'your campaign idea...',
    snippets: 'your content optimization need...'
  };

  return (
    <div className="flex flex-col space-y-6 relative">
      {campaignContext && context === 'messages' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-blue-800">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">
              Campaign: {campaignContext.type || 'Type'} → {campaignContext.purpose || 'Purpose'} → {campaignContext.stage}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {(message.type === 'ai' || message.type === 'system') && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[70%] rounded-xl p-4 text-left ${
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
                  className={`text-left ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}
                />
              ) : (
                <MarkdownFormatter 
                  content={message.content} 
                  className={`text-left ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`} 
                />
              )}
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex items-center gap-2">
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
        ))}
        
        {isThinking && <ThinkingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-4">
        <ConversationalChipGenerator
          chips={chips}
          onChipSelect={handleChipSelect}
          onRefreshChips={() => {}}
          onResetToStarter={() => {}}
          isLoading={isLoading}
          currentMode={currentMode}
        />

        <EnhancedChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={placeholderText[context]}
          context={context}
          onModeChange={setCurrentMode}
          disableDoMode={context !== 'messages'}
        />
      </div>

      <ScrollToBottomButton
        isVisible={showScrollButton}
        unreadCount={unreadCount}
        onClick={scrollToBottom}
      />
    </div>
  );
};
