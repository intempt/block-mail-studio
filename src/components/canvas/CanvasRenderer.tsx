import React from 'react';
import { EmailBlock, ColumnsBlock } from '@/types/emailBlocks';
import { ColumnRenderer } from './ColumnRenderer';
import { EnhancedTextBlockRenderer } from '../EnhancedTextBlockRenderer';
import { BlockRenderer } from '../BlockRenderer';
import { DropZoneIndicator } from '../DropZoneIndicator';
import { ColumnsBlockRenderer } from '../blocks/ColumnsBlockRenderer';

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
  onBlockHover: (blockId: string) => void;
  onBlockLeave: (blockId: string) => void;
  recentlyDroppedProductBlocks?: Set<string>;
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
  onAddVariable,
  onBlockHover,
  onBlockLeave,
  recentlyDroppedProductBlocks
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

  const handleBlockMouseEnter = (blockId: string) => {
    onBlockHover(blockId);
  };

  const handleBlockMouseLeave = (blockId: string) => {
    onBlockLeave(blockId);
  };

  const renderBlock = (block: EmailBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;
    const isEditing = editingBlockId === block.id;

    // Handle columns blocks with the new unified renderer
    if (block.type === 'columns') {
      const columnsBlock = block as ColumnsBlock;
      return (
        <div
          key={block.id}
          className={`email-block relative mb-8 transition-all duration-200 rounded-lg ${
            isSelected ? 'selected ring-2 ring-purple-400 ring-opacity-50' : ''
          }`}
          style={{
            isolation: 'isolate',
            position: 'relative',
            zIndex: isSelected ? 10 : 1,
            marginBottom: '32px',
          }}
          draggable
          onDragStart={(e) => onBlockDragStart(e, block.id)}
          onDrop={(e) => onBlockDrop(e, index)}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => onBlockClick(block.id)}
          onDoubleClick={() => onBlockDoubleClick(block.id, block.type)}
          onMouseEnter={() => handleBlockMouseEnter(block.id)}
          onMouseLeave={() => handleBlockMouseLeave(block.id)}
          data-testid={`email-block-${block.id}`}
          data-block-type="columns"
        >
          <ColumnsBlockRenderer
            block={columnsBlock}
            isSelected={isSelected}
            onUpdate={onBlockUpdate}
            onColumnDrop={onColumnDrop}
            selectedBlockId={selectedBlockId}
            editingBlockId={editingBlockId}
            onBlockSelect={onBlockClick}
            onBlockEditStart={onBlockEditStart}
            onBlockEditEnd={onBlockEditEnd}
            onBlockDelete={onDeleteBlock}
            onBlockDuplicate={onDuplicateBlock}
            onSaveAsSnippet={onSaveAsSnippet}
            onUnstarBlock={onUnstarBlock}
            onBlockHover={onBlockHover}
            onBlockLeave={onBlockLeave}
          />
        </div>
      );
    }

    // Handle text blocks with enhanced editor
    if (block.type === 'text') {
      return (
        <div 
          key={block.id} 
          className={`relative mb-8 transition-all duration-200 rounded-lg ${
            isSelected ? 'selected ring-2 ring-blue-400 ring-opacity-50' : ''
          }`}
          style={{
            isolation: 'isolate',
            position: 'relative',
            zIndex: isSelected ? 10 : 1,
            marginBottom: '32px',
          }}
          onMouseEnter={() => handleBlockMouseEnter(block.id)}
          onMouseLeave={() => handleBlockMouseLeave(block.id)}
          data-testid={`email-block-${block.id}`}
          data-block-type="text"
        >
          <EnhancedTextBlockRenderer
            block={block as any}
            editor={null}
            isSelected={isSelected}
            isEditing={isEditing}
            onUpdate={onBlockUpdate}
            onEditStart={() => onBlockEditStart(block.id)}
            onEditEnd={onBlockEditEnd}
            onInsertVariable={() => {}} // Simplified - we're using global handler now
          />
        </div>
      );
    }

    // Handle other block types
    return (
      <div
        key={block.id}
        className={`email-block relative mb-8 transition-all duration-200 rounded-lg ${
          isSelected ? 'selected ring-2 ring-blue-400 ring-opacity-50' : ''
        }`}
        style={{
          isolation: 'isolate',
          position: 'relative',
          zIndex: isSelected ? 10 : 1,
          marginBottom: '32px',
        }}
        draggable
        onDragStart={(e) => onBlockDragStart(e, block.id)}
        onDrop={(e) => onBlockDrop(e, index)}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => onBlockClick(block.id)}
        onDoubleClick={() => onBlockDoubleClick(block.id, block.type)}
        onMouseEnter={() => handleBlockMouseEnter(block.id)}
        onMouseLeave={() => handleBlockMouseLeave(block.id)}
        data-testid={`email-block-${block.id}`}
        data-block-type={block.type}
      >
        <BlockRenderer 
          block={block}
          isSelected={isSelected}
          onUpdate={onBlockUpdate}
          onStarBlock={() => onSaveAsSnippet(block.id)}
          onUnstarBlock={onUnstarBlock}
          recentlyDroppedProductBlocks={recentlyDroppedProductBlocks}
        />
      </div>
    );
  };

  return (
    <div className="canvas-renderer min-h-64">
      {blocks.length === 0 ? (
        <div className="text-center py-16">
          {isDraggingOver && currentDragType ? (
            <DropZoneIndicator
              isVisible={true}
              dragType={currentDragType}
              position="middle"
              className="min-h-48"
              data-testid="drop-zone-indicator"
            />
          ) : (
            <div className="text-gray-500">
              <div className="text-xl font-medium mb-3">Ready to build!</div>
              <div className="text-sm">Drag a layout from the toolbar above to start building your email</div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top drop zone */}
          {isDraggingOver && dragOverIndex === 0 && currentDragType && (
            <DropZoneIndicator
              isVisible={true}
              dragType={currentDragType}
              position="top"
              className="mb-4"
              data-testid="drop-zone-indicator"
            />
          )}

          {blocks.map((block, index) => (
            <div key={block.id}>
              {/* Drop zone above current block */}
              {isDraggingOver && dragOverIndex === index && dragOverIndex !== 0 && currentDragType && (
                <DropZoneIndicator
                  isVisible={true}
                  dragType={currentDragType}
                  position="top"
                  className="mb-4"
                  data-testid="drop-zone-indicator"
                />
              )}
              
              {renderBlock(block, index)}
              
              {/* Drop zone below current block */}
              {isDraggingOver && dragOverIndex === index + 1 && currentDragType && (
                <DropZoneIndicator
                  isVisible={true}
                  dragType={currentDragType}
                  position="bottom"
                  className="mt-4"
                  data-testid="drop-zone-indicator"
                />
              )}
            </div>
          ))}

          {/* Bottom drop zone */}
          {isDraggingOver && dragOverIndex === blocks.length && currentDragType && (
            <DropZoneIndicator
              isVisible={true}
              dragType={currentDragType}
              position="bottom"
              className="mt-6"
              data-testid="drop-zone-indicator"
            />
          )}
        </div>
      )}
    </div>
  );
};
