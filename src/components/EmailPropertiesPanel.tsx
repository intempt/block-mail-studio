
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Settings,
  Palette,
  Type,
  Layout,
  Link,
  Image
} from 'lucide-react';

interface EmailPropertiesPanelProps {
  editor: Editor | null;
}

export const EmailPropertiesPanel: React.FC<EmailPropertiesPanelProps> = ({ editor }) => {
  const [selectedElement, setSelectedElement] = useState<string>('general');

  if (!editor) return null;

  const updateTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const updateBackgroundColor = (color: string) => {
    // This would need custom extension for background colors
    console.log('Background color:', color);
  };

  const updateFontSize = (size: number) => {
    // Use HTML styling approach since setFontSize doesn't exist
    const selection = editor.state.selection;
    if (!selection.empty) {
      editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
    }
  };

  const updatePadding = (padding: number) => {
    // This would need custom styling logic
    console.log('Padding:', padding);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Properties
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Typography Settings */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4" />
            <Label className="font-semibold">Typography</Label>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="font-size" className="text-sm text-gray-600">Font Size</Label>
              <div className="mt-2">
                <Slider
                  id="font-size"
                  min={10}
                  max={48}
                  step={1}
                  defaultValue={[16]}
                  onValueChange={(value) => updateFontSize(value[0])}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="text-color" className="text-sm text-gray-600">Text Color</Label>
              <input
                id="text-color"
                type="color"
                defaultValue="#333333"
                onChange={(e) => updateTextColor(e.target.value)}
                className="mt-2 w-full h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div>
              <Label htmlFor="font-family" className="text-sm text-gray-600">Font Family</Label>
              <select
                id="font-family"
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                onChange={(e) => {
                  // This would need custom font family extension
                  console.log('Font family:', e.target.value);
                }}
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Layout Settings */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-4 h-4" />
            <Label className="font-semibold">Layout</Label>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="padding" className="text-sm text-gray-600">Padding</Label>
              <div className="mt-2">
                <Slider
                  id="padding"
                  min={0}
                  max={50}
                  step={1}
                  defaultValue={[20]}
                  onValueChange={(value) => updatePadding(value[0])}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bg-color" className="text-sm text-gray-600">Background Color</Label>
              <input
                id="bg-color"
                type="color"
                defaultValue="#ffffff"
                onChange={(e) => updateBackgroundColor(e.target.value)}
                className="mt-2 w-full h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div>
              <Label htmlFor="border-radius" className="text-sm text-gray-600">Border Radius</Label>
              <Input
                id="border-radius"
                type="number"
                placeholder="0"
                className="mt-2"
                onChange={(e) => {
                  console.log('Border radius:', e.target.value);
                }}
              />
            </div>
          </div>
        </Card>

        {/* Link Settings */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Link className="w-4 h-4" />
            <Label className="font-semibold">Links</Label>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url" className="text-sm text-gray-600">URL</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com"
                className="mt-2"
                onChange={(e) => {
                  if (editor.isActive('link')) {
                    editor.chain().focus().updateAttributes('link', { href: e.target.value }).run();
                  }
                }}
              />
            </div>

            <div>
              <Label htmlFor="link-text" className="text-sm text-gray-600">Link Text</Label>
              <Input
                id="link-text"
                placeholder="Click here"
                className="mt-2"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              const selection = editor.state.selection;
              if (!selection.empty) {
                editor.chain().focus().deleteSelection().run();
              }
            }}
          >
            Delete Selected
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              const content = editor.getHTML();
              navigator.clipboard.writeText(content);
            }}
          >
            Copy HTML
          </Button>
        </div>
      </div>
    </div>
  );
};
