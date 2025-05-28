
import React from 'react';
import { TextBlock } from '@/types/emailBlocks';

interface TextBlockRendererProps {
  block: TextBlock;
  isSelected: boolean;
  onUpdate: (block: TextBlock) => void;
}

export const TextBlockRenderer: React.FC<TextBlockRendererProps> = ({ block, isSelected }) => {
  console.log('TextBlockRenderer: Rendering text block:', { 
    id: block.id, 
    html: block.content.html,
    styling: block.styling 
  });

  const styling = block.styling?.desktop || {};

  return (
    <div
      className="text-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor || 'transparent',
        padding: styling.padding || '20px',
        margin: styling.margin || '0',
        borderRadius: styling.borderRadius || '8px',
        border: styling.border || (isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0'),
        color: styling.textColor || '#374151',
        fontSize: styling.fontSize || '14px',
        fontWeight: styling.fontWeight || '400',
      }}
    >
      {block.content.html ? (
        <div 
          dangerouslySetInnerHTML={{ __html: block.content.html }}
          className="prose prose-sm max-w-none"
        />
      ) : (
        <p className="text-gray-400 italic">
          {block.content.placeholder || 'Click to add text...'}
        </p>
      )}
    </div>
  );
};
