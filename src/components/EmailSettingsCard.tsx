
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Mail,
  ChevronDown
} from 'lucide-react';

interface EmailSettingsCardProps {
  isOpen: boolean;
  onToggle: () => void;
  onStylesChange: (styles: any) => void;
  inline?: boolean;
}

export const EmailSettingsCard: React.FC<EmailSettingsCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange,
  inline = false
}) => {
  const [emailStyles, setEmailStyles] = useState({
    templateBackground: '#8C9A80',
    contentBackground: '#263D29',
    width: '600',
    marginTop: '30',
    marginBottom: '30'
  });

  const handleStyleChange = (property: string, value: any) => {
    const newStyles = { ...emailStyles, [property]: value };
    setEmailStyles(newStyles);
    
    onStylesChange({
      email: {
        templateBackground: newStyles.templateBackground,
        contentBackground: newStyles.contentBackground,
        width: newStyles.width + 'px',
        marginTop: newStyles.marginTop + 'px',
        marginBottom: newStyles.marginBottom + 'px'
      }
    });
  };

  const content = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Template Background */}
        <div>
          <Label className="text-xs">Template background</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={emailStyles.templateBackground}
              onChange={(e) => handleStyleChange('templateBackground', e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              value={emailStyles.templateBackground}
              onChange={(e) => handleStyleChange('templateBackground', e.target.value)}
              className="flex-1 h-8 text-xs font-mono"
            />
          </div>
        </div>

        {/* Content Background */}
        <div>
          <Label className="text-xs">Content background</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={emailStyles.contentBackground}
              onChange={(e) => handleStyleChange('contentBackground', e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              value={emailStyles.contentBackground}
              onChange={(e) => handleStyleChange('contentBackground', e.target.value)}
              className="flex-1 h-8 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Width */}
        <div>
          <Label className="text-xs">Width</Label>
          <div className="flex mt-1">
            <Input
              value={emailStyles.width}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>

        {/* Margin Top */}
        <div>
          <Label className="text-xs">Margin top</Label>
          <div className="flex mt-1">
            <Input
              value={emailStyles.marginTop}
              onChange={(e) => handleStyleChange('marginTop', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>

        {/* Margin Bottom */}
        <div>
          <Label className="text-xs">Margin bottom</Label>
          <div className="flex mt-1">
            <Input
              value={emailStyles.marginBottom}
              onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs">Preheader</Label>
        <Input
          placeholder="View this email in your browser"
          className="h-8 text-xs mt-1"
        />
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        {content}
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 mx-6 shadow-lg border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Settings
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-500"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        {content}
      </div>
    </Card>
  );
};
