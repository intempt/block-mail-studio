
import React from 'react';
import { SpacerBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface SpacerBlockPropertyEditorProps {
  block: SpacerBlock;
  onUpdate: (block: SpacerBlock) => void;
}

export const SpacerBlockPropertyEditor: React.FC<SpacerBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const updateContent = (updates: Partial<SpacerBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const heightValue = parseInt(block.content.height.replace('px', '')) || 40;
  const mobileHeightValue = parseInt((block.content.mobileHeight || '20px').replace('px', '')) || 20;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="height">Desktop Height: {heightValue}px</Label>
        <Slider
          value={[heightValue]}
          onValueChange={([value]) => updateContent({ height: `${value}px` })}
          max={200}
          min={10}
          step={5}
          className="mt-2"
        />
        <Input
          value={block.content.height}
          onChange={(e) => updateContent({ height: e.target.value })}
          className="mt-2"
          placeholder="40px"
        />
      </div>

      <div>
        <Label htmlFor="mobile-height">Mobile Height: {mobileHeightValue}px</Label>
        <Slider
          value={[mobileHeightValue]}
          onValueChange={([value]) => updateContent({ mobileHeight: `${value}px` })}
          max={100}
          min={5}
          step={5}
          className="mt-2"
        />
        <Input
          value={block.content.mobileHeight || '20px'}
          onChange={(e) => updateContent({ mobileHeight: e.target.value })}
          className="mt-2"
          placeholder="20px"
        />
      </div>
    </div>
  );
};
