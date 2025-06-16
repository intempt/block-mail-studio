
import { 
  Type, 
  Image, 
  MousePointer, 
  MoveVertical, 
  Minus,
  Video, 
  Share2, 
  FileCode,
  Table,
  Database
} from 'lucide-react';
import { BlockItem } from '@/types/blockPalette';

export const blockItems: BlockItem[] = [
  { id: 'text', name: 'Text', description: 'Add paragraphs, headings, and formatted text', icon: <Type className="w-4 h-4" /> },
  { id: 'image', name: 'Image', description: 'Insert images with optional links', icon: <Image className="w-4 h-4" /> },
  { id: 'button', name: 'Call-to-action', description: 'Call-to-action buttons and links with custom styling', icon: <MousePointer className="w-4 h-4" /> },
  { id: 'spacer', name: 'Spacer', description: 'Add vertical spacing between blocks', icon: <MoveVertical className="w-4 h-4" /> },
  { id: 'divider', name: 'Divider', description: 'Horizontal line separators', icon: <Minus className="w-4 h-4" /> },
  { id: 'video', name: 'Video', description: 'Embed videos with thumbnails', icon: <Video className="w-4 h-4" /> },
  { id: 'social', name: 'Social', description: 'Social media icons and links', icon: <Share2 className="w-4 h-4" /> },
  { id: 'html', name: 'HTML', description: 'Custom HTML content', icon: <FileCode className="w-4 h-4" /> },
  { id: 'table', name: 'Table', description: 'Data tables with customizable styling', icon: <Table className="w-4 h-4" /> },
  { id: 'content', name: 'Content', description: 'Dynamic content from JSON data arrays', icon: <Database className="w-4 h-4" /> },
];
