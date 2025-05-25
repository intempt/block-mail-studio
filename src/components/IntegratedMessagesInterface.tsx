
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  User, 
  Plus
} from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { SmartChipGenerator, getStarterChips } from './SmartChipGenerator';
import { MessagesTable } from './MessagesTable';
import { ConversationalChipService } from '@/services/conversationalChipService';
import { OpenAIEmailService } from '@/services/openAIEmailService';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  mode?: 'ask' | 'do';
}

interface Chip {
  id: string;
  label: string;
  type: 'starter' | 'contextual';
}

interface IntegratedMessagesInterfaceProps {
  onEmailBuilderOpen: (emailHTML?: string, subjectLine?: string) => void;
}

export const IntegratedMessagesInterface: React.FC<IntegratedMessagesInterfaceProps> = ({
  onEmailBuilderOpen
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<Chip[]>(getStarterChips());
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'What would you like to create? Select one of the options below or describe what you need.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (message: string, mode: 'ask' | 'do') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      mode
    };

    setMessages(prev => [...prev, userMessage]);
    const newHistory = [...conversationHistory, message];
    setConversationHistory(newHistory);
    setIsLoading(true);

    try {
      // Handle Do mode for email creation
      if (mode === 'do') {
        if (!ConversationalChipService.canCreateEmail(newHistory)) {
          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: 'I need a bit more context to create your email. Please provide more details about what you want to create.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorResponse]);
          setIsLoading(false);
          return;
        }

        // Generate email content and open builder
        const emailGenerationPrompt = `Create an email based on this conversation: ${newHistory.join(' ')}. Latest request: ${message}`;
        
        const emailResponse = await OpenAIEmailService.generateEmailContent({
          prompt: emailGenerationPrompt,
          emailType: 'promotional',
          tone: 'professional'
        });

        const successResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Perfect! I\'ve created your email based on our conversation. Opening the email builder now...',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, successResponse]);
        
        setTimeout(() => {
          onEmailBuilderOpen(emailResponse.html, emailResponse.subject);
        }, 1000);
        
        setIsLoading(false);
        return;
      }

      // Regular conversational response
      const response = await OpenAIEmailService.conversationalResponse({
        userMessage: message,
        conversationContext: newHistory.slice(-3),
        currentEmailContent: ''
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      // Generate new contextual chips
      const contextualChips = await ConversationalChipService.generateContextualChips(newHistory, message);
      const newChips: Chip[] = contextualChips.map((chip, index) => ({
        id: `contextual-${Date.now()}-${index}`,
        label: chip,
        type: 'contextual'
      }));

      setChips([...getStarterChips(), ...newChips]);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I had trouble processing that. Could you tell me more about what you want to create?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipSelect = async (chip: Chip) => {
    const chipMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chip.label,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, chipMessage]);
    const newHistory = [...conversationHistory, chip.label];
    setConversationHistory(newHistory);
    setIsLoading(true);

    try {
      const response = await OpenAIEmailService.conversationalResponse({
        userMessage: chip.label,
        conversationContext: newHistory.slice(-3),
        currentEmailContent: ''
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      // Generate new contextual chips
      const contextualChips = await ConversationalChipService.generateContextualChips(newHistory, chip.label);
      const newChips: Chip[] = contextualChips.map((contextChip, index) => ({
        id: `contextual-${Date.now()}-${index}`,
        label: contextChip,
        type: 'contextual'
      }));

      setChips([...getStarterChips(), ...newChips]);
    } catch (error) {
      console.error('Error processing chip selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshChips = async () => {
    if (conversationHistory.length === 0) return;
    
    setIsLoading(true);
    try {
      const refreshedChips = await ConversationalChipService.generateContextualChips(
        conversationHistory, 
        conversationHistory[conversationHistory.length - 1]
      );
      const newChips: Chip[] = refreshedChips.map((chip, index) => ({
        id: `refresh-${Date.now()}-${index}`,
        label: chip,
        type: 'contextual'
      }));

      setChips([...getStarterChips(), ...newChips]);
    } catch (error) {
      console.error('Error refreshing chips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setConversationHistory([]);
    setChips(getStarterChips());
    const resetMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: 'Conversation reset. What would you like to create?',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, resetMessage]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Create and manage your email, SMS, and push campaigns</p>
        </div>
        <div className="flex gap-3">
          {conversationHistory.length > 0 && (
            <Button 
              variant="outline" 
              onClick={resetConversation}
              className="text-gray-600"
            >
              Fresh Start
            </Button>
          )}
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Message
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          {/* Conversation Progress Indicator */}
          {conversationHistory.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  Conversation depth: {conversationHistory.length} messages
                </span>
                {ConversationalChipService.canCreateEmail(conversationHistory) && (
                  <span className="text-xs text-green-700 font-medium">
                    ✓ Ready for "Do" mode
                  </span>
                )}
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

          {/* Smart Chips */}
          <div className="mb-6">
            <SmartChipGenerator
              chips={chips}
              onChipSelect={handleChipSelect}
              onRefreshChips={handleRefreshChips}
              isLoading={isLoading}
            />
          </div>

          {/* Enhanced Input */}
          <EnhancedChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="what you need..."
          />
        </div>
      </Card>

      {/* Messages Table */}
      <MessagesTable />
    </div>
  );
};
