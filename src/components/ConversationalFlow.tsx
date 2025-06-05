
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, Bot, User, Send, Mail, MessageSquare, Bell,
  CheckCircle, ArrowRight
} from 'lucide-react';
import { EmailAIService } from '@/services/EmailAIService';
import { ChannelRouter } from './ChannelRouter';
import { ConversationalSMSBuilder } from './ConversationalSMSBuilder';
import { ConversationalPushBuilder } from './ConversationalPushBuilder';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  chips?: string[];
  emailData?: {
    subject: string;
    html: string;
    previewText: string;
  };
}

interface ConversationalFlowProps {
  messages: Message[];
  mode: 'ask' | 'message';
  channelType: 'email' | 'sms' | 'push' | null;
  onEmailBuilderOpen: (emailHTML?: string, subjectLine?: string) => void;
  onBack: () => void;
}

export const ConversationalFlow: React.FC<ConversationalFlowProps> = ({
  messages: initialMessages,
  mode,
  channelType,
  onEmailBuilderOpen,
  onBack
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChannelBuilder, setShowChannelBuilder] = useState(false);

  useEffect(() => {
    // Add mode introduction message
    const modeIntro = mode === 'ask' 
      ? "I'm in Ask mode - I'll help you plan and discuss your message strategy."
      : "I'm in Message mode - Let's create your message step by step.";

    const introMessage: Message = {
      id: `mode-${Date.now()}`,
      type: 'ai',
      content: modeIntro,
      timestamp: new Date(),
      chips: mode === 'message' && channelType === 'email' 
        ? ['Start Building', 'Set Requirements', 'Choose Template']
        : ['Tell me more', 'What\'s the goal?', 'Who\'s the audience?']
    };

    setMessages(prev => [...prev, introMessage]);
  }, [mode, channelType]);

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
      if (mode === 'message' && channelType === 'email') {
        // Generate email directly
        const emailResponse = await EmailAIService.generateEmail({
          prompt: inputMessage,
          tone: 'professional',
          type: 'announcement'
        });

        if (emailResponse.success && emailResponse.data) {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I've created your email! Here's what I came up with:\n\n**Subject:** ${emailResponse.data.subject}\n**Preview:** ${emailResponse.data.previewText}\n\nWould you like to open it in the visual editor to customize further?`,
            timestamp: new Date(),
            chips: ['Open in Editor', 'Refine Content', 'Change Tone', 'Start Over'],
            emailData: emailResponse.data
          };

          setMessages(prev => [...prev, aiResponse]);
        } else {
          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: 'I encountered an issue generating your email. Let me try a different approach.',
            timestamp: new Date(),
            chips: ['Try again', 'Manual entry', 'Choose template']
          };
          setMessages(prev => [...prev, errorResponse]);
        }
      } else {
        // General conversation response
        const response = await EmailAIService.getConversationalResponse(inputMessage);
        
        if (response.success && response.data) {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: response.data,
            timestamp: new Date(),
            chips: ['Continue', 'More details', 'Examples', 'Next step']
          };

          setMessages(prev => [...prev, aiResponse]);
        } else {
          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: 'I\'m having trouble processing that request. Could you try rephrasing it?',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorResponse]);
        }
      }
    } catch (error) {
      console.error('Error in conversation:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I encountered an error. Let me help you in a different way.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    if (chip === 'Open in Editor' || chip === 'Start Building') {
      const lastEmailMessage = messages.slice().reverse().find(m => m.emailData);
      if (lastEmailMessage?.emailData) {
        onEmailBuilderOpen(lastEmailMessage.emailData.html, lastEmailMessage.emailData.subject);
        return;
      }
    }

    setInputMessage(chip);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Show specialized builders for non-email channels
  if (showChannelBuilder && channelType === 'sms') {
    return (
      <ConversationalSMSBuilder
        initialMessages={messages}
        onBack={() => setShowChannelBuilder(false)}
      />
    );
  }

  if (showChannelBuilder && channelType === 'push') {
    return (
      <ConversationalPushBuilder
        initialMessages={messages}
        onBack={() => setShowChannelBuilder(false)}
      />
    );
  }

  const getChannelIcon = () => {
    switch (channelType) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              {getChannelIcon()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {channelType} {mode} Mode
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'ask' ? 'Planning and discussion' : 'Creating your message'}
              </p>
            </div>
          </div>

          {channelType !== 'email' && (
            <Button
              onClick={() => setShowChannelBuilder(true)}
              variant="outline"
              className="text-gray-600"
            >
              {getChannelIcon()}
              <span className="ml-2">Open {channelType.toUpperCase()} Builder</span>
            </Button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <Card className="h-full flex flex-col bg-white">
          <ScrollArea className="flex-1 p-6">
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

                  {/* Chips */}
                  {message.chips && message.chips.length > 0 && (
                    <div className="mt-4 ml-12">
                      <div className="flex flex-wrap gap-2">
                        {message.chips.map((chip, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleChipClick(chip)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            disabled={isLoading}
                          >
                            {chip}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Email Preview */}
                  {message.emailData && (
                    <div className="mt-4 ml-12">
                      <Card className="p-4 bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-blue-900 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Ready
                          </h4>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-sm text-blue-800">
                          <p><strong>Subject:</strong> {message.emailData.subject}</p>
                          <p><strong>Preview:</strong> {message.emailData.previewText}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onEmailBuilderOpen(message.emailData!.html, message.emailData!.subject)}
                          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Open in Visual Editor
                        </Button>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white animate-pulse" />
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
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Continue the conversation..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-gray-300 focus:border-blue-500"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
