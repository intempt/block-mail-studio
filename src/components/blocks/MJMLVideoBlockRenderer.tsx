
import React from 'react';
import { VideoBlock } from '@/types/emailBlocks';

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
  return (
    <div className="mjml-video-block">
      <img
        src={block.content.thumbnail}
        alt={block.content.title || 'Video thumbnail'}
        className="w-full rounded"
      />
    </div>
  );
};
