
import React, { useState } from 'react';
import { VideoBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { VideoSelectionDialog } from '../dialogs/VideoSelectionDialog';
import { Video, Play, Upload } from 'lucide-react';

interface MJMLVideoBlockRendererProps {
  block: VideoBlock;
  isSelected: boolean;
  onUpdate: (block: VideoBlock) => void;
}

export const MJMLVideoBlockRenderer: React.FC<MJMLVideoBlockRendererProps> = ({ 
  block, 
  isSelected, 
  onUpdate 
}) => {
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  
  // Defensive programming: ensure content and styling exist with defaults
  const content = block.content || {
    videoUrl: '',
    thumbnail: 'https://via.placeholder.com/400x225?text=Video+Thumbnail',
    showPlayButton: true,
    platform: 'youtube' as const,
    autoThumbnail: true
  };
  
  const styling = block.styling?.desktop || {
    backgroundColor: 'transparent',
    padding: '16px',
    margin: '0',
    borderRadius: '0'
  };

  const handleVideoSelect = (videoData: {
    videoUrl: string;
    thumbnail: string;
    platform: "youtube" | "vimeo" | "tiktok" | "custom";
    showPlayButton: boolean;
    autoThumbnail: boolean;
  }) => {
    onUpdate({
      ...block,
      content: {
        ...content,
        ...videoData
      }
    });
  };

  const handleThumbnailClick = () => {
    if (!content.thumbnail || content.thumbnail.includes('placeholder')) {
      setShowVideoDialog(true);
    }
  };

  // Safe access to content properties with fallbacks
  const videoUrl = content.videoUrl || '';
  const thumbnail = content.thumbnail || 'https://via.placeholder.com/400x225?text=Video+Thumbnail';
  const showPlayButton = content.showPlayButton !== false; // Default to true
  const platform = content.platform || 'youtube';

  return (
    <div
      className="mjml-video-block-renderer relative group"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: 'center',
      }}
    >
      {/* Empty state with upload prompt */}
      {(!thumbnail || thumbnail.includes('placeholder')) && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
          onClick={() => setShowVideoDialog(true)}
        >
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Add Video</h3>
          <p className="text-gray-500 mb-2">Videos will be converted to clickable thumbnails</p>
          <p className="text-xs text-gray-400 mb-4">Email-safe approach for maximum compatibility</p>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </div>
      )}

      {/* Video thumbnail with play button */}
      {thumbnail && !thumbnail.includes('placeholder') && (
        <div className="relative inline-block">
          <a
            href={videoUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={thumbnail}
              alt="Video thumbnail"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: styling.borderRadius,
                cursor: 'pointer'
              }}
              className="transition-transform hover:scale-105"
            />
            
            {/* Play button overlay */}
            {showPlayButton && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center transition-all hover:bg-opacity-80">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}
          </a>

          {/* Platform indicator */}
          {platform && isSelected && (
            <div className="absolute top-2 left-2">
              <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {platform.toUpperCase()}
              </span>
            </div>
          )}

          {/* Edit overlay on hover */}
          {isSelected && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowVideoDialog(true)}
                className="bg-white shadow-lg"
              >
                Edit Video
              </Button>
            </div>
          )}
        </div>
      )}

      {/* MJML compliance indicator */}
      {isSelected && (
        <div className="absolute bottom-2 left-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Email Safe
          </span>
        </div>
      )}

      <VideoSelectionDialog
        isOpen={showVideoDialog}
        onClose={() => setShowVideoDialog(false)}
        onVideoSelect={handleVideoSelect}
        currentVideo={content}
      />
    </div>
  );
};
