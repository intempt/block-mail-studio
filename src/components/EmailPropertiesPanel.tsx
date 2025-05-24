
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Palette,
  Type,
  Layout,
  Link,
  Image,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface EmailPropertiesPanelProps {
  editor: Editor | null;
}

export const EmailPropertiesPanel: React.FC<EmailPropertiesPanelProps> = ({ editor }) => {
  const [expandedSection, setExpandedSection] = useState<string>('typography');

  if (!editor) return null;

  const updateTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const updateFontSize = (size: number) => {
    const selection = editor.state.selection;
    if (!selection.empty) {
      editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
    }
  };

  const sections = [
    {
      id: 'typography',
      name: 'Typography',
      icon: <Type className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Font Size</Label>
            <Slider
              min={10}
              max={48}
              step={1}
              defaultValue={[16]}
              onValueChange={(value) => updateFontSize(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>10px</span>
              <span>48px</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Text Color</Label>
            <input
              type="color"
              defaultValue="#333333"
              onChange={(e) => updateTextColor(e.target.value)}
              className="w-full h-10 border border-slate-300 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Font Family</Label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
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
      )
    },
    {
      id: 'layout',
      name: 'Layout',
      icon: <Layout className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Padding</Label>
            <Slider
              min={0}
              max={50}
              step={1}
              defaultValue={[20]}
              onValueChange={(value) => console.log('Padding:', value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0px</span>
              <span>50px</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Background Color</Label>
            <input
              type="color"
              defaultValue="#ffffff"
              onChange={(e) => console.log('Background color:', e.target.value)}
              className="w-full h-10 border border-slate-300 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Border Radius</Label>
            <Input
              type="number"
              placeholder="0"
              className="w-full"
              onChange={(e) => console.log('Border radius:', e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'links',
      name: 'Links',
      icon: <Link className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">URL</Label>
            <Input
              type="url"
              placeholder="https://example.com"
              onChange={(e) => {
                if (editor.isActive('link')) {
                  editor.chain().focus().updateAttributes('link', { href: e.target.value }).run();
                }
              }}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Link Text</Label>
            <Input
              placeholder="Click here"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Link Color</Label>
            <input
              type="color"
              defaultValue="#0066cc"
              className="w-full h-10 border border-slate-300 rounded-md cursor-pointer"
            />
          </div>
        </div>
      )
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-4 hover:bg-slate-50"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <span className="font-medium text-sm">{section.name}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
            
            {expandedSection === section.id && (
              <div className="p-4 pt-0 border-t border-slate-100">
                {section.content}
              </div>
            )}
          </Card>
        ))}

        <Separator className="my-6" />

        {/* Quick Actions */}
        <Card className="p-4">
          <Label className="font-medium text-sm mb-3 block">Quick Actions</Label>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start"
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
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                const content = editor.getHTML();
                navigator.clipboard.writeText(content);
              }}
            >
              Copy HTML
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                editor.chain().focus().selectAll().run();
              }}
            >
              Select All
            </Button>
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
};
