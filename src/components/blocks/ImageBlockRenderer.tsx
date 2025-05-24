
import React from 'react';
import { ImageBlock } from '@/types/emailBlocks';

interface ImageBlockRendererProps {
  block: ImageBlock;
  isSelected: boolean;
  onUpdate: (block: ImageBlock) => void;
}

export const ImageBlockRenderer: React.FC<ImageBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  const imageElement = (
    <img
      src={block.content.src || 'https://via.placeholder.com/400x200?text=Image'}
      alt={block.content.alt}
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: styling.borderRadius,
        border: styling.border,
      }}
      className="max-w-full"
    />
  );

  return (
    <div
      className="image-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: 'center',
      }}
    >
      {block.content.link ? (
        <a href={block.content.link} target="_blank" rel="noopener noreferrer">
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
    </div>
  );
};
