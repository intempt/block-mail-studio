
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  ShoppingCart, 
  Calendar, 
  Star,
  Users,
  Gift,
  Zap
} from 'lucide-react';

interface EmailBlock {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  html: string;
  thumbnail: string;
  premium?: boolean;
}

interface AdvancedBlockLibraryProps {
  editor: Editor | null;
}

const emailBlocks: EmailBlock[] = [
  {
    id: 'hero-gradient',
    name: 'Hero with Gradient',
    category: 'Headers',
    description: 'Eye-catching hero section with gradient background',
    icon: <Layout className="w-4 h-4" />,
    thumbnail: '🎨',
    html: `
      <div class="email-block hero-block" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; text-align: center; border-radius: 12px; margin: 20px 0;">
        <h1 style="color: white; font-size: 42px; font-weight: 700; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Transform Your Business</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 0 0 32px 0; max-width: 500px; margin-left: auto; margin-right: auto;">Discover how our innovative solutions can take your company to the next level</p>
        <a href="#" style="background: rgba(255,255,255,0.2); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s;">Get Started Now</a>
      </div>
    `
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    category: 'Content',
    description: 'Professional product display with features',
    icon: <ShoppingCart className="w-4 h-4" />,
    thumbnail: '📦',
    html: `
      <div class="email-block product-block" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin: 20px 0;">
        <div style="padding: 0; margin: 0;">
          <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop" alt="Product" style="width: 100%; height: 300px; object-fit: cover; display: block;" />
        </div>
        <div style="padding: 32px;">
          <h2 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 12px 0;">Premium Wireless Headphones</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">Experience crystal-clear audio with our latest noise-canceling technology. Perfect for work, travel, and everything in between.</p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 700; color: #dc2626;">$299</span>
            <span style="font-size: 18px; color: #6b7280; text-decoration: line-through;">$399</span>
          </div>
          <a href="#" style="background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; width: 100%; text-align: center;">Shop Now</a>
        </div>
      </div>
    `
  },
  {
    id: 'testimonial-card',
    name: 'Customer Testimonial',
    category: 'Social Proof',
    description: 'Build trust with customer reviews',
    icon: <Star className="w-4 h-4" />,
    thumbnail: '⭐',
    html: `
      <div class="email-block testimonial-block" style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 32px; margin: 20px 0; border-radius: 8px;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=60&h=60&fit=crop&crop=face" alt="Customer" style="width: 60px; height: 60px; border-radius: 50%; margin-right: 16px;" />
          <div>
            <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">Sarah Johnson</h4>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Marketing Director</p>
          </div>
        </div>
        <blockquote style="font-size: 16px; line-height: 1.6; color: #374151; font-style: italic; margin: 0;">"This product has completely transformed how we approach our marketing campaigns. The results speak for themselves - 150% increase in engagement!"</blockquote>
        <div style="margin-top: 16px;">
          <span style="color: #fbbf24;">★★★★★</span>
        </div>
      </div>
    `
  },
  {
    id: 'event-invitation',
    name: 'Event Invitation',
    category: 'Events',
    description: 'Elegant event invitation with RSVP',
    icon: <Calendar className="w-4 h-4" />,
    thumbnail: '📅',
    premium: true,
    html: `
      <div class="email-block event-block" style="background: linear-gradient(45deg, #1e293b, #334155); color: white; padding: 40px; text-align: center; border-radius: 16px; margin: 20px 0;">
        <div style="background: rgba(255,255,255,0.1); display: inline-block; padding: 12px 24px; border-radius: 50px; margin-bottom: 24px;">
          <span style="font-size: 14px; font-weight: 600; letter-spacing: 1px;">EXCLUSIVE INVITATION</span>
        </div>
        <h2 style="font-size: 36px; font-weight: 700; margin: 0 0 16px 0;">Product Launch Event</h2>
        <p style="font-size: 18px; margin: 0 0 32px 0; opacity: 0.9;">Join us for an unforgettable evening as we unveil our latest innovation</p>
        <div style="background: rgba(255,255,255,0.1); padding: 24px; border-radius: 12px; margin: 0 0 32px 0;">
          <div style="font-size: 16px; margin-bottom: 8px;">📅 March 15, 2024 • 7:00 PM</div>
          <div style="font-size: 16px;">📍 Grand Ballroom, City Center</div>
        </div>
        <a href="#" style="background: #ffffff; color: #1e293b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">RSVP Now</a>
      </div>
    `
  },
  {
    id: 'promotional-banner',
    name: 'Promotional Banner',
    category: 'Promotions',
    description: 'High-converting promotional banner',
    icon: <Gift className="w-4 h-4" />,
    thumbnail: '🎁',
    html: `
      <div class="email-block promo-block" style="background: linear-gradient(90deg, #ef4444, #dc2626); padding: 32px; text-align: center; border-radius: 12px; margin: 20px 0; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50%; right: -10%; width: 100px; height: 200px; background: rgba(255,255,255,0.1); transform: rotate(45deg);"></div>
        <h2 style="color: white; font-size: 32px; font-weight: 800; margin: 0 0 8px 0;">BLACK FRIDAY SALE</h2>
        <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 0 0 24px 0;">Limited time offer - Don't miss out!</p>
        <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 16px 32px; border-radius: 50px; margin-bottom: 24px;">
          <span style="color: white; font-size: 36px; font-weight: 800;">50% OFF</span>
        </div>
        <br />
        <a href="#" style="background: white; color: #dc2626; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Shop Now</a>
      </div>
    `
  }
];

export const AdvancedBlockLibrary: React.FC<AdvancedBlockLibraryProps> = ({ editor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(emailBlocks.map(block => block.category)))];

  const filteredBlocks = emailBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const insertBlock = (block: EmailBlock) => {
    if (editor) {
      editor.chain().focus().insertContent(block.html).run();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Email Blocks</h3>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search blocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredBlocks.map(block => (
            <Card 
              key={block.id} 
              className="p-3 cursor-pointer hover:shadow-md transition-shadow border border-slate-200"
              onClick={() => insertBlock(block)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{block.thumbnail}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-slate-900 truncate">{block.name}</h4>
                    {block.premium && (
                      <Badge variant="secondary" className="text-xs">Pro</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{block.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {block.category}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
