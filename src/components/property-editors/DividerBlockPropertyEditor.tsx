
import React from 'react';
import { DividerBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DividerBlockPropertyEditorProps {
  block: DividerBlock;
  onUpdate: (block: DividerBlock) => void;
}

export const DividerBlockPropertyEditor: React.FC<DividerBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const updateContent = (updates: Partial<DividerBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Line Style</Label>
        <Select
          value={block.content.style}
          onValueChange={(value) => updateContent({ style: value as any })}
        >
          <SelectTrigger className="mt-2">
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
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={block.content.color || '#e0e0e0'}
          onChange={(e) => updateContent({ color: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="thickness">Thickness</Label>
        <Input
          id="thickness"
          value={block.content.thickness || '1px'}
          onChange={(e) => updateContent({ thickness: e.target.value })}
          className="mt-2"
          placeholder="1px"
        />
      </div>

      <div>
        <Label htmlFor="width">Width</Label>
        <Input
          id="width"
          value={block.content.width || '100%'}
          onChange={(e) => updateContent({ width: e.target.value })}
          className="mt-2"
          placeholder="100%"
        />
      </div>

      <div>
        <Label>Alignment</Label>
        <Select
          value={block.content.alignment || 'center'}
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
    </div>
  );
};
