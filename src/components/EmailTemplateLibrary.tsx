
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  ShoppingCart,
  Megaphone,
  Calendar,
  Gift,
  Users,
  Star,
  Trophy
} from 'lucide-react';

interface EmailTemplateLibraryProps {
  editor: Editor | null;
}

interface Template {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  preview: string;
  template: string;
}

const templates: Template[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    category: 'welcome',
    icon: <Mail className="w-5 h-5" />,
    preview: 'Welcome new subscribers',
    template: `
      <div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div class="email-block header-block" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Welcome!</h1>
          <p style="margin: 16px 0 0 0; font-size: 18px; opacity: 0.9;">Thanks for joining our community</p>
        </div>
        <div class="email-block content-block" style="padding: 40px 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            We're excited to have you on board! Here's what you can expect from us:
          </p>
          <ul style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 30px 0;">
            <li>Weekly newsletter with industry insights</li>
            <li>Exclusive offers and early access</li>
            <li>Tips and best practices</li>
          </ul>
          <div style="text-align: center;">
            <a href="#" style="display: inline-block; padding: 16px 32px; background-color: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Get Started</a>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'promotional',
    name: 'Promotional',
    category: 'promotional',
    icon: <Megaphone className="w-5 h-5" />,
    preview: 'Sales and offers',
    template: `
      <div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div class="email-block header-block" style="background-color: #ff6b6b; padding: 30px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔥 FLASH SALE</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Limited Time Offer - Don't Miss Out!</p>
        </div>
        <div class="email-block content-block" style="padding: 40px 20px; text-align: center;">
          <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">50% OFF Everything</h2>
          <p style="font-size: 18px; color: #666; margin: 0 0 30px 0;">Use code: <strong style="color: #ff6b6b;">FLASH50</strong></p>
          <div style="margin: 30px 0;">
            <a href="#" style="display: inline-block; padding: 18px 36px; background-color: #ff6b6b; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 18px;">Shop Now</a>
          </div>
          <p style="font-size: 14px; color: #999;">*Offer valid until midnight. Terms and conditions apply.</p>
        </div>
      </div>
    `
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    category: 'newsletter',
    icon: <Calendar className="w-5 h-5" />,
    preview: 'Regular updates',
    template: `
      <div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div class="email-block header-block" style="background-color: #4ecdc4; padding: 30px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Weekly Newsletter</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Week of ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="email-block content-block" style="padding: 30px 20px;">
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 20px; margin: 0 0 15px 0;">📈 This Week's Highlights</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #666; margin: 0;">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; font-size: 18px; margin: 0 0 10px 0;">🎯 Featured Article</h3>
            <p style="font-size: 16px; line-height: 1.6; color: #666; margin: 0 0 15px 0;">
              Discover the latest trends and insights in our industry.
            </p>
            <a href="#" style="color: #4ecdc4; text-decoration: none; font-weight: bold;">Read More →</a>
          </div>
        </div>
      </div>
    `
  }
];

export const EmailTemplateLibrary: React.FC<EmailTemplateLibraryProps> = ({ editor }) => {
  const applyTemplate = (template: string) => {
    if (editor) {
      editor.commands.setContent(template);
    }
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Email Templates</h3>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 text-xs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="promotional">Promo</TabsTrigger>
          <TabsTrigger value="newsletter">News</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-2 mt-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
              <div onClick={() => applyTemplate(template.template)} className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{template.preview}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-2 mt-4">
            {templates.filter(t => t.category === category).map((template) => (
              <Card key={template.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div onClick={() => applyTemplate(template.template)} className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{template.preview}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
