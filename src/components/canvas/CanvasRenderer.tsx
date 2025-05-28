
import React from 'react';
import { EmailBlock } from '@/types/emailBlocks';
import { ColumnRenderer } from './ColumnRenderer';
import { EnhancedTextBlockRenderer } from '../EnhancedTextBlockRenderer';
import { BlockRenderer } from '../BlockRenderer';

interface CanvasRendererProps {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  editingBlockId: string | null;
  isDraggingOver: boolean;
  dragOverIndex: number | null;
  onBlockClick: (blockId: string) => void;
  onBlockDoubleClick: (blockId: string, blockType: string) => void;
  onBlockDragStart: (e: React.DragEvent, blockId: string) => void;
  onBlockDrop: (e: React.DragEvent, targetIndex: number) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onSaveAsSnippet: (blockId: string) => void;
  onTipTapChange: (blockId: string, html: string) => void;
  onTipTapBlur: () => void;
  onColumnDrop: (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => void;
  onBlockEditStart: (blockId: string) => void;
  onBlockEditEnd: () => void;
  onBlockUpdate: (block: EmailBlock) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  blocks,
  selectedBlockId,
  editingBlockId,
  isDraggingOver,
  dragOverIndex,
  onBlockClick,
  onBlockDoubleClick,
  onBlockDragStart,
  onBlockDrop,
  onDeleteBlock,
  onDuplicateBlock,
  onSaveAsSnippet,
  onTipTapChange,
  onTipTapBlur,
  onColumnDrop,
  onBlockEditStart,
  onBlockEditEnd,
  onBlockUpdate
}) => {
  const renderBlock = (block: EmailBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;
    const isEditing = editingBlockId === block.id;

    // Handle columns blocks specially
    if (block.type === 'columns') {
      return (
        <ColumnRenderer
          key={block.id}
          block={block}
          onColumnDrop={onColumnDrop}
          renderBlock={(innerBlock) => (
            <BlockRenderer 
              block={innerBlock}
              isSelected={false}
              onUpdate={onBlockUpdate}
            />
          )}
          editingBlockId={editingBlockId}
          onBlockEditStart={onBlockEditStart}
          onBlockEditEnd={onBlockEditEnd}
          onBlockUpdate={onBlockUpdate}
        />
      );
    }

    // Handle text blocks with enhanced editor
    if (block.type === 'text') {
      return (
        <EnhancedTextBlockRenderer
          key={block.id}
          block={block}
          isSelected={isSelected}
          isEditing={isEditing}
          onUpdate={onBlockUpdate}
          onEditStart={() => onBlockEditStart(block.id)}
          onEditEnd={onBlockEditEnd}
        />
      );
    }

    // Handle other block types
    return (
      <div
        key={block.id}
        className={`email-block mb-4 ${isSelected ? 'selected' : ''}`}
        draggable
        onDragStart={(e) => onBlockDragStart(e, block.id)}
        onDrop={(e) => onBlockDrop(e, index)}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => onBlockClick(block.id)}
        onDoubleClick={() => onBlockDoubleClick(block.id, block.type)}
      >
        <BlockRenderer 
          block={block}
          isSelected={isSelected}
          onUpdate={onBlockUpdate}
        />
      </div>
    );
  };

  return (
    <div className="canvas-renderer min-h-64">
      {blocks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium mb-2">Ready to build!</div>
          <div className="text-sm">Drag a layout from the toolbar above to start building your email</div>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <React.Fragment key={block.id}>
              {isDraggingOver && dragOverIndex === index && (
                <div className="h-2 bg-blue-400 rounded-full opacity-75 transition-all duration-200" />
              )}
              {renderBlock(block, index)}
            </React.Fragment>
          ))}
          {isDraggingOver && dragOverIndex === blocks.length && (
            <div className="h-2 bg-blue-400 rounded-full opacity-75 transition-all duration-200" />
          )}
        </div>
      )}
    </div>
  );
};
