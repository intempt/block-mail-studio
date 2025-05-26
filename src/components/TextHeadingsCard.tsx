
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type,
  ChevronDown,
  X,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Lock
} from 'lucide-react';

interface TextHeadingsCardProps {
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

const fontWeights = [
  { value: '300', label: '300 - Light' },
  { value: '400', label: '400 - Normal' },
  { value: '500', label: '500 - Medium' },
  { value: '600', label: '600 - Semi Bold' },
  { value: '700', label: '700 - Bold' },
  { value: '800', label: '800 - Extra Bold' }
];

export const TextHeadingsCard: React.FC<TextHeadingsCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange
}) => {
  const [activeTab, setActiveTab] = useState('paragraph');
  const [textStyles, setTextStyles] = useState({
    paragraph: {
      fontFamily: ['Arial, sans-serif'],
      fontSize: '16',
      color: '#000000',
      lineHeight: '130',
      fontWeight: '400',
      letterSpacing: '0',
      italic: false,
      underline: false,
      alignment: 'left',
      paddingTopBottom: '8',
      paddingLeftRight: '16',
      paddingLocked: true
    },
    h1: {
      fontFamily: ['Arial, sans-serif'],
      fontSize: '32',
      color: '#000000',
      lineHeight: '120',
      fontWeight: '700',
      letterSpacing: '0',
      italic: false,
      underline: false,
      alignment: 'left',
      paddingTopBottom: '12',
      paddingLeftRight: '16',
      paddingLocked: true
    },
    h2: {
      fontFamily: ['Arial, sans-serif'],
      fontSize: '24',
      color: '#000000',
      lineHeight: '125',
      fontWeight: '600',
      letterSpacing: '0',
      italic: false,
      underline: false,
      alignment: 'left',
      paddingTopBottom: '10',
      paddingLeftRight: '16',
      paddingLocked: true
    },
    h3: {
      fontFamily: ['Arial, sans-serif'],
      fontSize: '20',
      color: '#000000',
      lineHeight: '130',
      fontWeight: '600',
      letterSpacing: '0',
      italic: false,
      underline: false,
      alignment: 'left',
      paddingTopBottom: '8',
      paddingLeftRight: '16',
      paddingLocked: true
    }
  });

  const handleStyleChange = (textType: string, property: string, value: any) => {
    const newStyles = {
      ...textStyles,
      [textType]: {
        ...textStyles[textType as keyof typeof textStyles],
        [property]: value
      }
    };
    setTextStyles(newStyles);
    
    const currentStyle = newStyles[textType as keyof typeof newStyles];
    onStylesChange({
      text: {
        [textType]: {
          fontFamily: currentStyle.fontFamily.join(', '),
          fontSize: `${currentStyle.fontSize}px`,
          color: currentStyle.color,
          lineHeight: `${currentStyle.lineHeight}%`,
          fontWeight: currentStyle.fontWeight,
          letterSpacing: `${currentStyle.letterSpacing}px`,
          fontStyle: currentStyle.italic ? 'italic' : 'normal',
          textDecoration: currentStyle.underline ? 'underline' : 'none',
          textAlign: currentStyle.alignment,
          padding: `${currentStyle.paddingTopBottom}px ${currentStyle.paddingLeftRight}px`
        }
      }
    });
  };

  const addFont = (textType: string, font: string) => {
    const currentStyle = textStyles[textType as keyof typeof textStyles];
    if (!currentStyle.fontFamily.includes(font)) {
      handleStyleChange(textType, 'fontFamily', [...currentStyle.fontFamily, font]);
    }
  };

  const removeFont = (textType: string, font: string) => {
    const currentStyle = textStyles[textType as keyof typeof textStyles];
    handleStyleChange(textType, 'fontFamily', currentStyle.fontFamily.filter(f => f !== font));
  };

  const togglePaddingLock = (textType: string) => {
    const currentStyle = textStyles[textType as keyof typeof textStyles];
    const newLocked = !currentStyle.paddingLocked;
    handleStyleChange(textType, 'paddingLocked', newLocked);
  };

  const handlePaddingChange = (textType: string, type: 'topBottom' | 'leftRight', value: string) => {
    const currentStyle = textStyles[textType as keyof typeof textStyles];
    if (currentStyle.paddingLocked) {
      handleStyleChange(textType, 'paddingTopBottom', value);
      handleStyleChange(textType, 'paddingLeftRight', value);
    } else {
      const property = type === 'topBottom' ? 'paddingTopBottom' : 'paddingLeftRight';
      handleStyleChange(textType, property, value);
    }
  };

  const getCurrentStyle = () => textStyles[activeTab as keyof typeof textStyles];

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="paragraph" className="text-xs">Paragraph</TabsTrigger>
            <TabsTrigger value="h1" className="text-xs">H1</TabsTrigger>
            <TabsTrigger value="h2" className="text-xs">H2</TabsTrigger>
            <TabsTrigger value="h3" className="text-xs">H3</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Font Selection */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Font</Label>
              <div className="flex flex-wrap gap-1 mb-2">
                {getCurrentStyle().fontFamily.map((font) => (
                  <Badge key={font} variant="secondary" className="text-xs flex items-center gap-1">
                    {font.split(',')[0]}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFont(activeTab, font)}
                    />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => addFont(activeTab, value)}>
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
              {/* Size */}
              <div>
                <Label className="text-xs">Size</Label>
                <Input
                  type="number"
                  value={getCurrentStyle().fontSize}
                  onChange={(e) => handleStyleChange(activeTab, 'fontSize', e.target.value)}
                  className="h-8 text-xs mt-1"
                />
              </div>

              {/* Color */}
              <div>
                <Label className="text-xs">Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={getCurrentStyle().color}
                    onChange={(e) => handleStyleChange(activeTab, 'color', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={getCurrentStyle().color}
                    onChange={(e) => handleStyleChange(activeTab, 'color', e.target.value)}
                    className="flex-1 h-8 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Line Height */}
              <div>
                <Label className="text-xs">Line Height</Label>
                <div className="flex items-center gap-1 mt-1">
                  <Input
                    type="number"
                    value={getCurrentStyle().lineHeight}
                    onChange={(e) => handleStyleChange(activeTab, 'lineHeight', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>

              {/* Style */}
              <div>
                <Label className="text-xs">Style</Label>
                <Select 
                  value={getCurrentStyle().fontWeight} 
                  onValueChange={(value) => handleStyleChange(activeTab, 'fontWeight', value)}
                >
                  <SelectTrigger className="h-8 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Letter Spacing */}
              <div>
                <Label className="text-xs">Letter Spacing</Label>
                <div className="flex items-center gap-1 mt-1">
                  <Input
                    type="number"
                    value={getCurrentStyle().letterSpacing}
                    onChange={(e) => handleStyleChange(activeTab, 'letterSpacing', e.target.value)}
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
                    variant={getCurrentStyle().italic ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleStyleChange(activeTab, 'italic', !getCurrentStyle().italic)}
                  >
                    <Italic className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={getCurrentStyle().underline ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleStyleChange(activeTab, 'underline', !getCurrentStyle().underline)}
                  >
                    <Underline className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Alignment */}
              <div>
                <Label className="text-xs">Alignment</Label>
                <div className="flex gap-1 mt-1">
                  <Button
                    variant={getCurrentStyle().alignment === 'left' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleStyleChange(activeTab, 'alignment', 'left')}
                  >
                    <AlignLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={getCurrentStyle().alignment === 'center' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleStyleChange(activeTab, 'alignment', 'center')}
                  >
                    <AlignCenter className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={getCurrentStyle().alignment === 'right' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleStyleChange(activeTab, 'alignment', 'right')}
                  >
                    <AlignRight className="w-3 h-3" />
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
                    value={getCurrentStyle().paddingTopBottom}
                    onChange={(e) => handlePaddingChange(activeTab, 'topBottom', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <span className="text-xs text-gray-500">px</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => togglePaddingLock(activeTab)}
                  >
                    <Lock className={`w-3 h-3 ${getCurrentStyle().paddingLocked ? 'text-blue-600' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs">Left/Right Padding</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    value={getCurrentStyle().paddingLeftRight}
                    onChange={(e) => handlePaddingChange(activeTab, 'leftRight', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
