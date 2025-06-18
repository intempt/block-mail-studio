
import React from 'react';
import { VideoBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface VideoBlockPropertyEditorProps {
  block: VideoBlock;
  onUpdate: (block: VideoBlock) => void;
}

export const VideoBlockPropertyEditor: React.FC<VideoBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const updateContent = (updates: Partial<VideoBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="video-url">Video URL</Label>
        <Input
          id="video-url"
          value={block.content.videoUrl}
          onChange={(e) => updateContent({ videoUrl: e.target.value })}
          className="mt-2"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div>
        <Label>Platform</Label>
        <Select
          value={block.content.platform}
          onValueChange={(value) => updateContent({ platform: value as any })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input
          id="thumbnail"
          value={block.content.thumbnail}
          onChange={(e) => updateContent({ thumbnail: e.target.value })}
          className="mt-2"
          placeholder="https://example.com/thumbnail.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="show-play-button"
          checked={block.content.showPlayButton}
          onCheckedChange={(checked) => updateContent({ showPlayButton: checked })}
        />
        <Label htmlFor="show-play-button">Show Play Button</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-thumbnail"
          checked={block.content.autoThumbnail}
          onCheckedChange={(checked) => updateContent({ autoThumbnail: checked })}
        />
        <Label htmlFor="auto-thumbnail">Auto-generate Thumbnail</Label>
      </div>
    </div>
  );
};
