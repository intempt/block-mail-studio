
import React from 'react';
import { TextBlock } from '@/types/emailBlocks';

interface TextBlockComponentProps {
  block: TextBlock;
  onBlockUpdate: (blockId: string, updates: Partial<TextBlock>) => void;
}

export const TextBlockComponent: React.FC<TextBlockComponentProps> = ({ block, onBlockUpdate }) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    onBlockUpdate(block.id, {
      content: {
        ...block.content,
        html: e.target.innerHTML
      }
    });
  };

  return (
    <div
      contentEditable
      dangerouslySetInnerHTML={{ __html: block.content.html || '<p>Click to edit text...</p>' }}
      onBlur={handleContentChange}
      style={{
        ...block.styling.desktop,
        minHeight: '20px',
        outline: 'none'
      }}
    />
  );
};
