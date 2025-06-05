import React from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { TextBlockRenderer } from './blocks/TextBlockRenderer';
import { ImageBlockRenderer } from './blocks/ImageBlockRenderer';
import { ButtonBlockRenderer } from './blocks/ButtonBlockRenderer';
import { SpacerBlockRenderer } from './blocks/SpacerBlockRenderer';
import { DividerBlockRenderer } from './blocks/DividerBlockRenderer';
import { VideoBlockRenderer } from './blocks/VideoBlockRenderer';
import { SocialBlockRenderer } from './blocks/SocialBlockRenderer';
import { HtmlBlockRenderer } from './blocks/HtmlBlockRenderer';
import { TableBlockRenderer } from './blocks/TableBlockRenderer';
import { MJMLImageBlockRenderer } from './blocks/MJMLImageBlockRenderer';
import { MJMLVideoBlockRenderer } from './blocks/MJMLVideoBlockRenderer';
import { MJMLHtmlBlockRenderer } from './blocks/MJMLHtmlBlockRenderer';
import { MJMLTableBlockRenderer } from './blocks/MJMLTableBlockRenderer';
import { MJMLSocialBlockRenderer } from './blocks/MJMLSocialBlockRenderer';
import { ContentBlockRenderer } from './blocks/ContentBlockRenderer';

interface BlockRendererProps {
  block: EmailBlock;
  isSelected: boolean;
  onUpdate: (block: EmailBlock) => void;
  onBlockAdd?: (blockType: string, columnId: string) => void;
  onStarBlock?: (block: EmailBlock) => void;
  onUnstarBlock?: (blockId: string) => void;
  onSnippetRefresh?: () => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  isSelected, 
  onUpdate, 
  onBlockAdd,
  onStarBlock,
  onUnstarBlock,
  onSnippetRefresh
}) => {
  const getBlockComponent = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'image':
        return <MJMLImageBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'button':
        return <ButtonBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'spacer':
        return <SpacerBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'divider':
        return <DividerBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'video':
        return <MJMLVideoBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'social':
        return <MJMLSocialBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'html':
        return <MJMLHtmlBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'table':
        return <MJMLTableBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      case 'content':
        return <ContentBlockRenderer block={block as any} isSelected={isSelected} onUpdate={onUpdate} />;
      default:
        return <div className="p-4 bg-red-100 text-red-700">Unknown block type: {(block as any).type}</div>;
    }
  };

  const handleStarToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (block.isStarred) {
      // Unstar the block
      if (onUnstarBlock) {
        onUnstarBlock(block.id);
      }
      
      // Update the block state immediately
      const updatedBlock = { ...block, isStarred: false };
      onUpdate(updatedBlock);
    } else {
      // Star the block - create snippet immediately
      if (onStarBlock) {
        onStarBlock(block);
      }
      
      // Update the block state immediately
      const updatedBlock = { ...block, isStarred: true };
      onUpdate(updatedBlock);
    }
    
    // Force immediate snippet refresh
    if (onSnippetRefresh) {
      onSnippetRefresh();
    }
  };

  return (
    <div className={`block-renderer ${isSelected ? 'selected' : ''} relative group`}>
      {getBlockComponent()}
      
      {/* Enhanced star button with proper state management */}
      {(onStarBlock || onUnstarBlock) && (
        <div className={`absolute top-2 right-2 transition-all duration-200 ${
          isSelected || block.isStarred 
            ? 'opacity-100' 
            : 'opacity-0 group-hover:opacity-100'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStarToggle}
            className="h-8 w-8 p-0 bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white border border-gray-200"
            title={block.isStarred ? 'Remove from snippets' : 'Save as snippet'}
          >
            <Star 
              className={`w-4 h-4 transition-colors ${
                block.isStarred 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-400 hover:text-yellow-400'
              }`} 
            />
          </Button>
        </div>
      )}
    </div>
  );
};
