
import React from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { TextBlockRenderer } from './blocks/TextBlockRenderer';
import { ImageBlockRenderer } from './blocks/ImageBlockRenderer';
import { ButtonBlockRenderer } from './blocks/ButtonBlockRenderer';
import { SplitBlockRenderer } from './blocks/SplitBlockRenderer';
import { SpacerBlockRenderer } from './blocks/SpacerBlockRenderer';
import { DividerBlockRenderer } from './blocks/DividerBlockRenderer';
import { VideoBlockRenderer } from './blocks/VideoBlockRenderer';
import { SocialBlockRenderer } from './blocks/SocialBlockRenderer';
import { MenuBlockRenderer } from './blocks/MenuBlockRenderer';
import { HtmlBlockRenderer } from './blocks/HtmlBlockRenderer';
import { CodeBlockRenderer } from './blocks/CodeBlockRenderer';
import { ColumnsBlockRenderer } from './blocks/ColumnsBlockRenderer';

interface BlockRendererProps {
  block: EmailBlock;
  isSelected: boolean;
  onUpdate: (block: EmailBlock) => void;
  onBlockAdd?: (blockType: string, columnId: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, isSelected, onUpdate, onBlockAdd }) => {
  const getBlockComponent = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'image':
        return <ImageBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'button':
        return <ButtonBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'split':
        return <SplitBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'columns':
        return <ColumnsBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} onBlockAdd={onBlockAdd} />;
      case 'spacer':
        return <SpacerBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'divider':
        return <DividerBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'video':
        return <VideoBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'social':
        return <SocialBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'html':
        return <HtmlBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'menu':
        return <MenuBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'code':
        return <CodeBlockRenderer block={block} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'product':
      case 'table':
      case 'header-link-bar':
      case 'drop-shadow':
      case 'review-quote':
        return <div className="p-4 bg-blue-100 text-blue-700">Block type "{block.type}" coming soon</div>;
      default:
        return <div className="p-4 bg-red-100 text-red-700">Unknown block type: {(block as any).type}</div>;
    }
  };

  return (
    <div className={`block-renderer ${isSelected ? 'selected' : ''}`}>
      {getBlockComponent()}
    </div>
  );
};
