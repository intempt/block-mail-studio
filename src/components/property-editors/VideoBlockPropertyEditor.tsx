
import React, { useState, useCallback, useEffect } from 'react';
import { VideoBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimpleImageUploader } from '../SimpleImageUploader';
import { Play, AlertTriangle } from 'lucide-react';

interface VideoBlockPropertyEditorProps {
  block: VideoBlock;
  onUpdate: (block: VideoBlock) => void;
}

export const VideoBlockPropertyEditor: React.FC<VideoBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  const updateContent = (updates: Partial<VideoBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const detectPlatform = useCallback((url: string): "youtube" | "vimeo" | "tiktok" | "custom" => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    } else if (url.includes('tiktok.com')) {
      return 'tiktok';
    }
    return 'custom';
  }, []);

  const extractVideoId = useCallback((url: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeMatch ? youtubeMatch[1] : null;
      case 'vimeo':
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        return vimeoMatch ? vimeoMatch[1] : null;
      default:
        return null;
    }
  }, []);

  const generateThumbnail = useCallback(async (url: string, platform: string) => {
    const videoId = extractVideoId(url, platform);
    if (!videoId) return null;

    switch (platform) {
      case 'youtube':
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      case 'vimeo':
        return `https://vumbnail.com/${videoId}.jpg`;
      default:
        return null;
    }
  }, [extractVideoId]);

  useEffect(() => {
    if (block.content.videoUrl) {
      const platform = detectPlatform(block.content.videoUrl);
      setDetectedPlatform(platform);
      
      if (block.content.autoThumbnail && platform !== 'custom') {
        setIsGeneratingThumbnail(true);
        generateThumbnail(block.content.videoUrl, platform).then(thumbnailUrl => {
          if (thumbnailUrl) {
            updateContent({ thumbnail: thumbnailUrl, platform });
          }
          setIsGeneratingThumbnail(false);
        });
      }
    }
  }, [block.content.videoUrl, block.content.autoThumbnail, detectPlatform, generateThumbnail]);

  const handleThumbnailUpload = useCallback((uploadedUrl: string) => {
    updateContent({ thumbnail: uploadedUrl, autoThumbnail: false });
  }, []);

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Videos don't play in most email clients. This will create a clickable thumbnail image that links to your video.
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor="video-url">Video URL</Label>
        <Input
          id="video-url"
          value={block.content.videoUrl}
          onChange={(e) => updateContent({ videoUrl: e.target.value })}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          className="mt-2"
        />
        {detectedPlatform && (
          <p className="text-sm text-green-600 mt-1">
            ✓ Detected: {detectedPlatform} video
          </p>
        )}
      </div>

      <div>
        <Label>Platform</Label>
        <Select
          value={block.content.platform}
          onValueChange={(value: "youtube" | "vimeo" | "tiktok" | "custom") => 
            updateContent({ platform: value })
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="custom">Custom/Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Thumbnail</Label>
        
        <Tabs defaultValue="auto" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="auto">Auto Thumbnail</TabsTrigger>
            <TabsTrigger value="custom">Custom Thumbnail</TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-thumbnail"
                checked={block.content.autoThumbnail}
                onCheckedChange={(checked) => updateContent({ autoThumbnail: checked })}
              />
              <Label htmlFor="auto-thumbnail">Auto-generate thumbnail from video</Label>
            </div>
            
            {isGeneratingThumbnail && (
              <p className="text-sm text-blue-600">Generating thumbnail...</p>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <SimpleImageUploader
                onUploadSuccess={handleThumbnailUpload}
                onUploadError={(error) => console.error('Thumbnail upload error:', error)}
                maxSize={1024 * 1024} // 1MB limit
                accept="image/jpeg,image/png,image/jpg"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {!block.content.autoThumbnail && (
        <div>
          <Label htmlFor="thumbnail-url">Thumbnail URL</Label>
          <Input
            id="thumbnail-url"
            value={block.content.thumbnail}
            onChange={(e) => updateContent({ thumbnail: e.target.value })}
            placeholder="https://example.com/thumbnail.jpg"
            className="mt-2"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="show-play-button"
          checked={block.content.showPlayButton}
          onCheckedChange={(checked) => updateContent({ showPlayButton: checked })}
        />
        <Label htmlFor="show-play-button">Show play button overlay</Label>
      </div>

      {/* Preview */}
      {block.content.thumbnail && !block.content.thumbnail.includes('placeholder') && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <Label className="text-sm font-medium">Email Preview</Label>
          <div className="mt-2 text-center relative inline-block">
            <img
              src={block.content.thumbnail}
              alt="Video thumbnail"
              style={{ maxWidth: '300px', maxHeight: '200px' }}
              className="mx-auto border rounded"
            />
            {block.content.showPlayButton && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Clicking this image will open: {block.content.videoUrl}
          </p>
        </div>
      )}
    </div>
  );
};
