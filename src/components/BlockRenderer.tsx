
import React from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
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
  onStarBlock?: (block: EmailBlock) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  isSelected, 
  onUpdate, 
  onBlockAdd,
  onStarBlock 
}) => {
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

  const handleStarBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStarBlock) {
      onStarBlock(block);
    }
  };

  return (
    <div className={`block-renderer ${isSelected ? 'selected' : ''} relative group`}>
      {getBlockComponent()}
      
      {/* Star button - shows on hover or when block is starred */}
      {onStarBlock && (
        <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
          block.isStarred ? 'opacity-100' : ''
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStarBlock}
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
          >
            <Star 
              className={`w-4 h-4 ${
                block.isStarred 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-slate-400 hover:text-yellow-400'
              }`} 
            />
          </Button>
        </div>
      )}
    </div>
  );
};
