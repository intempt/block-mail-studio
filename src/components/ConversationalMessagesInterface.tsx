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

const MESSAGE_FOCUSED_STARTER_CHIPS: ConversationalChip[] = [
  { id: 'email-customers', label: 'Email my customers about something important', type: 'starter' },
  { id: 'welcome-new-users', label: 'Welcome new users to our platform', type: 'starter' },
  { id: 'promote-product', label: 'Promote a product or service', type: 'starter' },
  { id: 'send-newsletter', label: 'Create a newsletter or update', type: 'starter' },
  { id: 'urgent-announcement', label: 'Send an urgent announcement', type: 'starter' }
];

export const ConversationalMessagesInterface: React.FC<ConversationalMessagesInterfaceProps> = ({
  onEmailBuilderOpen
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<ConversationalChip[]>(MESSAGE_FOCUSED_STARTER_CHIPS);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingChips, setIsGeneratingChips] = useState(false);
  const [selectedMessageType, setSelectedMessageType] = useState<string | null>(null);
  const [conversationDepth, setConversationDepth] = useState(0);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'What kind of message would you like to create? Select a message type below or describe your campaign needs.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const generateProgressiveChips = async (userMessage: string, aiResponse: string, depth: number) => {
    setIsGeneratingChips(true);
    try {
      let prompt = '';
      
      if (depth <= 1) {
        // Early conversation - gather basic details
        prompt = `Based on this message creation conversation:

User: "${userMessage}"
AI: "${aiResponse}"

Generate 5 follow-up questions to gather essential details for creating their message. Focus on:
- Target audience
- Main goal/purpose
- Message type (email, SMS, etc.)
- Tone and urgency
- Key content points

Return as JSON: {"suggestions": ["question 1", "question 2", "question 3", "question 4", "question 5"]}`;
      } else if (depth <= 3) {
        // Mid conversation - get specific requirements
        prompt = `Based on this ongoing message creation conversation:

User latest: "${userMessage}"
AI response: "${aiResponse}"
Conversation depth: ${depth}

Generate 5 specific follow-up questions to finalize message details. Focus on:
- Specific content requirements
- Call-to-action needs
- Design preferences
- Timing and scheduling
- Ready to create options

Return as JSON: {"suggestions": ["question 1", "question 2", "question 3", "question 4", "question 5"]}`;
      } else {
        // Deep conversation - push toward creation
        prompt = `Based on this detailed message creation conversation:

User latest: "${userMessage}"
AI response: "${aiResponse}"
Conversation depth: ${depth}

Generate 5 action-oriented suggestions to move toward message creation:
- "Ready to create this message"
- "Generate email content now"
- "Open the email builder"
- Refinement options
- Alternative approaches

Return as JSON: {"suggestions": ["action 1", "action 2", "action 3", "action 4", "action 5"]}`;
      }

      const response = await OpenAIEmailService.callOpenAI(prompt, 2, true);
      
      if (response.suggestions && Array.isArray(response.suggestions)) {
        const contextualChips: ConversationalChip[] = response.suggestions.map((suggestion: string, index: number) => ({
          id: `contextual-${Date.now()}-${index}`,
          label: suggestion,
          type: 'contextual' as const
        }));

        setChips([...MESSAGE_FOCUSED_STARTER_CHIPS, ...contextualChips]);
      } else {
        // Fallback chips based on conversation depth
        setChips([...MESSAGE_FOCUSED_STARTER_CHIPS, ...getFallbackChips(depth)]);
      }
    } catch (error) {
      console.error('Error generating contextual chips:', error);
      // Use fallback chips on error
      setChips([...MESSAGE_FOCUSED_STARTER_CHIPS, ...getFallbackChips(depth)]);
    } finally {
      setIsGeneratingChips(false);
    }
  };

  const getFallbackChips = (depth: number): ConversationalChip[] => {
    if (depth <= 1) {
      return [
        { id: 'fb-audience', label: 'Who is the target audience?', type: 'contextual' },
        { id: 'fb-goal', label: 'What\'s the main goal?', type: 'contextual' },
        { id: 'fb-tone', label: 'What tone should it have?', type: 'contextual' },
        { id: 'fb-urgent', label: 'Is this time-sensitive?', type: 'contextual' }
      ];
    } else if (depth <= 3) {
      return [
        { id: 'fb-content', label: 'What specific content to include?', type: 'contextual' },
        { id: 'fb-cta', label: 'What action should recipients take?', type: 'contextual' },
        { id: 'fb-design', label: 'Any design preferences?', type: 'contextual' },
        { id: 'fb-timing', label: 'When should this be sent?', type: 'contextual' }
      ];
    } else {
      return [
        { id: 'fb-create', label: 'Ready to create this message', type: 'contextual' },
        { id: 'fb-generate', label: 'Generate email content now', type: 'contextual' },
        { id: 'fb-builder', label: 'Open the email builder', type: 'contextual' },
        { id: 'fb-refine', label: 'Refine the requirements', type: 'contextual' }
      ];
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
    setIsLoading(true);

    try {
      // Handle Do mode for email creation
      if (mode === 'do' && conversationDepth >= 2) {
        if (message.toLowerCase().includes('email') || selectedMessageType) {
          // Generate email and open builder
          const response = await OpenAIEmailService.generateEmailContent({
            prompt: `Create an email based on this conversation: ${message}`,
            emailType: 'promotional',
            tone: 'professional'
          });

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: 'Perfect! I\'ve generated your email content. Opening the email builder now...',
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
      await generateProgressiveChips(message, response, conversationDepth);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I had trouble processing that. Could you tell me more about the message you want to create?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipSelect = async (chip: ConversationalChip) => {
    // Track message type from starter chips
    if (chip.type === 'starter') {
      setSelectedMessageType(chip.id);
    }

    const chipMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chip.label,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, chipMessage]);
    setConversationDepth(prev => prev + 1);
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
      await generateProgressiveChips(chip.label, response, conversationDepth);

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
      await generateProgressiveChips(lastUserMessage.content, lastAiMessage.content, conversationDepth);
    }
  };

  const resetToStarterChips = () => {
    setChips(MESSAGE_FOCUSED_STARTER_CHIPS);
    setSelectedMessageType(null);
    setConversationDepth(0);
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
        context="messages"
      />
    </div>
  );
};
