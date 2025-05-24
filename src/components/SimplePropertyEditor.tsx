
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface SimpleBlock {
  id: string;
  type: string;
  content: any;
  styles?: Record<string, string>;
}

interface SimplePropertyEditorProps {
  block: SimpleBlock | null;
  onUpdate: (block: SimpleBlock) => void;
}

export const SimplePropertyEditor: React.FC<SimplePropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  if (!block) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Select a block to edit its properties</p>
      </div>
    );
  }

  const updateContent = (updates: any) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const updateStyles = (updates: Record<string, string>) => {
    onUpdate({
      ...block,
      styles: { ...block.styles, ...updates }
    });
  };

  const renderTextProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Font Size</Label>
        <Input
          value={block.styles?.fontSize || '16px'}
          onChange={(e) => updateStyles({ fontSize: e.target.value })}
          className="mt-1"
          placeholder="16px"
        />
      </div>
      <div>
        <Label>Text Color</Label>
        <Input
          type="color"
          value={block.styles?.color || '#000000'}
          onChange={(e) => updateStyles({ color: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Text Align</Label>
        <Select
          value={block.styles?.textAlign || 'left'}
          onValueChange={(value) => updateStyles({ textAlign: value })}
        >
          <SelectTrigger className="mt-1">
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
  );

  const renderButtonProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Button Text</Label>
        <Input
          value={block.content.text || ''}
          onChange={(e) => updateContent({ text: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Link URL</Label>
        <Input
          value={block.content.link || ''}
          onChange={(e) => updateContent({ link: e.target.value })}
          className="mt-1"
          placeholder="https://..."
        />
      </div>
      <div>
        <Label>Background Color</Label>
        <Input
          type="color"
          value={block.styles?.backgroundColor || '#3B82F6'}
          onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Text Color</Label>
        <Input
          type="color"
          value={block.styles?.color || '#ffffff'}
          onChange={(e) => updateStyles({ color: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderImageProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Image URL</Label>
        <Input
          value={block.content.src || ''}
          onChange={(e) => updateContent({ src: e.target.value })}
          className="mt-1"
          placeholder="https://..."
        />
      </div>
      <div>
        <Label>Alt Text</Label>
        <Input
          value={block.content.alt || ''}
          onChange={(e) => updateContent({ alt: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Width</Label>
        <Input
          value={block.styles?.maxWidth || '100%'}
          onChange={(e) => updateStyles({ maxWidth: e.target.value })}
          className="mt-1"
          placeholder="100%"
        />
      </div>
    </div>
  );

  const renderSpacerProperties = () => {
    const heightValue = parseInt(block.content.height?.replace('px', '')) || 40;
    return (
      <div className="space-y-4">
        <div>
          <Label>Height: {heightValue}px</Label>
          <Slider
            value={[heightValue]}
            onValueChange={([value]) => updateContent({ height: `${value}px` })}
            max={200}
            min={10}
            step={5}
            className="mt-2"
          />
        </div>
      </div>
    );
  };

  const renderDividerProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Style</Label>
        <Select
          value={block.content.style || 'solid'}
          onValueChange={(value) => updateContent({ style: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Thickness</Label>
        <Input
          value={block.content.thickness || '1px'}
          onChange={(e) => updateContent({ thickness: e.target.value })}
          className="mt-1"
          placeholder="1px"
        />
      </div>
      <div>
        <Label>Color</Label>
        <Input
          type="color"
          value={block.content.color || '#dddddd'}
          onChange={(e) => updateContent({ color: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderVideoProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Video URL</Label>
        <Input
          value={block.content.videoUrl || ''}
          onChange={(e) => updateContent({ videoUrl: e.target.value })}
          className="mt-1"
          placeholder="https://..."
        />
      </div>
      <div>
        <Label>Thumbnail URL</Label>
        <Input
          value={block.content.thumbnail || ''}
          onChange={(e) => updateContent({ thumbnail: e.target.value })}
          className="mt-1"
          placeholder="https://..."
        />
      </div>
    </div>
  );

  const renderSocialProperties = () => {
    const platforms = block.content.platforms || [];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Social Platforms</Label>
          <Button
            size="sm"
            onClick={() => {
              const newPlatforms = [...platforms, { name: 'Platform', url: '#', icon: 'link' }];
              updateContent({ platforms: newPlatforms });
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {platforms.map((platform: any, index: number) => (
          <div key={index} className="space-y-2 p-3 border rounded">
            <div className="flex items-center justify-between">
              <Label>Platform {index + 1}</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newPlatforms = platforms.filter((_: any, i: number) => i !== index);
                  updateContent({ platforms: newPlatforms });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Input
              value={platform.name}
              onChange={(e) => {
                const newPlatforms = [...platforms];
                newPlatforms[index] = { ...platform, name: e.target.value };
                updateContent({ platforms: newPlatforms });
              }}
              placeholder="Platform name"
            />
            <Input
              value={platform.url}
              onChange={(e) => {
                const newPlatforms = [...platforms];
                newPlatforms[index] = { ...platform, url: e.target.value };
                updateContent({ platforms: newPlatforms });
              }}
              placeholder="https://..."
            />
          </div>
        ))}
      </div>
    );
  };

  const renderHtmlProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>HTML Content</Label>
        <Textarea
          value={block.content.html || ''}
          onChange={(e) => updateContent({ html: e.target.value })}
          className="mt-1 font-mono text-sm"
          rows={6}
          placeholder="<div>Your HTML content here...</div>"
        />
      </div>
    </div>
  );

  const renderTableProperties = () => {
    const rows = block.content.rows || 2;
    const columns = block.content.columns || 2;
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Rows: {rows}</Label>
          <Slider
            value={[rows]}
            onValueChange={([value]) => updateContent({ rows: value })}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Columns: {columns}</Label>
          <Slider
            value={[columns]}
            onValueChange={([value]) => updateContent({ columns: value })}
            max={6}
            min={1}
            step={1}
            className="mt-2"
          />
        </div>
      </div>
    );
  };

  const renderProperties = () => {
    switch (block.type) {
      case 'text':
        return renderTextProperties();
      case 'button':
        return renderButtonProperties();
      case 'image':
        return renderImageProperties();
      case 'spacer':
        return renderSpacerProperties();
      case 'divider':
        return renderDividerProperties();
      case 'video':
        return renderVideoProperties();
      case 'social':
        return renderSocialProperties();
      case 'html':
        return renderHtmlProperties();
      case 'table':
        return renderTableProperties();
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            <p>No properties available for this block type</p>
          </div>
        );
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg capitalize">{block.type} Block</h3>
        <p className="text-sm text-gray-500">ID: {block.id}</p>
      </div>
      {renderProperties()}
    </Card>
  );
};
