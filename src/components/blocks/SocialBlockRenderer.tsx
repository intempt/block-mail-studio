
import React from 'react';
import { SocialBlock } from '@/types/emailBlocks';

interface SocialBlockRendererProps {
  block: SocialBlock;
  isSelected: boolean;
  onUpdate: (block: SocialBlock) => void;
}

export const SocialBlockRenderer: React.FC<SocialBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  return (
    <div
      className="social-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: 'center',
      }}
    >
      <div className={`flex ${block.content.layout === 'vertical' ? 'flex-col' : 'flex-row'} justify-center items-center gap-3`}>
        {block.content.platforms.map((platform, index) => (
          <a
            key={index}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={platform.icon || 'https://via.placeholder.com/32x32?text=S'}
              alt={platform.name}
              style={{ width: '32px', height: '32px' }}
            />
          </a>
        ))}
      </div>
    </div>
  );
};
