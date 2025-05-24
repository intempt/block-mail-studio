
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

interface EnhancedEmailAIChatProps {
  editor: Editor | null;
  onEmailGenerated?: (html: string) => void;
  onSaveTemplate?: (template: { name: string; description: string; html: string; category: string; tags: string[] }) => void;
}

// Industry templates data with enhanced metadata
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
    description: 'Perfect for launching new products with compelling CTAs',
    tags: ['product', 'launch', 'sales', 'discount']
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
    description: 'Onboard new users with structured welcome flow',
    tags: ['welcome', 'onboarding', 'saas', 'tutorial']
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
    description: 'Showcase menu items and seasonal offerings',
    tags: ['newsletter', 'restaurant', 'menu', 'seasonal']
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
    description: 'Highlight property features and create urgency',
    tags: ['real estate', 'property', 'alert', 'urgent']
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
    description: 'Professional event invitations with clear details',
    tags: ['event', 'invitation', 'networking', 'professional']
  }
};

export const EnhancedEmailAIChat: React.FC<EnhancedEmailAIChatProps> = ({ 
  editor, 
  onEmailGenerated, 
  onSaveTemplate 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '🎯 **Welcome to your AI Email Assistant!**\n\nI\'m here to help you create professional emails that convert. Choose a quick action below to get started, or tell me what you\'d like to create:\n\n• **Generate complete emails** with subject lines and content\n• **Create professional images** that match your brand\n• **Optimize existing content** for better engagement\n• **Browse industry templates** for instant inspiration\n\nEverything I create appears directly in your editor for seamless editing. What would you like to work on?',
      timestamp: new Date(),
      suggestions: [
        'Create a welcome email series',
        'Generate a product announcement',
        'Build a newsletter template',
        'Optimize my current email'
      ],
      actionType: 'general'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { 
      icon: <FileText className="w-6 h-6" />, 
      label: 'Industry Templates', 
      action: 'Show me industry email templates',
      description: 'Browse pre-made templates',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      onClick: () => setShowTemplates(true)
    },
    { 
      icon: <Palette className="w-6 h-6" />, 
      label: 'Brand Kit', 
      action: 'Help me apply my brand colors and fonts to this email',
      description: 'Apply brand styling',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    },
    { 
      icon: <Image className="w-6 h-6" />, 
      label: 'AI Images', 
      action: 'Generate professional images for my email campaign',
      description: 'Create custom visuals',
      color: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    { 
      icon: <Type className="w-6 h-6" />, 
      label: 'Smart Copy', 
      action: 'Write compelling email copy that converts readers into customers',
      description: 'AI-powered copywriting',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    },
    { 
      icon: <Target className="w-6 h-6" />, 
      label: 'Optimize', 
      action: 'Analyze and improve my current email for better performance',
      description: 'Enhance engagement',
      color: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    },
    { 
      icon: <BarChart3 className="w-6 h-6" />, 
      label: 'A/B Testing', 
      action: 'Create multiple variations of this email for split testing',
      description: 'Test multiple versions',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
    }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();
    
    // Handle template requests first
    if (input.includes('template') || input.includes('industry') || input.includes('show me')) {
      const templateList = Object.keys(industryTemplates);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `🎨 **Available Industry Templates**\n\nI have ${templateList.length} professional templates ready to load into your editor. Each template is optimized for specific industries and use cases:\n\n${templateList.map((template, index) => `${index + 1}. **${template}** - ${industryTemplates[template as keyof typeof industryTemplates].description}`).join('\n')}\n\nClick on any template above to load it instantly, or use the Template Browser for a visual preview.`,
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
          content: `✅ **Email Created Successfully!**\n\n**Subject:** ${emailResponse.subject}\n**Preview:** ${emailResponse.previewText}\n\nYour complete email is now loaded in the editor and ready for customization. You can edit it manually or ask me to make specific improvements.`,
          timestamp: new Date(),
          actionType: 'email_generated',
          suggestions: [
            'Make the tone more casual',
            'Add urgency to drive action',
            'Shorten the content',
            'Add call-to-action buttons',
            'Create an A/B test version'
          ]
        };
      } catch (error) {
        console.error('Error generating email:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ **Email Generation Failed**\n\nI encountered an issue creating your email. Please check your OpenAI API key configuration in the service file and try again.',
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
          content: `✅ **Image Generated and Inserted!**\n\n**Prompt:** ${imagePrompt}\n\nYour custom image is now in your email editor. You can resize, reposition, or ask me to generate alternative versions.`,
          timestamp: new Date(),
          actionType: 'image_generated',
          suggestions: [
            'Generate another variation',
            'Create a different style',
            'Add image caption',
            'Generate a matching header image'
          ]
        };
      } catch (error) {
        console.error('Error generating image:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ **Image Generation Failed**\n\nI had trouble generating that image. Please check your OpenAI API key and try again.',
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
            content: `✅ **Content Optimized!**\n\nI've analyzed and improved your email content based on your request. The updated version is now in your editor with enhanced:\n\n• Copy optimization\n• Structure improvements\n• Engagement enhancements\n\nYou can continue editing manually or ask for further refinements.`,
            timestamp: new Date(),
            actionType: 'content_refined',
            suggestions: [
              'Make further improvements',
              'Add more call-to-actions',
              'Optimize for mobile',
              'Create A/B test version'
            ]
          };
        } else {
          return {
            id: Date.now().toString(),
            type: 'ai',
            content: '⚠️ **No Content to Optimize**\n\nI need some content in your editor to refine. Please create an email first or paste some content, then ask me to improve it.',
            timestamp: new Date(),
            actionType: 'general',
            suggestions: [
              'Create a new email',
              'Load a template',
              'Generate email content',
              'Browse templates'
            ]
          };
        }
      } catch (error) {
        console.error('Error refining content:', error);
        return {
          id: Date.now().toString(),
          type: 'ai',
          content: '❌ **Optimization Failed**\n\nI had trouble refining that content. Please try again.',
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
            content: `✅ **Content Created and Inserted!**\n\nYour generated content is now in the editor and ready for customization. You can edit it manually or ask me to refine it further.`,
            timestamp: new Date(),
            actionType: 'content_refined',
            suggestions: [
              'Adjust the tone',
              'Make it shorter',
              'Add more details',
              'Create alternative version'
            ]
          };
        } else {
          return {
            id: Date.now().toString(),
            type: 'ai',
            content: `📝 **Content Generated**\n\n**${contentType === 'subject' ? 'Subject Line' : 'Content'}:**\n\n"${content}"\n\nWould you like me to create a full email using this content?`,
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
          content: '❌ **Content Generation Failed**\n\nI had trouble generating that content. Please try again.',
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
        content: `💡 **AI Assistant Response**\n\n${response}\n\nI can help you create emails, generate images, write copy, and optimize content - all directly in your editor. What would you like to work on?`,
        timestamp: new Date(),
        actionType: 'general',
        suggestions: [
          'Create email content',
          'Generate professional images',
          'Design templates',
          'Write compelling copy'
        ]
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '🚀 **Ready to Help!**\n\nI\'m here to assist with your email creation! I can generate complete emails, create images, write copy, and optimize content - all directly in your editor. What would you like to work on?',
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
        content: '❌ **Error Processing Request**\n\nI encountered an error while processing your request. Please check your API configuration and try again.',
        timestamp: new Date(),
        actionType: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  const applyAISuggestion = async (suggestion: string) => {
    if (!editor) return;
    
    // Handle industry template suggestions
    if (Object.keys(industryTemplates).includes(suggestion)) {
      const template = industryTemplates[suggestion as keyof typeof industryTemplates];
      editor.commands.setContent(template.html);
      onEmailGenerated?.(template.html);
      
      // Add confirmation message
      const confirmMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ **${suggestion} Template Loaded!**\n\nThe template is now in your editor and ready for customization. You can edit it manually or ask me to make specific modifications.`,
        timestamp: new Date(),
        actionType: 'template_loaded',
        suggestions: [
          'Customize the colors',
          'Update the copy',
          'Add more sections',
          'Generate images for this template'
        ]
      };
      setMessages(prev => [...prev, confirmMessage]);
      return;
    }
    
    // For other suggestions, treat as new message
    setNewMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleTemplateSelect = (templateName: string) => {
    const template = industryTemplates[templateName as keyof typeof industryTemplates];
    if (editor && template) {
      editor.commands.setContent(template.html);
      onEmailGenerated?.(template.html);
      
      const confirmMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ **${templateName} Template Loaded!**\n\nThe template is now in your editor with professional styling and structure. You can customize colors, copy, and layout, or ask me to make specific improvements.`,
        timestamp: new Date(),
        actionType: 'template_loaded',
        suggestions: [
          'Customize the colors',
          'Update the copy',
          'Add more sections',
          'Generate matching images'
        ]
      };
      setMessages(prev => [...prev, confirmMessage]);
      setShowTemplates(false);
    }
  };

  const handleSaveCurrentTemplate = () => {
    if (!editor) return;
    
    const currentHtml = editor.getHTML();
    if (currentHtml && currentHtml.length > 100) {
      setShowSaveTemplate(true);
    } else {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '⚠️ **No Content to Save**\n\nPlease create some content in your editor first before saving as a template.',
        timestamp: new Date(),
        actionType: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const confirmSaveTemplate = (templateData: { name: string; description: string; category: string; tags: string[] }) => {
    if (editor && onSaveTemplate) {
      const currentHtml = editor.getHTML();
      onSaveTemplate({
        ...templateData,
        html: currentHtml
      });
      
      const confirmMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ **Template Saved Successfully!**\n\n"${templateData.name}" is now available in your template library for future use.`,
        timestamp: new Date(),
        actionType: 'general'
      };
      setMessages(prev => [...prev, confirmMessage]);
      setShowSaveTemplate(false);
    }
  };

  // Template Browser View
  if (showTemplates) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Industry Templates</h3>
              <p className="text-sm text-gray-600">Professional templates optimized for different industries</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)}>
              ← Back to Assistant
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 grid gap-4">
            {Object.entries(industryTemplates).map(([name, template]) => (
              <Card key={name} className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200" onClick={() => handleTemplateSelect(name)}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">{template.category}</Badge>
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-xs text-gray-600 font-mono leading-relaxed">
                      {template.html.substring(0, 150)}...
                    </div>
                  </div>
                  
                  <Button className="w-full group-hover:bg-blue-600 transition-colors" variant="default">
                    <Zap className="w-4 h-4 mr-2" />
                    Load Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Save Template Dialog
  if (showSaveTemplate) {
    return (
      <SaveTemplateDialog 
        onSave={confirmSaveTemplate}
        onCancel={() => setShowSaveTemplate(false)}
      />
    );
  }

  // Main Chat Interface
  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">AI Email Assistant</h3>
              <p className="text-sm text-gray-600">Create • Optimize • Enhance</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveCurrentTemplate} className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Save className="w-4 h-4 mr-1" />
              Save Template
            </Button>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
              AI Powered
            </Badge>
          </div>
        </div>
        
        {/* Enhanced Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleQuickAction(action)}
              className={`flex flex-col items-center gap-3 h-auto p-4 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 ${action.color}`}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center w-8 h-8">
                {action.icon}
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm mb-1">{action.label}</div>
                <div className="text-xs opacity-90 leading-tight">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.type === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-900 shadow-sm'} rounded-2xl p-4`}>
                <div className="flex items-start gap-3">
                  {message.type === 'ai' && message.actionType && (
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      {message.actionType === 'email_generated' && <Check className="w-3 h-3 text-white" />}
                      {message.actionType === 'image_generated' && <Image className="w-3 h-3 text-white" />}
                      {message.actionType === 'content_refined' && <Wand2 className="w-3 h-3 text-white" />}
                      {message.actionType === 'template_loaded' && <FileText className="w-3 h-3 text-white" />}
                      {message.actionType === 'general' && <Sparkles className="w-3 h-3 text-white" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium opacity-80 mb-3 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Quick Actions
                    </p>
                    <div className="grid gap-2">
                      {message.suggestions.slice(0, 4).map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => applyAISuggestion(suggestion)}
                          className="justify-start h-auto p-3 bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700 border-gray-200 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200"
                          disabled={isLoading}
                        >
                          <Zap className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm">{suggestion}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">AI is creating your content...</div>
                    <div className="text-xs text-gray-600 mt-1">This will appear directly in your editor</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Input */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex gap-3 mb-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Describe the email you want to create or ask me to optimize existing content..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-green-500" />
              Content loads directly in editor
            </span>
            <span className="flex items-center gap-1">
              <Type className="w-3 h-3 text-blue-500" />
              Manual editing enabled
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by OpenAI</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Save Template Dialog Component
const SaveTemplateDialog: React.FC<{
  onSave: (data: { name: string; description: string; category: string; tags: string[] }) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Custom');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const categories = ['Custom', 'E-commerce', 'SaaS', 'Restaurant', 'Real Estate', 'Events', 'Newsletter', 'Welcome', 'Promotional'];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (name.trim() && description.trim()) {
      onSave({ name: name.trim(), description: description.trim(), category, tags });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Save as Template</h3>
            <p className="text-sm text-gray-600">Create a reusable template from your current email</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Welcome Email Series"
            className="border-gray-300 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this template's purpose"
            className="border-gray-300 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag (e.g., professional, urgent)"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 border-gray-300 focus:border-blue-500"
            />
            <Button onClick={addTag} size="sm" variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-red-100" onClick={() => removeTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <Button 
          onClick={handleSave} 
          disabled={!name.trim() || !description.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Template
        </Button>
      </div>
    </div>
  );
};
