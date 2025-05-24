
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Type, 
  Image, 
  Square, 
  Minus, 
  Code, 
  Columns, 
  Share2,
  MousePointer
} from 'lucide-react';

interface EmailBlockLibraryProps {
  editor: Editor | null;
}

interface BlockType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  template: string;
}

const blockTypes: BlockType[] = [
  {
    id: 'header',
    name: 'Header',
    icon: <Type className="w-5 h-5" />,
    description: 'Add a header with customizable styling',
    template: `<div class="email-block header-block">
      <h1 style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; text-align: center; background-color: #f8f9fa; font-size: 24px;">
        Your Header Text
      </h1>
    </div>`
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    icon: <Type className="w-5 h-5" />,
    description: 'Add text content with rich formatting',
    template: `<div class="email-block paragraph-block">
      <p style="font-family: Arial, sans-serif; color: #666; line-height: 1.6; margin: 0; padding: 20px; font-size: 16px;">
        Your paragraph text goes here. You can format this text with bold, italic, and other styling options.
      </p>
    </div>`
  },
  {
    id: 'button',
    name: 'Button',
    icon: <MousePointer className="w-5 h-5" />,
    description: 'Add a call-to-action button',
    template: `<div class="email-block button-block" style="text-align: center; padding: 20px;">
      <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-family: Arial, sans-serif; font-weight: bold;">
        Click Here
      </a>
    </div>`
  },
  {
    id: 'image',
    name: 'Image',
    icon: <Image className="w-5 h-5" />,
    description: 'Add an image with alt text',
    template: `<div class="email-block image-block" style="text-align: center; padding: 20px;">
      <img src="https://via.placeholder.com/400x200" alt="Placeholder image" style="max-width: 100%; height: auto; border: 0;" />
    </div>`
  },
  {
    id: 'spacer',
    name: 'Spacer',
    icon: <Minus className="w-5 h-5" />,
    description: 'Add vertical spacing',
    template: `<div class="email-block spacer-block" style="height: 40px; line-height: 40px; font-size: 1px;">
      &nbsp;
    </div>`
  },
  {
    id: 'divider',
    name: 'Divider',
    icon: <Minus className="w-5 h-5" />,
    description: 'Add a horizontal line divider',
    template: `<div class="email-block divider-block" style="padding: 20px;">
      <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 0;" />
    </div>`
  },
  {
    id: 'two-column',
    name: 'Two Columns',
    icon: <Columns className="w-5 h-5" />,
    description: 'Add a two-column layout',
    template: `<div class="email-block two-column-block" style="padding: 20px;">
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
    id: 'social',
    name: 'Social Icons',
    icon: <Share2 className="w-5 h-5" />,
    description: 'Add social media icons',
    template: `<div class="email-block social-block" style="text-align: center; padding: 20px;">
      <a href="#" style="display: inline-block; margin: 0 10px;">
        <img src="https://via.placeholder.com/32x32" alt="Facebook" style="width: 32px; height: 32px;" />
      </a>
      <a href="#" style="display: inline-block; margin: 0 10px;">
        <img src="https://via.placeholder.com/32x32" alt="Twitter" style="width: 32px; height: 32px;" />
      </a>
      <a href="#" style="display: inline-block; margin: 0 10px;">
        <img src="https://via.placeholder.com/32x32" alt="LinkedIn" style="width: 32px; height: 32px;" />
      </a>
    </div>`
  },
  {
    id: 'raw-html',
    name: 'Raw HTML',
    icon: <Code className="w-5 h-5" />,
    description: 'Add custom HTML code',
    template: `<div class="email-block raw-html-block">
      <!-- Add your custom HTML here -->
      <div style="padding: 20px; background-color: #f8f9fa; border: 1px dashed #ccc; text-align: center; font-family: Arial, sans-serif; color: #666;">
        Custom HTML Block - Edit to add your code
      </div>
    </div>`
  }
];

export const EmailBlockLibrary: React.FC<EmailBlockLibraryProps> = ({ editor }) => {
  const addBlock = (template: string) => {
    if (editor) {
      editor.chain().focus().insertContent(template).run();
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Email Blocks</h3>
      <div className="space-y-2">
        {blockTypes.map((block) => (
          <Card key={block.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div 
              onClick={() => addBlock(block.template)}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                {block.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {block.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {block.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
