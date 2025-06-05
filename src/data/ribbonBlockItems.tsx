
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
  Database
} from 'lucide-react';

export interface RibbonBlockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const ribbonBlockItems: RibbonBlockItem[] = [
  { id: 'text', name: 'Text', icon: <Type className="w-9 h-9" /> },
  { id: 'image', name: 'Image', icon: <Image className="w-9 h-9" /> },
  { id: 'button', name: 'Button', icon: <MousePointerClick className="w-9 h-9" /> },
  { id: 'spacer', name: 'Spacer', icon: <Space className="w-9 h-9" /> },
  { id: 'divider', name: 'Divider', icon: <Minus className="w-9 h-9" /> },
  { id: 'video', name: 'Video', icon: <Video className="w-9 h-9" /> },
  { id: 'social', name: 'Social', icon: <Share2 className="w-9 h-9" /> },
  { id: 'html', name: 'HTML', icon: <Code className="w-9 h-9" /> },
  { id: 'table', name: 'Table', icon: <Table className="w-9 h-9" /> },
  { id: 'content', name: 'Content', icon: <Database className="w-9 h-9" /> }
];
