import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Sparkles, 
  Image, 
  Type, 
  Layout, 
  Palette,
  FileText,
  Zap,
  Target,
  BarChart3,
  Users,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Wand2,
  Loader2
} from 'lucide-react';
import { emailAIService } from '@/services/EmailAIService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isLoading?: boolean;
}

interface EmailAIChatProps {
  editor: Editor | null;
  onEmailGenerated?: (html: string) => void;
}

export const EmailAIChat: React.FC<EmailAIChatProps> = ({ editor, onEmailGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI email assistant powered by OpenAI. I can help you create stunning emails, generate images, suggest improvements, and optimize for better performance. What would you like to work on today?',
      timestamp: new Date(),
      suggestions: [
        'Create a welcome email series',
        'Design a product announcement',
        'Build a newsletter template',
        'Generate professional images'
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { 
      icon: <FileText className="w-4 h-4" />, 
      label: 'Templates', 
      action: 'Show me industry email templates',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: <Palette className="w-4 h-4" />, 
      label: 'Brand Kit', 
      action: 'Help me apply my brand colors and fonts',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      icon: <Image className="w-4 h-4" />, 
      label: 'AI Images', 
      action: 'Generate professional images for my email',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      icon: <Type className="w-4 h-4" />, 
      label: 'Copywriting', 
      action: 'Write compelling email copy that converts',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    { 
      icon: <Target className="w-4 h-4" />, 
      label: 'Optimize', 
      action: 'Analyze and improve my email performance',
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    { 
      icon: <BarChart3 className="w-4 h-4" />, 
      label: 'A/B Test', 
      action: 'Create variations for split testing',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ];

  const industryTemplates = [
    'E-commerce Product Launch',
    'SaaS Welcome Series',
    'Restaurant Newsletter',
    'Real Estate Listing',
    'Event Invitation',
    'Educational Course',
    'Healthcare Updates',
    'Financial Services'
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(newMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I encountered an error while processing your request. Please check your API configuration and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();
    
    // Handle email generation requests
    if (input.includes('create email') || input.includes('generate email') || input.includes('write email')) {
      try {
        const emailResponse = await emailAIService.generateEmail({
          prompt: userInput,
          tone: input.includes('professional') ? 'professional' : 
                input.includes('casual') ? 'casual' : 
                input.includes('friendly') ? 'friendly' : 'professional'
        });

        // Insert generated email into editor
        if (editor) {
          editor.commands.setContent(emailResponse.html);
          onEmailGenerated?.(emailResponse.html);
        }

        return {
          id: Date.now().toString(),
          type: 'ai',
          content: `I've generated an email for you with the subject: "${emailResponse.subject}". The content has been inserted into your editor. You can now customize it further!`,
          timestamp: new Date(),
          suggestions: [
            'Generate a different version',
            'Optimize for mobile',
            'Add call-to-action buttons',
            'Create email series'
          ]
        };
      } catch (error) {
        console.error('Error generating email:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: 'I had trouble generating that email. Please check your OpenAI API key and try again.',
          timestamp: new Date()
        };
      }
    }

    // Handle image generation requests
    if (input.includes('generate image') || input.includes('create image') || input.includes('ai image')) {
      try {
        const imagePrompt = userInput.replace(/generate image|create image|ai image/gi, '').trim() || 'professional email header image';
        const imageResponse = await emailAIService.generateImage({
          prompt: imagePrompt,
          style: 'professional'
        });

        // Insert generated image into editor
        if (editor) {
          editor.chain().focus().insertContent(`<img src="${imageResponse.imageUrl}" alt="${imagePrompt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`).run();
        }

        return {
          id: Date.now().toString(),
          type: 'ai',
          content: `I've generated and inserted an image for: "${imagePrompt}". The image has been added to your email editor!`,
          timestamp: new Date(),
          suggestions: [
            'Generate another image',
            'Resize the image',
            'Add image caption',
            'Create image gallery'
          ]
        };
      } catch (error) {
        console.error('Error generating image:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: 'I had trouble generating that image. Please check your OpenAI API key and try again.',
          timestamp: new Date()
        };
      }
    }

    // Handle content generation requests
    if (input.includes('write') || input.includes('copy') || input.includes('content')) {
      try {
        const contentType = input.includes('subject') ? 'subject' : 
                           input.includes('cta') || input.includes('call to action') ? 'cta' :
                           input.includes('copy') ? 'copy' : 'general';
        
        const content = await emailAIService.generateContent(userInput, contentType);
        
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: `Here's the content I generated for you:\n\n${content}`,
          timestamp: new Date(),
          suggestions: [
            'Generate alternative version',
            'Make it more engaging',
            'Optimize for conversions',
            'Create variations'
          ]
        };
      } catch (error) {
        console.error('Error generating content:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: 'I had trouble generating that content. Please try again.',
          timestamp: new Date()
        };
      }
    }

    // Handle template requests
    if (input.includes('template') || input.includes('industry')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I\'d love to help you with templates! Here are some popular industry templates I can create for you. Which industry matches your needs best?',
        timestamp: new Date(),
        suggestions: industryTemplates
      };
    }

    // Default AI response using the content generation
    try {
      const response = await emailAIService.generateContent(userInput, 'general');
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        suggestions: [
          'Generate email content',
          'Create images',
          'Design templates',
          'Optimize performance'
        ]
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I understand! I can help you with email creation, image generation, content writing, and optimization. What specific task would you like assistance with?',
        timestamp: new Date(),
        suggestions: [
          'Create a new email',
          'Generate professional images',
          'Write compelling copy',
          'Optimize existing content'
        ]
      };
    }
  };

  const handleQuickAction = (action: string) => {
    setNewMessage(action);
    handleSendMessage();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  const applyAISuggestion = async (suggestion: string) => {
    if (!editor) return;
    
    // Handle template application
    if (suggestion.includes('Template') || suggestion.includes('template')) {
      try {
        const emailResponse = await emailAIService.generateEmail({
          prompt: `Create a professional ${suggestion} email template`,
          type: suggestion.toLowerCase().includes('welcome') ? 'welcome' : 
                suggestion.toLowerCase().includes('promotional') ? 'promotional' :
                suggestion.toLowerCase().includes('newsletter') ? 'newsletter' : 'announcement'
        });
        
        editor.commands.setContent(emailResponse.html);
        onEmailGenerated?.(emailResponse.html);
      } catch (error) {
        console.error('Error applying template:', error);
      }
      return;
    }
    
    console.log('Applied AI suggestion:', suggestion);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          <Badge variant="secondary" className="ml-auto bg-blue-50 text-blue-700">
            OpenAI Powered
          </Badge>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.action)}
              className={`flex items-center gap-2 justify-start h-auto p-2 text-xs ${action.color}`}
              disabled={isLoading}
            >
              {action.icon}
              <span className="truncate">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium opacity-80">Try these:</p>
                    {message.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex-1 justify-start h-auto p-2 text-xs bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          disabled={isLoading}
                        >
                          <Wand2 className="w-3 h-3 mr-2" />
                          {suggestion}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => applyAISuggestion(suggestion)}
                          className="p-1 h-auto"
                          disabled={isLoading}
                        >
                          <Zap className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask AI to help with your email..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || isLoading}
            size="sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send • Shift+Enter for new line</span>
          <div className="flex items-center gap-2">
            <span>Powered by OpenAI</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
