
import React from 'react';
import { HtmlBlock } from '@/types/emailBlocks';

interface MJMLHtmlBlockRendererProps {
  block: HtmlBlock;
  isSelected: boolean;
  onUpdate: (block: HtmlBlock) => void;
}

export const MJMLHtmlBlockRenderer: React.FC<MJMLHtmlBlockRendererProps> = ({ 
  block, 
  isSelected, 
  onUpdate 
}) => {
  const styling = block.styling.desktop;

  return (
    <div
      className="mjml-html-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
      }}
    >
      {block.content.html ? (
        <div 
          dangerouslySetInnerHTML={{ __html: block.content.html }}
          className="prose max-w-none"
        />
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 text-center text-gray-500 rounded-lg">
          <div className="text-lg font-medium mb-2">Custom HTML Block</div>
          <p className="text-sm">Click to edit HTML content</p>
          <p className="text-xs mt-2 text-gray-400">Will be converted to MJML-compatible format</p>
        </div>
      )}

      {/* MJML compliance indicator */}
      {isSelected && (
        <div className="absolute bottom-2 left-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            MJML Ready
          </span>
        </div>
      )}
    </div>
  );
};
