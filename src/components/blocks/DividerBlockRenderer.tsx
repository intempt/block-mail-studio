
import React from 'react';
import { DividerBlock } from '@/types/emailBlocks';

interface DividerBlockRendererProps {
  block: DividerBlock;
  isSelected: boolean;
  onUpdate: (block: DividerBlock) => void;
}

export const DividerBlockRenderer: React.FC<DividerBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  return (
    <div
      className="divider-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
      }}
    >
      <hr
        style={{
          border: 0,
          height: block.content.thickness || '1px',
          backgroundColor: block.content.color || '#e0e0e0',
          borderStyle: block.content.style || 'solid',
          margin: 0,
        }}
      />
    </div>
  );
};
