
import React from 'react';
import { TextBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';

interface TextBlockPropertyEditorProps {
  block: TextBlock;
  onUpdate: (block: TextBlock) => void;
}

export const TextBlockPropertyEditor: React.FC<TextBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const updateContent = (updates: Partial<TextBlock['content']>) => {
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
        <Label htmlFor="text-content">Content</Label>
        <Textarea
          id="text-content"
          value={block.content.html.replace(/<[^>]*>/g, '')}
          onChange={(e) => updateContent({ html: `<p>${e.target.value}</p>` })}
          className="mt-2"
          rows={4}
        />
      </div>

      <div>
        <Label>Text Style</Label>
        <Select
          value={block.content.textStyle}
          onValueChange={(value) => updateContent({ textStyle: value as any })}
        >
          <SelectTrigger className="mt-2">
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
        <Label>Text Alignment</Label>
        <div className="flex gap-2 mt-2">
          <Button
            variant={block.styling.desktop.textAlign === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateStyling('desktop', { textAlign: 'left' })}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={block.styling.desktop.textAlign === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateStyling('desktop', { textAlign: 'center' })}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant={block.styling.desktop.textAlign === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateStyling('desktop', { textAlign: 'right' })}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="font-size">Font Size</Label>
          <Input
            id="font-size"
            value={block.styling.desktop.fontSize || '16px'}
            onChange={(e) => updateStyling('desktop', { fontSize: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <Input
            id="text-color"
            type="color"
            value={block.styling.desktop.textColor || '#333333'}
            onChange={(e) => updateStyling('desktop', { textColor: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="padding">Padding</Label>
        <Input
          id="padding"
          value={block.styling.desktop.padding || '16px'}
          onChange={(e) => updateStyling('desktop', { padding: e.target.value })}
          className="mt-2"
          placeholder="e.g., 16px or 16px 24px"
        />
      </div>
    </div>
  );
};
