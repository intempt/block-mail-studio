
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
  AlertCircle,
  Save,
  Eye,
  Grid3X3,
  ChevronRight
} from 'lucide-react';
import { emailAIService } from '@/services/EmailAIService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isLoading?: boolean;
  actionType?: 'email_generated' | 'image_generated' | 'content_refined' | 'template_loaded' | 'general';
}

interface EmailAIChatProps {
  editor: Editor | null;
  onEmailGenerated?: (html: string) => void;
  onSaveTemplate?: (template: { name: string; description: string; html: string; category: string; tags: string[] }) => void;
}

// Industry templates data with thumbnails
const industryTemplates = {
  'E-commerce Product Launch': {
    html: `<div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <div class="email-block header-block">
      <h1 style="margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px 8px 0 0;">
        🚀 New Product Launch!
      </h1>
    </div>
    <div class="email-block paragraph-block">
      <p style="color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
        Get ready for something amazing! We're thrilled to introduce our latest product that will revolutionize your experience.
      </p>
    </div>
    <div class="email-block button-block" style="text-align: center; padding: 20px;">
      <a href="#" style="display: inline-block; padding: 16px 32px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
        Shop Now - 25% Off!
      </a>
    </div>
  </div>`,
    category: 'E-commerce',
    description: 'Perfect for launching new products with compelling CTAs'
  },
  
  'SaaS Welcome Series': {
    html: `<div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <div class="email-block header-block">
      <h1 style="margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white;">
        Welcome to {{product_name}}!
      </h1>
    </div>
    <div class="email-block paragraph-block">
      <p style="color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
        Hi {{first_name}}, welcome aboard! Let's get you set up for success with our powerful platform.
      </p>
      <h3 style="color: #1F2937; margin: 0; padding: 0 24px; font-size: 18px;">Your next steps:</h3>
      <ul style="color: #374151; margin: 0; padding: 8px 24px 24px 48px;">
        <li>Complete your profile setup</li>
        <li>Connect your first integration</li>
        <li>Invite your team members</li>
      </ul>
    </div>
  </div>`,
    category: 'SaaS',
    description: 'Onboard new users with structured welcome flow'
  },
  
  'Restaurant Newsletter': {
    html: `<div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <div class="email-block header-block">
      <h1 style="margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white;">
        🍽️ This Month's Specials
      </h1>
    </div>
    <div class="email-block paragraph-block">
      <p style="color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
        Dear food lovers, discover our chef's seasonal selections and exciting new menu items this month!
      </p>
    </div>
    <div class="email-block paragraph-block">
      <h3 style="color: #1F2937; margin: 0; padding: 0 24px; font-size: 18px;">Featured This Month:</h3>
      <ul style="color: #374151; margin: 0; padding: 8px 24px 24px 48px;">
        <li>🥩 Prime Ribeye with Truffle Butter</li>
        <li>🦞 Fresh Maine Lobster Thermidor</li>
        <li>🍰 Seasonal Berry Tart</li>
      </ul>
    </div>
  </div>`,
    category: 'Restaurant',
    description: 'Showcase menu items and seasonal offerings'
  },
  
  'Real Estate Listing': {
    html: `<div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <div class="email-block header-block">
      <h1 style="margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white;">
        🏡 New Property Alert
      </h1>
    </div>
    <div class="email-block paragraph-block">
      <p style="color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
        We found a property that matches your criteria! This stunning home won't last long in today's market.
      </p>
    </div>
    <div class="email-block paragraph-block">
      <h3 style="color: #1F2937; margin: 0; padding: 0 24px; font-size: 18px;">Property Highlights:</h3>
      <ul style="color: #374151; margin: 0; padding: 8px 24px 24px 48px;">
        <li>3 bedrooms, 2.5 bathrooms</li>
        <li>Modern kitchen with granite countertops</li>
        <li>Spacious backyard with patio</li>
        <li>Prime location near schools and shopping</li>
      </ul>
    </div>
  </div>`,
    category: 'Real Estate',
    description: 'Highlight property features and create urgency'
  },
  
  'Event Invitation': {
    html: `<div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <div class="email-block header-block">
      <h1 style="margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white;">
        🎉 You're Invited!
      </h1>
    </div>
    <div class="email-block paragraph-block">
      <p style="color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
        Join us for an exclusive evening of networking, entertainment, and celebration!
      </p>
    </div>
    <div class="email-block paragraph-block">
      <h3 style="color: #1F2937; margin: 0; padding: 0 24px; font-size: 18px;">Event Details:</h3>
      <ul style="color: #374151; margin: 0; padding: 8px 24px 24px 48px;">
        <li>📅 Date: [Event Date]</li>
        <li>🕐 Time: [Event Time]</li>
        <li>📍 Location: [Event Venue]</li>
        <li>👔 Dress Code: Business Casual</li>
      </ul>
    </div>
  </div>`,
    category: 'Events',
    description: 'Professional event invitations with clear details'
  }
};

