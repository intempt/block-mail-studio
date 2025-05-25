
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  User, 
  Plus,
  Sparkles
} from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { SmartChipGenerator, getStarterChips } from './SmartChipGenerator';
import { MessagesTable } from './MessagesTable';
import { DynamicChipGenerator } from './DynamicChipGenerator';
import { ChannelRouter } from './ChannelRouter';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  mode?: 'ask' | 'message';
}

interface Chip {
  id: string;
  label: string;
  type: 'starter' | 'contextual';
  category?: 'email' | 'sms' | 'push' | 'general';
  icon?: React.ReactNode;
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
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'push' | null>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'What kind of message is next? Describe your email, SMS or push task and let AI help you build it.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (message: string, mode: 'ask' | 'message') => {
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
      // Detect channel from user input
      const channelDetection = await ChannelRouter.detectChannel(message);
      setSelectedChannel(channelDetection.channel);

      // Generate contextual chips
      const contextualChips = await DynamicChipGenerator.generateContextualChips(
        message, 
        channelDetection.channel
      );

      // Convert to our chip format
      const newChips: Chip[] = contextualChips.map((chip, index) => ({
        id: `contextual-${index}`,
        label: chip,
        type: 'contextual',
        category: channelDetection.channel
      }));

      setChips([...getStarterChips(), ...newChips]);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I'll help you create a ${channelDetection.channel} message in ${mode} mode. ${
          mode === 'ask' 
            ? 'Let me understand your requirements better.' 
            : 'Let\'s start building it right away.'
        }`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      // If HTML email in message mode, transition to builder
      if (channelDetection.channel === 'email' && 
          channelDetection.format === 'html' && 
          mode === 'message') {
        setTimeout(() => {
          onEmailBuilderOpen();
        }, 1000);
      }

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
    setIsLoading(true);

    try {
      if (chip.type === 'starter') {
        setSelectedChannel(chip.category as 'email' | 'sms' | 'push');
        
        // Generate follow-up chips based on starter selection
        const followUpChips = await DynamicChipGenerator.generateContextualChips(
          chip.label,
          chip.category as 'email' | 'sms' | 'push'
        );

        const newChips: Chip[] = followUpChips.map((followUp, index) => ({
          id: `followup-${index}`,
          label: followUp,
          type: 'contextual',
          category: chip.category
        }));

        setChips([...getStarterChips(), ...newChips]);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Great choice! I'll help you create ${chip.label.toLowerCase()}. What would you like to focus on?`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error processing chip selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshChips = async () => {
    if (messages.length === 0) return;
    
    setIsLoading(true);
    try {
      const lastUserMessage = messages.slice().reverse().find(m => m.type === 'user');
      if (lastUserMessage && selectedChannel) {
        const refreshedChips = await DynamicChipGenerator.generateContextualChips(
          lastUserMessage.content,
          selectedChannel
        );

        const newChips: Chip[] = refreshedChips.map((chip, index) => ({
          id: `refresh-${index}`,
          label: chip,
          type: 'contextual',
          category: selectedChannel
        }));

        setChips([...getStarterChips(), ...newChips]);
      }
    } catch (error) {
      console.error('Error refreshing chips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Create and manage your email, SMS, and push campaigns</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Message
        </Button>
      </div>

      {/* Chat Interface */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
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
            placeholder="your message needs..."
          />
        </div>
      </Card>

      {/* Messages Table */}
      <MessagesTable />
    </div>
  );
};
