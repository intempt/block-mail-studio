import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Settings,
  Palette, 
  Eye, 
  Smartphone,
  Monitor,
  Tablet,
  Type,
  Image as ImageIcon,
  MousePointer,
  Layers,
  BarChart3,
  Trash2,
  Copy,
  Star,
  Save,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { EmailBlock, TextBlock, ImageBlock, ButtonBlock } from '@/types/emailBlocks';

interface EnhancedPropertiesPanelProps {
  selectedBlock?: EmailBlock;
  onBlockUpdate?: (block: EmailBlock) => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockDuplicate?: (block: EmailBlock) => void;
  onBlockSave?: (block: EmailBlock, name: string) => void;
  emailHTML?: string;
  templateStyles?: any;
  onTemplateStylesChange?: (styles: any) => void;
  compactMode?: boolean;
}

export const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  selectedBlock,
  onBlockUpdate,
  onBlockDelete,
  onBlockDuplicate,
  onBlockSave,
  emailHTML = '',
  templateStyles,
  onTemplateStylesChange,
  compactMode = false
}) => {
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  
  const [sectionsExpanded, setSectionsExpanded] = useState({
    typography: !compactMode,
    spacing: !compactMode,
    border: false,
    background: !compactMode,
    visibility: false
  });

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleStyleUpdate = (property: string, value: any) => {
    if (!selectedBlock || !onBlockUpdate) return;
    
    const updatedBlock = {
      ...selectedBlock,
      styling: {
        ...selectedBlock.styling,
        [activeDevice]: {
          ...selectedBlock.styling[activeDevice],
          [property]: value
        }
      }
    } as EmailBlock;
    onBlockUpdate(updatedBlock);
  };

  const handleContentUpdate = (property: string, value: any) => {
    if (!selectedBlock || !onBlockUpdate) return;
    
    const updatedBlock = {
      ...selectedBlock,
      content: {
        ...selectedBlock.content,
        [property]: value
      }
    } as EmailBlock;
    onBlockUpdate(updatedBlock);
  };

  const handleDisplayOptionUpdate = (property: string, value: any) => {
    if (!selectedBlock || !onBlockUpdate) return;
    
    const updatedBlock = {
      ...selectedBlock,
      displayOptions: {
        ...selectedBlock.displayOptions,
        [property]: value
      }
    } as EmailBlock;
    onBlockUpdate(updatedBlock);
  };

  const renderBlockIcon = (type: string) => {
    const iconSize = compactMode ? 'w-3 h-3' : 'w-4 h-4';
    switch (type) {
      case 'text': return <Type className={iconSize} />;
      case 'image': return <ImageIcon className={iconSize} />;
      case 'button': return <MousePointer className={iconSize} />;
      default: return <Layers className={iconSize} />;
    }
  };

  const renderContentEditor = () => {
    if (!selectedBlock) return null;

    const spacing = compactMode ? 'space-y-2' : 'space-y-4';
    const inputHeight = compactMode ? 'h-7' : 'h-8';
    const textareaHeight = compactMode ? 'min-h-16' : 'min-h-24';

    switch (selectedBlock.type) {
      case 'text':
        const textBlock = selectedBlock as TextBlock;
        return (
          <div className={spacing}>
            <div>
              <Label htmlFor="text-style" className={compactMode ? 'text-xs' : 'text-sm'}>Text Style</Label>
              <Select 
                value={textBlock.content.textStyle} 
                onValueChange={(value) => handleContentUpdate('textStyle', value)}
              >
                <SelectTrigger className={inputHeight}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal Text</SelectItem>
                  <SelectItem value="heading1">Heading 1</SelectItem>
                  <SelectItem value="heading2">Heading 2</SelectItem>
                  <SelectItem value="heading3">Heading 3</SelectItem>
                  <SelectItem value="heading4">Heading 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="text-content" className={compactMode ? 'text-xs' : 'text-sm'}>Content</Label>
              <Textarea
                id="text-content"
                value={textBlock.content.html}
                onChange={(e) => handleContentUpdate('html', e.target.value)}
                placeholder="Enter your text content..."
                className={`${textareaHeight} mt-1 ${compactMode ? 'text-xs' : 'text-sm'}`}
              />
            </div>
          </div>
        );

      case 'image':
        const imageBlock = selectedBlock as ImageBlock;
        return (
          <div className={spacing}>
            <div>
              <Label htmlFor="image-src" className={compactMode ? 'text-xs' : 'text-sm'}>Image URL</Label>
              <Input
                id="image-src"
                value={imageBlock.content.src}
                onChange={(e) => handleContentUpdate('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
              />
            </div>
            <div>
              <Label htmlFor="image-alt" className={compactMode ? 'text-xs' : 'text-sm'}>Alt Text</Label>
              <Input
                id="image-alt"
                value={imageBlock.content.alt}
                onChange={(e) => handleContentUpdate('alt', e.target.value)}
                placeholder="Describe the image"
                className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
              />
            </div>
            <div>
              <Label htmlFor="image-link" className={compactMode ? 'text-xs' : 'text-sm'}>Link URL (optional)</Label>
              <Input
                id="image-link"
                value={imageBlock.content.link || ''}
                onChange={(e) => handleContentUpdate('link', e.target.value)}
                placeholder="https://example.com"
                className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
              />
            </div>
            <div>
              <Label htmlFor="image-alignment" className={compactMode ? 'text-xs' : 'text-sm'}>Alignment</Label>
              <Select 
                value={imageBlock.content.alignment} 
                onValueChange={(value) => handleContentUpdate('alignment', value)}
              >
                <SelectTrigger className={inputHeight}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="image-dynamic"
                checked={imageBlock.content.isDynamic}
                onCheckedChange={(checked) => handleContentUpdate('isDynamic', checked)}
              />
              <Label htmlFor="image-dynamic" className={compactMode ? 'text-xs' : 'text-sm'}>Dynamic Image</Label>
            </div>
          </div>
        );

      case 'button':
        const buttonBlock = selectedBlock as ButtonBlock;
        return (
          <div className={spacing}>
            <div>
              <Label htmlFor="button-text" className={compactMode ? 'text-xs' : 'text-sm'}>Button Text</Label>
              <Input
                id="button-text"
                value={buttonBlock.content.text}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Click Here"
                className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
              />
            </div>
            <div>
              <Label htmlFor="button-link" className={compactMode ? 'text-xs' : 'text-sm'}>Button Link</Label>
              <Input
                id="button-link"
                value={buttonBlock.content.link}
                onChange={(e) => handleContentUpdate('link', e.target.value)}
                placeholder="https://example.com"
                className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="button-style" className={compactMode ? 'text-xs' : 'text-sm'}>Style</Label>
                <Select 
                  value={buttonBlock.content.style} 
                  onValueChange={(value) => handleContentUpdate('style', value)}
                >
                  <SelectTrigger className={inputHeight}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="text">Text Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="button-size" className={compactMode ? 'text-xs' : 'text-sm'}>Size</Label>
                <Select 
                  value={buttonBlock.content.size} 
                  onValueChange={(value) => handleContentUpdate('size', value)}
                >
                  <SelectTrigger className={inputHeight}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500">
            <p className={compactMode ? 'text-xs' : 'text-sm'}>
              Content editor for {selectedBlock.type} blocks coming soon
            </p>
          </div>
        );
    }
  };

  const renderStylingControls = () => {
    if (!selectedBlock) return null;

    const currentStyling = selectedBlock.styling[activeDevice];
    const spacing = compactMode ? 'space-y-2' : 'space-y-4';
    const sectionSpacing = compactMode ? 'space-y-2' : 'space-y-3';
    const inputHeight = compactMode ? 'h-7' : 'h-8';

    return (
      <div className={spacing}>
        {/* Device Selector */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeDevice === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDevice('desktop')}
            className={`flex-1 ${compactMode ? 'h-6' : 'h-8'}`}
          >
            <Monitor className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
          </Button>
          <Button
            variant={activeDevice === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDevice('tablet')}
            className={`flex-1 ${compactMode ? 'h-6' : 'h-8'}`}
          >
            <Tablet className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
          </Button>
          <Button
            variant={activeDevice === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDevice('mobile')}
            className={`flex-1 ${compactMode ? 'h-6' : 'h-8'}`}
          >
            <Smartphone className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
          </Button>
        </div>

        {/* Background Section */}
        <Collapsible 
          open={sectionsExpanded.background} 
          onOpenChange={() => toggleSection('background')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                <Palette className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                Background
              </h4>
              {sectionsExpanded.background ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div>
              <Label htmlFor="bg-color" className={compactMode ? 'text-xs' : 'text-sm'}>Background Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={currentStyling.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                  className={`${compactMode ? 'w-8 h-7' : 'w-10 h-8'} border border-gray-300 rounded cursor-pointer`}
                />
                <Input
                  value={currentStyling.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                  className={`flex-1 ${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Typography Section */}
        <Collapsible 
          open={sectionsExpanded.typography} 
          onOpenChange={() => toggleSection('typography')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                <Type className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                Typography
              </h4>
              {sectionsExpanded.typography ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className={sectionSpacing}>
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                <div>
                  <Label htmlFor="text-color" className={compactMode ? 'text-xs' : 'text-sm'}>Text Color</Label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="color"
                      value={currentStyling.textColor || '#333333'}
                      onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                      className={`${compactMode ? 'w-6 h-7' : 'w-8 h-8'} border border-gray-300 rounded cursor-pointer`}
                    />
                    <Input
                      value={currentStyling.textColor || '#333333'}
                      onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                      className={`flex-1 ${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="font-size" className={compactMode ? 'text-xs' : 'text-sm'}>Font Size</Label>
                  <Input
                    value={currentStyling.fontSize || '16px'}
                    onChange={(e) => handleStyleUpdate('fontSize', e.target.value)}
                    placeholder="16px"
                    className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="font-family" className={compactMode ? 'text-xs' : 'text-sm'}>Font Family</Label>
                <Select 
                  value={currentStyling.fontFamily || 'Arial, sans-serif'} 
                  onValueChange={(value) => handleStyleUpdate('fontFamily', value)}
                >
                  <SelectTrigger className={inputHeight}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                    <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="text-align" className={compactMode ? 'text-xs' : 'text-sm'}>Text Alignment</Label>
                <Select 
                  value={currentStyling.textAlign || 'left'} 
                  onValueChange={(value) => handleStyleUpdate('textAlign', value)}
                >
                  <SelectTrigger className={inputHeight}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Spacing Section */}
        <Collapsible 
          open={sectionsExpanded.spacing} 
          onOpenChange={() => toggleSection('spacing')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                <Layers className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                Spacing
              </h4>
              {sectionsExpanded.spacing ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <div>
                <Label htmlFor="padding" className={compactMode ? 'text-xs' : 'text-sm'}>Padding</Label>
                <Input
                  value={currentStyling.padding || '16px'}
                  onChange={(e) => handleStyleUpdate('padding', e.target.value)}
                  placeholder="16px"
                  className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                />
              </div>
              <div>
                <Label htmlFor="margin" className={compactMode ? 'text-xs' : 'text-sm'}>Margin</Label>
                <Input
                  value={currentStyling.margin || '0'}
                  onChange={(e) => handleStyleUpdate('margin', e.target.value)}
                  placeholder="0"
                  className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Border & Effects Section */}
        <Collapsible 
          open={sectionsExpanded.border} 
          onOpenChange={() => toggleSection('border')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
                <Settings className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                Border & Effects
              </h4>
              {sectionsExpanded.border ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className={sectionSpacing}>
              <div>
                <Label htmlFor="border-radius" className={compactMode ? 'text-xs' : 'text-sm'}>Border Radius</Label>
                <Input
                  value={currentStyling.borderRadius || '0'}
                  onChange={(e) => handleStyleUpdate('borderRadius', e.target.value)}
                  placeholder="0"
                  className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                />
              </div>
              <div>
                <Label htmlFor="border" className={compactMode ? 'text-xs' : 'text-sm'}>Border</Label>
                <Input
                  value={currentStyling.border || 'none'}
                  onChange={(e) => handleStyleUpdate('border', e.target.value)}
                  placeholder="1px solid #ccc"
                  className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                />
              </div>
              <div>
                <Label htmlFor="box-shadow" className={compactMode ? 'text-xs' : 'text-sm'}>Box Shadow</Label>
                <Input
                  value={currentStyling.boxShadow || 'none'}
                  onChange={(e) => handleStyleUpdate('boxShadow', e.target.value)}
                  placeholder="0 2px 4px rgba(0,0,0,0.1)"
                  className={`${inputHeight} ${compactMode ? 'text-xs' : 'text-sm'}`}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderDisplayOptions = () => {
    if (!selectedBlock) return null;

    const spacing = compactMode ? 'space-y-2' : 'space-y-4';
    const sectionSpacing = compactMode ? 'space-y-2' : 'space-y-3';

    return (
      <Collapsible 
        open={sectionsExpanded.visibility} 
        onOpenChange={() => toggleSection('visibility')}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
              <Eye className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
              Device Visibility
            </h4>
            {sectionsExpanded.visibility ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className={sectionSpacing}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                <span className={compactMode ? 'text-xs' : 'text-sm'}>Desktop</span>
              </div>
              <Switch
                checked={selectedBlock.displayOptions.showOnDesktop}
                onCheckedChange={(checked) => handleDisplayOptionUpdate('showOnDesktop', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                <span className={compactMode ? 'text-xs' : 'text-sm'}>Tablet</span>
              </div>
              <Switch
                checked={selectedBlock.displayOptions.showOnTablet}
                onCheckedChange={(checked) => handleDisplayOptionUpdate('showOnTablet', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
                <span className={compactMode ? 'text-xs' : 'text-sm'}>Mobile</span>
              </div>
              <Switch
                checked={selectedBlock.displayOptions.showOnMobile}
                onCheckedChange={(checked) => handleDisplayOptionUpdate('showOnMobile', checked)}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderOverviewStats = () => {
    const safeEmailHTML = emailHTML || '';
    const blockCount = (safeEmailHTML.match(/<div[^>]*class[^>]*email-block/g) || []).length;
    const textBlocks = (safeEmailHTML.match(/<div[^>]*>.*?<\/div>/g) || []).filter(block => 
      block.includes('text') || block.includes('<p>') || block.includes('<h')
    ).length;
    const imageBlocks = (safeEmailHTML.match(/<img/g) || []).length;
    const linkBlocks = (safeEmailHTML.match(/<a/g) || []).length;

    const spacing = compactMode ? 'space-y-2' : 'space-y-4';

    return (
      <div className={spacing}>
        <div className="flex items-center gap-2 mb-2 lg:mb-3">
          <BarChart3 className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
          <h4 className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium`}>Email Overview</h4>
        </div>
        
        <div className={compactMode ? 'space-y-1' : 'space-y-2'}>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Blocks</span>
            <Badge variant="secondary">{blockCount}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Text Blocks</span>
            <Badge variant="outline">{textBlocks}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Images</span>
            <Badge variant="outline">{imageBlocks}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Links</span>
            <Badge variant="outline">{linkBlocks}</Badge>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedBlock) {
    return (
      <div className="h-full">
        <div className={`${compactMode ? 'p-2' : 'p-4'} border-b border-gray-200`}>
          <h3 className={`${compactMode ? 'text-sm' : 'text-lg'} font-semibold text-gray-900 flex items-center gap-2`}>
            <Settings className={compactMode ? 'w-4 h-4' : 'w-5 h-5'} />
            Properties
          </h3>
        </div>
        <div className={compactMode ? 'p-2' : 'p-4'}>
          {renderOverviewStats()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`${compactMode ? 'p-2' : 'p-4'} border-b border-gray-200`}>
        <div className="flex items-center justify-between mb-2 lg:mb-3">
          <div className="flex items-center gap-2">
            {renderBlockIcon(selectedBlock.type)}
            <h3 className={`${compactMode ? 'text-sm' : 'text-lg'} font-semibold text-gray-900 capitalize`}>
              {selectedBlock.type} Block
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBlockSave?.(selectedBlock, `${selectedBlock.type}-${Date.now()}`)}
              className={`${compactMode ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'}`}
            >
              <Star className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBlockDuplicate?.(selectedBlock)}
              className={`${compactMode ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'}`}
            >
              <Copy className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBlockDelete?.(selectedBlock.id)}
              className={`${compactMode ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'} text-red-600 hover:text-red-700`}
            >
              <Trash2 className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className={`mx-2 lg:mx-4 ${compactMode ? 'mb-1' : 'mb-2'}`}>
          <TabsTrigger value="content" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>Content</TabsTrigger>
          <TabsTrigger value="styles" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>Styles</TabsTrigger>
          <TabsTrigger value="display" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>Display</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="content" className="h-full overflow-auto mt-0">
            <div className={compactMode ? 'p-2' : 'p-4'}>
              {renderContentEditor()}
            </div>
          </TabsContent>

          <TabsContent value="styles" className="h-full overflow-auto mt-0">
            <div className={compactMode ? 'p-2' : 'p-4'}>
              {renderStylingControls()}
            </div>
          </TabsContent>

          <TabsContent value="display" className="h-full overflow-auto mt-0">
            <div className={compactMode ? 'p-2' : 'p-4'}>
              {renderDisplayOptions()}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
