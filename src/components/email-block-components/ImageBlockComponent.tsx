
import React from 'react';
import { ImageBlock } from '@/types/emailBlocks';

interface ImageBlockComponentProps {
  block: ImageBlock;
  onBlockUpdate: (blockId: string, updates: Partial<ImageBlock>) => void;
}

export const ImageBlockComponent: React.FC<ImageBlockComponentProps> = ({ block }) => {
  return (
    <div style={{ textAlign: 'center', ...block.styling.desktop }}>
      <img
        src={block.content.src || 'https://via.placeholder.com/400x200'}
        alt={block.content.alt || 'Image'}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          margin: '0 auto'
        }}
      />
    </div>
  );
};
