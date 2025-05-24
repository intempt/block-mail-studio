
import React from 'react';
import { SocialBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface SocialBlockPropertyEditorProps {
  block: SocialBlock;
  onUpdate: (block: SocialBlock) => void;
}

export const SocialBlockPropertyEditor: React.FC<SocialBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const updateContent = (updates: Partial<SocialBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const updatePlatform = (index: number, updates: any) => {
    const newPlatforms = [...block.content.platforms];
    newPlatforms[index] = { ...newPlatforms[index], ...updates };
    updateContent({ platforms: newPlatforms });
  };

  const addPlatform = () => {
    const newPlatform = {
      name: 'New Platform',
      url: '#',
      icon: 'link',
      iconStyle: 'color' as const,
      showLabel: false
    };
    updateContent({ platforms: [...block.content.platforms, newPlatform] });
  };

  const removePlatform = (index: number) => {
    const newPlatforms = block.content.platforms.filter((_, i) => i !== index);
    updateContent({ platforms: newPlatforms });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Layout</Label>
        <Select
          value={block.content.layout}
          onValueChange={(value) => updateContent({ layout: value as any })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icon-size">Icon Size</Label>
          <Input
            id="icon-size"
            value={block.content.iconSize}
            onChange={(e) => updateContent({ iconSize: e.target.value })}
            className="mt-2"
            placeholder="32px"
          />
        </div>
        <div>
          <Label htmlFor="spacing">Spacing</Label>
          <Input
            id="spacing"
            value={block.content.spacing}
            onChange={(e) => updateContent({ spacing: e.target.value })}
            className="mt-2"
            placeholder="16px"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Social Platforms</Label>
          <Button size="sm" onClick={addPlatform}>
            <Plus className="w-4 h-4 mr-1" />
            Add Platform
          </Button>
        </div>
        
        <div className="space-y-3">
          {block.content.platforms.map((platform, index) => (
            <Card key={index} className="p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={platform.name}
                    onChange={(e) => updatePlatform(index, { name: e.target.value })}
                    placeholder="Platform name"
                    className="flex-1 mr-2"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removePlatform(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <Input
                  value={platform.url}
                  onChange={(e) => updatePlatform(index, { url: e.target.value })}
                  placeholder="https://..."
                />
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={platform.showLabel}
                    onCheckedChange={(checked) => updatePlatform(index, { showLabel: checked })}
                  />
                  <Label>Show Label</Label>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
