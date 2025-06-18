
import React from 'react';
import { ImageBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ImageBlockPropertyEditorProps {
  block: ImageBlock;
  onUpdate: (block: ImageBlock) => void;
}

export const ImageBlockPropertyEditor: React.FC<ImageBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const updateContent = (updates: Partial<ImageBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="image-src">Image URL</Label>
        <Input
          id="image-src"
          value={block.content.src}
          onChange={(e) => updateContent({ src: e.target.value })}
          className="mt-2"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="alt-text">Alt Text</Label>
        <Input
          id="alt-text"
          value={block.content.alt}
          onChange={(e) => updateContent({ alt: e.target.value })}
          className="mt-2"
          placeholder="Describe the image"
        />
      </div>

      <div>
        <Label htmlFor="image-link">Link URL (optional)</Label>
        <Input
          id="image-link"
          value={block.content.link || ''}
          onChange={(e) => updateContent({ link: e.target.value })}
          className="mt-2"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <Label>Alignment</Label>
        <Select
          value={block.content.alignment}
          onValueChange={(value) => updateContent({ alignment: value as any })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="image-width">Width</Label>
        <Input
          id="image-width"
          value={block.content.width}
          onChange={(e) => updateContent({ width: e.target.value })}
          className="mt-2"
          placeholder="100% or 400px"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="dynamic-content"
          checked={block.content.isDynamic}
          onCheckedChange={(checked) => updateContent({ isDynamic: checked })}
        />
        <Label htmlFor="dynamic-content">Use dynamic content</Label>
      </div>

      {block.content.isDynamic && (
        <div>
          <Label htmlFor="dynamic-variable">Dynamic Variable</Label>
          <Input
            id="dynamic-variable"
            value={block.content.dynamicVariable || ''}
            onChange={(e) => updateContent({ dynamicVariable: e.target.value })}
            className="mt-2"
            placeholder="{{product.image}}"
          />
        </div>
      )}
    </div>
  );
};
