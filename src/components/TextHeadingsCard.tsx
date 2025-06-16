
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Type,
  ChevronDown,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface TextHeadingsCardProps {
  isOpen: boolean;
  onToggle: () => void;
  onStylesChange: (styles: any) => void;
  inline?: boolean;
}

export const TextHeadingsCard: React.FC<TextHeadingsCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange,
  inline = false
}) => {
  const [selectedHeading, setSelectedHeading] = useState('Paragraph');
  const [textStyles, setTextStyles] = useState({
    font: 'Arial',
    size: '16',
    color: '#000000',
    lineHeight: '130',
    style: '400 - Normal',
    letterSpacing: '0',
    topBottomPadding: '8',
    leftRightPadding: '16',
    alignment: 'center'
  });

  const handleTextStyleChange = (property: string, value: any) => {
    const newStyles = { ...textStyles, [property]: value };
    setTextStyles(newStyles);
    
    onStylesChange({
      text: {
        fontFamily: newStyles.font,
        fontSize: newStyles.size + 'px',
        color: newStyles.color,
        lineHeight: newStyles.lineHeight + '%',
        fontWeight: newStyles.style.includes('400') ? 'normal' : 'bold',
        letterSpacing: newStyles.letterSpacing + 'px',
        paddingTop: newStyles.topBottomPadding + 'px',
        paddingBottom: newStyles.topBottomPadding + 'px',
        paddingLeft: newStyles.leftRightPadding + 'px',
        paddingRight: newStyles.leftRightPadding + 'px',
        textAlign: newStyles.alignment
      }
    });
  };

  const content = (
    <div className="space-y-4">
      {/* Heading Type Selector */}
      <div className="flex gap-1">
        {['Paragraph', 'H1', 'H2', 'H3'].map((heading) => (
          <Button
            key={heading}
            variant={selectedHeading === heading ? 'default' : 'outline'}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => setSelectedHeading(heading)}
          >
            {heading}
          </Button>
        ))}
      </div>

      <div>
        <Label className="text-xs">Font</Label>
        <div className="flex gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {textStyles.font} ✕
          </Badge>
        </div>
        <Button variant="outline" className="w-full h-8 text-xs mt-2 justify-start">
          Add font...
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <Label className="text-xs">Size</Label>
          <Input
            value={textStyles.size}
            onChange={(e) => handleTextStyleChange('size', e.target.value)}
            className="h-8 text-xs mt-1"
          />
        </div>

        <div>
          <Label className="text-xs">Color</Label>
          <div className="flex gap-1 mt-1">
            <input
              type="color"
              value={textStyles.color}
              onChange={(e) => handleTextStyleChange('color', e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Line Height</Label>
          <div className="flex mt-1">
            <Input
              value={textStyles.lineHeight}
              onChange={(e) => handleTextStyleChange('lineHeight', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">%</span>
          </div>
        </div>

        <div>
          <Label className="text-xs">Style</Label>
          <Select value={textStyles.style} onValueChange={(value) => handleTextStyleChange('style', value)}>
            <SelectTrigger className="h-8 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="400 - Normal">400 - Normal</SelectItem>
              <SelectItem value="700 - Bold">700 - Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Letter Spacing</Label>
          <div className="flex mt-1">
            <Input
              value={textStyles.letterSpacing}
              onChange={(e) => handleTextStyleChange('letterSpacing', e.target.value)}
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

        <div>
          <Label className="text-xs">Alignment</Label>
          <div className="flex gap-1 mt-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <AlignLeft className="w-3 h-3" />
            </Button>
            <Button 
              variant={textStyles.alignment === 'center' ? 'default' : 'outline'} 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleTextStyleChange('alignment', 'center')}
            >
              <AlignCenter className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <AlignRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Top/Bottom Padding</Label>
          <div className="flex mt-1">
            <Input
              value={textStyles.topBottomPadding}
              onChange={(e) => handleTextStyleChange('topBottomPadding', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>

        <div>
          <Label className="text-xs">Left/Right Padding</Label>
          <div className="flex mt-1">
            <Input
              value={textStyles.leftRightPadding}
              onChange={(e) => handleTextStyleChange('leftRightPadding', e.target.value)}
              className="h-8 text-xs"
            />
            <span className="ml-1 text-xs text-gray-500 flex items-center">px</span>
          </div>
        </div>
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
            <Type className="w-4 h-4" />
            Text & Headings
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
