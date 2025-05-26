
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings,
  ChevronDown,
  Edit
} from 'lucide-react';

interface EmailSettingsCardProps {
  isOpen: boolean;
  onToggle: () => void;
  onStylesChange: (styles: any) => void;
}

export const EmailSettingsCard: React.FC<EmailSettingsCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange
}) => {
  const [emailSettings, setEmailSettings] = useState({
    templateBackground: '#8C9A80',
    contentBackground: '#263D29',
    width: '600',
    marginTop: '30',
    marginBottom: '30',
    preheader: 'View this email in your browser'
  });

  const handleSettingChange = (property: string, value: any) => {
    const newSettings = { ...emailSettings, [property]: value };
    setEmailSettings(newSettings);
    
    onStylesChange({
      email: {
        templateBackground: newSettings.templateBackground,
        contentBackground: newSettings.contentBackground,
        width: `${newSettings.width}px`,
        marginTop: `${newSettings.marginTop}px`,
        marginBottom: `${newSettings.marginBottom}px`,
        preheader: newSettings.preheader
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 mx-6 shadow-lg border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
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

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Template Background */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Template background</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={emailSettings.templateBackground}
                  onChange={(e) => handleSettingChange('templateBackground', e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={emailSettings.templateBackground}
                  onChange={(e) => handleSettingChange('templateBackground', e.target.value)}
                  className="flex-1 h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Content Background */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Content background</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={emailSettings.contentBackground}
                  onChange={(e) => handleSettingChange('contentBackground', e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={emailSettings.contentBackground}
                  onChange={(e) => handleSettingChange('contentBackground', e.target.value)}
                  className="flex-1 h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Width */}
            <div>
              <Label className="text-xs">Width</Label>
              <div className="flex items-center gap-1 mt-1">
                <Input
                  type="number"
                  value={emailSettings.width}
                  onChange={(e) => handleSettingChange('width', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Margin Top */}
            <div>
              <Label className="text-xs">Margin top</Label>
              <div className="flex items-center gap-1 mt-1">
                <Input
                  type="number"
                  value={emailSettings.marginTop}
                  onChange={(e) => handleSettingChange('marginTop', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Margin Bottom */}
            <div>
              <Label className="text-xs">Margin bottom</Label>
              <div className="flex items-center gap-1 mt-1">
                <Input
                  type="number"
                  value={emailSettings.marginBottom}
                  onChange={(e) => handleSettingChange('marginBottom', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
          </div>

          {/* Preheader */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Preheader</Label>
            <div className="flex gap-2">
              <Textarea
                value={emailSettings.preheader}
                onChange={(e) => handleSettingChange('preheader', e.target.value)}
                className="flex-1 h-8 text-xs resize-none"
                rows={1}
              />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
