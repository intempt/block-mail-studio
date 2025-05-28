
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Type, 
  Image, 
  Table, 
  Minus,
  Quote,
  List,
  Star,
  ChevronDown,
  MousePointer,
  Code,
  Mail,
  Calendar,
  MapPin
} from 'lucide-react';

interface BlockInserterProps {
  editor: Editor | null;
}

interface BlockTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'content' | 'media' | 'layout' | 'interactive';
  content: string;
  description: string;
}

export const BlockInserter: React.FC<BlockInserterProps> = ({ editor }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const blockTemplates: BlockTemplate[] = [
    {
      id: 'paragraph',
      name: 'Paragraph',
      icon: <Type className="w-4 h-4" />,
      category: 'content',
      content: '<p>Add your content here...</p>',
      description: 'Basic text paragraph'
    },
    {
      id: 'heading',
      name: 'Heading',
      icon: <Type className="w-4 h-4" />,
      category: 'content',
      content: '<h2>Your Heading</h2>',
      description: 'Section heading'
    },
    {
      id: 'subheading',
      name: 'Subheading',
      icon: <Type className="w-4 h-4" />,
      category: 'content',
      content: '<h3>Your Subheading</h3>',
      description: 'Subsection heading'
    },
    {
      id: 'hero-image',
      name: 'Hero Image',
      icon: <Image className="w-4 h-4" />,
      category: 'media',
      content: '<div style="text-align: center; margin: 32px 0;"><img src="https://via.placeholder.com/600x200" alt="Hero image" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" /></div>',
      description: 'Large featured image'
    },
    {
      id: 'image-gallery',
      name: 'Image Gallery',
      icon: <Image className="w-4 h-4" />,
      category: 'media',
      content: '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin: 24px 0;"><img src="https://via.placeholder.com/150x150" alt="Gallery image 1" style="width: 100%; height: auto; border-radius: 8px;" /><img src="https://via.placeholder.com/150x150" alt="Gallery image 2" style="width: 100%; height: auto; border-radius: 8px;" /><img src="https://via.placeholder.com/150x150" alt="Gallery image 3" style="width: 100%; height: auto; border-radius: 8px;" /></div>',
      description: 'Grid of images'
    },
    {
      id: 'cta-button',
      name: 'Call to Action',
      icon: <MousePointer className="w-4 h-4" />,
      category: 'interactive',
      content: '<div style="text-align: center; margin: 32px 0;"><a href="#" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">Get Started Today</a></div>',
      description: 'Styled action button'
    },
    {
      id: 'feature-table',
      name: 'Feature Table',
      icon: <Table className="w-4 h-4" />,
      category: 'layout',
      content: '<table style="width: 100%; border-collapse: collapse; margin: 24px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;"><thead><tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;"><th style="padding: 16px; text-align: left; font-weight: 600;">Feature</th><th style="padding: 16px; text-align: left; font-weight: 600;">Description</th><th style="padding: 16px; text-align: center; font-weight: 600;">Available</th></tr></thead><tbody><tr style="background-color: #f8f9fa;"><td style="padding: 12px; border-bottom: 1px solid #e9ecef;">Feature 1</td><td style="padding: 12px; border-bottom: 1px solid #e9ecef;">Description of feature 1</td><td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;">✅</td></tr><tr><td style="padding: 12px; border-bottom: 1px solid #e9ecef;">Feature 2</td><td style="padding: 12px; border-bottom: 1px solid #e9ecef;">Description of feature 2</td><td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;">✅</td></tr></tbody></table>',
      description: 'Styled comparison table'
    },
    {
      id: 'divider-fancy',
      name: 'Fancy Divider',
      icon: <Minus className="w-4 h-4" />,
      category: 'layout',
      content: '<div style="text-align: center; margin: 40px 0;"><div style="width: 100px; height: 2px; background: linear-gradient(90deg, transparent, #667eea, transparent); margin: 0 auto;"></div></div>',
      description: 'Gradient line separator'
    },
    {
      id: 'testimonial',
      name: 'Testimonial',
      icon: <Quote className="w-4 h-4" />,
      category: 'content',
      content: '<blockquote style="border-left: 4px solid #667eea; padding: 24px; margin: 24px 0; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; font-style: italic; position: relative;"><p style="margin: 0; font-size: 18px; line-height: 1.6; color: #495057;">"This is an amazing product that has completely transformed how we work. Highly recommended!"</p><footer style="margin-top: 16px; font-style: normal; font-weight: 600; color: #667eea;">— Sarah Johnson, CEO</footer></blockquote>',
      description: 'Customer testimonial'
    },
    {
      id: 'contact-info',
      name: 'Contact Info',
      icon: <Mail className="w-4 h-4" />,
      category: 'content',
      content: '<div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin: 24px 0;"><h3 style="margin: 0 0 16px 0; color: #495057;">Get in Touch</h3><div style="display: grid; gap: 12px;"><div style="display: flex; align-items: center; gap: 12px;"><span style="color: #667eea;">📧</span> contact@example.com</div><div style="display: flex; align-items: center; gap: 12px;"><span style="color: #667eea;">📱</span> +1 (555) 123-4567</div><div style="display: flex; align-items: center; gap: 12px;"><span style="color: #667eea;">📍</span> 123 Business St, City, State 12345</div></div></div>',
      description: 'Contact information block'
    },
    {
      id: 'code-block',
      name: 'Code Block',
      icon: <Code className="w-4 h-4" />,
      category: 'content',
      content: '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 24px 0; font-family: \'Monaco\', \'Menlo\', \'Ubuntu Mono\', monospace; font-size: 14px; line-height: 1.5;"><code>function welcomeUser(name) {\n  console.log(`Welcome, ${name}!`);\n  return true;\n}</code></pre>',
      description: 'Syntax highlighted code'
    },
    {
      id: 'bullet-list',
      name: 'Feature List',
      icon: <List className="w-4 h-4" />,
      category: 'content',
      content: '<ul style="margin: 20px 0; padding-left: 0; list-style: none;"><li style="margin: 12px 0; padding-left: 28px; position: relative;"><span style="position: absolute; left: 0; color: #667eea; font-weight: bold;">✓</span> First amazing feature</li><li style="margin: 12px 0; padding-left: 28px; position: relative;"><span style="position: absolute; left: 0; color: #667eea; font-weight: bold;">✓</span> Second incredible benefit</li><li style="margin: 12px 0; padding-left: 28px; position: relative;"><span style="position: absolute; left: 0; color: #667eea; font-weight: bold;">✓</span> Third outstanding advantage</li></ul>',
      description: 'Checkmark feature list'
    }
  ];

  const insertBlock = (block: BlockTemplate) => {
    if (!editor) return;
    
    editor.chain().focus().insertContent(block.content).run();
    setShowDropdown(false);
  };

  const categories = [
    { id: 'all', name: 'All Blocks', count: blockTemplates.length },
    { id: 'content', name: 'Content', count: blockTemplates.filter(b => b.category === 'content').length },
    { id: 'media', name: 'Media', count: blockTemplates.filter(b => b.category === 'media').length },
    { id: 'layout', name: 'Layout', count: blockTemplates.filter(b => b.category === 'layout').length },
    { id: 'interactive', name: 'Interactive', count: blockTemplates.filter(b => b.category === 'interactive').length }
  ];

  const filteredBlocks = selectedCategory === 'all' 
    ? blockTemplates 
    : blockTemplates.filter(b => b.category === selectedCategory);

  return (
    <div className="relative">
      <Button
        variant="default"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Plus className="w-4 h-4" />
        <span>Add Block</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {showDropdown && (
        <Card className="absolute top-full left-0 mt-2 w-96 p-4 shadow-xl z-50 bg-white animate-scale-in">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Block Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {filteredBlocks.map((block) => (
              <Button
                key={block.id}
                variant="outline"
                onClick={() => insertBlock(block)}
                className="flex flex-col items-start gap-2 h-auto p-4 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md">
                    {block.icon}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">{block.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {block.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Click any block to insert it at your cursor position
            </p>
          </div>
        </Card>
      )}
      
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)} 
        />
      )}
    </div>
  );
};
