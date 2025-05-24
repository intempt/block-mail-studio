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
  Save
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
}

export const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  selectedBlock,
  onBlockUpdate,
  onBlockDelete,
  onBlockDuplicate,
  onBlockSave,
  emailHTML = '',
  templateStyles,
  onTemplateStylesChange
}) => {
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

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
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'button': return <MousePointer className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const renderContentEditor = () => {
    if (!selectedBlock) return null;

    switch (selectedBlock.type) {
      case 'text':
        const textBlock = selectedBlock as TextBlock;
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-style">Text Style</Label>
              <Select 
                value={textBlock.content.textStyle} 
                onValueChange={(value) => handleContentUpdate('textStyle', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                value={textBlock.content.html}
                onChange={(e) => handleContentUpdate('html', e.target.value)}
                placeholder="Enter your text content..."
                className="min-h-24 mt-2"
              />
            </div>
          </div>
        );

      case 'image':
        const imageBlock = selectedBlock as ImageBlock;
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-src">Image URL</Label>
              <Input
                id="image-src"
                value={imageBlock.content.src}
                onChange={(e) => handleContentUpdate('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={imageBlock.content.alt}
                onChange={(e) => handleContentUpdate('alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            <div>
              <Label htmlFor="image-link">Link URL (optional)</Label>
              <Input
                id="image-link"
                value={imageBlock.content.link || ''}
                onChange={(e) => handleContentUpdate('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="image-alignment">Alignment</Label>
              <Select 
                value={imageBlock.content.alignment} 
                onValueChange={(value) => handleContentUpdate('alignment', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="image-dynamic">Dynamic Image</Label>
            </div>
          </div>
        );

      case 'button':
        const buttonBlock = selectedBlock as ButtonBlock;
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={buttonBlock.content.text}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Click Here"
              />
            </div>
            <div>
              <Label htmlFor="button-link">Button Link</Label>
              <Input
                id="button-link"
                value={buttonBlock.content.link}
                onChange={(e) => handleContentUpdate('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="button-style">Button Style</Label>
              <Select 
                value={buttonBlock.content.style} 
                onValueChange={(value) => handleContentUpdate('style', value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="button-size">Button Size</Label>
              <Select 
                value={buttonBlock.content.size} 
                onValueChange={(value) => handleContentUpdate('size', value)}
              >
                <SelectTrigger>
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
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500">
            Content editor for {selectedBlock.type} blocks coming soon
          </div>
        );
    }
  };

  const renderStylingControls = () => {
    if (!selectedBlock) return null;

    const currentStyling = selectedBlock.styling[activeDevice];

    return (
      <div className="space-y-4">
        {/* Device Selector */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeDevice === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDevice('desktop')}
            className="flex-1 h-8"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={activeDevice === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDevice('tablet')}
            className="flex-1 h-8"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={activeDevice === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDevice('mobile')}
            className="flex-1 h-8"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        {/* Background */}
        <div>
          <Label htmlFor="bg-color">Background Color</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={currentStyling.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              value={currentStyling.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Typography</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={currentStyling.textColor || '#333333'}
                  onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={currentStyling.textColor || '#333333'}
                  onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                  className="flex-1 text-xs"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <Input
                value={currentStyling.fontSize || '16px'}
                onChange={(e) => handleStyleUpdate('fontSize', e.target.value)}
                placeholder="16px"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select 
              value={currentStyling.fontFamily || 'Arial, sans-serif'} 
              onValueChange={(value) => handleStyleUpdate('fontFamily', value)}
            >
              <SelectTrigger>
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
            <Label htmlFor="text-align">Text Alignment</Label>
            <Select 
              value={currentStyling.textAlign || 'left'} 
              onValueChange={(value) => handleStyleUpdate('textAlign', value)}
            >
              <SelectTrigger>
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

        {/* Spacing */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Spacing</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="padding">Padding</Label>
              <Input
                value={currentStyling.padding || '16px'}
                onChange={(e) => handleStyleUpdate('padding', e.target.value)}
                placeholder="16px"
              />
            </div>
            <div>
              <Label htmlFor="margin">Margin</Label>
              <Input
                value={currentStyling.margin || '0'}
                onChange={(e) => handleStyleUpdate('margin', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Border & Effects */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Border & Effects</h4>
          <div>
            <Label htmlFor="border-radius">Border Radius</Label>
            <Input
              value={currentStyling.borderRadius || '0'}
              onChange={(e) => handleStyleUpdate('borderRadius', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="border">Border</Label>
            <Input
              value={currentStyling.border || 'none'}
              onChange={(e) => handleStyleUpdate('border', e.target.value)}
              placeholder="1px solid #ccc"
            />
          </div>
          <div>
            <Label htmlFor="box-shadow">Box Shadow</Label>
            <Input
              value={currentStyling.boxShadow || 'none'}
              onChange={(e) => handleStyleUpdate('boxShadow', e.target.value)}
              placeholder="0 2px 4px rgba(0,0,0,0.1)"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderDisplayOptions = () => {
    if (!selectedBlock) return null;

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Device Visibility</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span className="text-sm">Desktop</span>
            </div>
            <Switch
              checked={selectedBlock.displayOptions.showOnDesktop}
              onCheckedChange={(checked) => handleDisplayOptionUpdate('showOnDesktop', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tablet className="w-4 h-4" />
              <span className="text-sm">Tablet</span>
            </div>
            <Switch
              checked={selectedBlock.displayOptions.showOnTablet}
              onCheckedChange={(checked) => handleDisplayOptionUpdate('showOnTablet', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="text-sm">Mobile</span>
            </div>
            <Switch
              checked={selectedBlock.displayOptions.showOnMobile}
              onCheckedChange={(checked) => handleDisplayOptionUpdate('showOnMobile', checked)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewStats = () => {
    const blockCount = (emailHTML.match(/<div[^>]*class[^>]*email-block/g) || []).length;
    const textBlocks = (emailHTML.match(/<div[^>]*>.*?<\/div>/g) || []).filter(block => 
      block.includes('text') || block.includes('<p>') || block.includes('<h')
    ).length;
    const imageBlocks = (emailHTML.match(/<img/g) || []).length;
    const linkBlocks = (emailHTML.match(/<a/g) || []).length;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4" />
          <h4 className="text-sm font-medium">Email Overview</h4>
        </div>
        
        <div className="space-y-2">
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
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Properties
          </h3>
        </div>
        <div className="p-4">
          {renderOverviewStats()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {renderBlockIcon(selectedBlock.type)}
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {selectedBlock.type} Block
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBlockSave?.(selectedBlock, `${selectedBlock.type}-${Date.now()}`)}
              className="h-8 w-8 p-0"
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBlockDuplicate?.(selectedBlock)}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBlockDelete?.(selectedBlock.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mb-2">
          <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
          <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
          <TabsTrigger value="display" className="flex-1">Display</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="content" className="h-full overflow-auto mt-0">
            <div className="p-4">
              {renderContentEditor()}
            </div>
          </TabsContent>

          <TabsContent value="styles" className="h-full overflow-auto mt-0">
            <div className="p-4">
              {renderStylingControls()}
            </div>
          </TabsContent>

          <TabsContent value="display" className="h-full overflow-auto mt-0">
            <div className="p-4">
              {renderDisplayOptions()}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
