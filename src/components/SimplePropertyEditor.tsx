
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

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
