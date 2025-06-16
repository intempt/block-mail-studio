
import React, { useState } from 'react';
import { TextBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  X,
  Lock
} from 'lucide-react';

interface TextBlockPropertyEditorProps {
  block: TextBlock;
  onUpdate: (block: TextBlock) => void;
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

export const TextBlockPropertyEditor: React.FC<TextBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState('paragraph');
  const [selectedFonts, setSelectedFonts] = useState(['Arial, sans-serif']);
  const [paddingLocked, setPaddingLocked] = useState(true);

  const updateStyling = (device: 'desktop' | 'tablet' | 'mobile', updates: any) => {
    onUpdate({
      ...block,
      styling: {
        ...block.styling,
        [device]: { ...block.styling[device], ...updates }
      }
    });
  };

  const addFont = (font: string) => {
    if (!selectedFonts.includes(font)) {
      const newFonts = [...selectedFonts, font];
      setSelectedFonts(newFonts);
      updateStyling('desktop', { fontFamily: newFonts.join(', ') });
    }
  };

  const removeFont = (font: string) => {
    const newFonts = selectedFonts.filter(f => f !== font);
    setSelectedFonts(newFonts);
    updateStyling('desktop', { fontFamily: newFonts.join(', ') || 'Arial, sans-serif' });
  };

  const handlePaddingChange = (type: 'top' | 'right' | 'bottom' | 'left', value: string) => {
    const currentPadding = block.styling.desktop.padding || '16px';
    const paddingValues = currentPadding.split(' ');
    
    if (paddingLocked) {
      updateStyling('desktop', { padding: `${value}px` });
    } else {
      // Handle individual padding values
      let newPadding;
      if (type === 'top' || type === 'bottom') {
        newPadding = `${value}px ${paddingValues[1] || value}px`;
      } else {
        newPadding = `${paddingValues[0] || value}px ${value}px`;
      }
      updateStyling('desktop', { padding: newPadding });
    }
  };

  const styling = block.styling.desktop;

  return (
    <div className="space-y-6">
      {/* Text Style Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="paragraph" className="text-xs">Paragraph</TabsTrigger>
          <TabsTrigger value="h1" className="text-xs">H1</TabsTrigger>
          <TabsTrigger value="h2" className="text-xs">H2</TabsTrigger>
          <TabsTrigger value="h3" className="text-xs">H3</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {/* Font Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Font</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedFonts.map((font) => (
                <Badge key={font} variant="secondary" className="text-xs flex items-center gap-1">
                  {font.split(',')[0]}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFont(font)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={addFont}>
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

          {/* Size, Color, Line Height, Style Row */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label className="text-xs">Size</Label>
              <Input
                type="number"
                value={parseInt(styling.fontSize || '16')}
                onChange={(e) => updateStyling('desktop', { fontSize: `${e.target.value}px` })}
                className="h-8 text-xs mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Color</Label>
              <div className="flex gap-1 mt-1">
                <input
                  type="color"
                  value={styling.textColor || '#000000'}
                  onChange={(e) => updateStyling('desktop', { textColor: e.target.value })}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={styling.textColor || '#000000'}
                  onChange={(e) => updateStyling('desktop', { textColor: e.target.value })}
                  className="flex-1 h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Line Height</Label>
              <div className="flex items-center gap-1 mt-1">
                <Input
                  type="number"
                  value={parseInt(styling.lineHeight || '130')}
                  onChange={(e) => updateStyling('desktop', { lineHeight: `${e.target.value}%` })}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>

            <div>
              <Label className="text-xs">Style</Label>
              <Select 
                value={styling.fontWeight || '400'} 
                onValueChange={(value) => updateStyling('desktop', { fontWeight: value })}
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

          {/* Letter Spacing, Format, Alignment Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Letter Spacing</Label>
              <div className="flex items-center gap-1 mt-1">
                <Input
                  type="number"
                  value={parseInt((styling as any).letterSpacing || '0')}
                  onChange={(e) => updateStyling('desktop', { letterSpacing: `${e.target.value}px` })}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            <div>
              <Label className="text-xs">Format</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Italic className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Underline className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs">Alignment</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  variant={styling.textAlign === 'left' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateStyling('desktop', { textAlign: 'left' })}
                >
                  <AlignLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant={styling.textAlign === 'center' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateStyling('desktop', { textAlign: 'center' })}
                >
                  <AlignCenter className="w-3 h-3" />
                </Button>
                <Button
                  variant={styling.textAlign === 'right' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateStyling('desktop', { textAlign: 'right' })}
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
                  value={8}
                  onChange={(e) => handlePaddingChange('top', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPaddingLocked(!paddingLocked)}
                >
                  <Lock className={`w-3 h-3 ${paddingLocked ? 'text-blue-600' : 'text-gray-400'}`} />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs">Left/Right Padding</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={16}
                  onChange={(e) => handlePaddingChange('left', e.target.value)}
                  className="h-8 text-xs"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
