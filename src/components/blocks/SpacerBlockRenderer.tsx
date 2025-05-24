
import React from 'react';
import { SpacerBlock } from '@/types/emailBlocks';

interface SpacerBlockRendererProps {
  block: SpacerBlock;
  isSelected: boolean;
  onUpdate: (block: SpacerBlock) => void;
}

export const SpacerBlockRenderer: React.FC<SpacerBlockRendererProps> = ({ block, isSelected }) => {
  return (
    <div
      className="spacer-block-renderer"
      style={{
        height: block.content.height || '40px',
        lineHeight: block.content.height || '40px',
        fontSize: '1px',
      }}
    >
      {isSelected && (
        <div className="text-center text-gray-400 text-xs">
          Spacer ({block.content.height || '40px'})
        </div>
      )}
      &nbsp;
    </div>
  );
};
