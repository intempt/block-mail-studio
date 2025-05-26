import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  ChevronDown,
  X,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Lock
} from 'lucide-react';

interface StylesCardProps {
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

export const StylesCard: React.FC<StylesCardProps> = ({
  isOpen,
  onToggle,
  onStylesChange
}) => {
  const [activeTab, setActiveTab] = useState('email');
  const [emailStyles, setEmailStyles] = useState({
    backgroundColor: '#ffffff',
    contentWidth: '600',
    fontFamily: 'Arial, sans-serif',
    textColor: '#000000',
    preheaderText: '',
    containerPadding: '20'
  });

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

  const [buttonStyles, setButtonStyles] = useState({
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    borderRadius: '4',
    fontSize: '16',
    fontWeight: '500',
    paddingTopBottom: '12',
    paddingLeftRight: '24',
    borderWidth: '0',
    borderColor: '#000000'
  });

  const [linkStyles, setLinkStyles] = useState({
    color: '#3B82F6',
    hoverColor: '#1E40AF',
    underline: true,
    italic: false,
    fontWeight: '400'
  });

  const handleEmailStyleChange = (property: string, value: any) => {
    const newStyles = { ...emailStyles, [property]: value };
    setEmailStyles(newStyles);
    onStylesChange({
      email: {
        backgroundColor: newStyles.backgroundColor,
        contentWidth: `${newStyles.contentWidth}px`,
        fontFamily: newStyles.fontFamily,
        textColor: newStyles.textColor,
        preheaderText: newStyles.preheaderText,
        containerPadding: `${newStyles.containerPadding}px`
      }
    });
  };

  const handleTextStyleChange = (textType: string, property: string, value: any) => {
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

  const handleButtonStyleChange = (property: string, value: any) => {
    const newStyles = { ...buttonStyles, [property]: value };
    setButtonStyles(newStyles);
    onStylesChange({
      buttons: {
        default: {
          backgroundColor: newStyles.backgroundColor,
          color: newStyles.textColor,
          borderRadius: `${newStyles.borderRadius}px`,
          fontSize: `${newStyles.fontSize}px`,
          fontWeight: newStyles.fontWeight,
          padding: `${newStyles.paddingTopBottom}px ${newStyles.paddingLeftRight}px`,
          border: `${newStyles.borderWidth}px solid ${newStyles.borderColor}`
        }
      }
    });
  };

  const handleLinkStyleChange = (property: string, value: any) => {
    const newStyles = { ...linkStyles, [property]: value };
    setLinkStyles(newStyles);
    onStylesChange({
      links: {
        normal: {
          color: newStyles.color,
          textDecoration: newStyles.underline ? 'underline' : 'none',
          fontStyle: newStyles.italic ? 'italic' : 'normal',
          fontWeight: newStyles.fontWeight
        },
        hover: {
          color: newStyles.hoverColor
        }
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
            Styles
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
            <TabsTrigger value="email" className="text-xs">Email</TabsTrigger>
            <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>
            <TabsTrigger value="buttons" className="text-xs">Buttons</TabsTrigger>
            <TabsTrigger value="links" className="text-xs">Links</TabsTrigger>
          </TabsList>

          {/* Email Settings Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={emailStyles.backgroundColor}
                    onChange={(e) => handleEmailStyleChange('backgroundColor', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={emailStyles.backgroundColor}
                    onChange={(e) => handleEmailStyleChange('backgroundColor', e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Content Width</Label>
                <div className="flex items-center gap-1 mt-1">
                  <Input
                    type="number"
                    value={emailStyles.contentWidth}
                    onChange={(e) => handleEmailStyleChange('contentWidth', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Text Settings Tab */}
          <TabsContent value="text" className="space-y-4">
            <div className="flex gap-1 mb-3">
              {Object.keys(textStyles).map((textType) => (
                <Button
                  key={textType}
                  variant={activeTab === textType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(textType)}
                  className="h-7 text-xs"
                >
                  {textType === 'paragraph' ? 'P' : textType.toUpperCase()}
                </Button>
              ))}
            </div>
            {/* Text styling controls would go here - keeping it simple for now */}
          </TabsContent>

          {/* Button Settings Tab */}
          <TabsContent value="buttons" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Background Color</Label>
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
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
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
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Links Settings Tab */}
          <TabsContent value="links" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Link Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={linkStyles.color}
                    onChange={(e) => handleLinkStyleChange('color', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={linkStyles.color}
                    onChange={(e) => handleLinkStyleChange('color', e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Hover Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={linkStyles.hoverColor}
                    onChange={(e) => handleLinkStyleChange('hoverColor', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={linkStyles.hoverColor}
                    onChange={(e) => handleLinkStyleChange('hoverColor', e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={linkStyles.underline ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-3"
                onClick={() => handleLinkStyleChange('underline', !linkStyles.underline)}
              >
                <Underline className="w-3 h-3 mr-1" />
                Underline
              </Button>
              <Button
                variant={linkStyles.italic ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-3"
                onClick={() => handleLinkStyleChange('italic', !linkStyles.italic)}
              >
                <Italic className="w-3 h-3 mr-1" />
                Italic
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
