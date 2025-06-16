
import React from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { TextBlockRenderer } from './blocks/TextBlockRenderer';
import { ImageBlockRenderer } from './blocks/ImageBlockRenderer';
import { ButtonBlockRenderer } from './blocks/ButtonBlockRenderer';
import { SpacerBlockRenderer } from './blocks/SpacerBlockRenderer';
import { DividerBlockRenderer } from './blocks/DividerBlockRenderer';
import { VideoBlockRenderer } from './blocks/VideoBlockRenderer';
import { SocialBlockRenderer } from './blocks/SocialBlockRenderer';
import { HtmlBlockRenderer } from './blocks/HtmlBlockRenderer';
import { TableBlockRenderer } from './blocks/TableBlockRenderer';
import { ProductBlockRenderer } from './blocks/ProductBlockRenderer';

interface BlockRendererProps {
  block: EmailBlock;
  isSelected: boolean;
  onUpdate: (block: EmailBlock) => void;
  onStarBlock?: () => void;
  onUnstarBlock?: (blockId: string) => void;
  recentlyDroppedProductBlocks?: Set<string>;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  isSelected, 
  onUpdate, 
  onStarBlock, 
  onUnstarBlock,
  recentlyDroppedProductBlocks = new Set()
}) => {
  const commonProps = {
    block,
    isSelected,
    onUpdate,
    onStarBlock,
    onUnstarBlock
  };

  switch (block.type) {
    case 'text':
      return <TextBlockRenderer {...commonProps} />;
    case 'image':
      return <ImageBlockRenderer {...commonProps} />;
    case 'button':
      return <ButtonBlockRenderer {...commonProps} />;
    case 'spacer':
      return <SpacerBlockRenderer {...commonProps} />;
    case 'divider':
      return <DividerBlockRenderer {...commonProps} />;
    case 'video':
      return <VideoBlockRenderer {...commonProps} />;
    case 'social':
      return <SocialBlockRenderer {...commonProps} />;
    case 'html':
      return <HtmlBlockRenderer {...commonProps} />;
    case 'table':
      return <TableBlockRenderer {...commonProps} />;
    case 'product':
      return <ProductBlockRenderer {...commonProps} recentlyDroppedProductBlocks={recentlyDroppedProductBlocks} />;
    default:
      return <div>Unknown block type: {(block as any).type}</div>;
  }
};
