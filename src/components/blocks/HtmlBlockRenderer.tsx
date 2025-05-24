
import React from 'react';
import { HtmlBlock } from '@/types/emailBlocks';

interface HtmlBlockRendererProps {
  block: HtmlBlock;
  isSelected: boolean;
  onUpdate: (block: HtmlBlock) => void;
}

export const HtmlBlockRenderer: React.FC<HtmlBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  return (
    <div
      className="html-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
      }}
    >
      {block.content.html ? (
        <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-4 text-center text-gray-500">
          <p>Custom HTML Block</p>
          <p className="text-xs">Click to edit HTML content</p>
        </div>
      )}
    </div>
  );
};
