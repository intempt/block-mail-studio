
import React from 'react';
import { ColumnsBlock, EmailBlock } from '@/types/emailBlocks';
import { EnhancedTextBlockRenderer } from '../EnhancedTextBlockRenderer';
import { BlockRenderer } from '../BlockRenderer';
import { BlockControls } from '../canvas/BlockControls';

interface ColumnsBlockRendererProps {
  block: ColumnsBlock;
  isSelected: boolean;
  onUpdate: (block: ColumnsBlock) => void;
  onBlockAdd?: (blockType: string, columnId: string) => void;
  selectedBlockId?: string | null;
  editingBlockId?: string | null;
  onBlockSelect?: (blockId: string | null) => void;
  onBlockEditStart?: (blockId: string) => void;
  onBlockEditEnd?: () => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockDuplicate?: (blockId: string) => void;
  onSaveAsSnippet?: (blockId: string) => void;
  onUnstarBlock?: (blockId: string) => void;
}

export const ColumnsBlockRenderer: React.FC<ColumnsBlockRendererProps> = ({ 
  block, 
  isSelected,
  onUpdate,
  onBlockAdd,
  selectedBlockId,
  editingBlockId,
  onBlockSelect,
  onBlockEditStart,
  onBlockEditEnd,
  onBlockDelete,
  onBlockDuplicate,
  onSaveAsSnippet,
  onUnstarBlock
}) => {
  const styling = block.styling.desktop;
  
  const getColumnWidths = () => {
    switch (block.content.columnRatio) {
      case '100%':
        return ['100%'];
      case '50-50':
        return ['50%', '50%'];
      case '33-67':
        return ['33%', '67%'];
      case '67-33':
        return ['67%', '33%'];
      case '25-75':
        return ['25%', '75%'];
      case '75-25':
        return ['75%', '25%'];
      case '60-40':
        return ['60%', '40%'];
      case '40-60':
        return ['40%', '60%'];
      case '33-33-33':
        return ['33.33%', '33.33%', '33.33%'];
      case '25-50-25':
        return ['25%', '50%', '25%'];
      case '25-25-50':
        return ['25%', '25%', '50%'];
      case '50-25-25':
        return ['50%', '25%', '25%'];
      case '25-25-25-25':
        return ['25%', '25%', '25%', '25%'];
      default:
        return ['100%'];
    }
  };

  const columnWidths = getColumnWidths();

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.blockType && onBlockAdd) {
        onBlockAdd(data.blockType, columnId);
      }
    } catch (error) {
      console.error('Error handling drop in column:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBlockUpdate = (updatedBlock: EmailBlock, columnId: string) => {
    const updatedColumns = block.content.columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          blocks: column.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
        };
      }
      return column;
    });

    onUpdate({
      ...block,
      content: {
        ...block.content,
        columns: updatedColumns
      }
    });
  };

  const handleBlockClick = (blockId: string) => {
    onBlockSelect?.(blockId);
  };

  const handleBlockDoubleClick = (blockId: string) => {
    onBlockEditStart?.(blockId);
  };

  const handleBlockDelete = (blockId: string) => {
    const updatedColumns = block.content.columns.map(column => ({
      ...column,
      blocks: column.blocks.filter(b => b.id !== blockId)
    }));

    onUpdate({
      ...block,
      content: {
        ...block.content,
        columns: updatedColumns
      }
    });

    onBlockDelete?.(blockId);
  };

  const handleBlockDuplicate = (blockId: string) => {
    const blockToDuplicate = block.content.columns
      .flatMap(col => col.blocks)
      .find(b => b.id === blockId);
    
    if (!blockToDuplicate) return;

    const duplicatedBlock: EmailBlock = {
      ...blockToDuplicate,
      id: `${blockToDuplicate.id}_copy_${Date.now()}`,
      isStarred: false
    };

    const updatedColumns = block.content.columns.map(column => {
      const blockIndex = column.blocks.findIndex(b => b.id === blockId);
      if (blockIndex !== -1) {
        const newBlocks = [...column.blocks];
        newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
        return { ...column, blocks: newBlocks };
      }
      return column;
    });

    onUpdate({
      ...block,
      content: {
        ...block.content,
        columns: updatedColumns
      }
    });

    onBlockDuplicate?.(blockId);
  };

  // Ensure blocks have all required properties for EmailBlock interface
  const ensureCompleteBlock = (innerBlock: EmailBlock): EmailBlock => {
    const defaultStyling = {
      desktop: { width: '100%', height: 'auto' },
      tablet: { width: '100%', height: 'auto' },
      mobile: { width: '100%', height: 'auto' }
    };

    const defaultPosition = { x: 0, y: 0 };

    const defaultDisplayOptions = {
      showOnDesktop: true,
      showOnTablet: true,
      showOnMobile: true
    };

    return {
      ...innerBlock,
      styling: innerBlock.styling ?? defaultStyling,
      position: innerBlock.position ?? defaultPosition,
      displayOptions: innerBlock.displayOptions ?? defaultDisplayOptions
    } as EmailBlock;
  };

  const renderColumnBlock = (innerBlock: EmailBlock, columnId: string) => {
    const completeBlock = ensureCompleteBlock(innerBlock);
    const isBlockSelected = selectedBlockId === innerBlock.id;
    const isBlockEditing = editingBlockId === innerBlock.id;

    return (
      <div key={innerBlock.id} className="relative group mb-2">
        {/* Block Controls */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <BlockControls
            blockId={innerBlock.id}
            onDelete={handleBlockDelete}
            onDuplicate={handleBlockDuplicate}
            onDragStart={() => {}} // Disable drag for now within columns
            onSaveAsSnippet={onSaveAsSnippet || (() => {})}
            isStarred={innerBlock.isStarred}
            onUnstar={onUnstarBlock}
            onAddVariable={() => {}} // Handle variable insertion
          />
        </div>

        {/* Block Content */}
        <div
          className={`border border-gray-100 rounded p-2 transition-colors cursor-pointer ${
            isBlockSelected ? 'border-blue-300 bg-blue-50' : 'hover:border-gray-300'
          }`}
          onClick={() => handleBlockClick(innerBlock.id)}
          onDoubleClick={() => handleBlockDoubleClick(innerBlock.id)}
        >
          {innerBlock.type === 'text' ? (
            <EnhancedTextBlockRenderer
              block={completeBlock as any}
              editor={null}
              isSelected={isBlockSelected}
              isEditing={isBlockEditing}
              onUpdate={(updatedBlock: EmailBlock) => handleBlockUpdate(updatedBlock, columnId)}
              onEditStart={() => onBlockEditStart?.(innerBlock.id)}
              onEditEnd={onBlockEditEnd}
            />
          ) : (
            <BlockRenderer 
              block={completeBlock}
              isSelected={isBlockSelected}
              onUpdate={(updatedBlock: EmailBlock) => handleBlockUpdate(updatedBlock, columnId)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="columns-block-renderer"
      style={{
        backgroundColor: styling.backgroundColor,
        padding: styling.padding,
        margin: styling.margin,
        borderRadius: styling.borderRadius,
        border: styling.border,
      }}
    >
      <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
        <tr>
          {block.content.columns.map((column, index) => (
            <td
              key={column.id}
              style={{
                width: columnWidths[index],
                verticalAlign: 'top',
                paddingLeft: index > 0 ? block.content.gap || '8px' : '0',
                paddingRight: index < block.content.columns.length - 1 ? block.content.gap || '8px' : '0'
              }}
            >
              <div 
                className="min-h-24 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-blue-300"
                style={{
                  backgroundColor: isSelected ? '#f1f5f9' : '#f8fafc',
                  borderColor: column.blocks.length > 0 ? '#e2e8f0' : '#cbd5e1'
                }}
                onDrop={(e) => handleDrop(e, column.id)}
                onDragOver={handleDragOver}
              >
                {column.blocks.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    <div className="text-xs text-slate-400 mb-2">Column {index + 1}</div>
                    <div className="text-xs text-slate-500">
                      Drop blocks here ({columnWidths[index]})
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {column.blocks.map((innerBlock) => 
                      renderColumnBlock(innerBlock, column.id)
                    )}
                  </div>
                )}
              </div>
            </td>
          ))}
        </tr>
      </table>
    </div>
  );
};
