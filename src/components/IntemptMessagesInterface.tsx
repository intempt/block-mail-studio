
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Mail, 
  MessageSquare, 
  Bell,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DynamicChipGenerator } from './DynamicChipGenerator';
import { ChannelRouter } from './ChannelRouter';
import { ConversationalFlow } from './ConversationalFlow';
import { ChatContextService } from '@/services/chatContextService';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  chips?: string[];
  channelType?: 'email' | 'sms' | 'push';
  messageFormat?: 'html' | 'rich-text';
}

interface IntemptMessagesInterfaceProps {
  onEmailBuilderOpen: (emailHTML?: string, subjectLine?: string) => void;
}

export const IntemptMessagesInterface: React.FC<IntemptMessagesInterfaceProps> = ({
  onEmailBuilderOpen
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'ask' | 'message' | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'push' | null>(null);
  const [showConversation, setShowConversation] = useState(false);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'What kind of message is next? Describe your email, SMS or push task and let AI help you build it.',
      timestamp: new Date(),
      chips: ['Email Campaign', 'SMS Blast', 'Push Notification', 'Welcome Series', 'Product Launch']
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleChipSelect = async (chip: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chip,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Detect channel and generate follow-up chips
      const channelDetection = await ChannelRouter.detectChannel(chip);
      const followUpChips = await DynamicChipGenerator.generateContextualChips(chip, channelDetection.channel);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Great! I'll help you create a ${channelDetection.channel} message. Let me understand your needs better.`,
        timestamp: new Date(),
        chips: followUpChips,
        channelType: channelDetection.channel,
        messageFormat: channelDetection.format
      };

      setMessages(prev => [...prev, aiResponse]);
      setSelectedChannel(channelDetection.channel);

      // Update context service
      ChatContextService.updateContext({
        emailType: channelDetection.channel,
        mode: 'agentic',
        userGoals: [chip]
      });

    } catch (error) {
      console.error('Error processing chip selection:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I had trouble processing that. Could you tell me more about what you want to create?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSelect = (selectedMode: 'ask' | 'message') => {
    setMode(selectedMode);
    setShowConversation(true);
    
    const modeMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: `Switched to ${selectedMode} mode`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, modeMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Generate dynamic chips based on conversation context
      const contextualChips = await DynamicChipGenerator.generateFromConversation(inputMessage, messages);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand. Let me help you with that.',
        timestamp: new Date(),
        chips: contextualChips
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showConversation) {
    return (
      <ConversationalFlow
        messages={messages}
        mode={mode!}
        channelType={selectedChannel}
        onEmailBuilderOpen={onEmailBuilderOpen}
        onBack={() => setShowConversation(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Intempt Growth Messages
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered message creation for email, SMS, and push notifications
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="bg-white shadow-xl border-0">
          <ScrollArea className="h-96 p-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {(message.type === 'ai' || message.type === 'system') && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] rounded-xl p-4 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'system'
                        ? 'bg-gray-100 text-gray-700 text-sm'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Dynamic Chips */}
                  {message.chips && message.chips.length > 0 && (
                    <div className="mt-4 ml-12">
                      <div className="flex flex-wrap gap-2">
                        {message.chips.map((chip, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleChipSelect(chip)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                            disabled={isLoading}
                          >
                            <Sparkles className="w-3 h-3 mr-2" />
                            {chip}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mode Selection */}
                  {selectedChannel && !mode && message.type === 'ai' && (
                    <div className="mt-4 ml-12">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-3">Choose your approach:</p>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleModeSelect('ask')}
                            variant="outline"
                            className="flex-1 h-auto p-3"
                          >
                            <div className="text-center">
                              <MessageSquare className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                              <div className="font-medium">Ask</div>
                              <div className="text-xs text-gray-600">Plan and discuss</div>
                            </div>
                          </Button>
                          <Button
                            onClick={() => handleModeSelect('message')}
                            className="flex-1 h-auto p-3 bg-blue-600 hover:bg-blue-700"
                          >
                            <div className="text-center">
                              <ArrowRight className="w-5 h-5 mx-auto mb-2" />
                              <div className="font-medium">Message</div>
                              <div className="text-xs opacity-90">Start creating</div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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
          
          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe your message needs..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-gray-300 focus:border-blue-500 h-12"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Channel Icons */}
        <div className="flex justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-5 h-5" />
            <span className="text-sm">Email</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm">SMS</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Bell className="w-5 h-5" />
            <span className="text-sm">Push</span>
          </div>
        </div>
      </div>
    </div>
  );
};
