
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer,
  ChevronDown,
  X,
  Lock,
  Italic,
  Underline
} from 'lucide-react';

interface ButtonsLinksCardProps {
  isOpen: boolean;
  onToggle: () => void;
  onStylesChange: (styles: any) => void;
}

const fontOptions = [
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

export const ButtonsLinksCard: React.FC<ButtonsLinksCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange
}) => {
  const [buttonStyles, setButtonStyles] = useState({
    fontFamily: ['Arial, sans-serif'],
    style: 'Normal',
    textColor: '#ffffff',
    backgroundColor: '#414141',
    fontSize: '13',
    lineHeight: '120',
    letterSpacing: '0',
    italic: false,
    underline: false,
    paddingTopBottom: '10',
    paddingLeftRight: '25',
    paddingLocked: true
  });

  const handleButtonStyleChange = (property: string, value: any) => {
    const newStyles = { ...buttonStyles, [property]: value };
    setButtonStyles(newStyles);
    
    onStylesChange({
      buttons: {
        default: {
          fontFamily: newStyles.fontFamily.join(', '),
          color: newStyles.textColor,
          backgroundColor: newStyles.backgroundColor,
          fontSize: `${newStyles.fontSize}px`,
          lineHeight: `${newStyles.lineHeight}%`,
          letterSpacing: `${newStyles.letterSpacing}px`,
          fontStyle: newStyles.italic ? 'italic' : 'normal',
          textDecoration: newStyles.underline ? 'underline' : 'none',
          padding: `${newStyles.paddingTopBottom}px ${newStyles.paddingLeftRight}px`
        }
      }
    });
  };

  const addFont = (font: string) => {
    if (!buttonStyles.fontFamily.includes(font)) {
      handleButtonStyleChange('fontFamily', [...buttonStyles.fontFamily, font]);
    }
  };

  const removeFont = (font: string) => {
    handleButtonStyleChange('fontFamily', buttonStyles.fontFamily.filter(f => f !== font));
  };

  const togglePaddingLock = () => {
    const newLocked = !buttonStyles.paddingLocked;
    setButtonStyles(prev => ({ ...prev, paddingLocked: newLocked }));
  };

  const handlePaddingChange = (type: 'topBottom' | 'leftRight', value: string) => {
    if (buttonStyles.paddingLocked) {
      // When locked, update both values
      handleButtonStyleChange('paddingTopBottom', value);
      handleButtonStyleChange('paddingLeftRight', value);
    } else {
      // When unlocked, update specific value
      const property = type === 'topBottom' ? 'paddingTopBottom' : 'paddingLeftRight';
      handleButtonStyleChange(property, value);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 mx-6 shadow-lg border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            Buttons
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

        <div className="space-y-3">
          {/* Font Selection */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Font</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {buttonStyles.fontFamily.map((font) => (
                <Badge key={font} variant="secondary" className="text-xs flex items-center gap-1">
                  {font.split(',')[0]}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFont(font)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={(value) => addFont(value)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Add font..." />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font.split(',')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {/* Style */}
            <div>
              <Label className="text-xs">Style</Label>
              <Select value={buttonStyles.style} onValueChange={(value) => handleButtonStyleChange('style', value)}>
                <SelectTrigger className="h-8 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Bold">Bold</SelectItem>
                  <SelectItem value="Light">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Text Color */}
            <div>
              <Label className="text-xs">Text Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={buttonStyles.textColor}
                  onChange={(e) => handleButtonStyleChange('textColor', e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={buttonStyles.textColor}
                  onChange={(e) => handleButtonStyleChange('textColor', e.target.value)}
                  className="flex-1 h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Button Color */}
            <div>
              <Label className="text-xs">Button Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={buttonStyles.backgroundColor}
                  onChange={(e) => handleButtonStyleChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={buttonStyles.backgroundColor}
                  onChange={(e) => handleButtonStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Font Size */}
            <div>
              <Label className="text-xs">Size</Label>
              <div className="flex items-center mt-1">
                <Input
                  type="number"
                  value={buttonStyles.fontSize}
                  onChange={(e) => handleButtonStyleChange('fontSize', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500 ml-1">px</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Line Height */}
            <div>
              <Label className="text-xs">Line Height</Label>
              <div className="flex items-center gap-1 mt-1">
                <Input
                  type="number"
                  value={buttonStyles.lineHeight}
                  onChange={(e) => handleButtonStyleChange('lineHeight', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <Label className="text-xs">Letter Spacing</Label>
              <div className="flex items-center gap-1 mt-1">
                <Input
                  type="number"
                  value={buttonStyles.letterSpacing}
                  onChange={(e) => handleButtonStyleChange('letterSpacing', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Text Formatting */}
            <div>
              <Label className="text-xs">Format</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  variant={buttonStyles.italic ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleButtonStyleChange('italic', !buttonStyles.italic)}
                >
                  <Italic className="w-3 h-3" />
                </Button>
                <Button
                  variant={buttonStyles.underline ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleButtonStyleChange('underline', !buttonStyles.underline)}
                >
                  <Underline className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Padding Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Top/Bottom Padding</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={buttonStyles.paddingTopBottom}
                  onChange={(e) => handlePaddingChange('topBottom', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={togglePaddingLock}
                >
                  <Lock className={`w-3 h-3 ${buttonStyles.paddingLocked ? 'text-blue-600' : 'text-gray-400'}`} />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs">Left/Right Padding</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={buttonStyles.paddingLeftRight}
                  onChange={(e) => handlePaddingChange('leftRight', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <Badge variant="secondary" className="text-xs">
              Applied to all buttons
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
