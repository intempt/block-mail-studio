
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
  Zap
} from 'lucide-react';
import { EmailPromptLibrary, EmailPrompt } from './EmailPromptLibrary';
import { EmailTemplate } from './TemplateManager';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
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
      content: 'Hi! I\'m your AI email assistant. I can help you create amazing emails, suggest templates, or optimize your content. What would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'prompts' | 'templates'>('chat');
  const [templateSearch, setTemplateSearch] = useState('');

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
        timestamp: new Date()
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
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const renderChatTab = () => (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
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
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your email..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('prompts')}
            className="flex items-center gap-1 text-xs"
          >
            <Sparkles className="w-3 h-3" />
            Prompts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('templates')}
            className="flex items-center gap-1 text-xs"
          >
            <Wand2 className="w-3 h-3" />
            Templates
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Templates</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('chat')}
          >
            ← Back
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
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
                  
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {template.usageCount} uses
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
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            Smart
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && renderChatTab()}
        {activeTab === 'prompts' && (
          <div className="h-full">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Prompt Library</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('chat')}
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
