
import React from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { BlockRenderer } from './BlockRenderer';

interface EmailBlockRendererProps {
  block: EmailBlock;
  onBlockDelete?: (blockId: string) => void;
  onBlockUpdate?: (block: EmailBlock) => void;
  isSelected?: boolean;
  previewMode?: 'desktop' | 'mobile';
}

export const EmailBlockRenderer: React.FC<EmailBlockRendererProps> = ({
  block,
  onBlockDelete,
  onBlockUpdate,
  isSelected = false,
  previewMode = 'desktop'
}) => {
  const handleUpdate = (updatedBlock: EmailBlock) => {
    if (onBlockUpdate) {
      onBlockUpdate(updatedBlock);
    }
  };

  const handleDelete = () => {
    if (onBlockDelete) {
      onBlockDelete(block.id);
    }
  };

  return (
    <div className="relative group">
      <BlockRenderer
        block={block}
        isSelected={isSelected}
        onUpdate={handleUpdate}
      />
      
      {isSelected && onBlockDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete block"
        >
          ×
        </button>
      )}
    </div>
  );
};

// For backwards compatibility
export default EmailBlockRenderer;
