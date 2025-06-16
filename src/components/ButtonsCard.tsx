
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointerClick,
  ChevronDown,
  Italic,
  Underline
} from 'lucide-react';

interface ButtonsCardProps {
  isOpen: boolean;
  onToggle: () => void;
  onStylesChange: (styles: any) => void;
  inline?: boolean;
}

export const ButtonsCard: React.FC<ButtonsCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange,
  inline = false
}) => {
  const [buttonStyles, setButtonStyles] = useState({
    font: 'Arial',
    style: 'Normal',
    textColor: '#ffffff',
    buttonColor: '#414141',
    size: '13',
    lineHeight: '120',
    letterSpacing: '0',
    topBottomPadding: '10',
    leftRightPadding: '25'
  });

  const handleButtonStyleChange = (property: string, value: any) => {
    const newStyles = { ...buttonStyles, [property]: value };
    setButtonStyles(newStyles);
    
    onStylesChange({
      button: {
        fontFamily: newStyles.font,
        fontWeight: newStyles.style === 'Normal' ? 'normal' : 'bold',
        color: newStyles.textColor,
        backgroundColor: newStyles.buttonColor,
        fontSize: newStyles.size + 'px',
        lineHeight: newStyles.lineHeight + '%',
        letterSpacing: newStyles.letterSpacing + 'px',
        paddingTop: newStyles.topBottomPadding + 'px',
        paddingBottom: newStyles.topBottomPadding + 'px',
        paddingLeft: newStyles.leftRightPadding + 'px',
        paddingRight: newStyles.leftRightPadding + 'px'
      }
    });
  };

  const content = (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Font</Label>
        <div className="flex gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {buttonStyles.font} ✕
          </Badge>
        </div>
        <Button variant="outline" className="w-full h-8 text-xs mt-2 justify-start">
          Add font...
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <Label className="text-xs">Style</Label>
          <Select value={buttonStyles.style} onValueChange={(value) => handleButtonStyleChange('style', value)}>
            <SelectTrigger className="h-8 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Bold">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Text Color</Label>
          <div className="flex gap-1 mt-1">
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

        <div>
          <Label className="text-xs">Button Color</Label>
          <div className="flex gap-1 mt-1">
            <input
              type="color"
              value={buttonStyles.buttonColor}
              onChange={(e) => handleButtonStyleChange('buttonColor', e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              value={buttonStyles.buttonColor}
              onChange={(e) => handleButtonStyleChange('buttonColor', e.target.value)}
              className="flex-1 h-8 text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Size</Label>
          <div className="flex mt-1">
            <Input
              value={buttonStyles.size}
              onChange={(e) => handleButtonStyleChange('size', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Line Height</Label>
          <div className="flex mt-1">
            <Input
              value={buttonStyles.lineHeight}
              onChange={(e) => handleButtonStyleChange('lineHeight', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">%</span>
          </div>
        </div>

        <div>
          <Label className="text-xs">Letter Spacing</Label>
          <div className="flex mt-1">
            <Input
              value={buttonStyles.letterSpacing}
              onChange={(e) => handleButtonStyleChange('letterSpacing', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>

        <div>
          <Label className="text-xs">Format</Label>
          <div className="flex gap-1 mt-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Italic className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Underline className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Top/Bottom Padding</Label>
          <div className="flex mt-1">
            <Input
              value={buttonStyles.topBottomPadding}
              onChange={(e) => handleButtonStyleChange('topBottomPadding', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>

        <div>
          <Label className="text-xs">Left/Right Padding</Label>
          <div className="flex mt-1">
            <Input
              value={buttonStyles.leftRightPadding}
              onChange={(e) => handleButtonStyleChange('leftRightPadding', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <Badge variant="secondary" className="text-xs">
          Applied to all buttons
        </Badge>
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
            <MousePointerClick className="w-4 h-4" />
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
        {content}
      </div>
    </Card>
  );
};
