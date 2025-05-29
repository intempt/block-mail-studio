
import React from 'react';
import { TextBlock } from '@/types/emailBlocks';

interface EnhancedTextBlockRendererProps {
  block: TextBlock;
  isSelected: boolean;
  isEditing: boolean;
  onUpdate: (block: TextBlock) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
}

export const EnhancedTextBlockRenderer: React.FC<EnhancedTextBlockRendererProps> = ({
  block,
  isSelected,
  isEditing,
  onUpdate,
  onEditStart,
  onEditEnd
}) => {
  const styling = block.styling.desktop;

  if (isEditing) {
    return (
      <textarea
        value={block.content.html.replace(/<[^>]*>/g, '')}
        onChange={(e) => onUpdate({
          ...block,
          content: { ...block.content, html: `<p>${e.target.value}</p>` }
        })}
        onBlur={onEditEnd}
        className="w-full p-2 border rounded"
        autoFocus
      />
    );
  }

  return (
    <div
      className={`text-block ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onEditStart}
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        borderRadius: styling.borderRadius,
        border: styling.border,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
    </div>
  );
};
