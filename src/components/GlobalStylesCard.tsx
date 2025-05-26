
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Settings,
  Type,
  Palette,
  ChevronDown,
  ChevronRight,
  Save,
  RotateCcw
} from 'lucide-react';

interface GlobalStylesCardProps {
  isOpen: boolean;
  onToggle: () => void;
  onStylesChange: (styles: any) => void;
  onOpenAdvanced: () => void;
}

const googleFonts = [
  'Arial, sans-serif',
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Lato, sans-serif',
  'Montserrat, sans-serif',
  'Poppins, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
];

const colorPresets = [
  { name: 'Blue', primary: '#3B82F6', secondary: '#1E40AF', text: '#1F2937' },
  { name: 'Green', primary: '#10B981', secondary: '#047857', text: '#1F2937' },
  { name: 'Purple', primary: '#8B5CF6', secondary: '#7C3AED', text: '#1F2937' },
  { name: 'Orange', primary: '#F59E0B', secondary: '#D97706', text: '#1F2937' },
];

export const GlobalStylesCard: React.FC<GlobalStylesCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange,
  onOpenAdvanced
}) => {
  const [selectedFont, setSelectedFont] = useState('Arial, sans-serif');
  const [selectedPreset, setSelectedPreset] = useState(colorPresets[0]);
  const [customColors, setCustomColors] = useState({
    text: '#1F2937',
    headings: '#111827',
    buttons: '#3B82F6',
    links: '#3B82F6'
  });

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    onStylesChange({
      email: { defaultFontFamily: font },
      text: {
        body: { fontFamily: font },
        h1: { fontFamily: font },
        h2: { fontFamily: font },
        h3: { fontFamily: font },
        h4: { fontFamily: font }
      }
    });
  };

  const handleColorPresetApply = (preset: typeof colorPresets[0]) => {
    setSelectedPreset(preset);
    const newColors = {
      text: preset.text,
      headings: preset.text,
      buttons: preset.primary,
      links: preset.secondary
    };
    setCustomColors(newColors);
    
    onStylesChange({
      text: {
        body: { color: newColors.text },
        h1: { color: newColors.headings },
        h2: { color: newColors.headings },
        h3: { color: newColors.headings },
        h4: { color: newColors.headings }
      },
      buttons: {
        default: { backgroundColor: newColors.buttons }
      },
      links: {
        normal: newColors.links,
        hover: preset.primary
      }
    });
  };

  const handleCustomColorChange = (colorType: string, color: string) => {
    const newColors = { ...customColors, [colorType]: color };
    setCustomColors(newColors);
    
    // Apply the color change based on type
    const styleUpdate: any = {};
    
    if (colorType === 'text') {
      styleUpdate.text = { body: { color } };
    } else if (colorType === 'headings') {
      styleUpdate.text = {
        h1: { color },
        h2: { color },
        h3: { color },
        h4: { color }
      };
    } else if (colorType === 'buttons') {
      styleUpdate.buttons = { default: { backgroundColor: color } };
    } else if (colorType === 'links') {
      styleUpdate.links = { normal: color };
    }
    
    onStylesChange(styleUpdate);
  };

  const handleSave = () => {
    // Save current configuration as a template
    console.log('Saving global styles configuration');
  };

  const handleReset = () => {
    // Reset to default styles
    setSelectedFont('Arial, sans-serif');
    setSelectedPreset(colorPresets[0]);
    setCustomColors({
      text: '#1F2937',
      headings: '#111827',
      buttons: '#3B82F6',
      links: '#3B82F6'
    });
    
    onStylesChange({
      email: { defaultFontFamily: 'Arial, sans-serif' },
      text: {
        body: { fontFamily: 'Arial, sans-serif', color: '#1F2937' },
        h1: { fontFamily: 'Arial, sans-serif', color: '#111827' },
        h2: { fontFamily: 'Arial, sans-serif', color: '#111827' },
        h3: { fontFamily: 'Arial, sans-serif', color: '#111827' },
        h4: { fontFamily: 'Arial, sans-serif', color: '#111827' }
      },
      buttons: {
        default: { backgroundColor: '#3B82F6' }
      },
      links: {
        normal: '#3B82F6',
        hover: '#1E40AF'
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 mx-6 shadow-lg border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Global Styles
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAdvanced}
              className="text-xs"
            >
              <Settings className="w-3 h-3 mr-1" />
              Advanced
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-500"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Font Selection */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Font Family</Label>
            <Select value={selectedFont} onValueChange={handleFontChange}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {googleFonts.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font.split(',')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Presets */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Color Themes</Label>
            <div className="flex gap-2 mb-3">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant={selectedPreset.name === preset.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleColorPresetApply(preset)}
                  className="h-8 px-3 flex items-center gap-2"
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded-full border" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Body Text</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={customColors.text}
                  onChange={(e) => handleCustomColorChange('text', e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={customColors.text}
                  onChange={(e) => handleCustomColorChange('text', e.target.value)}
                  className="flex-1 h-6 text-xs"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Headings</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={customColors.headings}
                  onChange={(e) => handleCustomColorChange('headings', e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={customColors.headings}
                  onChange={(e) => handleCustomColorChange('headings', e.target.value)}
                  className="flex-1 h-6 text-xs"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Buttons</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={customColors.buttons}
                  onChange={(e) => handleCustomColorChange('buttons', e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={customColors.buttons}
                  onChange={(e) => handleCustomColorChange('buttons', e.target.value)}
                  className="flex-1 h-6 text-xs"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Links</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={customColors.links}
                  onChange={(e) => handleCustomColorChange('links', e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={customColors.links}
                  onChange={(e) => handleCustomColorChange('links', e.target.value)}
                  className="flex-1 h-6 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="h-7 text-xs"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Preset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-7 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
            <Badge variant="secondary" className="text-xs">
              Applied to all elements
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
