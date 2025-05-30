
import React from 'react';
import { TextBlock } from '@/types/emailBlocks';

interface TextBlockRendererProps {
  block: TextBlock;
  isSelected: boolean;
  onUpdate: (block: TextBlock) => void;
}

export const TextBlockRenderer: React.FC<TextBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  return (
    <div
      className="text-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        borderRadius: styling.borderRadius,
        border: styling.border,
        color: styling.textColor,
        fontSize: styling.fontSize,
        fontWeight: styling.fontWeight,
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
