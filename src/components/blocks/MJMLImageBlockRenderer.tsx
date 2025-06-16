
import React from 'react';
import { ImageBlock } from '@/types/emailBlocks';
import { Image } from 'lucide-react';

interface MJMLImageBlockRendererProps {
  block: ImageBlock;
  isSelected: boolean;
  onUpdate: (block: ImageBlock) => void;
}

export const MJMLImageBlockRenderer: React.FC<MJMLImageBlockRendererProps> = ({ 
  block, 
  isSelected, 
  onUpdate 
}) => {
  const styling = block.styling.desktop;

  const imageElement = (
    <img
      src={block.content.src || 'https://via.placeholder.com/400x200?text=Click+to+Add+Image'}
      alt={block.content.alt || 'Image'}
      style={{
        width: block.content.width || '100%',
        height: 'auto',
        borderRadius: styling.borderRadius,
        border: styling.border,
      }}
      className="max-w-full transition-opacity hover:opacity-80"
    />
  );

  return (
    <div
      className="mjml-image-block-renderer relative group"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        textAlign: block.content.alignment || 'center',
      }}
    >
      {/* Empty state with upload prompt */}
      {(!block.content.src || block.content.src.includes('placeholder')) && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Add Image</h3>
          <p className="text-gray-500 mb-4">Use the properties panel to configure this image</p>
        </div>
      )}

      {/* Image with link wrapper */}
      {block.content.src && !block.content.src.includes('placeholder') && (
        <>
          {block.content.link ? (
            <a href={block.content.link} target="_blank" rel="noopener noreferrer">
              {imageElement}
            </a>
          ) : (
            imageElement
          )}
        </>
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
