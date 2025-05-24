
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus,
  Type, 
  Image, 
  MousePointer, 
  Columns, 
  Minus,
  Gift,
  Star,
  Calendar,
  ShoppingCart,
  Layout
} from 'lucide-react';

interface BlockInserterProps {
  editor: Editor | null;
}

interface BlockTemplate {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  html: string;
}

const blockTemplates: BlockTemplate[] = [
  {
    id: 'header',
    name: 'Header',
    category: 'Basic',
    icon: <Type className="w-4 h-4" />,
    html: `<div class="email-block header-block">
      <h1 style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; text-align: center; background-color: #f8f9fa; font-size: 24px;">
        Your Header Text
      </h1>
    </div>`
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    category: 'Basic',
    icon: <Type className="w-4 h-4" />,
    html: `<div class="email-block paragraph-block">
      <p style="font-family: Arial, sans-serif; color: #666; line-height: 1.6; margin: 0; padding: 20px; font-size: 16px;">
        Your paragraph text goes here. You can format this text with bold, italic, and other styling options.
      </p>
    </div>`
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Basic',
    icon: <MousePointer className="w-4 h-4" />,
    html: `<div class="email-block button-block" style="text-align: center; padding: 20px;">
      <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-family: Arial, sans-serif; font-weight: bold;">
        Click Here
      </a>
    </div>`
  },
  {
    id: 'image',
    name: 'Image',
    category: 'Basic',
    icon: <Image className="w-4 h-4" />,
    html: `<div class="email-block image-block" style="text-align: center; padding: 20px;">
      <img src="https://via.placeholder.com/400x200" alt="Placeholder image" style="max-width: 100%; height: auto; border: 0;" />
    </div>`
  },
  {
    id: 'two-column',
    name: 'Two Columns',
    category: 'Layout',
    icon: <Columns className="w-4 h-4" />,
    html: `<div class="email-block two-column-block" style="padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="50%" style="padding-right: 10px; vertical-align: top;">
            <p style="font-family: Arial, sans-serif; color: #666; margin: 0; font-size: 16px;">
              Left column content
            </p>
          </td>
          <td width="50%" style="padding-left: 10px; vertical-align: top;">
            <p style="font-family: Arial, sans-serif; color: #666; margin: 0; font-size: 16px;">
              Right column content
            </p>
          </td>
        </tr>
      </table>
    </div>`
  },
  {
    id: 'spacer',
    name: 'Spacer',
    category: 'Layout',
    icon: <Minus className="w-4 h-4" />,
    html: `<div class="email-block spacer-block" style="height: 40px; line-height: 40px; font-size: 1px;">
      &nbsp;
    </div>`
  },
  {
    id: 'hero-gradient',
    name: 'Hero Banner',
    category: 'Advanced',
    icon: <Layout className="w-4 h-4" />,
    html: `<div class="email-block hero-block" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; text-align: center; border-radius: 12px; margin: 20px 0;">
      <h1 style="color: white; font-size: 42px; font-weight: 700; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Transform Your Business</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 0 0 32px 0; max-width: 500px; margin-left: auto; margin-right: auto;">Discover how our innovative solutions can take your company to the next level</p>
      <a href="#" style="background: rgba(255,255,255,0.2); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid rgba(255,255,255,0.3);">Get Started Now</a>
    </div>`
  },
  {
    id: 'product-showcase',
    name: 'Product Card',
    category: 'Advanced',
    icon: <ShoppingCart className="w-4 h-4" />,
    html: `<div class="email-block product-block" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin: 20px 0;">
      <div style="padding: 0; margin: 0;">
        <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop" alt="Product" style="width: 100%; height: 200px; object-fit: cover; display: block;" />
      </div>
      <div style="padding: 24px;">
        <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Premium Product</h3>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">Experience quality with our latest offering.</p>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: 700; color: #dc2626;">$199</span>
        </div>
        <a href="#" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; width: 100%; text-align: center;">Shop Now</a>
      </div>
    </div>`
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    category: 'Advanced',
    icon: <Star className="w-4 h-4" />,
    html: `<div class="email-block testimonial-block" style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 24px; margin: 20px 0; border-radius: 8px;">
      <blockquote style="font-size: 16px; line-height: 1.6; color: #374151; font-style: italic; margin: 0 0 16px 0;">"This product has completely transformed how we approach our business. Highly recommended!"</blockquote>
      <div style="display: flex; align-items: center;">
        <div>
          <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">Sarah Johnson</h4>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Marketing Director</p>
        </div>
      </div>
    </div>`
  },
  {
    id: 'promotional-banner',
    name: 'Promo Banner',
    category: 'Advanced',
    icon: <Gift className="w-4 h-4" />,
    html: `<div class="email-block promo-block" style="background: linear-gradient(90deg, #ef4444, #dc2626); padding: 32px; text-align: center; border-radius: 12px; margin: 20px 0;">
      <h2 style="color: white; font-size: 28px; font-weight: 800; margin: 0 0 8px 0;">SPECIAL OFFER</h2>
      <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0 0 24px 0;">Limited time - Don't miss out!</p>
      <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 12px 24px; border-radius: 50px; margin-bottom: 20px;">
        <span style="color: white; font-size: 24px; font-weight: 800;">50% OFF</span>
      </div>
      <br />
      <a href="#" style="background: white; color: #dc2626; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Claim Now</a>
    </div>`
  }
];

export const BlockInserter: React.FC<BlockInserterProps> = ({ editor }) => {
  const insertBlock = (template: BlockTemplate) => {
    if (editor) {
      editor.chain().focus().insertContent(template.html).run();
    }
  };

  const categories = Array.from(new Set(blockTemplates.map(block => block.category)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="w-4 h-4 mr-2" />
          Insert Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-slate-200 shadow-lg" align="start">
        {categories.map((category) => (
          <div key={category}>
            <DropdownMenuLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {category}
            </DropdownMenuLabel>
            {blockTemplates
              .filter(block => block.category === category)
              .map((block) => (
                <DropdownMenuItem
                  key={block.id}
                  onClick={() => insertBlock(block)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-slate-50"
                >
                  <div className="flex-shrink-0">
                    {block.icon}
                  </div>
                  <span className="text-sm">{block.name}</span>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
