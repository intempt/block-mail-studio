
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
  Plus,
  X,
  Palette,
  Monitor
} from 'lucide-react';

interface GlobalStyles {
  email: {
    maxWidth: number;
    backgroundColor: string;
    backgroundImage?: string;
    defaultFontFamily: string;
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
      linked: boolean;
    };
  };
  text: {
    body: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
      tags: string[];
    };
    h1: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
      tags: string[];
    };
    h2: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
      tags: string[];
    };
    h3: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
      tags: string[];
    };
    h4: {
      fontFamily: string;
      fontSize: number;
      color: string;
      fontWeight: string;
      tags: string[];
    };
  };
  buttons: {
    default: {
      backgroundColor: string;
      textColor: string;
      borderRadius: number;
      padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
        linked: boolean;
      };
      border: {
        width: number;
        style: string;
        color: string;
      };
    };
  };
  links: {
    normal: string;
    hover: string;
    visited: string;
    underline: boolean;
    fontWeight: string;
  };
}

interface GlobalStylesPanelProps {
  globalStyles?: GlobalStyles;
  onStylesChange?: (styles: GlobalStyles) => void;
  compactMode?: boolean;
}

const defaultGlobalStyles: GlobalStyles = {
  email: {
    maxWidth: 600,
    backgroundColor: '#ffffff',
    defaultFontFamily: 'Arial, sans-serif',
    padding: { top: 20, right: 20, bottom: 20, left: 20, linked: true },
  },
  text: {
    body: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      color: '#333333',
      fontWeight: '400',
      tags: ['paragraph', 'content'],
    },
    h1: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 32,
      color: '#1a1a1a',
      fontWeight: '700',
      tags: ['title', 'main-heading'],
    },
    h2: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 24,
      color: '#1a1a1a',
      fontWeight: '600',
      tags: ['subtitle', 'section-heading'],
    },
    h3: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 20,
      color: '#1a1a1a',
      fontWeight: '600',
      tags: ['subheading'],
    },
    h4: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 18,
      color: '#1a1a1a',
      fontWeight: '500',
      tags: ['minor-heading'],
    },
  },
  buttons: {
    default: {
      backgroundColor: '#3B82F6',
      textColor: '#ffffff',
      borderRadius: 8,
      padding: { top: 12, right: 24, bottom: 12, left: 24, linked: false },
      border: { width: 0, style: 'none', color: '#transparent' },
    },
  },
  links: {
    normal: '#3B82F6',
    hover: '#1E40AF',
    visited: '#7C3AED',
    underline: true,
    fontWeight: '400',
  },
};

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
  globalStyles = defaultGlobalStyles,
  onStylesChange,
  compactMode = false
}) => {
  const [styles, setStyles] = useState<GlobalStyles>(globalStyles);
  const [sectionsExpanded, setSectionsExpanded] = useState({
    email: true,
    text: true,
    buttons: true,
    links: true,
  });

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateStyles = (newStyles: Partial<GlobalStyles>) => {
    const updatedStyles = { ...styles, ...newStyles };
    setStyles(updatedStyles);
    onStylesChange?.(updatedStyles);
  };

  const updateEmailStyles = (field: string, value: any) => {
    updateStyles({
      email: { ...styles.email, [field]: value }
    });
  };

  const updateTextStyles = (textType: keyof GlobalStyles['text'], field: string, value: any) => {
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

  const addTag = (textType: keyof GlobalStyles['text'], tag: string) => {
    if (tag.trim() && !styles.text[textType].tags.includes(tag.trim())) {
      updateTextStyles(textType, 'tags', [...styles.text[textType].tags, tag.trim()]);
    }
  };

  const removeTag = (textType: keyof GlobalStyles['text'], tagToRemove: string) => {
    updateTextStyles(textType, 'tags', styles.text[textType].tags.filter(tag => tag !== tagToRemove));
  };

  const inputHeight = compactMode ? 'h-7' : 'h-8';
  const sectionSpacing = compactMode ? 'space-y-2' : 'space-y-3';
  const paddingClass = compactMode ? 'p-2' : 'p-4';

  return (
    <div className="h-full flex flex-col">
      <div className={`${paddingClass} border-b border-gray-200`}>
        <h3 className={`${compactMode ? 'text-sm' : 'text-lg'} font-semibold text-gray-900 flex items-center gap-2`}>
          <Palette className={compactMode ? 'w-4 h-4' : 'w-5 h-5'} />
          Global Styles
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

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className={compactMode ? 'text-xs' : 'text-sm'}>Container Padding</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={styles.email.padding.linked}
                          onCheckedChange={(linked) => updateEmailStyles('padding', { ...styles.email.padding, linked })}
                        />
                        <span className="text-xs text-gray-500">Linked</span>
                      </div>
                    </div>
                    {styles.email.padding.linked ? (
                      <div>
                        <Input
                          type="number"
                          value={styles.email.padding.top}
                          onChange={(e) => updatePadding('email', 'all', parseInt(e.target.value) || 0)}
                          className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                          placeholder="All sides"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          value={styles.email.padding.top}
                          onChange={(e) => updatePadding('email', 'top', parseInt(e.target.value) || 0)}
                          placeholder="Top"
                          className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                        />
                        <Input
                          type="number"
                          value={styles.email.padding.right}
                          onChange={(e) => updatePadding('email', 'right', parseInt(e.target.value) || 0)}
                          placeholder="Right"
                          className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                        />
                        <Input
                          type="number"
                          value={styles.email.padding.bottom}
                          onChange={(e) => updatePadding('email', 'bottom', parseInt(e.target.value) || 0)}
                          placeholder="Bottom"
                          className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                        />
                        <Input
                          type="number"
                          value={styles.email.padding.left}
                          onChange={(e) => updatePadding('email', 'left', parseInt(e.target.value) || 0)}
                          placeholder="Left"
                          className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                        />
                      </div>
                    )}
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

                        <div>
                          <Label className="text-xs">Tags</Label>
                          <div className="flex flex-wrap gap-1 mt-1 mb-2">
                            {styles.text[textType].tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                                {tag}
                                <X 
                                  className="w-3 h-3 cursor-pointer" 
                                  onClick={() => removeTag(textType, tag)}
                                />
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-1">
                            <Input
                              placeholder="Add tag..."
                              className="flex-1 h-7 text-xs"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addTag(textType, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input) {
                                  addTag(textType, input.value);
                                  input.value = '';
                                }
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
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

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Padding</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={styles.buttons.default.padding.linked}
                          onCheckedChange={(linked) => updateButtonStyles('padding', { ...styles.buttons.default.padding, linked })}
                        />
                        <span className="text-xs text-gray-500">Linked</span>
                      </div>
                    </div>
                    {styles.buttons.default.padding.linked ? (
                      <Input
                        type="number"
                        value={styles.buttons.default.padding.top}
                        onChange={(e) => updatePadding('buttons', 'all', parseInt(e.target.value) || 0)}
                        className="h-7 text-xs"
                        placeholder="All sides"
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          value={styles.buttons.default.padding.top}
                          onChange={(e) => updatePadding('buttons', 'top', parseInt(e.target.value) || 0)}
                          placeholder="Top"
                          className="h-7 text-xs"
                        />
                        <Input
                          type="number"
                          value={styles.buttons.default.padding.right}
                          onChange={(e) => updatePadding('buttons', 'right', parseInt(e.target.value) || 0)}
                          placeholder="Right"
                          className="h-7 text-xs"
                        />
                        <Input
                          type="number"
                          value={styles.buttons.default.padding.bottom}
                          onChange={(e) => updatePadding('buttons', 'bottom', parseInt(e.target.value) || 0)}
                          placeholder="Bottom"
                          className="h-7 text-xs"
                        />
                        <Input
                          type="number"
                          value={styles.buttons.default.padding.left}
                          onChange={(e) => updatePadding('buttons', 'left', parseInt(e.target.value) || 0)}
                          placeholder="Left"
                          className="h-7 text-xs"
                        />
                      </div>
                    )}
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
                    <div>
                      <Label className="text-xs">Visited Color</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={styles.links.visited}
                          onChange={(e) => updateLinkStyles('visited', e.target.value)}
                          className="w-6 h-7 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          value={styles.links.visited}
                          onChange={(e) => updateLinkStyles('visited', e.target.value)}
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
