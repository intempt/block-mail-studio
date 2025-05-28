
import React, { useState } from 'react';
import { ImageBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { ImageSelectionDialog } from '../dialogs/ImageSelectionDialog';
import { Image, Upload } from 'lucide-react';

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
  const [showImageDialog, setShowImageDialog] = useState(false);
  const styling = block.styling.desktop;

  const handleImageSelect = (imageData: {
    src: string;
    alt: string;
    width?: string;
    link?: string;
  }) => {
    onUpdate({
      ...block,
      content: {
        ...block.content,
        ...imageData
      }
    });
  };

  const handleImageClick = () => {
    if (!block.content.src || block.content.src.includes('placeholder')) {
      setShowImageDialog(true);
    }
  };

  const imageElement = (
    <img
      src={block.content.src || 'https://via.placeholder.com/400x200?text=Click+to+Add+Image'}
      alt={block.content.alt || 'Image'}
      style={{
        width: block.content.width || '100%',
        height: 'auto',
        borderRadius: styling.borderRadius,
        border: styling.border,
        cursor: !block.content.src || block.content.src.includes('placeholder') ? 'pointer' : 'default'
      }}
      className="max-w-full transition-opacity hover:opacity-80"
      onClick={handleImageClick}
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
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
          onClick={() => setShowImageDialog(true)}
        >
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Add Image</h3>
          <p className="text-gray-500 mb-4">Upload an image or provide a URL</p>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
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
          
          {/* Edit overlay on hover */}
          {isSelected && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowImageDialog(true)}
                className="bg-white shadow-lg"
              >
                Edit Image
              </Button>
            </div>
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

      <ImageSelectionDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onImageSelect={handleImageSelect}
        currentImage={block.content}
      />
    </div>
  );
};