export const EmailAIChat: React.FC<EmailAIChatProps> = ({ editor, onEmailGenerated, onSaveTemplate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to your AI Email Assistant! I can create professional emails, generate images, optimize content, and help you build amazing campaigns. Choose a quick action below or tell me what you\'d like to create.',
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
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: 'Templates', 
      action: 'Show me industry email templates',
      description: 'Pre-made designs',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => setShowTemplates(true)
    },
    { 
      icon: <Palette className="w-5 h-5" />, 
      label: 'Brand Kit', 
      action: 'Help me apply my brand colors and fonts',
      description: 'Apply brand styling',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    { 
      icon: <Image className="w-5 h-5" />, 
      label: 'AI Images', 
      action: 'Generate professional images for my email',
      description: 'Create custom visuals',
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      icon: <Type className="w-5 h-5" />, 
      label: 'Smart Copy', 
      action: 'Write compelling email copy that converts',
      description: 'AI-powered copywriting',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    { 
      icon: <Target className="w-5 h-5" />, 
      label: 'Optimize', 
      action: 'Analyze and improve my email performance',
      description: 'Enhance engagement',
      color: 'bg-red-500 hover:bg-red-600'
    },
    { 
      icon: <BarChart3 className="w-5 h-5" />, 
      label: 'A/B Testing', 
      action: 'Create variations for split testing',
      description: 'Test multiple versions',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
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
    
    // Handle template requests first
    if (input.includes('template') || input.includes('industry') || input.includes('show me')) {
      const templateList = Object.keys(industryTemplates);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Here are the available industry email templates I can load directly into your editor. Click on any template to load it instantly:\n\n${templateList.map((template, index) => `${index + 1}. ${template}`).join('\n')}`,
        timestamp: new Date(),
        actionType: 'general',
        suggestions: templateList
      };
    }

    // Handle email generation requests
    if (input.includes('create email') || input.includes('generate email') || input.includes('write email')) {
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
        if (editor && emailResponse.html) {
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

  const handleQuickAction = (action: any) => {
    if (action.onClick) {
      action.onClick();
    } else {
      setNewMessage(action.action);
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const handleTemplateSelect = (templateName: string) => {
    const template = industryTemplates[templateName as keyof typeof industryTemplates];
    if (editor && template) {
      editor.commands.setContent(template.html);
      onEmailGenerated?.(template.html);
      
      const confirmMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ ${templateName} template loaded into your editor!\n\nThe template is now ready for customization. You can edit it manually or ask me to modify specific elements.`,
        timestamp: new Date(),
        actionType: 'template_loaded',
        suggestions: [
          'Customize the colors',
          'Change the copy',
          'Add more sections',
          'Generate images for this template'
        ]
      };
      setMessages(prev => [...prev, confirmMessage]);
      setShowTemplates(false);
    }
  };

  if (showTemplates) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Industry Templates</h3>
              <p className="text-xs text-gray-600">Choose a template to load</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)} className="text-xs">
              ← Back to Chat
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 grid gap-3">
            {Object.entries(industryTemplates).map(([name, template]) => (
              <Card key={name} className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTemplateSelect(name)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">{name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                    <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="bg-gray-50 rounded-md p-2 text-xs text-gray-700 font-mono">
                  Preview: {template.html.substring(0, 80)}...
                </div>
                
                <Button className="w-full mt-2 text-xs" variant="outline" size="sm">
                  <Zap className="w-3 h-3 mr-1" />
                  Load Template
                </Button>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 max-h-[240px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">AI Email Assistant</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            Smart
          </Badge>
        </div>
        
        {/* Compact Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleQuickAction(action)}
              className={`flex flex-col items-center gap-1 h-auto p-3 text-white border-0 ${action.color}`}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center w-6 h-6">
                {action.icon}
              </div>
              <div className="text-center">
                <div className="font-semibold text-xs">{action.label}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-900'} rounded-lg p-3`}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium opacity-80">Suggestions:</p>
                    {message.suggestions.slice(0, 3).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleTemplateSelect(suggestion)}
                        className="block w-full text-left text-xs"
                        disabled={isLoading}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-xs text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tell me what kind of email you want to create..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || isLoading}
            size="sm"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
