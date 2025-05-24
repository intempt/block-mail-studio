
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Palette, 
  Layout, 
  Image, 
  Link, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

interface EmailPropertiesPanelProps {
  editor: Editor | null;
}

export const EmailPropertiesPanel: React.FC<EmailPropertiesPanelProps> = ({ editor }) => {
  const [selectedElement, setSelectedElement] = useState<string>('document');

  if (!editor) return null;

  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const handleFontSizeChange = (size: string) => {
    // Using insertContent to apply font size styling
    const selection = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to);
    
    if (selectedText) {
      editor.chain().focus().insertContent(`<span style="font-size: ${size}px">${selectedText}</span>`).run();
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Element Selector */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Selected Element
          </Label>
          <select 
            value={selectedElement}
            onChange={(e) => setSelectedElement(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="document">Document</option>
            <option value="paragraph">Paragraph</option>
            <option value="heading">Heading</option>
            <option value="image">Image</option>
            <option value="link">Link</option>
          </select>
        </div>

        <Separator />

        {/* Typography */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <Type className="w-4 h-4" />
            Typography
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600 block mb-1">Font Family</Label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>System Font</option>
                <option>Arial</option>
                <option>Helvetica</option>
                <option>Georgia</option>
                <option>Times New Roman</option>
              </select>
            </div>
            
            <div>
              <Label className="text-xs text-gray-600 block mb-1">Font Size</Label>
              <Input 
                type="number" 
                defaultValue="16" 
                className="w-full"
                onChange={(e) => handleFontSizeChange(e.target.value)}
              />
            </div>
            
            <div>
              <Label className="text-xs text-gray-600 block mb-2">Style</Label>
              <div className="flex gap-1">
                <Button
                  variant={editor.isActive('bold') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className="flex-1"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive('italic') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className="flex-1"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive('underline') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className="flex-1"
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Colors */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Colors
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600 block mb-2">Text Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  defaultValue="#000000"
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input 
                  type="text" 
                  defaultValue="#000000" 
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-600 block mb-2">Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  defaultValue="#ffffff"
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input 
                  type="text" 
                  defaultValue="#ffffff" 
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Alignment */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <AlignLeft className="w-4 h-4" />
            Alignment
          </Label>
          
          <div className="flex gap-1">
            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className="flex-1"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className="flex-1"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className="flex-1"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Spacing */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Spacing
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600 block mb-1">Margin</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Top" className="text-sm" />
                <Input type="number" placeholder="Right" className="text-sm" />
                <Input type="number" placeholder="Bottom" className="text-sm" />
                <Input type="number" placeholder="Left" className="text-sm" />
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-600 block mb-1">Padding</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Top" className="text-sm" />
                <Input type="number" placeholder="Right" className="text-sm" />
                <Input type="number" placeholder="Bottom" className="text-sm" />
                <Input type="number" placeholder="Left" className="text-sm" />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Element Properties */}
        {selectedElement === 'image' && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
              <Image className="w-4 h-4" />
              Image Properties
            </Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600 block mb-1">Alt Text</Label>
                <Input type="text" placeholder="Describe the image" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600 block mb-1">Width</Label>
                  <Input type="number" placeholder="Auto" />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 block mb-1">Height</Label>
                  <Input type="number" placeholder="Auto" />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedElement === 'link' && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
              <Link className="w-4 h-4" />
              Link Properties
            </Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600 block mb-1">URL</Label>
                <Input type="url" placeholder="https://example.com" />
              </div>
              
              <div>
                <Label className="text-xs text-gray-600 block mb-1">Target</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="_self">Same Window</option>
                  <option value="_blank">New Window</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
