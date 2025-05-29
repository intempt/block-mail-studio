
import React from 'react';
import { ButtonBlock } from '@/types/emailBlocks';

interface ButtonBlockComponentProps {
  block: ButtonBlock;
  onBlockUpdate: (blockId: string, updates: Partial<ButtonBlock>) => void;
}

export const ButtonBlockComponent: React.FC<ButtonBlockComponentProps> = ({ block, onBlockUpdate }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLSpanElement>) => {
    onBlockUpdate(block.id, {
      content: {
        ...block.content,
        text: e.target.textContent || ''
      }
    });
  };

  return (
    <div style={{ textAlign: 'center', ...block.styling.desktop }}>
      <a
        href={block.content.link || '#'}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        <span
          contentEditable
          onBlur={handleTextChange}
          style={{ outline: 'none' }}
        >
          {block.content.text || 'Click Me'}
        </span>
      </a>
    </div>
  );
};
