
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Type, Palette, Link } from 'lucide-react';

interface TemplateStylePanelProps {
  onStylesChange: (styles: any) => void;
}

export const TemplateStylePanel: React.FC<TemplateStylePanelProps> = ({
  onStylesChange
}) => {
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedHeadingStyle, setSelectedHeadingStyle] = useState('modern');

  const fontFamilies = [
    'Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Helvetica, sans-serif',
    'Verdana, sans-serif'
  ];

  const headingStyles = [
    { id: 'modern', name: 'Modern', preview: 'Clean & Bold' },
    { id: 'classic', name: 'Classic', preview: 'Traditional' },
    { id: 'minimal', name: 'Minimal', preview: 'Simple & Light' },
    { id: 'editorial', name: 'Editorial', preview: 'Magazine Style' }
  ];

  const colorPresets = [
    { name: 'Blue Theme', primary: '#007bff', secondary: '#6c757d', accent: '#17a2b8' },
    { name: 'Green Theme', primary: '#28a745', secondary: '#6c757d', accent: '#ffc107' },
    { name: 'Purple Theme', primary: '#6f42c1', secondary: '#6c757d', accent: '#e83e8c' },
    { name: 'Orange Theme', primary: '#fd7e14', secondary: '#6c757d', accent: '#20c997' }
  ];

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    onStylesChange({ fontFamily: font });
  };

  const handleHeadingStyleChange = (styleId: string) => {
    setSelectedHeadingStyle(styleId);
    onStylesChange({ headingStyle: styleId });
  };

  const handleColorPresetApply = (preset: any) => {
    onStylesChange({ colorPreset: preset });
  };

  return (
    <div className="flex items-center gap-6 p-3">
      {/* Font Family */}
      <div className="flex items-center gap-2">
        <Type className="w-4 h-4" />
        <Label className="text-sm font-medium">Font</Label>
        <Select value={selectedFont} onValueChange={handleFontChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font}>
                {font.split(',')[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-6 w-px bg-gray-300" />

      {/* Heading Styles */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Headings</span>
        <div className="flex gap-1">
          {headingStyles.map((style) => (
            <Button
              key={style.id}
              variant={selectedHeadingStyle === style.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleHeadingStyleChange(style.id)}
              className="h-7"
            >
              {style.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-6 w-px bg-gray-300" />

      {/* Color Themes */}
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium">Colors</span>
        <div className="flex gap-1">
          {colorPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => handleColorPresetApply(preset)}
              className="h-7 px-2"
            >
              <div className="flex gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: preset.primary }}
                />
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="h-6 w-px bg-gray-300" />

      {/* Link Styling */}
      <div className="flex items-center gap-2">
        <Link className="w-4 h-4" />
        <span className="text-sm font-medium">Links</span>
        <Badge variant="outline" className="text-xs">Underlined</Badge>
      </div>
    </div>
  );
};
