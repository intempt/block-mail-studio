
import React from 'react';
import { DividerBlock } from '@/types/emailBlocks';

interface DividerBlockComponentProps {
  block: DividerBlock;
  onBlockUpdate: (blockId: string, updates: Partial<DividerBlock>) => void;
}

export const DividerBlockComponent: React.FC<DividerBlockComponentProps> = ({ block }) => {
  return (
    <div style={{ margin: '20px 0', ...block.styling.desktop }}>
      <hr
        style={{
          border: 'none',
          borderTop: `${block.content.style === 'dashed' ? 'dashed' : 'solid'} 1px #ccc`,
          margin: 0
        }}
      />
    </div>
  );
};
