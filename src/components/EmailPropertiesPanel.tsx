
import React from 'react';
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
  BarChart3,
  Zap
} from 'lucide-react';

interface EmailPropertiesPanelProps {
  emailHTML?: string;
  onPropertyChange?: (property: string, value: any) => void;
}

export const EmailPropertiesPanel: React.FC<EmailPropertiesPanelProps> = ({ 
  emailHTML = '',
  onPropertyChange
}) => {
  const blockCount = (emailHTML.match(/<div[^>]*class[^>]*email-block/g) || []).length;
  const textBlocks = (emailHTML.match(/<div[^>]*>.*?<\/div>/g) || []).filter(block => 
    block.includes('text') || block.includes('<p>') || block.includes('<h')
  ).length;
  const imageBlocks = (emailHTML.match(/<img/g) || []).length;
  const linkBlocks = (emailHTML.match(/<a/g) || []).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Email Overview */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Email Overview
          </Label>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Total Blocks</span>
              <Badge variant="secondary">{blockCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Text Blocks</span>
              <Badge variant="outline">{textBlocks}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Images</span>
              <Badge variant="outline">{imageBlocks}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Links</span>
              <Badge variant="outline">{linkBlocks}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Email Settings */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Email Settings
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600 block mb-1">Max Width</Label>
              <Input 
                type="number" 
                defaultValue="600" 
                className="w-full"
                onChange={(e) => onPropertyChange?.('maxWidth', e.target.value)}
              />
            </div>
            
            <div>
              <Label className="text-xs text-gray-600 block mb-1">Font Family</Label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                onChange={(e) => onPropertyChange?.('fontFamily', e.target.value)}
              >
                <option>System Font</option>
                <option>Arial</option>
                <option>Helvetica</option>
                <option>Georgia</option>
                <option>Times New Roman</option>
              </select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Background */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Background
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600 block mb-2">Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  defaultValue="#ffffff"
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  onChange={(e) => onPropertyChange?.('backgroundColor', e.target.value)}
                />
                <Input 
                  type="text" 
                  defaultValue="#ffffff" 
                  className="flex-1"
                  onChange={(e) => onPropertyChange?.('backgroundColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Performance Tips */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance Tips
          </Label>
          
          <div className="space-y-2 text-xs text-gray-600">
            <p>• Use web-safe fonts for better compatibility</p>
            <p>• Optimize images before adding them</p>
            <p>• Keep email width under 600px</p>
            <p>• Test in multiple email clients</p>
          </div>
        </div>
      </div>
    </div>
  );
};
