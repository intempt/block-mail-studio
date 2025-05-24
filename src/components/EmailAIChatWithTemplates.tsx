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
  const [activeTab, setActiveTab<'chat' | 'prompts' | 'templates'>( 'chat');
  const [templateSearch, setTemplateSearch] = useState('');

  const quickActions = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Templates',
      description: 'Pre-made designs',
      action: 'Show me industry email templates',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      onClick: () => setActiveTab('templates')
    },
    {
      icon: <Palette className="w-5 h-5" />,
      label: 'Brand Kit',
      description: 'Apply styling',
      action: 'Help me apply my brand colors and fonts to this email',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    },
    {
      icon: <Image className="w-5 h-5" />,
      label: 'AI Images',
      description: 'Generate visuals',
      action: 'Generate professional images for my email campaign',
      color: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      icon: <Type className="w-5 h-5" />,
      label: 'Smart Copy',
      description: 'AI copywriting',
      action: 'Write compelling email copy that converts readers into customers',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Optimize',
      description: 'Enhance performance',
      action: 'Analyze and improve my current email for better performance',
      color: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'A/B Testing',
      description: 'Create variations',
      action: 'Create multiple variations of this email for split testing',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
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

  const renderChatTab = () => (
    <div className="flex flex-col h-full">
      <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50 border-b border-gray-200 max-h-[280px] overflow-y-auto">
        <div className="mb-3">
          <h4 className="text-lg font-bold text-gray-900 mb-1">Quick Actions</h4>
          <p className="text-xs text-gray-600">Choose an action to get started</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 overflow-hidden ${action.color} text-white`}
              onClick={() => handleQuickAction(action)}
            >
              <div className="p-3">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    {action.icon}
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold">{action.label}</h5>
                    <p className="text-xs opacity-90 leading-tight">{action.description}</p>
                  </div>
                  
                  <div className="flex items-center text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>Start</span>
                    <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
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
            className="bg-white/50 border-white/20 text-gray-700 hover:bg-white/70 text-xs px-3 py-1"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Prompts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('templates')}
            className="bg-white/50 border-white/20 text-gray-700 hover:bg-white/70 text-xs px-3 py-1"
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Templates
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                  }`}
                >
                  {message.content}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                )}
              </div>

              {message.suggestions && message.suggestions.length > 0 && message.type === 'ai' && (
                <div className="mt-2 ml-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Quick Follow-ups
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="justify-start h-auto p-2 bg-white text-gray-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all text-xs"
                          disabled={isLoading}
                        >
                          <Zap className="w-3 h-3 mr-1 text-blue-500" />
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
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white border border-gray-200 shadow-sm p-3 rounded-xl">
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
      
      <div className="p-3 border-t border-gray-200 bg-white">
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
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900 text-sm">Templates</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('chat')}
            className="text-xs"
          >
            ← Back
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
            className="pl-8 text-sm h-8"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">
                    {template.name}
                  </h5>
                  <p className="text-xs text-gray-600 mb-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-1 flex-wrap mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
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
                className="w-full text-xs"
              >
                <Zap className="w-3 h-3 mr-1" />
                Use Template
              </Button>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-6">
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
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Bot className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">AI Assistant</h3>
          <Badge variant="secondary" className="ml-auto text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
            Smart
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && renderChatTab()}
        {activeTab === 'prompts' && (
          <div className="h-full">
            <div className="p-2 border-b border-gray-200 flex items-center justify-between">
              <h4 className="font-medium text-gray-900 text-sm">Prompt Library</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('chat')}
                className="text-xs"
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
