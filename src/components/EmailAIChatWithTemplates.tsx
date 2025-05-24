import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Wand2,
  Search,
  Star,
  Eye,
  Zap,
  FileText,
  Palette,
  Image,
  Type,
  Target,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { EmailPromptLibrary, EmailPrompt } from './EmailPromptLibrary';
import { EmailTemplate } from './TemplateManager';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface EmailAIChatWithTemplatesProps {
  editor: Editor | null;
  templates?: EmailTemplate[];
  onLoadTemplate?: (template: EmailTemplate) => void;
  onSaveTemplate?: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
}

export const EmailAIChatWithTemplates: React.FC<EmailAIChatWithTemplatesProps> = ({ 
  editor, 
  templates = [],
  onLoadTemplate,
  onSaveTemplate
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to your AI Email Assistant! 🎯 I\'m here to help you create professional emails that convert. Choose a quick action below to get started, or tell me what you\'d like to create.',
      timestamp: new Date(),
      suggestions: [
        'Create a welcome email series',
        'Generate a product announcement', 
        'Build a newsletter template',
        'Optimize my current email'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'prompts' | 'templates'>('chat');
  const [templateSearch, setTemplateSearch] = useState('');

  const quickActions = [
    {
      icon: <FileText className="w-4 h-4" />,
      label: 'Templates',
      action: 'Show me industry email templates',
      onClick: () => setActiveTab('templates')
    },
    {
      icon: <Palette className="w-4 h-4" />,
      label: 'Brand Kit',
      action: 'Help me apply my brand colors and fonts to this email'
    },
    {
      icon: <Image className="w-4 h-4" />,
      label: 'AI Images',
      action: 'Generate professional images for my email campaign'
    },
    {
      icon: <Type className="w-4 h-4" />,
      label: 'Smart Copy',
      action: 'Write compelling email copy that converts readers into customers'
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: 'Optimize',
      action: 'Analyze and improve my current email for better performance'
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'A/B Testing',
      action: 'Create multiple variations of this email for split testing'
    }
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
    template.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(templateSearch.toLowerCase()))
  );

  const sendMessage = async () => {
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        suggestions: generateContextualSuggestions(inputMessage)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('template') || input.includes('design')) {
      return "I can help you with email templates! I see you have access to several templates. Would you like me to suggest one based on your needs, or would you prefer to start with a specific style? I can also help customize any template to match your brand.";
    }
    
    if (input.includes('write') || input.includes('create')) {
      return "I'd be happy to help you write engaging email content! What type of email are you creating? (e.g., newsletter, promotional, welcome email) I can suggest structure, tone, and compelling copy.";
    }
    
    if (input.includes('subject') || input.includes('headline')) {
      return "Great subject lines are crucial for email success! I can help you create compelling subject lines that increase open rates. What's the main goal of your email?";
    }
    
    return "I understand you want to improve your email. I can help with content creation, design suggestions, template selection, and optimization tips. What specific aspect would you like to focus on?";
  };

  const generateContextualSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();
    
    if (input.includes('template')) {
      return [
        'Show newsletter templates',
        'Browse promotional designs',
        'Find welcome email templates',
        'Create custom template'
      ];
    }
    
    if (input.includes('write') || input.includes('create')) {
      return [
        'Generate subject lines',
        'Write call-to-action text',
        'Create email outline',
        'Add personalization'
      ];
    }
    
    if (input.includes('optimize')) {
      return [
        'Improve subject line',
        'Enhance call-to-actions',
        'Optimize for mobile',
        'Test different versions'
      ];
    }
    
    return [
      'Generate email content',
      'Choose a template',
      'Create images',
      'Optimize performance'
    ];
  };

  const handleQuickAction = (action: any) => {
    if (action.onClick) {
      action.onClick();
    } else {
      setInputMessage(action.action);
      setTimeout(() => sendMessage(), 100);
    }
  };

  const handlePromptSelect = (prompt: EmailPrompt) => {
    setInputMessage(prompt.prompt);
    setActiveTab('chat');
  };

  const handleTemplateLoad = (template: EmailTemplate) => {
    if (onLoadTemplate) {
      onLoadTemplate(template);
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I've loaded the "${template.name}" template for you! The template has been applied to your editor. Would you like me to help you customize it or suggest improvements?`,
        timestamp: new Date(),
        suggestions: [
          'Customize colors',
          'Update copy',
          'Add more sections',
          'Generate images'
        ]
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => sendMessage(), 100);
  };

  const getAccentClass = (accent: string) => {
    switch (accent) {
      case 'blue': return 'border-blue-200 hover:border-blue-300 hover:bg-blue-50';
      case 'purple': return 'border-purple-200 hover:border-purple-300 hover:bg-purple-50';
      case 'green': return 'border-green-200 hover:border-green-300 hover:bg-green-50';
      case 'orange': return 'border-orange-200 hover:border-orange-300 hover:bg-orange-50';
      case 'red': return 'border-red-200 hover:border-red-300 hover:bg-red-50';
      case 'indigo': return 'border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50';
      default: return 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
    }
  };

  const getAccentIconClass = (accent: string) => {
    switch (accent) {
      case 'blue': return 'text-blue-600';
      case 'purple': return 'text-purple-600';
      case 'green': return 'text-green-600';
      case 'orange': return 'text-orange-600';
      case 'red': return 'text-red-600';
      case 'indigo': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const renderChatTab = () => (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="mb-3">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Quick Actions</h4>
            <p className="text-sm text-gray-600">Choose an action to get started</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group cursor-pointer transition-all duration-200 hover:shadow-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white border"
                onClick={() => handleQuickAction(action)}
              >
                <div className="p-2">
                  <div className="flex flex-col items-center text-center space-y-1">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-50 group-hover:bg-white transition-colors text-gray-700">
                      {action.icon}
                    </div>
                    <h5 className="text-xs font-medium text-gray-900">{action.label}</h5>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('prompts')}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 text-xs px-4 py-2"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Prompts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('templates')}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 text-xs px-4 py-2"
            >
              <Wand2 className="w-3 h-3 mr-2" />
              Templates
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-xl text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white px-4 py-3'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3'
                    }`}
                  >
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

                {message.suggestions && message.suggestions.length > 0 && message.type === 'ai' && (
                  <div className="mt-3 ml-11">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Quick Follow-ups
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="justify-start h-auto p-2 bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-xs"
                            disabled={isLoading}
                          >
                            <Zap className="w-3 h-3 mr-2 text-blue-500" />
                            <span className="text-xs">{suggestion}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
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
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your email..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border-gray-300 focus:border-blue-500 text-sm"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 text-sm">Templates</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('chat')}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            ← Back
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
            className="pl-9 text-sm h-9 border-gray-300"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-4 border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h5>
                  <p className="text-xs text-gray-600 mb-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-1 flex-wrap mb-2">
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {template.usageCount}
                    </span>
                    {template.isFavorite && (
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTemplateLoad(template)}
                className="w-full text-xs border-gray-300 hover:bg-gray-50"
              >
                <Zap className="w-3 h-3 mr-2" />
                Use Template
              </Button>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No templates found</p>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">AI Assistant</h3>
          <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
            Smart
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && renderChatTab()}
        {activeTab === 'prompts' && (
          <div className="h-full">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white">
              <h4 className="font-semibold text-gray-900 text-sm">Prompt Library</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('chat')}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                ← Back
              </Button>
            </div>
            <EmailPromptLibrary onSelectPrompt={handlePromptSelect} />
          </div>
        )}
        {activeTab === 'templates' && renderTemplatesTab()}
      </div>
    </div>
  );
};
