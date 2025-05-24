
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
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { emailAIService } from '@/services/EmailAIService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isLoading?: boolean;
  actionType?: 'email_generated' | 'image_generated' | 'content_refined' | 'general';
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
      content: 'Hi! I\'m your AI email assistant. I can create emails, generate images, write copy, and help optimize your content. Everything I create will appear directly in your editor for seamless editing. What would you like to work on?',
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
        timestamp: new Date(),
        actionType: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();
    
    // Handle email generation requests
    if (input.includes('create email') || input.includes('generate email') || input.includes('write email') || input.includes('email template')) {
      try {
        const emailResponse = await emailAIService.generateEmail({
          prompt: userInput,
          tone: input.includes('professional') ? 'professional' : 
                input.includes('casual') ? 'casual' : 
                input.includes('friendly') ? 'friendly' : 
                input.includes('urgent') ? 'urgent' : 'professional',
          type: input.includes('welcome') ? 'welcome' :
                input.includes('promotional') || input.includes('sale') ? 'promotional' :
                input.includes('newsletter') ? 'newsletter' : 'announcement'
        });

        // Insert generated email into editor
        if (editor) {
          editor.commands.setContent(emailResponse.html);
          onEmailGenerated?.(emailResponse.html);
        }

        return {
          id: Date.now().toString(),
          type: 'ai',
          content: `✅ Email created and inserted into your editor!\n\n**Subject:** ${emailResponse.subject}\n**Preview:** ${emailResponse.previewText}\n\nThe complete email is now in your editor - you can edit it manually or ask me to refine it further.`,
          timestamp: new Date(),
          actionType: 'email_generated',
          suggestions: [
            'Make it more casual',
            'Add urgency',
            'Shorten the content',
            'Add call-to-action buttons',
            'Create another variation'
          ]
        };
      } catch (error) {
        console.error('Error generating email:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ I had trouble generating that email. Please check your OpenAI API key configuration and try again.',
          timestamp: new Date(),
          actionType: 'general'
        };
      }
    }

    // Handle image generation requests
    if (input.includes('generate image') || input.includes('create image') || input.includes('ai image') || input.includes('add image')) {
      try {
        const imagePrompt = userInput.replace(/generate image|create image|ai image|add image/gi, '').trim() || 'professional email header image';
        const imageResponse = await emailAIService.generateImage({
          prompt: imagePrompt,
          style: input.includes('creative') ? 'creative' : 
                 input.includes('minimal') ? 'minimal' :
                 input.includes('vibrant') ? 'vibrant' : 'professional'
        });

        // Insert generated image into editor at cursor position
        if (editor) {
          editor.chain().focus().insertContent(`
            <div class="email-block image-block" style="text-align: center; padding: 16px;">
              <img src="${imageResponse.imageUrl}" alt="${imagePrompt}" style="max-width: 100%; height: auto; border-radius: 8px;" />
            </div>
          `).run();
        }

        return {
          id: Date.now().toString(),
          type: 'ai',
          content: `✅ Image generated and inserted into your editor!\n\n**Prompt:** ${imagePrompt}\n\nThe image is now in your email - you can resize, move, or ask me to generate alternatives.`,
          timestamp: new Date(),
          actionType: 'image_generated',
          suggestions: [
            'Generate another variation',
            'Create a different style',
            'Add image caption',
            'Generate a header image'
          ]
        };
      } catch (error) {
        console.error('Error generating image:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ I had trouble generating that image. Please check your OpenAI API key and try again.',
          timestamp: new Date(),
          actionType: 'general'
        };
      }
    }

    // Handle content refinement requests
    if ((input.includes('improve') || input.includes('refine') || input.includes('optimize') || input.includes('make it')) && editor) {
      try {
        const currentHtml = editor.getHTML();
        if (currentHtml && currentHtml.length > 50) {
          const refinedHtml = await emailAIService.refineEmail(currentHtml, userInput);
          
          // Update editor with refined content
          editor.commands.setContent(refinedHtml);
          onEmailGenerated?.(refinedHtml);

          return {
            id: Date.now().toString(),
            type: 'ai',
            content: `✅ Content refined and updated in your editor!\n\nI've applied your requested changes. The updated content is now in your editor for further editing.`,
            timestamp: new Date(),
            actionType: 'content_refined',
            suggestions: [
              'Make further adjustments',
              'Add call-to-action',
              'Optimize for mobile',
              'Create A/B test version'
            ]
          };
        } else {
          return {
            id: Date.now().toString(),
            type: 'ai',
            content: 'I need some content in your editor to refine. Please create an email first or paste some content, then ask me to improve it.',
            timestamp: new Date(),
            actionType: 'general',
            suggestions: [
              'Create a new email',
              'Generate template content',
              'Write email copy',
              'Add content blocks'
            ]
          };
        }
      } catch (error) {
        console.error('Error refining content:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ I had trouble refining that content. Please try again.',
          timestamp: new Date(),
          actionType: 'general'
        };
      }
    }

    // Handle content writing requests (copy, subject lines, etc.)
    if (input.includes('write') || input.includes('copy') || input.includes('content') || input.includes('subject')) {
      try {
        const contentType = input.includes('subject') ? 'subject' : 
                           input.includes('cta') || input.includes('call to action') ? 'cta' :
                           input.includes('copy') ? 'copy' : 'general';
        
        const content = await emailAIService.generateContent(userInput, contentType);
        
        // Insert content into editor if it's substantial content
        if (editor && (contentType === 'copy' || contentType === 'general') && content.length > 100) {
          const wrappedContent = `<div class="email-block paragraph-block" style="padding: 16px;"><p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #374151; line-height: 1.7; margin: 0;">${content}</p></div>`;
          editor.chain().focus().insertContent(wrappedContent).run();
          
          return {
            id: Date.now().toString(),
            type: 'ai',
            content: `✅ Content written and inserted into your editor!\n\nThe generated content is now in your email for further editing and customization.`,
            timestamp: new Date(),
            actionType: 'content_refined',
            suggestions: [
              'Refine the tone',
              'Make it shorter',
              'Add more details',
              'Create alternative version'
            ]
          };
        } else {
          return {
            id: Date.now().toString(),
            type: 'ai',
            content: `Here's the content I generated:\n\n**${contentType === 'subject' ? 'Subject Line' : 'Content'}:**\n${content}\n\nWould you like me to create a full email with this content?`,
            timestamp: new Date(),
            actionType: 'general',
            suggestions: [
              'Create full email with this',
              'Generate alternative',
              'Make it more engaging',
              'Add to current email'
            ]
          };
        }
      } catch (error) {
        console.error('Error generating content:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ I had trouble generating that content. Please try again.',
          timestamp: new Date(),
          actionType: 'general'
        };
      }
    }

    // Handle template requests
    if (input.includes('template') || input.includes('industry')) {
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

      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I can create professional email templates for any industry. Which type would you like me to generate? Just tell me the industry and I\'ll create a complete template in your editor.',
        timestamp: new Date(),
        actionType: 'general',
        suggestions: industryTemplates
      };
    }

    // Default helpful response
    try {
      const response = await emailAIService.generateContent(userInput, 'general');
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        actionType: 'general',
        suggestions: [
          'Create email content',
          'Generate images',
          'Design templates',
          'Write compelling copy'
        ]
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I\'m here to help with your email creation! I can generate complete emails, create images, write copy, and optimize content - all directly in your editor. What would you like to work on?',
        timestamp: new Date(),
        actionType: 'general',
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
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  const applyAISuggestion = async (suggestion: string) => {
    if (!editor) return;
    
    // Handle quick template application
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
        
        // Add confirmation message
        const confirmMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `✅ ${suggestion} template created and loaded into your editor!`,
          timestamp: new Date(),
          actionType: 'email_generated'
        };
        setMessages(prev => [...prev, confirmMessage]);
      } catch (error) {
        console.error('Error applying template:', error);
      }
      return;
    }
    
    // For other suggestions, treat as new message
    setNewMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          <Badge variant="secondary" className="ml-auto bg-blue-50 text-blue-700">
            Editor Integration
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
              <div className={`max-w-[85%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                <div className="flex items-start gap-2">
                  {message.type === 'ai' && message.actionType && (
                    <div className="mt-1">
                      {message.actionType === 'email_generated' && <Check className="w-4 h-4 text-green-600" />}
                      {message.actionType === 'image_generated' && <Image className="w-4 h-4 text-blue-600" />}
                      {message.actionType === 'content_refined' && <Wand2 className="w-4 h-4 text-purple-600" />}
                      {message.actionType === 'general' && <Sparkles className="w-4 h-4 text-gray-600" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium opacity-80">Quick actions:</p>
                    {message.suggestions.slice(0, 3).map((suggestion, index) => (
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
                          title="Apply directly"
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
                  <span className="text-sm">AI is working on your request...</span>
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
            placeholder="Ask AI to create content in your editor..."
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
          <span>Content appears directly in editor • Manual editing enabled</span>
          <div className="flex items-center gap-2">
            <span>Powered by OpenAI</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
