
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  Type,
  MousePointer,
  Link,
  ChevronDown,
  ChevronRight,
  Palette
} from 'lucide-react';
import { useGlobalBrandStyles } from '@/contexts/GlobalBrandStylesContext';

interface GlobalStylesPanelProps {
  compactMode?: boolean;
}

const googleFonts = [
  'Arial, sans-serif',
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Lato, sans-serif',
  'Montserrat, sans-serif',
  'Poppins, sans-serif',
  'Source Sans Pro, sans-serif',
  'Nunito, sans-serif',
  'Raleway, sans-serif',
  'Ubuntu, sans-serif',
  'Playfair Display, serif',
  'Merriweather, serif',
  'Georgia, serif',
  'Times New Roman, serif',
];

const fontWeights = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
];

export const GlobalStylesPanel: React.FC<GlobalStylesPanelProps> = ({
  compactMode = false
}) => {
  const { styles, updateStyles, resetStyles } = useGlobalBrandStyles();
  const [sectionsExpanded, setSectionsExpanded] = useState({
    email: true,
    text: true,
    buttons: true,
    links: true,
  });

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateEmailStyles = (field: string, value: any) => {
    updateStyles({
      email: { ...styles.email, [field]: value }
    });
  };

  const updateTextStyles = (textType: keyof typeof styles.text, field: string, value: any) => {
    updateStyles({
      text: {
        ...styles.text,
        [textType]: { ...styles.text[textType], [field]: value }
      }
    });
  };

  const updateButtonStyles = (field: string, value: any) => {
    updateStyles({
      buttons: {
        default: { ...styles.buttons.default, [field]: value }
      }
    });
  };

  const updateLinkStyles = (field: string, value: any) => {
    updateStyles({
      links: { ...styles.links, [field]: value }
    });
  };

  const updatePadding = (target: 'email' | 'buttons', side: string, value: number) => {
    if (target === 'email') {
      const currentPadding = styles.email.padding;
      if (currentPadding.linked) {
        updateEmailStyles('padding', {
          top: value,
          right: value,
          bottom: value,
          left: value,
          linked: true,
        });
      } else {
        updateEmailStyles('padding', {
          ...currentPadding,
          [side]: value,
        });
      }
    } else {
      const currentPadding = styles.buttons.default.padding;
      if (currentPadding.linked) {
        updateButtonStyles('padding', {
          top: value,
          right: value,
          bottom: value,
          left: value,
          linked: true,
        });
      } else {
        updateButtonStyles('padding', {
          ...currentPadding,
          [side]: value,
        });
      }
    }
  };

  const inputHeight = compactMode ? 'h-7' : 'h-8';
  const sectionSpacing = compactMode ? 'space-y-2' : 'space-y-3';
  const paddingClass = compactMode ? 'p-2' : 'p-4';

  return (
    <div className="h-full flex flex-col">
      <div className={`${paddingClass} border-b border-gray-200`}>
        <h3 className={`${compactMode ? 'text-sm' : 'text-lg'} font-semibold text-gray-900 flex items-center gap-2`}>
          <Palette className={compactMode ? 'w-4 h-4' : 'w-5 h-5'} />
          Global Brand Styles
        </h3>
      </div>

      <div className="flex-1 overflow-auto">
        <div className={paddingClass}>
          <div className={sectionSpacing}>
            {/* Email Settings Section */}
            <Collapsible 
              open={sectionsExpanded.email} 
              onOpenChange={() => toggleSection('email')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                    <Settings className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                    Email Settings
                  </h4>
                  {sectionsExpanded.email ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className={sectionSpacing}>
                  <div>
                    <Label className={compactMode ? 'text-xs' : 'text-sm'}>Container Max Width</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[styles.email.maxWidth]}
                        onValueChange={([value]) => updateEmailStyles('maxWidth', value)}
                        min={300}
                        max={800}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 w-12">{styles.email.maxWidth}px</span>
                    </div>
                  </div>

                  <div>
                    <Label className={compactMode ? 'text-xs' : 'text-sm'}>Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={styles.email.backgroundColor}
                        onChange={(e) => updateEmailStyles('backgroundColor', e.target.value)}
                        className={`${compactMode ? 'w-8 h-7' : 'w-10 h-8'} border border-gray-300 rounded cursor-pointer`}
                      />
                      <Input
                        value={styles.email.backgroundColor}
                        onChange={(e) => updateEmailStyles('backgroundColor', e.target.value)}
                        className={`flex-1 ${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className={compactMode ? 'text-xs' : 'text-sm'}>Default Font Family</Label>
                    <Select 
                      value={styles.email.defaultFontFamily} 
                      onValueChange={(value) => updateEmailStyles('defaultFontFamily', value)}
                    >
                      <SelectTrigger className={inputHeight}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {googleFonts.map((font) => (
                          <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                            {font.split(',')[0]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Text & Headings Section */}
            <Collapsible 
              open={sectionsExpanded.text} 
              onOpenChange={() => toggleSection('text')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                    <Type className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                    Text & Headings
                  </h4>
                  {sectionsExpanded.text ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className={sectionSpacing}>
                  {(['body', 'h1', 'h2', 'h3', 'h4'] as const).map((textType) => (
                    <div key={textType} className="border border-gray-200 rounded-lg p-3">
                      <h5 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium mb-2 capitalize`}>
                        {textType === 'body' ? 'Body Text' : textType.toUpperCase()}
                      </h5>
                      <div className={sectionSpacing}>
                        <div>
                          <Label className="text-xs">Font Family</Label>
                          <Select 
                            value={styles.text[textType].fontFamily} 
                            onValueChange={(value) => updateTextStyles(textType, 'fontFamily', value)}
                          >
                            <SelectTrigger className={inputHeight}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg z-50">
                              {googleFonts.map((font) => (
                                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                  {font.split(',')[0]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Font Size</Label>
                            <Input
                              type="number"
                              value={styles.text[textType].fontSize}
                              onChange={(e) => updateTextStyles(textType, 'fontSize', parseInt(e.target.value) || 16)}
                              className={`${inputHeight} text-xs`}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Font Weight</Label>
                            <Select 
                              value={styles.text[textType].fontWeight} 
                              onValueChange={(value) => updateTextStyles(textType, 'fontWeight', value)}
                            >
                              <SelectTrigger className={inputHeight}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border shadow-lg z-50">
                                {fontWeights.map((weight) => (
                                  <SelectItem key={weight.value} value={weight.value}>
                                    {weight.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">Text Color</Label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="color"
                              value={styles.text[textType].color}
                              onChange={(e) => updateTextStyles(textType, 'color', e.target.value)}
                              className="w-6 h-7 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={styles.text[textType].color}
                              onChange={(e) => updateTextStyles(textType, 'color', e.target.value)}
                              className="flex-1 h-7 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Buttons Section */}
            <Collapsible 
              open={sectionsExpanded.buttons} 
              onOpenChange={() => toggleSection('buttons')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                    <MousePointer className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                    Buttons
                  </h4>
                  {sectionsExpanded.buttons ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className={sectionSpacing}>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Background Color</Label>
                      <div className="flex gap-1 mt-1">
                        <input
                          type="color"
                          value={styles.buttons.default.backgroundColor}
                          onChange={(e) => updateButtonStyles('backgroundColor', e.target.value)}
                          className="w-6 h-7 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          value={styles.buttons.default.backgroundColor}
                          onChange={(e) => updateButtonStyles('backgroundColor', e.target.value)}
                          className="flex-1 h-7 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Text Color</Label>
                      <div className="flex gap-1 mt-1">
                        <input
                          type="color"
                          value={styles.buttons.default.textColor}
                          onChange={(e) => updateButtonStyles('textColor', e.target.value)}
                          className="w-6 h-7 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          value={styles.buttons.default.textColor}
                          onChange={(e) => updateButtonStyles('textColor', e.target.value)}
                          className="flex-1 h-7 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Border Radius</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[styles.buttons.default.borderRadius]}
                        onValueChange={([value]) => updateButtonStyles('borderRadius', value)}
                        min={0}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 w-12">{styles.buttons.default.borderRadius}px</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Links Section */}
            <Collapsible 
              open={sectionsExpanded.links} 
              onOpenChange={() => toggleSection('links')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                    <Link className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                    Links
                  </h4>
                  {sectionsExpanded.links ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className={sectionSpacing}>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-xs">Normal Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={styles.links.normal}
                          onChange={(e) => updateLinkStyles('normal', e.target.value)}
                          className="w-6 h-7 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          value={styles.links.normal}
                          onChange={(e) => updateLinkStyles('normal', e.target.value)}
                          className="flex-1 h-7 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Hover Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={styles.links.hover}
                          onChange={(e) => updateLinkStyles('hover', e.target.value)}
                          className="w-6 h-7 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          value={styles.links.hover}
                          onChange={(e) => updateLinkStyles('hover', e.target.value)}
                          className="flex-1 h-7 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Font Weight</Label>
                      <Select 
                        value={styles.links.fontWeight} 
                        onValueChange={(value) => updateLinkStyles('fontWeight', value)}
                      >
                        <SelectTrigger className="h-7">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {fontWeights.map((weight) => (
                            <SelectItem key={weight.value} value={weight.value}>
                              {weight.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 pt-4">
                      <Switch
                        checked={styles.links.underline}
                        onCheckedChange={(checked) => updateLinkStyles('underline', checked)}
                      />
                      <Label className="text-xs">Underline</Label>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};
