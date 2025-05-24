
import React from 'react';
import { VideoBlock } from '@/types/emailBlocks';
import { Play } from 'lucide-react';

interface VideoBlockRendererProps {
  block: VideoBlock;
  isSelected: boolean;
  onUpdate: (block: VideoBlock) => void;
}

export const VideoBlockRenderer: React.FC<VideoBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  return (
    <div
      className="video-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: 'center',
      }}
    >
      <div className="relative inline-block">
        <img
          src={block.content.thumbnail || 'https://via.placeholder.com/400x225?text=Video+Thumbnail'}
          alt="Video thumbnail"
          style={{
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
            borderRadius: styling.borderRadius,
          }}
        />
        {block.content.playButton !== false && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
