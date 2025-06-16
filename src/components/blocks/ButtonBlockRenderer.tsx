
import React from 'react';
import { ButtonBlock } from '@/types/emailBlocks';

interface ButtonBlockRendererProps {
  block: ButtonBlock;
  isSelected: boolean;
  onUpdate: (block: ButtonBlock) => void;
}

export const ButtonBlockRenderer: React.FC<ButtonBlockRendererProps> = ({ block, isSelected }) => {
  const styling = block.styling.desktop;

  // Check if the text contains HTML anchor tags
  const containsAnchorTag = block.content.text.includes('<a');

  return (
    <div
      className="button-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: 'center',
      }}
    >
      {containsAnchorTag ? (
        // Render HTML content directly if it contains anchor tags
        <div
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#3B82F6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            border: block.content.style === 'outline' ? '2px solid #3B82F6' : 'none',
            ...(block.content.style === 'outline' && { 
              backgroundColor: 'transparent', 
              color: '#3B82F6' 
            }),
            ...(block.content.style === 'text' && { 
              backgroundColor: 'transparent', 
              color: '#3B82F6',
              padding: '12px 0'
            }),
          }}
          dangerouslySetInnerHTML={{ __html: block.content.text }}
        />
      ) : (
        // Fallback to traditional button rendering
        <a
          href={block.content.link}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#3B82F6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            border: block.content.style === 'outline' ? '2px solid #3B82F6' : 'none',
            ...(block.content.style === 'outline' && { 
              backgroundColor: 'transparent', 
              color: '#3B82F6' 
            }),
            ...(block.content.style === 'text' && { 
              backgroundColor: 'transparent', 
              color: '#3B82F6',
              padding: '12px 0'
            }),
          }}
        >
          {block.content.text || 'Button Text'}
        </a>
      )}
    </div>
  );
};
