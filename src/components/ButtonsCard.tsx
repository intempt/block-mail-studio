
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

interface ButtonsCardProps {
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

export const ButtonsCard: React.FC<ButtonsCardProps> = ({
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
    <Card className="absolute top-full left-0 right-0 z-50 mt-brand-2 mx-brand-6 shadow-lg border border-brand bg-brand-bg">
      <div className="p-brand-4">
        <div className="flex items-center justify-between mb-brand-4">
          <h3 className="text-h4 font-medium flex items-center gap-brand-2 text-brand-fg">
            <MousePointer className="w-4 h-4" />
            Buttons
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-brand-fg hover:bg-brand-muted"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-brand-4">
          {/* Font Selection */}
          <div>
            <Label className="text-caption font-medium mb-brand-2 block text-brand-fg">Font</Label>
            <div className="flex flex-wrap gap-brand-1 mb-brand-2">
              {buttonStyles.fontFamily.map((font) => (
                <Badge key={font} variant="secondary" className="text-caption flex items-center gap-brand-1 bg-brand-muted text-brand-fg">
                  {font.split(',')[0]}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFont(font)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={(value) => addFont(value)}>
              <SelectTrigger className="h-8 border-brand">
                <SelectValue placeholder="Add font..." />
              </SelectTrigger>
              <SelectContent className="bg-brand-bg border-brand">
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }} className="text-brand-fg hover:bg-brand-muted">
                    {font.split(',')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 gap-brand-3">
            {/* Style */}
            <div>
              <Label className="text-caption text-brand-fg">Style</Label>
              <Select value={buttonStyles.style} onValueChange={(value) => handleButtonStyleChange('style', value)}>
                <SelectTrigger className="h-8 mt-brand-1 border-brand">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-brand-bg border-brand">
                  <SelectItem value="Normal" className="text-brand-fg hover:bg-brand-muted">Normal</SelectItem>
                  <SelectItem value="Bold" className="text-brand-fg hover:bg-brand-muted">Bold</SelectItem>
                  <SelectItem value="Light" className="text-brand-fg hover:bg-brand-muted">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Text Color */}
            <div>
              <Label className="text-caption text-brand-fg">Text Color</Label>
              <div className="flex gap-brand-2 mt-brand-1">
                <input
                  type="color"
                  value={buttonStyles.textColor}
                  onChange={(e) => handleButtonStyleChange('textColor', e.target.value)}
                  className="w-8 h-8 border border-brand rounded-brand cursor-pointer"
                />
                <Input
                  value={buttonStyles.textColor}
                  onChange={(e) => handleButtonStyleChange('textColor', e.target.value)}
                  className="flex-1 h-8 text-caption font-mono border-brand bg-brand-bg text-brand-fg"
                />
              </div>
            </div>

            {/* Button Color */}
            <div>
              <Label className="text-caption text-brand-fg">Button Color</Label>
              <div className="flex gap-brand-2 mt-brand-1">
                <input
                  type="color"
                  value={buttonStyles.backgroundColor}
                  onChange={(e) => handleButtonStyleChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 border border-brand rounded-brand cursor-pointer"
                />
                <Input
                  value={buttonStyles.backgroundColor}
                  onChange={(e) => handleButtonStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 h-8 text-caption font-mono border-brand bg-brand-bg text-brand-fg"
                />
              </div>
            </div>

            {/* Font Size */}
            <div>
              <Label className="text-caption text-brand-fg">Size</Label>
              <div className="flex items-center mt-brand-1">
                <Input
                  type="number"
                  value={buttonStyles.fontSize}
                  onChange={(e) => handleButtonStyleChange('fontSize', e.target.value)}
                  className="h-8 text-caption border-brand bg-brand-bg text-brand-fg"
                />
                <span className="text-caption text-brand-fg opacity-75 ml-brand-1">px</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-brand-3">
            {/* Line Height */}
            <div>
              <Label className="text-caption text-brand-fg">Line Height</Label>
              <div className="flex items-center gap-brand-1 mt-brand-1">
                <Input
                  type="number"
                  value={buttonStyles.lineHeight}
                  onChange={(e) => handleButtonStyleChange('lineHeight', e.target.value)}
                  className="h-8 text-caption border-brand bg-brand-bg text-brand-fg"
                />
                <span className="text-caption text-brand-fg opacity-75">%</span>
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <Label className="text-caption text-brand-fg">Letter Spacing</Label>
              <div className="flex items-center gap-brand-1 mt-brand-1">
                <Input
                  type="number"
                  value={buttonStyles.letterSpacing}
                  onChange={(e) => handleButtonStyleChange('letterSpacing', e.target.value)}
                  className="h-8 text-caption border-brand bg-brand-bg text-brand-fg"
                />
                <span className="text-caption text-brand-fg opacity-75">px</span>
              </div>
            </div>

            {/* Text Formatting */}
            <div>
              <Label className="text-caption text-brand-fg">Format</Label>
              <div className="flex gap-brand-1 mt-brand-1">
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
          <div className="grid grid-cols-2 gap-brand-3">
            <div>
              <Label className="text-caption text-brand-fg">Top/Bottom Padding</Label>
              <div className="flex items-center gap-brand-2 mt-brand-1">
                <Input
                  type="number"
                  value={buttonStyles.paddingTopBottom}
                  onChange={(e) => handlePaddingChange('topBottom', e.target.value)}
                  className="h-8 text-caption border-brand bg-brand-bg text-brand-fg"
                />
                <span className="text-caption text-brand-fg opacity-75">px</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-brand-muted"
                  onClick={togglePaddingLock}
                >
                  <Lock className={`w-3 h-3 ${buttonStyles.paddingLocked ? 'text-brand-primary' : 'text-brand-fg opacity-50'}`} />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-caption text-brand-fg">Left/Right Padding</Label>
              <div className="flex items-center gap-brand-2 mt-brand-1">
                <Input
                  type="number"
                  value={buttonStyles.paddingLeftRight}
                  onChange={(e) => handlePaddingChange('leftRight', e.target.value)}
                  className="h-8 text-caption border-brand bg-brand-bg text-brand-fg"
                />
                <span className="text-caption text-brand-fg opacity-75">px</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-brand-2 border-t border-brand">
            <Badge variant="secondary" className="text-caption bg-brand-muted text-brand-fg">
              Applied to all buttons
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
