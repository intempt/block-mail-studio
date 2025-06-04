
import React from 'react';
import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';
import { ColumnRenderer } from './ColumnRenderer';
import { EnhancedTextBlockRenderer } from '../EnhancedTextBlockRenderer';
import { BlockRenderer } from '../BlockRenderer';
import { BlockControls } from './BlockControls';
import { DropZoneIndicator } from '../DropZoneIndicator';

interface VariableOption {
  text: string;
  value: string;
}

interface CanvasRendererProps {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  editingBlockId: string | null;
  isDraggingOver: boolean;
  dragOverIndex: number | null;
  currentDragType?: 'block' | 'layout' | 'reorder' | null;
  onBlockClick: (blockId: string) => void;
  onBlockDoubleClick: (blockId: string, blockType: string) => void;
  onBlockDragStart: (e: React.DragEvent, blockId: string) => void;
  onBlockDrop: (e: React.DragEvent, targetIndex: number) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onSaveAsSnippet: (blockId: string) => void;
  onUnstarBlock?: (blockId: string) => void;
  onTipTapChange: (blockId: string, html: string) => void;
  onTipTapBlur: () => void;
  onColumnDrop: (e: React.DragEvent, layoutBlockId: string, columnIndex: number) => void;
  onBlockEditStart: (blockId: string) => void;
  onBlockEditEnd: () => void;
  onBlockUpdate: (block: EmailBlock) => void;
  onAddVariable?: (blockId: string, variable: VariableOption) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  blocks,
  selectedBlockId,
  editingBlockId,
  isDraggingOver,
  dragOverIndex,
  currentDragType = null,
  onBlockClick,
  onBlockDoubleClick,
  onBlockDragStart,
  onBlockDrop,
  onDeleteBlock,
  onDuplicateBlock,
  onSaveAsSnippet,
  onUnstarBlock,
  onTipTapChange,
  onTipTapBlur,
  onColumnDrop,
  onBlockEditStart,
  onBlockEditEnd,
  onBlockUpdate,
  onAddVariable
}) => {
  // Simplified variable handling
  const handleAddVariable = (blockId: string, variable: any) => {
    console.log('CanvasRenderer handleAddVariable called for block:', blockId, 'variable:', variable);
    
    // For text blocks, use the global handler approach
    const handler = (window as any)[`insertVariable_${blockId}`];
    if (handler) {
      console.log('Found handler for text block, calling it');
      handler(variable);
      return;
    }
    
    console.log('No handler found, falling back to onAddVariable callback');
    
    // Fallback to parent handler for other block types
    if (onAddVariable) {
      onAddVariable(blockId, variable);
    }
  };

  const renderBlock = (block: EmailBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;
    const isEditing = editingBlockId === block.id;

    // Handle columns blocks specially
    if (block.type === 'columns') {
      const columnsBlock = block as ColumnsBlock;
      return (
        <div
          key={block.id}
          className={`email-block group relative mb-brand-4 ${isSelected ? 'selected ring-2 ring-brand-primary ring-opacity-50' : ''}`}
          draggable
          onDragStart={(e) => onBlockDragStart(e, block.id)}
          onDrop={(e) => onBlockDrop(e, index)}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => onBlockClick(block.id)}
          onDoubleClick={() => onBlockDoubleClick(block.id, block.type)}
        >
          <BlockControls
            blockId={block.id}
            onDelete={onDeleteBlock}
            onDuplicate={onDuplicateBlock}
            onDragStart={onBlockDragStart}
            onSaveAsSnippet={onSaveAsSnippet}
            isStarred={block.isStarred}
            onUnstar={onUnstarBlock}
            onAddVariable={(blockId, variable) => handleAddVariable(blockId, variable)}
          />
          <ColumnRenderer
            block={columnsBlock}
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
        </div>
      );
    }

    // Handle text blocks with enhanced editor
    if (block.type === 'text') {
      return (
        <div key={block.id} className="group relative">
          <BlockControls
            blockId={block.id}
            onDelete={onDeleteBlock}
            onDuplicate={onDuplicateBlock}
            onDragStart={onBlockDragStart}
            onSaveAsSnippet={onSaveAsSnippet}
            isStarred={block.isStarred}
            onUnstar={onUnstarBlock}
            onAddVariable={(blockId, variable) => handleAddVariable(blockId, variable)}
          />
          <EnhancedTextBlockRenderer
            block={block as any}
            isSelected={isSelected}
            isEditing={isEditing}
            onUpdate={onBlockUpdate}
            onEditStart={() => onBlockEditStart(block.id)}
            onEditEnd={onBlockEditEnd}
            onInsertVariable={() => {}}
          />
        </div>
      );
    }

    // Handle other block types
    return (
      <div
        key={block.id}
        className={`email-block group relative mb-brand-4 ${
          isSelected ? 'selected ring-2 ring-brand-primary ring-opacity-50' : ''
        } hover:shadow-lg transition-all duration-300 rounded-brand-lg`}
        draggable
        onDragStart={(e) => onBlockDragStart(e, block.id)}
        onDrop={(e) => onBlockDrop(e, index)}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => onBlockClick(block.id)}
        onDoubleClick={() => onBlockDoubleClick(block.id, block.type)}
      >
        <BlockControls
          blockId={block.id}
          onDelete={onDeleteBlock}
          onDuplicate={onDuplicateBlock}
          onDragStart={onBlockDragStart}
          onSaveAsSnippet={onSaveAsSnippet}
          isStarred={block.isStarred}
          onUnstar={onUnstarBlock}
          onAddVariable={(blockId, variable) => handleAddVariable(blockId, variable)}
        />
        <BlockRenderer 
          block={block}
          isSelected={isSelected}
          onUpdate={onBlockUpdate}
          onStarBlock={() => onSaveAsSnippet(block.id)}
          onUnstarBlock={onUnstarBlock}
        />
      </div>
    );
  };

  return (
    <div className="canvas-renderer min-h-64">
      {blocks.length === 0 ? (
        <div className="text-center py-brand-8">
          {isDraggingOver && currentDragType ? (
            <DropZoneIndicator
              isVisible={true}
              dragType={currentDragType}
              position="middle"
              className="min-h-48"
            />
          ) : (
            <div className="text-brand-fg opacity-75">
              <div className="text-h2 font-medium mb-brand-3">Ready to build!</div>
              <div className="text-body">Drag a layout from the toolbar above to start building your email</div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-brand-6">
          {/* Top drop zone */}
          {isDraggingOver && dragOverIndex === 0 && currentDragType && (
            <DropZoneIndicator
              isVisible={true}
              dragType={currentDragType}
              position="top"
              className="mb-brand-4"
            />
          )}

          {blocks.map((block, index) => (
            <React.Fragment key={block.id}>
              {/* Drop zone above current block */}
              {isDraggingOver && dragOverIndex === index && dragOverIndex !== 0 && currentDragType && (
                <DropZoneIndicator
                  isVisible={true}
                  dragType={currentDragType}
                  position="top"
                  className="mb-brand-4"
                />
              )}
              
              {renderBlock(block, index)}
              
              {/* Drop zone below current block */}
              {isDraggingOver && dragOverIndex === index + 1 && currentDragType && (
                <DropZoneIndicator
                  isVisible={true}
                  dragType={currentDragType}
                  position="bottom"
                  className="mt-brand-4"
                />
              )}
            </React.Fragment>
          ))}

          {/* Bottom drop zone */}
          {isDraggingOver && dragOverIndex === blocks.length && currentDragType && (
            <DropZoneIndicator
              isVisible={true}
              dragType={currentDragType}
              position="bottom"
              className="mt-brand-6"
            />
          )}
        </div>
      )}
    </div>
  );
};
