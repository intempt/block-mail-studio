
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Bot, User, Zap, Target } from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { ConversationalChipGenerator } from './ConversationalChipGenerator';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ChatCompletionService } from '@/services/chatCompletionService';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('UniversalConversationalInterface: Initializing with context:', context);
    console.log('UniversalConversationalInterface: onEmailBuilderOpen callback:', onEmailBuilderOpen);
    
    ChatCompletionService.initializeContext(sessionId, context);
    
    const welcomeMessage: Message = {
      id: `welcome-${context}`,
      type: 'ai',
      content: getWelcomeMessage(context),
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setChips(getInitialChips(context));
  }, [context, sessionId, onEmailBuilderOpen]);

  const getWelcomeMessage = (context: string): string => {
    const messages = {
      messages: "I can help you build email campaigns, SMS blasts, and push notifications from strategy to execution. What type of campaign would you like to create?",
      journeys: "I can help you map customer experiences, design touchpoints, and plan automation flows. What journey challenge can I help you solve?",
      snippets: "I can assist with subject lines, CTAs, personalization, and A/B testing strategies. What content challenge are you working on?"
    };
    return messages[context] || messages.messages;
  };

  const getInitialChips = (context: string): ConversationalChip[] => {
    const chipSets = {
      messages: [
        { id: 'email-campaign', label: 'Create an email campaign', type: 'starter' as const },
        { id: 'sms-campaign', label: 'Build an SMS campaign', type: 'starter' as const },
        { id: 'push-notification', label: 'Create push notifications', type: 'starter' as const },
        { id: 'rich-text-email', label: 'Design a rich text email', type: 'starter' as const }
      ],
      journeys: [
        { id: 'map-journey', label: 'Map a customer journey', type: 'starter' as const },
        { id: 'onboarding-flow', label: 'Design an onboarding flow', type: 'starter' as const },
        { id: 'retention-strategy', label: 'Build a retention strategy', type: 'starter' as const },
        { id: 'conversion-optimization', label: 'Optimize conversions', type: 'starter' as const }
      ],
      snippets: [
        { id: 'subject-lines', label: 'Write better subject lines', type: 'starter' as const },
        { id: 'cta-optimization', label: 'Optimize call-to-actions', type: 'starter' as const },
        { id: 'personalization', label: 'Add more personalization', type: 'starter' as const },
        { id: 'ab-testing', label: 'Plan A/B tests', type: 'starter' as const }
      ]
    };
    return chipSets[context] || chipSets.messages;
  };

  const handleSendMessage = async (message: string, mode: 'ask' | 'do') => {
    console.log('UniversalConversationalInterface: Sending message:', message, 'Mode:', mode);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      mode
    };

    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);
    setIsLoading(true);

    try {
      const response = await ChatCompletionService.processUserMessage(sessionId, message, mode);
      
      setIsThinking(false);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        emailData: response.emailData
      };

      setMessages(prev => [...prev, aiResponse]);

      if (response.campaignContext) {
        setCampaignContext(response.campaignContext);
      }

      const cleanedChips: ConversationalChip[] = response.suggestedChips.map((chip, index) => ({
        id: `chip-${Date.now()}-${index}`,
        label: chip.replace(/^-\s*/, '').trim(),
        type: 'contextual' as const
      }));
      setChips(cleanedChips);

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
    console.log('UniversalConversationalInterface: Chip selected:', chip.label);
    await handleSendMessage(chip.label, currentMode);
  };

  const handleLoadIntoEditor = (emailData: any) => {
    console.log('UniversalConversationalInterface: Loading email into editor:', emailData);
    console.log('UniversalConversationalInterface: onEmailBuilderOpen callback:', !!onEmailBuilderOpen);
    
    if (onEmailBuilderOpen && emailData) {
      const emailHTML = emailData.html || emailData.emailHTML || '';
      const subjectLine = emailData.subject || emailData.subjectLine || '';
      
      console.log('UniversalConversationalInterface: Calling onEmailBuilderOpen with HTML length:', emailHTML.length, 'Subject:', subjectLine);
      
      onEmailBuilderOpen(emailHTML, subjectLine);
    } else {
      console.error('UniversalConversationalInterface: Missing email data or callback:', { emailData, onEmailBuilderOpen });
    }
  };

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
              <MarkdownFormatter 
                content={message.content} 
                className={`text-left ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`} 
              />
              
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
    </div>
  );
};
