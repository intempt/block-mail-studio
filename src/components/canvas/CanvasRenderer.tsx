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
    
    console.log('No handler found, falling back to block update approach');
    
    // Fallback for other block types
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId && block.type !== 'text') {
        if (block.type === 'button') {
          // Add variable to button text
          const currentText = block.content.text || '';
          const newText = currentText + ` ${variable.value}`;
          
          return {
            ...block,
            content: {
              ...block.content,
              text: newText
            }
          };
        }
      } else if (block.type === 'columns') {
        // Handle columns recursively
        const updatedColumns = block.content.columns.map(column => ({
          ...column,
          blocks: column.blocks.map(columnBlock => {
            if (columnBlock.id === blockId) {
              if (columnBlock.type === 'text') {
                // Text blocks in columns should also use the handler
                const columnHandler = (window as any)[`insertVariable_${blockId}`];
                if (columnHandler) {
                  columnHandler(variable);
                }
                return columnBlock;
              } else if (columnBlock.type === 'button') {
                const currentText = columnBlock.content.text || '';
                const newText = currentText + ` ${variable.value}`;
                
                return {
                  ...columnBlock,
                  content: {
                    ...columnBlock.content,
                    text: newText
                  }
                };
              }
            }
            return columnBlock;
          })
        }));
        
        return {
          ...block,
          content: {
            ...block.content,
            columns: updatedColumns
          }
        };
      }
      
      return block;
    }));
  };

  const renderBlock = (block: EmailBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;
    const isEditing = editingBlockId === block.id;

    // Handle columns blocks specially
    if (block.type === 'columns') {
      // Type assertion with proper check
      const columnsBlock = block as ColumnsBlock;
      return (
        <div
          key={block.id}
          className={`email-block group relative mb-4 ${isSelected ? 'selected ring-2 ring-purple-400 ring-opacity-50' : ''}`}
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
            onInsertVariable={() => {}} // Simplified - we're using global handler now
          />
        </div>
      );
    }

    // Handle other block types
    return (
      <div
        key={block.id}
        className={`email-block group relative mb-4 ${isSelected ? 'selected ring-2 ring-blue-400 ring-opacity-50' : ''} hover:shadow-lg transition-all duration-200 rounded-lg`}
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
        <div className="text-center py-16">
          {isDraggingOver && currentDragType ? (
            <DropZoneIndicator
              isVisible={true}
              dragType={currentDragType}
              position="middle"
              className="min-h-48"
            />
          ) : (
            <div className="text-gray-500">
              <div className="text-xl font-medium mb-3">Ready to build!</div>
              <div className="text-sm">Drag a layout from the toolbar above to start building your email</div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top drop zone */}
          {isDraggingOver && dragOverIndex === 0 && currentDragType && (
            <DropZoneIndicator
              isVisible={true}
              dragType={currentDragType}
              position="top"
              className="mb-4"
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
                  className="mb-4"
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
              className="mt-6"
            />
          )}
        </div>
      )}
    </div>
  );
};
