
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
  FileTemplate,
  Zap,
  Target,
  BarChart3,
  Users,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Wand2
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface EmailAIChatProps {
  editor: Editor | null;
}

export const EmailAIChat: React.FC<EmailAIChatProps> = ({ editor }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI email assistant. I can help you create stunning emails, suggest improvements, generate content, and optimize for better performance. What would you like to work on today?',
      timestamp: new Date(),
      suggestions: [
        'Create a welcome email series',
        'Design a product announcement',
        'Build a newsletter template',
        'Optimize for mobile devices'
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { 
      icon: <FileTemplate className="w-4 h-4" />, 
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
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('template') || input.includes('industry')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I\'d love to help you with templates! Here are some popular industry templates I can create for you. Which industry matches your needs best?',
        timestamp: new Date(),
        suggestions: industryTemplates
      };
    }
    
    if (input.includes('brand') || input.includes('color') || input.includes('font')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Great! Let\'s set up your brand kit. I can help you choose colors, fonts, and create a consistent brand experience across all your emails. What\'s your brand\'s primary color?',
        timestamp: new Date(),
        suggestions: [
          'Use blue (#2563EB) as primary',
          'Set up a professional color palette',
          'Apply brand fonts throughout',
          'Create brand guidelines'
        ]
      };
    }
    
    if (input.includes('image') || input.includes('generate') || input.includes('photo')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I can generate professional images for your email! Describe what kind of image you need and I\'ll create it for you. For example: "professional team photo", "modern office space", or "product showcase".',
        timestamp: new Date(),
        suggestions: [
          'Generate hero image for header',
          'Create product showcase grid',
          'Design abstract background',
          'Make team photos'
        ]
      };
    }
    
    if (input.includes('optimize') || input.includes('improve') || input.includes('performance')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I\'ll analyze your email for optimization opportunities! I can check deliverability, mobile responsiveness, engagement potential, and accessibility. Let me scan your current email...',
        timestamp: new Date(),
        suggestions: [
          'Check mobile responsiveness',
          'Improve subject line',
          'Optimize call-to-action buttons',
          'Enhance accessibility'
        ]
      };
    }

    if (input.includes('copy') || input.includes('write') || input.includes('text')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I\'d be happy to help with copywriting! What type of email copy do you need? I can write subject lines, body content, call-to-action text, and more. What\'s the main goal of your email?',
        timestamp: new Date(),
        suggestions: [
          'Write compelling subject lines',
          'Create engaging body copy',
          'Craft powerful CTAs',
          'Develop email sequence'
        ]
      };
    }
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: 'I understand! I can help you with that. Let me provide some specific suggestions based on what you\'re looking to accomplish. Here are some ways I can assist:',
      timestamp: new Date(),
      suggestions: [
        'Generate email content',
        'Design improvements',
        'Performance optimization',
        'Template suggestions'
      ]
    };
  };

  const handleQuickAction = (action: string) => {
    setNewMessage(action);
    handleSendMessage();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  const applyAISuggestion = (suggestion: string) => {
    if (!editor) return;
    
    // Simulate applying AI suggestions to the editor
    if (suggestion.includes('template') || suggestion.includes('Template')) {
      const templateContent = `
        <div class="email-container">
          <div class="email-block header-block">
            <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: white; margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              ${suggestion}
            </h1>
          </div>
          <div class="email-block paragraph-block">
            <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
              Professional email template tailored for your industry. Ready to customize with your content and branding.
            </p>
          </div>
        </div>
      `;
      editor.commands.setContent(templateContent);
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
            Advanced AI
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
                <p className="text-sm">{message.content}</p>
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
                        >
                          <Wand2 className="w-3 h-3 mr-2" />
                          {suggestion}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => applyAISuggestion(suggestion)}
                          className="p-1 h-auto"
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
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || isLoading}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send</span>
          <div className="flex items-center gap-2">
            <span>Powered by AI</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
