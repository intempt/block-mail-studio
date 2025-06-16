
import React from 'react';
import { 
  Type, 
  Image, 
  MousePointerClick, 
  Space, 
  Video, 
  Share2, 
  Table,
  Minus,
  Code,
  Package
} from 'lucide-react';

export interface RibbonBlockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const ribbonBlockItems: RibbonBlockItem[] = [
  { id: 'text', name: 'Text', icon: <Type className="w-7 h-7" /> },
  { id: 'image', name: 'Image', icon: <Image className="w-7 h-7" /> },
  { id: 'button', name: 'Button', icon: <MousePointerClick className="w-7 h-7" /> },
  { id: 'spacer', name: 'Spacer', icon: <Space className="w-7 h-7" /> },
  { id: 'divider', name: 'Divider', icon: <Minus className="w-7 h-7" /> },
  { id: 'video', name: 'Video', icon: <Video className="w-7 h-7" /> },
  { id: 'social', name: 'Social', icon: <Share2 className="w-7 h-7" /> },
  { id: 'html', name: 'HTML', icon: <Code className="w-7 h-7" /> },
  { id: 'table', name: 'Table', icon: <Table className="w-7 h-7" /> },
  { id: 'product', name: 'Product', icon: <Package className="w-7 h-7" /> }
];
