
import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimpleImageUploader } from '../SimpleImageUploader';
import { Play, AlertTriangle } from 'lucide-react';

interface VideoSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect: (videoData: {
    videoUrl: string;
    thumbnail: string;
    platform: "youtube" | "vimeo" | "tiktok" | "custom";
    showPlayButton: boolean;
    autoThumbnail: boolean;
  }) => void;
  currentVideo?: {
    videoUrl: string;
    thumbnail: string;
    platform: "youtube" | "vimeo" | "tiktok" | "custom";
    showPlayButton: boolean;
    autoThumbnail: boolean;
  };
}

export const VideoSelectionDialog: React.FC<VideoSelectionDialogProps> = ({
  isOpen,
  onClose,
  onVideoSelect,
  currentVideo
}) => {
  const [videoData, setVideoData] = useState({
    videoUrl: currentVideo?.videoUrl || '',
    thumbnail: currentVideo?.thumbnail || '',
    platform: currentVideo?.platform || 'youtube' as const,
    showPlayButton: currentVideo?.showPlayButton ?? true,
    autoThumbnail: currentVideo?.autoThumbnail ?? true
  });

  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

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
    if (videoData.videoUrl) {
      const platform = detectPlatform(videoData.videoUrl);
      setDetectedPlatform(platform);
      
      if (videoData.autoThumbnail && platform !== 'custom') {
        setIsGeneratingThumbnail(true);
        generateThumbnail(videoData.videoUrl, platform).then(thumbnailUrl => {
          if (thumbnailUrl) {
            setVideoData(prev => ({ ...prev, thumbnail: thumbnailUrl, platform }));
          }
          setIsGeneratingThumbnail(false);
        });
      }
    }
  }, [videoData.videoUrl, videoData.autoThumbnail, detectPlatform, generateThumbnail]);

  const handleThumbnailUpload = useCallback((uploadedUrl: string) => {
    setVideoData(prev => ({ ...prev, thumbnail: uploadedUrl, autoThumbnail: false }));
  }, []);

  const handleSave = () => {
    if (!videoData.videoUrl) {
      alert('Please provide a video URL');
      return;
    }

    if (!videoData.thumbnail) {
      alert('Please provide a thumbnail image');
      return;
    }

    onVideoSelect(videoData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Video - Email Safe (MJML)</DialogTitle>
        </DialogHeader>

        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Videos don't play in most email clients. This will create a clickable thumbnail image that links to your video.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              value={videoData.videoUrl}
              onChange={(e) => setVideoData(prev => ({ ...prev, videoUrl: e.target.value }))}
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
              value={videoData.platform}
              onValueChange={(value: "youtube" | "vimeo" | "tiktok" | "custom") => 
                setVideoData(prev => ({ ...prev, platform: value }))
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

          <Tabs defaultValue="auto" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="auto">Auto Thumbnail</TabsTrigger>
              <TabsTrigger value="custom">Custom Thumbnail</TabsTrigger>
            </TabsList>

            <TabsContent value="auto" className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-thumbnail"
                  checked={videoData.autoThumbnail}
                  onChange={(e) => setVideoData(prev => ({ ...prev, autoThumbnail: e.target.checked }))}
                />
                <Label htmlFor="auto-thumbnail">Auto-generate thumbnail from video</Label>
              </div>
              
              {isGeneratingThumbnail && (
                <p className="text-sm text-blue-600">Generating thumbnail...</p>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <SimpleImageUploader
                onUploadSuccess={handleThumbnailUpload}
                onUploadError={(error) => console.error('Thumbnail upload error:', error)}
                maxSize={1024 * 1024} // 1MB limit
                accept="image/jpeg,image/png,image/jpg"
              />
            </TabsContent>
          </Tabs>

          {!videoData.autoThumbnail && (
            <div>
              <Label htmlFor="thumbnail-url">Thumbnail URL</Label>
              <Input
                id="thumbnail-url"
                value={videoData.thumbnail}
                onChange={(e) => setVideoData(prev => ({ ...prev, thumbnail: e.target.value }))}
                placeholder="https://example.com/thumbnail.jpg"
                className="mt-2"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-play-button"
              checked={videoData.showPlayButton}
              onChange={(e) => setVideoData(prev => ({ ...prev, showPlayButton: e.target.checked }))}
            />
            <Label htmlFor="show-play-button">Show play button overlay</Label>
          </div>

          {/* Preview */}
          {videoData.thumbnail && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium">Email Preview</Label>
              <div className="mt-2 text-center relative inline-block">
                <img
                  src={videoData.thumbnail}
                  alt="Video thumbnail"
                  style={{ maxWidth: '300px', maxHeight: '200px' }}
                  className="mx-auto border rounded"
                />
                {videoData.showPlayButton && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Clicking this image will open: {videoData.videoUrl}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!videoData.videoUrl || !videoData.thumbnail}
          >
            Add Video Thumbnail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
