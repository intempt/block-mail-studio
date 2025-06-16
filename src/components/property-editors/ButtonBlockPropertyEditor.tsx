
import React from 'react';
import { ButtonBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ButtonBlockPropertyEditorProps {
  block: ButtonBlock;
  onUpdate: (block: ButtonBlock) => void;
}

export const ButtonBlockPropertyEditor: React.FC<ButtonBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const updateContent = (updates: Partial<ButtonBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const updateStyling = (device: 'desktop' | 'tablet' | 'mobile', updates: any) => {
    onUpdate({
      ...block,
      styling: {
        ...block.styling,
        [device]: { ...block.styling[device], ...updates }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="button-text">Call-to-action Text</Label>
        <Input
          id="button-text"
          value={block.content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          className="mt-2"
          placeholder='<a href="#" style="color: inherit;">Click Here</a>'
        />
        <p className="text-xs text-gray-500 mt-1">You can use HTML tags like &lt;a&gt; for links</p>
      </div>

      <div>
        <Label htmlFor="button-link">Default Link URL</Label>
        <Input
          id="button-link"
          value={block.content.link}
          onChange={(e) => updateContent({ link: e.target.value })}
          className="mt-2"
          placeholder="https://example.com"
        />
        <p className="text-xs text-gray-500 mt-1">This will be used if no link is specified in the text</p>
      </div>

      <div>
        <Label>Button Style</Label>
        <Select
          value={block.content.style}
          onValueChange={(value) => updateContent({ style: value as any })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Button Size</Label>
        <Select
          value={block.content.size}
          onValueChange={(value) => updateContent({ size: value as any })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bg-color">Background Color</Label>
          <Input
            id="bg-color"
            type="color"
            value={block.styling.desktop.backgroundColor || '#3B82F6'}
            onChange={(e) => updateStyling('desktop', { backgroundColor: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <Input
            id="text-color"
            type="color"
            value={block.styling.desktop.textColor || '#ffffff'}
            onChange={(e) => updateStyling('desktop', { textColor: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="border-radius">Border Radius</Label>
        <Input
          id="border-radius"
          value={block.styling.desktop.borderRadius || '6px'}
          onChange={(e) => updateStyling('desktop', { borderRadius: e.target.value })}
          className="mt-2"
          placeholder="6px"
        />
      </div>

      <div>
        <Label htmlFor="padding">Padding</Label>
        <Input
          id="padding"
          value={block.styling.desktop.padding || '12px 24px'}
          onChange={(e) => updateStyling('desktop', { padding: e.target.value })}
          className="mt-2"
          placeholder="12px 24px"
        />
      </div>
    </div>
  );
};
