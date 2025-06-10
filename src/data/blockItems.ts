
import React from 'react';
import { 
  Type, 
  Image, 
  MousePointer, 
  Columns, 
  Minus, 
  Play, 
  Share2, 
  Menu, 
  Code,
  Package
} from 'lucide-react';

export interface BlockItem {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
  category: 'content' | 'layout' | 'media' | 'navigation';
}

export const blockItems: BlockItem[] = [
  {
    id: 'text',
    name: 'Text',
    icon: <Type className="w-6 h-6" />,
    description: 'Rich text content with formatting',
    category: 'content'
  },
  {
    id: 'productfeed',
    name: 'Product Feed',
    icon: <Package className="w-6 h-6" />,
    description: 'Display products with images, prices, and descriptions',
    category: 'content'
  },
  {
    id: 'image',
    name: 'Image',
    icon: <Image className="w-6 h-6" />,
    description: 'Images with optional links',
    category: 'media'
  },
  {
    id: 'button',
    name: 'Button',
    icon: <MousePointer className="w-6 h-6" />,
    description: 'Call-to-action buttons',
    category: 'content'
  },
  {
    id: 'spacer',
    name: 'Spacer',
    icon: <Minus className="w-6 h-6" />,
    description: 'Add vertical spacing',
    category: 'layout'
  },
  {
    id: 'divider',
    name: 'Divider',
    icon: <Minus className="w-6 h-6" />,
    description: 'Horizontal dividing line',
    category: 'layout'
  },
  {
    id: 'video',
    name: 'Video',
    icon: <Play className="w-6 h-6" />,
    description: 'Video thumbnail with play button',
    category: 'media'
  },
  {
    id: 'social',
    name: 'Social',
    icon: <Share2 className="w-6 h-6" />,
    description: 'Social media icons',
    category: 'navigation'
  },
  {
    id: 'html',
    name: 'HTML',
    icon: <Code className="w-6 h-6" />,
    description: 'Custom HTML code',
    category: 'content'
  }
];
