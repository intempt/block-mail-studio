import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  User, 
  Send, 
  ArrowLeft,
  Sparkles,
  Mail,
  FileText,
  Zap,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { EmailTemplate } from './TemplateManager';
import { emailAIService } from '@/services/EmailAIService';
import { ChatContextService } from '@/services/chatContextService';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'error';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  emailData?: {
    subject: string;
    html: string;
    previewText: string;
  };
}

interface AgenticAIEngineProps {
  initialPrompt: string;
  mode: 'ask' | 'mail';
  templates: EmailTemplate[];
  onComplete: (emailHTML?: string, subjectLine?: string) => void;
  onBack: () => void;
}

export const AgenticAIEngine: React.FC<AgenticAIEngineProps> = ({
  initialPrompt,
  mode,
  templates,
  onComplete,
  onBack
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize conversation with user's task
    const initialMessage: Message = {
      id: '1',
      type: 'user',
      content: initialPrompt,
      timestamp: new Date()
    };

    const welcomeMessage: Message = {
      id: '2',
      type: 'ai',
      content: `Perfect! I'll help you ${mode === 'mail' ? 'create an email' : 'with your task'}. Let me understand what you need better.`,
      timestamp: new Date(),
      suggestions: [
        'What type of email is this?',
        'Who is the target audience?',
        'What\'s the main goal?',
        'Any specific requirements?'
      ]
    };

    setMessages([initialMessage, welcomeMessage]);
    
    // Update context service
    ChatContextService.updateContext({
      mode: 'agentic',
      userGoals: [initialPrompt],
      emailType: mode === 'mail' ? 'email-creation' : 'general'
    });

    // Auto-process initial prompt if it's detailed enough
    if (initialPrompt.length > 20) {
      processInitialPrompt(initialPrompt);
    }
  }, [initialPrompt, mode]);

  const processInitialPrompt = async (prompt: string) => {
    setIsLoading(true);
    try {
      if (mode === 'mail' && (prompt.toLowerCase().includes('create') || prompt.toLowerCase().includes('email'))) {
        const emailResponse = await emailAIService.generateEmail({
          prompt,
          tone: 'professional',
          type: 'announcement'
        });

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I've created a draft email based on your request!\n\n**Subject:** ${emailResponse.subject}\n**Preview:** ${emailResponse.previewText}\n\nWould you like me to refine anything or shall we move to the editor?`,
          timestamp: new Date(),
          suggestions: [
            'Move to editor',
            'Make it more casual',
            'Add urgency',
            'Change the tone'
          ],
          emailData: emailResponse
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        const response = await emailAIService.getConversationalResponse(prompt);
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response,
          timestamp: new Date(),
          suggestions: [
            'Tell me more',
            'Show examples',
            'Start creating',
            'Choose template'
          ]
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Error processing initial prompt:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'I\'m having trouble connecting to AI services right now. Let\'s work with what we have and I\'ll help guide you through the process manually.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    ChatContextService.addToHistory('user', inputMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (inputMessage.toLowerCase().includes('move to editor') || inputMessage.toLowerCase().includes('open editor')) {
        // Find the most recent email data
        const lastEmailMessage = messages.slice().reverse().find(m => m.emailData);
        if (lastEmailMessage?.emailData) {
          onComplete(lastEmailMessage.emailData.html, lastEmailMessage.emailData.subject);
          return;
        }
      }

      const response = await emailAIService.getConversationalResponse(
        inputMessage,
        ChatContextService.getRecentContext(3).split('\n')
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        suggestions: [
          'Create email',
          'Show templates',
          'Refine request',
          'Move to editor'
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      ChatContextService.addToHistory('ai', response);
    } catch (error) {
      console.error('AI response error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'I\'m having trouble processing that request. Could you try rephrasing it?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Move to editor') {
      const lastEmailMessage = messages.slice().reverse().find(m => m.emailData);
      if (lastEmailMessage?.emailData) {
        onComplete(lastEmailMessage.emailData.html, lastEmailMessage.emailData.subject);
        return;
      }
    }
    setInputMessage(suggestion);
    setTimeout(() => sendMessage(), 100);
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
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-600">
                {mode === 'mail' ? 'Creating your email' : 'Understanding your task'}
              </p>
            </div>
          </div>

          <Button
            onClick={() => onComplete()}
            variant="outline"
            className="text-gray-600"
          >
            <FileText className="w-4 h-4 mr-2" />
            Skip to Editor
          </Button>
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
                    {(message.type === 'ai' || message.type === 'error') && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'error' ? 'bg-red-500' : 'bg-blue-600'
                      }`}>
                        {message.type === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] rounded-xl p-4 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-800'
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

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 ml-12">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Quick Actions
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="justify-start h-auto p-2 text-xs hover:bg-gray-50"
                              disabled={isLoading}
                            >
                              <Zap className="w-3 h-3 mr-2 text-blue-500" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
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
                            Email Draft Ready
                          </h4>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-sm text-blue-800">
                          <p><strong>Subject:</strong> {message.emailData.subject}</p>
                          <p><strong>Preview:</strong> {message.emailData.previewText}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onComplete(message.emailData!.html, message.emailData!.subject)}
                          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Open in Editor
                        </Button>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
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
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 border-gray-300 focus:border-blue-500"
              />
              <Button 
                onClick={sendMessage} 
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
